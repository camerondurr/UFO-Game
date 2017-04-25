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
	
	var my_color = [customizedColors.red, customizedColors.green, customizedColors.blue, 1];
	
	canvas.whenAnimate().then(function()
	{
		if (my_session == null)
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
		
		var users = my_session.getUsers();
		for (var i in users)
		{
			if (users[i] !== me && users [i].p)
			{
				users[i].variable('p').interpolate(10);
				
				var opponentPosition = {
					x: users[i].p[0],
					y: users[i].p[1],
					z: users[i].p[2]
				};
				if (distance(ufo.position, opponentPosition) < 2*ufo.widthOfMiddlePart)
				{
					users[i].p[0] += 2*ufo.speed.x;
					users[i].p[2] += 2*ufo.speed.z;
					ufo.speed.x = -ufo.speed.x;
					ufo.speed.z = -ufo.speed.z;
					
					users[i].variable('p').broadcast({skip: 10});
					users[i].variable('color').broadcast({skip: 10});
				}
			}
		}
		ufo.animate();
		ufo.testForCollisions(arena);
	});
	
	canvas.whenDraw().then(function()
	{
		if (my_session == null)
		{
			return;
		}
		
		var p = canvas.getPrinter();
		p.translate([0, -1.5, -4]);
		p.rotateY(-ufo.orientation.y);
		p.translate([-ufo.position.x, -ufo.position.y, -ufo.position.z]);
		
		arena.draw();
		
		var users = my_session.getUsers();
		for (var i in users)
		{
			if (users[i].isSpawned === false)
			{
				users[i].isSpawned = true;
				ufo.position.x = -Math.sin((i - 1)*(3.14/2))*(arena.lengthOfBoard/2 - ufo.widthOfMiddlePart/2);
				ufo.position.z = Math.cos((i - 1)*(3.14/2))*(arena.lengthOfBoard/2 - ufo.widthOfMiddlePart/2);
				ufo.orientation.y = -(i - 1)*(3.14/2);
			}
			
			var pos = users[i].p;
			if (pos)
			{
				p.pushMatrix();
				
				p.translate([pos[0], pos[1], pos[2]]);
				p.rotateX(pos[3]);
				p.rotateY(pos[4]);
				p.rotateZ(pos[5]);
				
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
			
			var bPos = users[i].b;
			if (bPos && users[i].bulletIsActive === true)
			{
				p.pushMatrix();
				
				p.translate([bPos[0], bPos[1], bPos[2]]);
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
	
	var my_session = null;
	var me = null;
	var server = null;
	
	var init_rt = function()
	{
		my_session = null;
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
			my_session = session;
			me = server.me();
			me.color = my_color;
			me.variable('color').broadcast();
			me.isSpawned = false;
			me.variable('isSpawned').broadcast();
			me.variable('p').whenValueChanged().then(function(event)
			{
				if (event.initiator !== me)
				{
					ufo.position.x = me.p[0];
					ufo.position.y = me.p[1];
					ufo.position.z = me.p[2];
					ufo.orientation.x = me.p[3];
					ufo.orientation.y = me.p[4];
					ufo.orientation.z = me.p[5];
				}
			});
			me.bulletIsActive = false;
			me.variable('b').whenValueChanged().then(function(event)
			{
				if (event.initiator !== me)
				{
					ufo.bullet.position.x = me.b[0];
					ufo.bullet.position.y = me.b[1];
					ufo.bullet.position.z = me.b[2];
				}
			});
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