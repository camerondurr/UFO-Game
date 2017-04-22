var Networking = function()
{
	this.session = null;
	this.me = null;
	this.server = null;
	this.connect();
	this._p = new VNPromise(this);
};

Networking.prototype.isConnected = function()
{
	if (this.session == null)
	{
		return false;
	}
	else
	{
		return true;
	}
};

Networking.prototype.connect = function()
{
	this.session = null;
	this.me = null;
	this.server = new VNServer();
	var self = this;

	this.server.whenConnected().otherwise(function(s)
	{
		if (s == self.server)
		{
			console.log('will reconnect...');
			self.server = null;
			self.connect();
		}
	});
	this.server.connect('UFO Game',
		{
			capacity: 0,
			releaseSeats: true
		}).then(function(session)
	{
		self.session = session;
		self.me = self.server.me();
		self.me.color = [0, 0, 0, 0];
		self.me.variable('color').broadcast();
		self.me.variable('p').whenValueChanged().then(function(event)
		{
			if (event.initiator != self.me)
			{
				sim_obj.position.x = self.me.p [0];
				sim_obj.position.y = self.me.p [1];
				sim_obj.position.z = self.me.p [2];
				sim_obj.orientation = self.me.p [3];
			}
		});
		vn.getWindowManager().createNotification('You are now connected!');
		self._p.callThen();
	});
};

Networking.prototype.whenConnected = function() {return this._p;};