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
        randomX = -arena.lengthOfBoard/2 + 2 + Math.random()*(arena.lengthOfBoard - 4);
        randomZ = -arena.lengthOfBoard/2 + 2 + Math.random()*(arena.lengthOfBoard - 4);
        maker.translate([randomX, 0.5, randomZ]);
        maker.color([1, 1, 1]);
        randomWidth = Math.random() + 1;
        randomDepth = Math.random() + 1;
        if (!randomX - randomWidth/2 < arena.ufo.widthOfMiddlePart/2)
        {
            if (!randomX + randomWidth/2 > -arena.ufo.widthOfMiddlePart/2)
            {
                if (!randomZ - randomDepth/2 < arena.ufo.widthOfMiddlePart/2)
                {
                    if (!randomZ + randomDepth/2 > -arena.ufo.widthOfMiddlePart/2)
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