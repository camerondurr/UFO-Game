var HUD = function(area)
{
	for (var i = 0; i < 3; i++)
	{
		var life = document.createElement("div");
		var lifeSize = 100;
		life.style.width = lifeSize + "px";
		life.style.height = lifeSize + "px";
		life.style.right = (i + 1)*lifeSize + "px";
		life.style.top = lifeSize + "px";
		life.style.position = "absolute";
		life.style.backgroundColor = "red";
		life.style.borderRadius = "100%";
		// TODO: Space out the lives.

		area.appendChild(life);
	}
};