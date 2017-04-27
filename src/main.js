var main = function(area, customizedColors)
{
	while(area.firstChild)
	{
		area.removeChild(area.firstChild);
	}
	
	var canvas = new GLCanvas(area);
	
	drawHud(area);
	var ufo = new UFO(canvas);
	var arena = new Arena(canvas, ufo);
	
	var isPressed = new Array(100);
	canvas.whenKeyPressed().then(function(keyCode)
	{
		isPressed[keyCode] = true;
	});
	canvas.whenKeyReleased().then(function(keyCode)
	{
		isPressed[keyCode] = false;
	});
	
	var myColor = [customizedColors.red, customizedColors.green, customizedColors.blue, 1];
	
	canvas.whenAnimate().then(function()
	{
		if (mySession == null)
		{
			return;
		}
		
		ufo.control(isPressed);
		
		me.p = [ufo.position.x, ufo.position.y, ufo.position.z, ufo.orientation.x, ufo.orientation.y, ufo.orientation.z];
		me.variable('p').broadcast({
			decimals: 2,
			skip: 10
		});
		me.b = [ufo.bullet.position.x, ufo.bullet.position.y, ufo.bullet.position.z];
		me.variable('b').broadcast({
			decimals: 2,
			skip: 10
		});
		
		var users = mySession.getUsers();
		for (var i in users)
		{
			if (users[i] != me && users[i].p)
			{
				users[i].variable('p').interpolate(10);
				var opponentPosition = {
					x: users[i].p[0],
					y: users[i].p[1],
					z: users[i].p[2]
				};
				
				// Player-Player Collision
				if (distance(ufo.position, opponentPosition) < 2*ufo.widthOfMiddlePart)
				{
					users[i].p[0] += 2*ufo.speed.x;
					users[i].p[2] += 2*ufo.speed.z;
					ufo.speed.x = -ufo.speed.x;
					ufo.speed.z = -ufo.speed.z;
					
					users[i].variable('p').broadcast({skip: 10});
				}
			}
			
			if (users[i] != me && users[i].b)
			{
				users[i].variable('b').interpolate(10);
				var opponentBulletPosition = {
					x: users[i].b[0],
					y: users[i].b[1],
					z: users[i].b[2]
				};
				
				if (distance(ufo.position, opponentBulletPosition) < 2*ufo.widthOfMiddlePart)
				{
					ufo.armor--;
					if (ufo.armor === 0)
					{
						var livesDiv = document.getElementById("lives");
						ufo.lives--;
						if (ufo.lives === 0)
						{
							livesDiv.removeChild(document.getElementById("2 life"));
							
							
							
							// TODO: "Eliminate" this Player from the game.
							var gameOverMessage = document.createElement("div");
							gameOverMessage.style.width = "100px";
							gameOverMessage.style.height = "50px";
							gameOverMessage.align = "center";
							gameOverMessage.style.lineHeight = "50px";
							gameOverMessage.style.top = "50%";
							gameOverMessage.style.left = "50%";
							gameOverMessage.style.marginTop = "-25px";
							gameOverMessage.style.marginLeft = "-50px";
							gameOverMessage.style.position = "absolute";
							gameOverMessage.style.backgroundColor = "black";
							gameOverMessage.style.color = "green";
							gameOverMessage.style.fontFamily = "monospace";
							gameOverMessage.style.fontSize = "16px";
							gameOverMessage.innerHTML = "GAME OVER";
							
							area.appendChild(gameOverMessage);
						}
						else
						{
							if (ufo.lives === 2)
							{
								livesDiv.removeChild(document.getElementById("0 life"));
							}
							else if (ufo.lives === 1)
							{
								livesDiv.removeChild(document.getElementById("1 life"));
							}
							ufo.armor = 3;
							users[i].isSpawned = false;
						}
					}
					
					var clangSound = new Audio("src/sounds/effects/Clang.wav");
					clangSound.play();
					
					users[i].bulletIsActive = false;
					
					users[i].variable('b').broadcast({skip: 10});
				}
				
				var opponentPosition = {
					x: users[i].p[0],
					y: users[i].p[1],
					z: users[i].p[2]
				};
				
				if (distance(ufo.bullet.position, opponentPosition) < 2*ufo.widthOfMiddlePart)
				{
					var clangSound = new Audio("src/sounds/effects/Clang.wav");
					clangSound.play();
					
					me.bulletIsActive = false;
					ufo.bullet.isActive = false;
				}
			}
		}
		
		ufo.animate();
		
		ufo.testForCollisions(arena);
		me.bulletIsActive = ufo.bullet.isActive;
	});
	
	canvas.whenDraw().then(function()
	{
		if (mySession == null)
		{
			return;
		}
		
		var p = canvas.getPrinter();
		p.translate([0, -1.5, -4]);
		p.rotateY(-ufo.orientation.y);
		p.translate([-ufo.position.x, -ufo.position.y, -ufo.position.z]);
		
		arena.draw();
		
		var users = mySession.getUsers();
		for (var i in users)
		{
			// If the Player is spawning...
			if (users[i].isSpawned == false)
			{
				users[i].isSpawned = true;
				ufo.position.x = -Math.sin((i - 1)*(3.14/2))*(arena.lengthOfBoard/2 - ufo.widthOfMiddlePart/2);
				ufo.position.z = Math.cos((i - 1)*(3.14/2))*(arena.lengthOfBoard/2 - ufo.widthOfMiddlePart/2);
				ufo.orientation.y = -(i - 1)*(3.14/2);
			}
			
			var ufoPosition = users[i].p;
			if (ufoPosition)
			{
				p.pushMatrix();
				
				p.translate([ufoPosition[0], ufoPosition[1], ufoPosition[2]]);
				p.rotateX(ufoPosition[3]);
				p.rotateY(ufoPosition[4]);
				p.rotateZ(ufoPosition[5]);
				
				if (users[i].color)
				{
					ufo.model.getShader().setColorMask(users[i].color);
				}
				else
				{
					ufo.model.getShader().setColorMask([1, 1, 1, 1]);
				}
				var texture = new GLTexture(canvas);
				texture.text({text: i, color: 'white', font: '40px Arial', width: 128, height: 128});
				ufo.label.setTexture(texture);
				
				ufo.draw();
				
				p.popMatrix();
			}
			
			var bulletPosition = users[i].b;
			// TODO: Fix the bug where users[i].b is undefined.
			// console.log("User " + i + " b: " + users[i].b[0] + ", " + users[i].b[1] + ", " + users[i].b[2]);
			// TODO: Fix the bug where users[i].bulletIsActive is undefined.
			// console.log("User " + i + " bulletIsActive: " + users[i].bulletIsActive);
			if (users[i].bulletIsActive == true)
			{
				p.pushMatrix();
				
				p.translate([bulletPosition[0], bulletPosition[1], bulletPosition[2]]);
				ufo.bullet.draw();
				
				p.popMatrix();
			}
		}
	});
	
	canvas.whenDragged().then(function(o, event)
	{
		canvas.getCamera().oneFingerRotate(event, {
			radius: 4,
			type: 'polar'
		});
	});
	
	canvas.start();
	
	var mySession = null;
	var me = null;
	var server = null;
	
	var init_rt = function()
	{
		mySession = null;
		me = null;
		server = new VNServer();
		server.whenConnected().otherwise(function(s)
		{
			if (s == server)
			{
				console.log('will reconnect...');
				server = null;
				init_rt();
			}
		});
		server.connect('UFO Game',
			{
				capacity: 4,
				releaseSeats: true
			}).then(function(session)
		{
			mySession = session;
			me = server.me();
			me.color = myColor;
			me.variable('color').broadcast();
			me.isSpawned = false;
			me.variable('isSpawned').broadcast();
			me.variable('p').whenValueChanged().then(function(event)
			{
				if (event.initiator != me)
				{
					ufo.position.x = me.p[0];
					ufo.position.y = me.p[1];
					ufo.position.z = me.p[2];
					ufo.orientation.x = me.p[3];
					ufo.orientation.y = me.p[4];
					ufo.orientation.z = me.p[5];
				}
			});
			me.bulletIsActive = ufo.bullet.isActive;
			me.variable('b').whenValueChanged().then(function(event)
			{
				if (event.initiator != me)
				{
					ufo.bullet.position.x = me.b[0];
					ufo.bullet.position.y = me.b[1];
					ufo.bullet.position.z = me.b[2];
				}
			});
			me.variable('bulletIsActive').whenValueChanged().then(function(event)
			{
				if (event.initiator != me)
				{
					ufo.bullet.isActive = me.bulletIsActive;
				}
			});
			me.armor = ufo.armor;
			me.lives = ufo.lives;
			
			vn.getWindowManager().createNotification('You are now connected!');
		});
	};
	init_rt();
	
	var mainMusic = new Audio("src/sounds/music/Retro Sci-Fi Planet.mp3");
	mainMusic.volume = 0.25;
	mainMusic.play();
};

// Methods
var drawHud = function(area)
{
	var hud = new HUD(area);
};

var distance = function(p1, p2)
{
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	var dz = p1.z - p2.z;
	return dx*dx + dy*dy + dz*dz;
};