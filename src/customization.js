var customization = function()
{
	var area = vn.getScreen();
	var canvas = new GLCanvas(area);

	// UFO/Player
	var ufo = new UFO(canvas);

	var buttons = new Array;
	var reds = new Array;
	var greens = new Array;
	var blues = new Array;

	var buttonSize = 50;
    var buttonSound = new Audio("src/sounds/effects/Button.wav");

	for (var i = 0; i < 9; i++)
	{
		var button = document.createElement("div");

        button.style.position = "absolute";
        button.style.top = (i + 1)*buttonSize + "px";
        button.style.right = 5*buttonSize + "px";
		button.style.width = 4*buttonSize + "px";
		button.style.height = buttonSize + "px";
		button.style.border = "1px solid white";

		var red = 0;
		var green = 0;
		var blue = 0;

		switch (i)
		{
			case 0:
				button.style.backgroundColor = "red";
				red = 1;
				break;
			case 1:
				button.style.backgroundColor = "orange";
				red = 1;
				green = 0.65;
				break;
			case 2:
				button.style.backgroundColor = "yellow";
				red = 1;
				green = 1;
				break;
			case 3:
				button.style.backgroundColor = "green";
				green = 1;
				break;
			case 4:
				button.style.backgroundColor = "blue";
				blue = 1;
				break;
			case 5:
				button.style.backgroundColor = "purple";
				red = 1;
				blue = 1;
				break;
			case 6:
				button.style.backgroundColor = "pink";
				red = 1;
				green = 0.75;
				blue = 0.75;
				break;
			case 7:
				button.style.backgroundColor = "white";
				red = 1;
				green = 1;
				blue = 1;
				break;
			case 8:
				button.style.backgroundColor = "grey";
				red = 0.5;
				green = 0.5;
				blue = 0.5;
				break;
		}

		area.appendChild(button);

		reds.push(red);
		greens.push(green);
		blues.push(blue);

		buttons.push(button);
	}

	var toggledButtonIndex = 0;

	for (var i = 0; i < 9; i++)
    {
        buttons[i].addEventListener("click", function()
        {
            buttonSound.play();

            toggledButtonIndex = Math.round(event.screenY/buttonSize) - 3;
            ufo.model.getShader().setColorMask([reds[toggledButtonIndex], greens[toggledButtonIndex], blues[toggledButtonIndex], 1]);
        });
    }

    // TODO: Fix the bug where toggledButtonIndex is 0 when passed into the following line.
	var customizedColors = {red: reds[toggledButtonIndex], green: greens[toggledButtonIndex], blue: blues[toggledButtonIndex]};

	var confirmationButton = document.createElement("div");
	confirmationButton.style.width = 4*buttonSize + "px";
	confirmationButton.style.height = buttonSize + "px";
	confirmationButton.style.position = "absolute";
	confirmationButton.style.backgroundColor = "white";
	confirmationButton.style.right = 5*buttonSize + "px";
	confirmationButton.style.bottom = "50px";
	confirmationButton.style.color = "black";
	confirmationButton.align = "center";
	confirmationButton.innerHTML = "CONFIRM";
	confirmationButton.style.verticalAlign = "middle";
	confirmationButton.style.lineHeight = "50px";
	confirmationButton.style.fontFamily = 'monospace';
	confirmationButton.style.fontSize = "18px";
	confirmationButton.style.padding = "auto";

	confirmationButton.addEventListener("click", function()
	{
		buttonSound.play();
		menuMusic.pause();
		main(area, customizedColors);
	});

	area.appendChild(confirmationButton);

	// Animation
	canvas.whenAnimate().then(function()
	{
		ufo.display();
	});

	// Render
	canvas.whenDraw().then(function()
	{
		var printer = canvas.getPrinter();
		var cameraHeight = 1;
		var cameraDistance = 3.5;
		printer.translate([-1.25, -cameraHeight, -cameraDistance]);
		printer.rotateY(3.14);

		// Draw UFO
		printer.pushMatrix();
		var texture = new GLTexture(canvas);
		texture.text({text: "1", color: 'white', font: '40px Arial', width: 128, height: 128});
		ufo.label.setTexture(texture);
		ufo.draw();
		printer.popMatrix();
	});

	canvas.start();

	var menuMusic = new Audio("src/sounds/music/Trouble on Mercury.mp3");
	menuMusic.volume = 0.25;
	menuMusic.play();
};