var Obstacle = function(canvas, arena)
{
    var maker = new GLObjectMaker(canvas);

    var randomX;
    var randomZ;
    var randomWidth;
    var randomDepth;

    while (true)
    {
        maker.identity();
        
	    randomWidth = Math.random() + 1; // Random number from 1 to 2.
	    randomDepth = Math.random() + 1; // Random number from 1 to 2.
	    
	    var maximumX = arena.lengthOfBoard/2 - (arena.ufo.widthOfMiddlePart + randomWidth/2);
	    var minimumX = -arena.lengthOfBoard/2 + (arena.ufo.widthOfMiddlePart + randomWidth/2);
	    
	    var maximumZ = arena.lengthOfBoard/2 - (arena.ufo.widthOfMiddlePart + randomDepth/2);
	    var minimumZ = -arena.lengthOfBoard/2 + (arena.ufo.widthOfMiddlePart + randomDepth/2);
	    
        randomX = Math.random()*(maximumX - minimumX) + minimumX;
        randomZ = Math.random()*(maximumZ - minimumZ) + minimumZ;
        
        maker.translate([randomX, 0.5, randomZ]);
        maker.color([1, 1, 1]);
        
        if (randomX - randomWidth < arena.ufo.widthOfMiddlePart/2)
        {
            break;
        }
        if (randomX + randomWidth > -arena.ufo.widthOfMiddlePart/2)
        {
        	break;
        }
        if (randomZ - randomDepth < arena.ufo.widthOfMiddlePart/2)
        {
        	break;
        }
        if (randomZ + randomDepth > -arena.ufo.widthOfMiddlePart/2)
        {
        	break;
        }
    }
    
    maker.box({
        width: randomWidth,
        height: 1,
        depth: randomDepth
    });

    maker.clear({uv: true});
    this.model = maker.flush();

    this.xLow = randomX - randomWidth/2;
    this.xHigh = randomX + randomWidth/2;
    
    this.zLow = randomZ - randomDepth/2;
    this.zHigh = randomZ + randomDepth/2;
};

Obstacle.prototype.draw = function()
{
    this.model.draw();
};