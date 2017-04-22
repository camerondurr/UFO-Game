// Constructor
var Arena = function(canvas, ufo)
{
	var maker = new GLObjectMaker(canvas);

	this.ufo = ufo;

	this.lengthOfBoard = 50;

    maker.identity();
    maker.rotateX(-3.14/2);
    maker.color([1, 0, 0]);
    maker.rectangle({
        width: this.lengthOfBoard,
        height: this.lengthOfBoard
    });
    maker.clear({uv: true});
    this.floorModel = maker.flush();

    var widthOfWall = this.lengthOfBoard;
    var depthOfWall = 1;
    var heightOfWall = 1;

    var distanceToBuildPoint = this.lengthOfBoard/2 + depthOfWall/2;
    var heightOfBuildPoint = heightOfWall/2;

    maker.color([1, 1, 1]);
    for (var i = 0; i < 4; i++)
    {
        maker.identity();

        var buildPoint = [Math.sin(i*(3.14/2))*distanceToBuildPoint, heightOfBuildPoint, -Math.cos(i*(3.14/2))*distanceToBuildPoint];
        maker.translate(buildPoint);

        var width = 0;
        var depth = 0;
        if ((i + 1)%2 === 0)
        {
            width = depthOfWall;
            depth = widthOfWall;
        }
        else
        {
            width = widthOfWall;
            depth = depthOfWall;
        }
        maker.box({
            width: width,
            height: heightOfWall,
            depth: depth
        });
    }
    maker.clear({uv: true});
    this.wallModels = maker.flush();

    this.westWallBoundary = -this.lengthOfBoard/2;
    this.eastWallBoundary = -this.westWallBoundary;
    this.northWallBoundary = -this.lengthOfBoard/2;
    this.southWallBoundary = -this.northWallBoundary;

    this.numberOfObstacles = 15;
	this.obstacles = new Array;
	for (var i = 0; i < this.numberOfObstacles; i++)
	{
        var obstacle = new Obstacle(canvas, this);
		this.obstacles.push(obstacle);
	}
};

// Methods
Arena.prototype.draw = function()
{
    this.floorModel.draw();
	this.wallModels.draw();
	for (var i = 0; i < this.numberOfObstacles; i++)
    {
        this.obstacles[i].draw();
    }
};