// Constructor
var Bullet = function(canvas, ufo)
{
	var maker = new GLObjectMaker(canvas);

	this.ufo = ufo;
	this.model = this.makeModel(maker);

	this.isActive = false;
	this.position = {
        x: 0,
        y: ufo.heightOfGunBarrel,
        z: 0
	};
	this.speed = {
        x: 0,
        z: 0
    };
	this.speedIntensity = 0.75;
};

// Methods
Bullet.prototype.makeModel = function(maker)
{
    this.diameter = this.ufo.widthOfGunBarrel;

    maker.identity();
    maker.color([1, 1, 1]);
    maker.sphere({
        width: this.diameter,
        depth: this.diameter,
        height: this.diameter,
        resolution: 32
    });

    maker.clear({uv: true});
    return maker.flush();
};

Bullet.prototype.animate = function()
{
    this.position.x += this.speed.x;
    this.position.z += this.speed.z;
};
Bullet.prototype.draw = function()
{
    this.model.draw();
};

Bullet.prototype.testForCollisions = function(arena)
{
	if (this.position.x < arena.westWallBoundary + this.diameter/2
	 || this.position.x > arena.eastWallBoundary - this.diameter/2
	 || this.position.z < arena.northWallBoundary + this.diameter/2
	 || this.position.z > arena.southWallBoundary - this.diameter/2)
	{
		this.isActive = false;
	}

	for (var i = 0; i < arena.numberOfObstacles; i++)
	{
		if (this.position.x > arena.obstacles[i].xLow - this.diameter)
		{
			if (this.position.x < arena.obstacles[i].xHigh + this.diameter)
			{
				if (this.position.z > arena.obstacles[i].zLow - this.diameter)
				{
					if (this.position.z < arena.obstacles[i].zHigh + this.diameter)
					{
						var thudSound = new Audio("src/sounds/effects/Thud.wav");
						thudSound.play();
						this.isActive = false;
					}
				}
			}
		}
	}
};