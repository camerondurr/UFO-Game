var HUD = function(canvas)
{
	var maker = new GLObjectMaker(canvas);
	//// HUD
	////// Lives
	var x = 0.52;
	this.lives = [];
	for (var i = 0; i < 3; i++)
	{
		maker.identity();
		maker.translate([x, 0.35, -1]);
		maker.rectangle({width: 0.1, height: 0.1});
		maker.clear({uv: true});
		var life = maker.flush();
		life.getShader().setColorMask([1, 0, 0, 1]);
		this.lives[i] = life;
		x += 0.15;
	}
};

HUD.prototype.draw = function()
{
	for (var i = 0; i < 3; i++)
	{
		this.lives[i].draw();
	}
};