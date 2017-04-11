var Arena = function(canvas, lengthOfBoard)
{
	var maker = new GLObjectMaker(canvas);
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
	////// Obstacles
	//////// Box
	maker.identity();
	var randomX = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	var randomZ = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	maker.translate([randomX, 0.5, randomZ]);
	maker.color([1, 1, 1]);
	maker.box({
		width: Math.random() + 1,
		height: 1,
		depth: Math.random() + 1
	});
	//////// Sphere
	maker.identity();
	randomX = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	randomZ = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	maker.translate([randomX, 0.5, randomZ]);
	maker.color([1, 1, 1]);
	maker.sphere({
		width: 1,
		depth: 1,
		height: 1,
		resolution: 32
	});
	//////// Cylinder
	maker.identity();
	randomX = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	randomZ = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	maker.translate([randomX, 0.5, randomZ]);
	maker.color([1, 1, 1]);
	var randomWidth = Math.random() + 1;
	maker.cylinder({
		width: randomWidth,
		depth: randomWidth,
		height: 1,
		width2: randomWidth,
		depth2: randomWidth
	});
	//////// Cone
	maker.identity();
	randomX = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	randomZ = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	maker.translate([randomX, 0, randomZ]);
	maker.color([1, 1, 1]);
	randomWidth = Math.random() + 1;
	maker.cone({
		width: randomWidth,
		height: 1,
		depth: randomWidth,
		resolution: 32
	});
	//////// Pyramid
	maker.identity();
	randomX = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	randomZ = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	maker.translate([randomX, 0, randomZ]);
	maker.color([1, 1, 1]);
	randomWidth = Math.random() + 1;
	maker.pyramid({
		width: randomWidth,
		height: 1,
		depth: randomWidth
	});
	//////// Trapezoid
	maker.identity();
	randomX = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	randomZ = -lengthOfBoard/2 + 2 + Math.random()*(lengthOfBoard - 4);
	maker.translate([randomX, 0.5, randomZ]);
	maker.color([1, 1, 1]);
	maker.trapezoid({
		width: Math.random() + 1,
		depth: Math.random() + 1,
		height: 1,
		width2: Math.random() + 1,
		depth2: Math.random() + 1
	});
	
	maker.clear({uv: true});
	this.model = maker.flush();
};

Arena.prototype.draw = function()
{
	this.model.draw();
};