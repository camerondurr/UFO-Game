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

	// TODO: Fix the bug associated with customizedColors not being passed through correctly.
	// ufo.model.getShader().setColorMask([customizedColors.red, customizedColors.green, customizedColors.blue, 1]);
	
	// Assets
	//// Arena
	var widthOfBoard = 50;
	var arena = new Arena(canvas, widthOfBoard, dimensions);
	
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
		
		ufo.testForCollisions(westWallBoundary, eastWallBoundary, northWallBoundary, southWallBoundary, arena);

		var westWallBoundaryForBullet = -widthOfBoard/2 + bullet.diameter/2;
		var eastWallBoundaryForBullet = -westWallBoundary;
		var northWallBoundaryForBullet = -widthOfBoard/2 + bullet.diameter/2;
		var southWallBoundaryForBullet = -northWallBoundary;

		bullet.testForCollisions(westWallBoundaryForBullet, eastWallBoundaryForBullet, northWallBoundaryForBullet, southWallBoundaryForBullet, arena);
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

	canvas.whenDragged().then(function(o, event)
	{
		canvas.getCamera().oneFingerRotate(event, {radius: 4, type: 'polar'});
	});
	
	var network = new Networking();
	canvas.start();

	// Network
	// TODO: Add networking code.
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