// Constructor
var UFO = function(canvas)
{
	var maker = new GLObjectMaker(canvas);

    this.distanceAboveGround = 0.3;

    this.heightOfBottomPart = 0.15;
    this.widthOfBottomPart = 0.75;

    this.heightOfMiddlePart = 0.1;
    this.widthOfMiddlePart = 1.75;

    this.heightOfTopPart = 0.15;
    this.widthOfTopPart = 0.75;

    this.diameterOfCockpit = 0.5;

    this.heightOfUFO = this.heightOfBottomPart + this.heightOfMiddlePart + this.heightOfTopPart + this.diameterOfCockpit/2;

    this.widthOfGunBarrel = 0.1;
    this.lengthOfGunBarrel = 0.85;

    this.heightOfGunBarrel = this.distanceAboveGround + this.heightOfBottomPart + this.heightOfMiddlePart + this.heightOfTopPart/2;

    this.heightOfLabel = this.heightOfUFO/2;

    this.model = this.makeModel(maker);
	this.label = this.makeLabel(maker);

	this.orientation = {x: 0, y: 0, z: 0};
	this.position = {x: 0, y: 0, z: 0};
	this.speed = {x: 0, y: 0, z: 0};
	this.speedIntensity = 0.0075;
	this.spinIntensity = 0.0625;
	this.tiltLimit = 3.14/16;

    this.bullet = new Bullet(canvas, this);
    this.lastTimeWeShotABullet = Number.MIN_VALUE;
};

// Methods
UFO.prototype.makeModel = function(maker)
{
    maker.identity();
    maker.translate([0, this.distanceAboveGround, 0]);

    maker.translate([0, this.heightOfBottomPart/2, 0]);
    maker.color(this.color);
    maker.cylinder({
        width: this.widthOfBottomPart,
        depth: this.widthOfBottomPart,
        height: this.heightOfBottomPart,
        width2: this.widthOfMiddlePart,
        depth2: this.widthOfMiddlePart,
        resolution: 32
    });
    maker.translate([0, this.heightOfBottomPart/2, 0]);

    maker.translate([0, this.heightOfMiddlePart/2, 0]);
    maker.color(this.color);
    maker.cylinder({
        width: this.widthOfMiddlePart,
        depth: this.widthOfMiddlePart,
        height: this.heightOfMiddlePart,
        width2: this.widthOfMiddlePart,
        depth2: this.widthOfMiddlePart,
        resolution: 32
    });
    maker.translate([0, this.heightOfMiddlePart/2, 0]);

    maker.translate([0, this.heightOfTopPart/2, 0]);
    maker.color(this.color);
    maker.cylinder({
        width: this.widthOfMiddlePart,
        depth: this.widthOfMiddlePart,
        height: this.heightOfTopPart,
        width2: this.widthOfTopPart,
        depth2: this.widthOfTopPart,
        resolution: 32
    });

    maker.translate([0, 0, -this.lengthOfGunBarrel/2]);
    maker.rotateX(-3.14/2);
    maker.color(this.color);
    maker.cylinder({
        width: this.widthOfGunBarrel,
        depth: this.widthOfGunBarrel,
        height: this.lengthOfGunBarrel,
        width2: this.widthOfGunBarrel,
        depth2: this.widthOfGunBarrel,
        resolution: 32
    });
    maker.rotateX(3.14/2);
    maker.translate([0, this.heightOfTopPart/2, this.lengthOfGunBarrel/2]);

    maker.translate([0, 0, 0]);
    maker.color(this.color);
    maker.sphere({
        width: this.diameterOfCockpit,
        depth: this.diameterOfCockpit,
        height: this.diameterOfCockpit,
        resolution: 32
    });

    maker.clear({uv: true});
    return maker.flush();
};
UFO.prototype.makeLabel = function(maker)
{
    maker.identity();
    maker.translate([0, this.distanceAboveGround + this.heightOfUFO + this.heightOfLabel/2, this.widthOfMiddlePart/4]);
    maker.rectangle({
        width: this.diameterOfCockpit,
        height: this.heightOfLabel
    });
    return maker.flush();
};

UFO.prototype.control = function(isPressed)
{
    // W Key / Up Arrow Key
    if (isPressed[38] || isPressed[87])
    {
        this.speed.x -= Math.sin(this.orientation.y)*this.speedIntensity;
        this.speed.z -= Math.cos(this.orientation.y)*this.speedIntensity;
        
        this.orientation.x -= this.speedIntensity;
    }
	// S Key / Down Key
	if (isPressed[40] || isPressed[83])
	{
		this.speed.x += Math.sin(this.orientation.y)*this.speedIntensity;
		this.speed.z += Math.cos(this.orientation.y)*this.speedIntensity;
		
		this.orientation.x += this.speedIntensity;
	}
    // A Key
    if (isPressed[65])
    {
        this.speed.x -= Math.cos(this.orientation.y)*this.speedIntensity;
        this.speed.z += Math.sin(this.orientation.y)*this.speedIntensity;
        
        this.orientation.z += this.speedIntensity;
    }
    // D Key
    if (isPressed[68])
    {
        this.speed.x += Math.cos(this.orientation.y)*this.speedIntensity;
        this.speed.z -= Math.sin(this.orientation.y)*this.speedIntensity;
        
        this.orientation.z -= this.speedIntensity;
    }

    // Left Arrow Key
    if (isPressed[37])
    {
        this.orientation.y += this.spinIntensity;
        this.orientation.z += this.speedIntensity;
    }
    // Right Arrow Key
    if (isPressed[39])
    {
        this.orientation.y -= this.spinIntensity;
        this.orientation.z -= this.speedIntensity;
    }

    // Space Bar
    if (isPressed[32])
    {
        if (this.ableToShootAgain() === true)
        {
            this.shoot(this.bullet);
        }
    }
};
UFO.prototype.ableToShootAgain = function()
{
	if (this.bullet.isActive === false)
	{
		var date = new Date();
		var currentTime = date.getTime();
		if (currentTime - this.lastTimeWeShotABullet >= 500)
		{
			this.lastTimeWeShotABullet = currentTime;
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
};
UFO.prototype.shoot = function(bullet)
{
    var shootSound = new Audio("src/sounds/effects/Shoot.wav");
    shootSound.volume = 0.25;
    shootSound.play();

    bullet.isActive = true;
    bullet.position.x = this.position.x - Math.sin(this.orientation.y)*this.lengthOfGunBarrel;
    bullet.position.z = this.position.z - Math.cos(this.orientation.y)*this.lengthOfGunBarrel;
    bullet.speed.x = -Math.sin(this.orientation.y)*this.bullet.speedIntensity;
    bullet.speed.z = -Math.cos(this.orientation.y)*this.bullet.speedIntensity;
};

UFO.prototype.animate = function()
{
    this.label.rotateY(0.075);

    this.position.x += this.speed.x;
    this.position.z += this.speed.z;

    this.speed.x *= 0.95;
    this.speed.z *= 0.95;

    this.orientation.x *= 0.95;
    this.orientation.z *= 0.95;

    if (this.orientation.x < -this.tiltLimit)
    {
        this.orientation.x = -this.tiltLimit;
    }
    else if (this.orientation.x > this.tiltLimit)
    {
        this.orientation.x = this.tiltLimit;
    }
    if (this.orientation.z < -this.tiltLimit)
    {
        this.orientation.z = -this.tiltLimit;
    }
    else if (this.orientation.z > this.tiltLimit)
    {
        this.orientation.z = this.tiltLimit;
    }

    this.bullet.animate();
};
UFO.prototype.testForCollisions = function(arena)
{
	var thudSound = new Audio("src/sounds/effects/Thud.wav");
    if (this.position.x < arena.westWallBoundary + this.widthOfMiddlePart/2)
    {
	    thudSound.play();
        this.position.x = arena.westWallBoundary + this.widthOfMiddlePart/2;
	    this.speed.x = -this.speed.x;
    }
    else if (this.position.x > arena.eastWallBoundary - this.widthOfMiddlePart/2)
    {
	    thudSound.play();
        this.position.x = arena.eastWallBoundary - this.widthOfMiddlePart/2;
	    this.speed.x = -this.speed.x;
    }
    if (this.position.z < arena.northWallBoundary + this.widthOfMiddlePart/2)
    {
	    thudSound.play();
        this.position.z = arena.northWallBoundary + this.widthOfMiddlePart/2;
	    this.speed.z = -this.speed.z;
    }
    else if (this.position.z > arena.southWallBoundary - this.widthOfMiddlePart/2)
    {
	    thudSound.play();
        this.position.z = arena.southWallBoundary - this.widthOfMiddlePart/2;
	    this.speed.z = -this.speed.z;
    }

    for (var i = 0; i < 15; i++)
    {
	    if (this.position.x >= arena.obstacles[i].xLow - this.widthOfMiddlePart/2 && this.position.x <= arena.obstacles[i].xLow)
	    {
		    if (this.position.z >= arena.obstacles[i].zLow && this.position.z <= arena.obstacles[i].zHigh)
		    {
			    thudSound.play();
			    this.speed.x = -this.speed.x;
			    this.position.x = arena.obstacles[i].xLow - this.widthOfMiddlePart/2;
		    }
	    }
	    if (this.position.x <= arena.obstacles[i].xHigh + this.widthOfMiddlePart/2 && this.position.x >= arena.obstacles[i].xHigh)
	    {
		    if (this.position.z >= arena.obstacles[i].zLow && this.position.z <= arena.obstacles[i].zHigh)
		    {
			    thudSound.play();
			    this.speed.x = -this.speed.x;
			    this.position.x = arena.obstacles[i].xHigh + this.widthOfMiddlePart/2;
		    }
	    }
	    if (this.position.z <= arena.obstacles[i].zHigh + this.widthOfMiddlePart/2 && this.position.z >= arena.obstacles[i].zHigh)
	    {
	    	if (this.position.x >= arena.obstacles[i].xLow && this.position.x <= arena.obstacles[i].xHigh)
		    {
			    thudSound.play();
		    	this.speed.z = -this.speed.z;
		    	this.position.z = arena.obstacles[i].zHigh + this.widthOfMiddlePart/2;
		    }
	    }
	    if (this.position.z >= arena.obstacles[i].zLow - this.widthOfMiddlePart/2 && this.position.z <= arena.obstacles[i].zLow)
	    {
	    	if (this.position.x >= arena.obstacles[i].xLow && this.position.x <= arena.obstacles[i].xHigh)
		    {
			    thudSound.play();
		    	this.speed.z = -this.speed.z;
		    	this.position.z = arena.obstacles[i].zLow - this.widthOfMiddlePart/2;
		    }
	    }
    }
    this.bullet.testForCollisions(arena);
};

UFO.prototype.draw = function()
{
	this.model.draw();
	this.label.draw();
};

UFO.prototype.display = function()
{
	this.model.rotateY(0.005);
	this.label.rotateY(0.075);
};