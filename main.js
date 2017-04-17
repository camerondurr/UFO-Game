var main = function(area, customizedColors)
{
	// Clean the screen.
	while(area.firstChild)
	{
		area.removeChild(area.firstChild);
	}
	var canvas = new GLCanvas(area);
	area.style.background = 'black';
	canvas.whenStarted().then(function()
	{
		canvas.setBackgroundColor(0, 0, 0, 1);
	});
	
	// Assets
	//// Arena
	var widthOfBoard = 50;
	var arena = new Arena(canvas, widthOfBoard);
	
	//// UFO/Player
	var dimensions = {
		distanceAboveGround: 0.3,
		heightOfBottomPart: 0.15,
		widthOfBottomPart: 0.75,
		heightOfMiddlePart: 0.1,
		widthOfMiddlePart: 1.75,
		heightOfTopPart: 0.15,
		widthOfTopPart: 0.75,
		heightOfUFO: 0,
		heightOfGunBarrel: 0,
		widthOfGunBarrel: 0.1,
		lengthOfGunBarrel: 0.875,
		diameterOfCockpit: 0.5,
		heightOfLabel: 0
	};
	dimensions.heightOfUFO = getHeightOfUFOUsingDimensions(dimensions);
	dimensions.heightOfGunBarrel = getHeightOfGunBarrelUsingDimensions(dimensions);
	dimensions.heightOfLabel = dimensions.heightOfUFO/2;
	var ufo = new UFO(canvas, dimensions);

	// TODO: Fix the bug associated with customizedColors being black no matter which color was last picked.
	// ufo.model.getShader().setColorMask([customizedColors.red, customizedColors.green, customizedColors.blue, 1]);
	
	//// Bullet
	var bullet = new Bullet(canvas, dimensions);
	
	//// HUD
	var hud = new HUD(area);
	
	// Game Logic
	//// Controls
	var isPressed = new Array(100);
	canvas.whenKeyPressed().then(function(keyCode)
	{
		isPressed[keyCode] = true;
	});
	canvas.whenKeyReleased().then(function(keyCode)
	{
		isPressed[keyCode] = false;
	});
	
	// Animation
	canvas.whenAnimate().then(function()
	{
		if (network.isConnected())
		{
			var users = network.session.getUsers();
			for (var i in users)
			{
				if (users[i].p)
				{
					users[i].variable('p').interpolate(10);
				}
			}
		}
		
		// Controls
		ufo.control(isPressed);
		bullet.control(ufo, isPressed);
		
		// Animation
		ufo.animate();
		bullet.animate();
		
		// Collision Detection
		var westWallBoundary = -widthOfBoard/2 + dimensions.widthOfMiddlePart/2;
		var eastWallBoundary = -westWallBoundary;
		var northWallBoundary = -widthOfBoard/2 + dimensions.widthOfMiddlePart/2;
		var southWallBoundary = -northWallBoundary;
		
		ufo.testForCollisions(westWallBoundary, eastWallBoundary, northWallBoundary, southWallBoundary);
		bullet.testForCollisions(westWallBoundary, eastWallBoundary, northWallBoundary, southWallBoundary);
	});
	
	// Draw
	canvas.whenDraw().then(function()
	{
		var printer = canvas.getPrinter();
		var cameraHeight = 1.5;
		var cameraDistance = 4;
		printer.translate([0, -cameraHeight, -cameraDistance]);
		
		// Draw Arena
		printer.rotateY(-ufo.orientation.y);
		printer.translate([-ufo.position.x, 0, -ufo.position.z]);
		arena.draw();
		
		// Draw UFOs/Players
		if (network.isConnected())
		{
			var users = network.session.getUsers();
			for (var user in users)
			{
				printer.pushMatrix();
				
				printer.translate([ufo.position.x, ufo.position.y, ufo.position.z]);
				printer.rotateX(ufo.orientation.x);
				printer.rotateY(ufo.orientation.y);
				printer.rotateZ(ufo.orientation.z);

				var texture = new GLTexture(canvas);
				// TODO: Change the text field to be a variable that's based on the player's number in the lobby.
				texture.text({text: "1", color: 'white', font: '40px Arial', width: 128, height: 128});
				ufo.label.setTexture(texture);
				ufo.draw(user.p, user.clr);
				
				printer.popMatrix();
			}
		}
		
		// Draw Bullets
		if (bullet.isActive)
		{
			printer.pushMatrix();
			printer.translate([bullet.position.x, bullet.position.y, bullet.position.z]);
			bullet.draw();
			printer.popMatrix();
		}
	});
	
	var network = new Networking();
	canvas.start();

	// Network
	// TODO: Test the network.
	/*var session = null;
	var me = null;
	var server = null;

	var init_rt = function()
	{
		session = null;
		me = null;
		server = new VNServer();
		server.whenConnected().otherwise(function(s)
		{
			if (s == server)
			{
				console.log('will reconnect...');
				server = null;
				init_rt();
			}
		});
		server.connect('UFO Game',
			{
				capacity: 4,
				releaseSeats: true
			}).then(function(session)
		{
			session = session;
			me = server.me();
			me.color = my_color;
			me.variable('color').broadcast();
			me.variable('p').whenValueChanged().then(function(event)
			{
				if (event.initiator != me)
				{
					sim_obj.position.x = me.p [0];
					sim_obj.position.y = me.p [1];
					sim_obj.position.z = me.p [2];
					sim_obj.orientation = me.p [3];
				}
			});
			vn.getWindowManager().createNotification('You are now connected!');
		});
	};
	init_rt();*/
};

// Methods
var getHeightOfUFOUsingDimensions = function(dimensions)
{
	return dimensions.heightOfBottomPart + dimensions.heightOfMiddlePart + dimensions.heightOfTopPart + dimensions.diameterOfCockpit/2;
};
var getHeightOfGunBarrelUsingDimensions = function(dimensions)
{
	return dimensions.distanceAboveGround + dimensions.heightOfBottomPart + dimensions.heightOfMiddlePart + dimensions.heightOfTopPart/2;
};