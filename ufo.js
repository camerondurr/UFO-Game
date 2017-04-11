var UFO = function(canvas, dimensions)
{
	var maker = new GLObjectMaker(canvas);
	
	// UFO Model
	maker.identity();
	maker.translate([0, dimensions.distanceAboveGround, 0]);
	//// Bottom Part
	maker.translate([0, dimensions.heightOfBottomPart/2, 0]);
	maker.color([1, 1, 1]);
	maker.cylinder({
		width: dimensions.widthOfBottomPart,
		depth: dimensions.widthOfBottomPart,
		height: dimensions.heightOfBottomPart,
		width2: dimensions.widthOfMiddlePart,
		depth2: dimensions.widthOfMiddlePart,
		resolution: 32
	});
	maker.translate([0, dimensions.heightOfBottomPart/2, 0]);
	//// Middle Part
	maker.translate([0, dimensions.heightOfMiddlePart/2, 0]);
	maker.color([1, 1, 1]);
	maker.cylinder({
		width: dimensions.widthOfMiddlePart,
		depth: dimensions.widthOfMiddlePart,
		height: dimensions.heightOfMiddlePart,
		width2: dimensions.widthOfMiddlePart,
		depth2: dimensions.widthOfMiddlePart,
		resolution: 32
	});
	maker.translate([0, dimensions.heightOfMiddlePart/2, 0]);
	//// Top Part
	maker.translate([0, dimensions.heightOfTopPart/2, 0]);
	maker.color([1, 1, 1]);
	maker.cylinder({
		width: dimensions.widthOfMiddlePart,
		depth: dimensions.widthOfMiddlePart,
		height: dimensions.heightOfTopPart,
		width2: dimensions.widthOfTopPart,
		depth2: dimensions.widthOfTopPart,
		resolution: 32
	});
	//// Gun Barrel
	maker.translate([0, 0, -dimensions.lengthOfGunBarrel/2]);
	maker.rotateX(-3.14/2);
	maker.color([1, 1, 1]);
	maker.cylinder({
		width: dimensions.widthOfGunBarrel,
		depth: dimensions.widthOfGunBarrel,
		height: dimensions.lengthOfGunBarrel,
		width2: dimensions.widthOfGunBarrel,
		depth2: dimensions.widthOfGunBarrel,
		resolution: 32
	});
	maker.rotateX(3.14/2);
	maker.translate([0, dimensions.heightOfTopPart/2, dimensions.lengthOfGunBarrel/2]);
	//// Cockpit
	maker.translate([0, 0, 0]);
	maker.color([1, 1, 1]);
	maker.sphere({
		width: dimensions.diameterOfCockpit,
		depth: dimensions.diameterOfCockpit,
		height: dimensions.diameterOfCockpit,
		resolution: 32
	});
	maker.clear({uv: true});
	this.model = maker.flush();
	
	// Label
	maker.identity();
	maker.translate([0, dimensions.distanceAboveGround + dimensions.heightOfUFO + dimensions.heightOfLabel/2, 0]);
	maker.rectangle({
		width: dimensions.widthOfMiddlePart,
		height: dimensions.heightOfLabel
	});
	maker.clear({uv: true});
	this.label = maker.flush();
	this.label.getShader().setColorMask([0, 0, 0, 1]);
	var texture = new GLTexture(canvas);
	texture.text({text: 'Cameron', color: 'white', font: '40px Arial', width: 128, height: 128});
	this.label.setTexture(texture);
	
	this.dimensions = dimensions;
	
	//// Player Data
	this.orientation = {
		x: 0,
		y: 0,
		z: 0
	};
	this.position = {
		x: 0,
		y: 0,
		z: 0
	};
	this.speed = {
		x: 0,
		y: 0,
		z: 0
	};
	this.speedIntensity = 0.0075;
	this.spinIntensity = 0.0625;
	this.livesLeft = 3;
};

UFO.prototype.draw = function()
{
	this.model.draw();
	this.label.draw();
};
UFO.prototype.setTexture = function(texture)
{
	this.model.setTexture(texture);
};
UFO.prototype.animate = function()
{
	// Friction
	this.speed.x *= 0.95;
	this.speed.z *= 0.95;
	// Balance
	this.orientation.x *= 0.95;
	this.orientation.z *= 0.95;
	// Player Movement
	this.position.x += this.speed.x;
	this.position.z += this.speed.z;
	//// Tilt Limit
	var tiltLimit = 3.14/16;
	if (this.orientation.z < -tiltLimit)
	{
		this.orientation.z = -tiltLimit;
	}
	else if (this.orientation.z > tiltLimit)
	{
		this.orientation.z = tiltLimit;
	}
	if (this.orientation.x < -tiltLimit)
	{
		this.orientation.x = -tiltLimit;
	}
	else if (this.orientation.x > tiltLimit)
	{
		this.orientation.x = tiltLimit;
	}
	// Label Rotation
	this.label.rotateY(0.005);
};
UFO.prototype.testForCollisions = function(westWallBoundary, eastWallBoundary, northWallBoundary, southWallBoundary)
{
	if (this.position.x < westWallBoundary)
	{
		this.position.x = westWallBoundary;
		this.speed.x = 0;
	}
	else if (this.position.x > eastWallBoundary)
	{
		this.position.x = eastWallBoundary;
		this.speed.x = 0;
	}
	if (this.position.z < northWallBoundary)
	{
		this.position.z = northWallBoundary;
		this.speed.z = 0;
	}
	else if (this.position.z > southWallBoundary)
	{
		this.position.z = southWallBoundary;
		this.speed.z = 0;
	}
};
UFO.prototype.control = function(isPressed)
{
	//// If the left arrow key is pressed...
	if (isPressed[37])
	{
		this.orientation.y += this.spinIntensity;
	}
	//// If the right arrow key is pressed...
	if (isPressed[39])
	{
		this.orientation.y -= this.spinIntensity;
	}
	//// If the up arrow key or 'w' key is pressed...
	if (isPressed[38] || isPressed[87])
	{
		this.speed.x -= Math.sin(this.orientation.y)*this.speedIntensity;
		this.speed.z -= Math.cos(this.orientation.y)*this.speedIntensity;
		this.orientation.x -= Math.cos(this.orientation.y)*this.spinIntensity;
	}
	//// If the down arrow key or 's' key is pressed...
	if (isPressed[40] || isPressed[83])
	{
		this.speed.x += Math.sin(this.orientation.y)*this.speedIntensity;
		this.speed.z += Math.cos(this.orientation.y)*this.speedIntensity;
		this.orientation.x += Math.cos(this.orientation.y)*this.spinIntensity;
	}
	//// If the 'a' key is pressed...
	if (isPressed[65])
	{
		this.speed.x -= Math.cos(this.orientation.y)*this.speedIntensity;
		this.speed.z += Math.sin(this.orientation.y)*this.speedIntensity;
		this.orientation.z += Math.cos(this.orientation.y)*this.spinIntensity;
	}
	//// If the 'd' key is pressed...
	if (isPressed[68])
	{
		this.speed.x += Math.cos(this.orientation.y)*this.speedIntensity;
		this.speed.z -= Math.sin(this.orientation.y)*this.speedIntensity;
		this.orientation.z -= Math.cos(this.orientation.y)*this.spinIntensity;
	}
};