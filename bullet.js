var Bullet = function(canvas, dimensions)
{
	var maker = new GLObjectMaker(canvas);
	//// Bullet
	this.diameter = dimensions.widthOfGunBarrel;
	maker.identity();
	maker.color([1, 1, 1]);
	maker.sphere({
		width: this.diameter,
		depth: this.diameter,
		height: this.diameter,
		resolution: 32
	});
	maker.clear({uv: true});
	this.model = maker.flush();
	
	//// Bullet Data
	this.isActive = false;
	this.orientation = 0;
	this.position =
		{
			x: 0,
			y: dimensions.heightOfGunBarrel,
			z: 0
		};
	this.speed =
		{
			x: 0,
			z: 0
		};
	this.speedIntensity = 0.75;
};

Bullet.prototype.draw = function()
{
	this.model.draw();
};
Bullet.prototype.animate = function()
{
	// Bullet Movement
	this.position.x += this.speed.x;
	this.position.z += this.speed.z;
};
Bullet.prototype.shootFrom = function(ufo)
{
	this.isActive = true;
	this.orientation = ufo.orientation.y;
	this.position.x = ufo.position.x - Math.sin(this.orientation)*ufo.dimensions.lengthOfGunBarrel;
	this.position.z = ufo.position.z - Math.cos(this.orientation)*ufo.dimensions.lengthOfGunBarrel;
	this.speed.x = -Math.sin(this.orientation)*this.speedIntensity;
	this.speed.z = -Math.cos(this.orientation)*this.speedIntensity;
};
Bullet.prototype.testForCollisions = function(westWallBoundary, eastWallBoundary, northWallBoundary, southWallBoundary)
{
	if (this.position.x < westWallBoundary || this.position.x > eastWallBoundary)
	{
		this.isActive = false;
	}
	if (this.position.z < northWallBoundary || this.position.z > southWallBoundary)
	{
		this.isActive = false;
	}
};
Bullet.prototype.control = function(ufo, isPressed)
{
	//// If the space bar is pressed...
	if (isPressed[32])
	{
		if (this.isActive == false)
		{
			this.shootFrom(ufo);
		}
	}
};