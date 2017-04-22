var main = function(area, customizedColors)
{
	while(area.firstChild)
	{
		area.removeChild(area.firstChild);
	}

	var canvas = new GLCanvas(area);

    drawHud(area);

	var ufo = new UFO(canvas);
	ufo.model.getShader().setColorMask([customizedColors.red, customizedColors.green, customizedColors.blue, 1]);

    var arena = new Arena(canvas, ufo);

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
		ufo.control(isPressed);
		ufo.animate();
		ufo.testForCollisions(arena);
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
        if (ufo.bullet.isActive)
        {
            printer.pushMatrix();
            printer.translate([ufo.bullet.position.x, ufo.bullet.position.y, ufo.bullet.position.z]);
            ufo.bullet.draw();
            printer.popMatrix();
        }
	});

	canvas.whenDragged().then(function(o, event)
	{
		canvas.getCamera().oneFingerRotate(event, {radius: 4, type: 'polar'});
	});
	
	var network = new Networking();
	canvas.start();

	var mainMusic = new Audio("src/sounds/music/Retro Sci-Fi Planet.mp3");
	mainMusic.volume = 0.25;
	mainMusic.play();

	// Network
	// TODO: Add networking code.
};

// Methods
var drawHud = function(area)
{
    var hud = new HUD(area);
};