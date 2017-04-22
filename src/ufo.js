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
        // TODO: Add tilting logic for when the UFO moves forward.
    }
    //// If the down arrow key or 's' key is pressed...
    if (isPressed[40] || isPressed[83])
    {
        this.speed.x += Math.sin(this.orientation.y)*this.speedIntensity;
        this.speed.z += Math.cos(this.orientation.y)*this.speedIntensity;
        // TODO: Add tilting logic for when the UFO moves backward.
    }
    //// If the 'a' key is pressed...
    if (isPressed[65])
    {
        this.speed.x -= Math.cos(this.orientation.y)*this.speedIntensity;
        this.speed.z += Math.sin(this.orientation.y)*this.speedIntensity;
        this.orientation.z += this.speedIntensity;
    }
    //// If the 'd' key is pressed...
    if (isPressed[68])
    {
        this.speed.x += Math.cos(this.orientation.y)*this.speedIntensity;
        this.speed.z -= Math.sin(this.orientation.y)*this.speedIntensity;
        this.orientation.z -= this.speedIntensity;
    }
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
};
UFO.prototype.testForCollisions = function(arena)
{
    if (this.position.x < arena.westWallBoundary + this.widthOfMiddlePart)
    {
        // TODO: Add Thud.
        this.position.x = arena.westWallBoundary;
        this.speed.x = 0;
    }
    else if (this.position.x > arena.eastWallBoundary - this.widthOfMiddlePart)
    {
        // TODO: Add Thud.
        this.position.x = arena.eastWallBoundary;
        this.speed.x = 0;
    }
    if (this.position.z < arena.northWallBoundary + this.widthOfMiddlePart)
    {
        // TODO: Add Thud.
        this.position.z = arena.northWallBoundary;
        this.speed.z = 0;
    }
    else if (this.position.z > arena.southWallBoundary - this.widthOfMiddlePart)
    {
        // TODO: Add Thud.
        this.position.z = arena.southWallBoundary;
        this.speed.z = 0;
    }

    for (var i = 0; i < 15; i++)
    {
        if (this.position.x > arena.obstaclesData[i].xLow - this.widthOfMiddlePart/2)
        {
            if (this.position.x < arena.obstaclesData[i].xHigh + this.widthOfMiddlePart/2)
            {
                if (this.position.z > arena.obstaclesData[i].zLow - this.widthOfMiddlePart/2)
                {
                    if (this.position.z < arena.obstaclesData[i].zHigh + this.widthOfMiddlePart/2)
                    {
                        // TODO: Keep the UFO from passing through the obstacles.
                        this.speed.x = 0;
                        this.speed.z = 0;
                    }
                }
            }
        }
    }
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