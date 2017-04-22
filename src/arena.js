var Arena = function(canvas, ufo)
{
	var maker = new GLObjectMaker(canvas);

	var lengthOfBoard = 50;

    this.westWallBoundary = -lengthOfBoard/2;
    this.eastWallBoundary = -this.westWallBoundary;
    this.northWallBoundary = -lengthOfBoard/2;
    this.southWallBoundary = -this.northWallBoundary;

	//// Arena
	////// Floor
	maker.identity();
	maker.rotateX(-3.14/2);
	maker.color([1, 0, 0]);
	maker.rectangle({
		width: lengthOfBoard,
		height: lengthOfBoard
	});
	////// Walls
	var widthOfWall = lengthOfBoard;
	var depthOfWall = 1;
	var heightOfWall = 1;
	var distanceToBuildPoint = lengthOfBoard/2 + depthOfWall/2;
	maker.color([1, 1, 1]);
	//////// North
	maker.identity();
	var northWallBuildPoint = [0, heightOfWall/2, -distanceToBuildPoint];
	maker.translate(northWallBuildPoint);
	maker.box({
		width: widthOfWall,
		height: heightOfWall,
		depth: depthOfWall
	});
	//////// East
	maker.identity();
	var eastWallBuildPoint = [distanceToBuildPoint, heightOfWall/2, 0];
	maker.translate(eastWallBuildPoint);
	maker.rotateY(3.14/2);
	maker.box({
		width: widthOfWall,
		height: heightOfWall,
		depth: depthOfWall
	});
	//////// South
	maker.identity();
	var westWallBuildPoint = [0, heightOfWall/2, distanceToBuildPoint];
	maker.translate(westWallBuildPoint);
	maker.box({
		width: widthOfWall,
		height: heightOfWall,
		depth: depthOfWall
	});
	//////// West
	maker.identity();
	var southWallBuildPoint = [-distanceToBuildPoint, heightOfWall/2, 0];
	maker.translate(southWallBuildPoint);
	maker.rotateY(3.14/2);
	maker.box({
		width: widthOfWall,
		height: heightOfWall,
		depth: depthOfWall
	});

    this.numberOfObstacles = 15;
	this.obstaclesData = new Array;
	////// Obstacles
	for (var i = 0; i < this.numberOfObstacles; i++)
	{
		var randomX;
		var randomZ;
		var randomWidth;
		var randomDepth;
		while (true)
		{
			maker.identity();
			randomX = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
			randomZ = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
			maker.translate([randomX, 0.5, randomZ]);
			maker.color([1, 1, 1]);
			randomWidth = Math.random() + 1;
			randomDepth = Math.random() + 1;
			if (!randomX - randomWidth/2 < ufo.widthOfMiddlePart/2)
			{
				if (!randomX + randomWidth/2 > -ufo.widthOfMiddlePart/2)
				{
					if (!randomZ - randomDepth/2 < ufo.widthOfMiddlePart/2)
					{
						if (!randomZ + randomDepth/2 > -ufo.widthOfMiddlePart/2)
						{
							break;
						}
					}
				}
			}
		}
		maker.box({
			width: randomWidth,
			height: 1,
			depth: randomDepth
		});

		var obstacleData = {
			xLow: randomX - randomWidth/2,
			xHigh: randomX + randomWidth/2,
			zLow: randomZ - randomDepth/2,
			zHigh: randomZ + randomDepth/2,
			armor: 10
		};

		this.obstaclesData.push(obstacleData);
	}
	
	maker.clear({uv: true});
	this.model = maker.flush();
};

Arena.prototype.draw = function()
{
	this.model.draw();
};