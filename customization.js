var customization = function()
{
	var area = vn.getScreen();
	var canvas = new GLCanvas(area);

	// UFO/Player
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

	var buttons = new Array;
	var reds = new Array;
	var greens = new Array;
	var blues = new Array;

	for (var i = 0; i < 9; i++)
	{
		var button = document.createElement("div");
		var buttonSize = 50;

		button.style.width = buttonSize + "px";
		button.style.height = buttonSize + "px";
		button.style.position = "absolute";
		button.style.right = buttonSize + "px";
		button.style.top = (i + 1)*buttonSize + "px";
		button.style.marginBottom = buttonSize/2 + "px";
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
				button.style.backgroundColor = "white";
				red = 1;
				green = 1;
				blue = 1;
				break;
			case 7:
				button.style.backgroundColor = "grey";
				red = 0.5;
				green = 0.5;
				blue = 0.5;
				break;
			case 8:
				button.style.backgroundColor = "black";
				break;
		}

		area.appendChild(button);

		reds.push(red);
		greens.push(green);
		blues.push(blue);
		buttons.push(button);
	}

	var finalRed = 0;
	var finalGreen = 0;
	var finalBlue = 0;

	buttons[0].addEventListener("click", function()
	{
		ufo.model.getShader().setColorMask([reds[0], greens[0], blues[0], 1]);
		finalRed = reds[0];
		finalGreen = greens[0];
		finalBlue = blues[0];
	});

	buttons[1].addEventListener("click", function()
	{
		ufo.model.getShader().setColorMask([reds[1], greens[1], blues[1], 1]);
		finalRed = reds[1];
		finalGreen = greens[1];
		finalBlue = blues[1];
	});

	buttons[2].addEventListener("click", function()
	{
		ufo.model.getShader().setColorMask([reds[2], greens[2], blues[2], 1]);
		finalRed = reds[2];
		finalGreen = greens[2];
		finalBlue = blues[2];
	});

	buttons[3].addEventListener("click", function()
	{
		ufo.model.getShader().setColorMask([reds[3], greens[3], blues[3], 1]);
		finalRed = reds[3];
		finalGreen = greens[3];
		finalBlue = blues[3];
	});

	buttons[4].addEventListener("click", function()
	{
		ufo.model.getShader().setColorMask([reds[4], greens[4], blues[4], 1]);
		finalRed = reds[4];
		finalGreen = greens[4];
		finalBlue = blues[4];
	});

	buttons[5].addEventListener("click", function()
	{
		ufo.model.getShader().setColorMask([reds[5], greens[5], blues[5], 1]);
		finalRed = reds[5];
		finalGreen = greens[5];
		finalBlue = blues[5];
	});

	buttons[6].addEventListener("click", function()
	{
		ufo.model.getShader().setColorMask([reds[6], greens[6], blues[6], 1]);
		finalRed = reds[6];
		finalGreen = greens[6];
		finalBlue = blues[6];
	});

	buttons[7].addEventListener("click", function()
	{
		ufo.model.getShader().setColorMask([reds[7], greens[7], blues[7], 1]);
		finalRed = reds[7];
		finalGreen = greens[7];
		finalBlue = blues[7];
	});

	buttons[8].addEventListener("click", function()
	{
		ufo.model.getShader().setColorMask([reds[8], greens[8], blues[8], 1]);
		finalRed = reds[8];
		finalGreen = greens[8];
		finalBlue = blues[8];
	});

	var customizedColors = {
		red: finalRed,
		green: finalGreen,
		blue: finalBlue
	};

	var confirmationButton = document.createElement("div");
	confirmationButton.style.width = "100px";
	confirmationButton.style.height = "50px";
	confirmationButton.style.position = "absolute";
	confirmationButton.style.backgroundColor = "white";
	confirmationButton.style.right = "50px";
	confirmationButton.style.bottom = "50px";
	confirmationButton.style.color = "black";
	confirmationButton.innerHTML = "CONFIRM";
	confirmationButton.align = "center";
	confirmationButton.fontFamily = "Arial";
	confirmationButton.fontSize = "20px";
	confirmationButton.style.padding = "auto";

	confirmationButton.addEventListener("click", function()
	{
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
	// main(area);
};