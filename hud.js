var HUD = function(area)
{
	var lifeSize = 100;
	var spaceAroundLives = 10;

	var lives = document.createElement("div");
	lives.style.width = 3*lifeSize + 4*spaceAroundLives + "px";
	lives.style.height = lifeSize + 2*spaceAroundLives + "px";
	lives.style.right = lifeSize/2 + "px";
	lives.style.top = lifeSize/2 + "px";
	lives.style.position = "absolute";
	lives.style.border = "1px dashed red";

	for (var i = 0; i < 3; i++)
	{
		var life = document.createElement("div");
		life.style.width = lifeSize + "px";
		life.style.height = lifeSize + "px";
		life.style.left = (i + 1)*spaceAroundLives + i*lifeSize + "px";
		life.style.top = spaceAroundLives + "px";
		life.style.position = "absolute";
		life.style.backgroundColor = "red";
		life.style.borderRadius = "100%";

		lives.appendChild(life);
	}

	area.appendChild(lives);
};