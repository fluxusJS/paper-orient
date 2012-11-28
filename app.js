
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io')
  , useragent = require('useragent')
  , gm = require('googlemaps')
  , pusher = require('node-pusher');

var app = module.exports = express.createServer();

// Clients is a list of users who have connected
var clients = [];

///////////////////////////////////////////////////////////////////// SEND() UTILITY
function send(message) { 

  clients.forEach(function(client) {
      client.send(message);
  });
}

///////////////////////////////////////////////////////////////////// DATE UTILITY
function getTime(){
	var currentTime = new Date();
	return currentTime;
}

// JADE Configuration ////////////////////////////////////////////////////////////////
	app.configure(function(){
	  app.set('views', __dirname + '/views');
	  app.set('view engine', 'jade');
	  app.use(express.bodyParser());
	  app.use(express.methodOverride());
	  // app.use(require('stylus').middleware({ src: __dirname + '/public' }));
	  app.use(app.router);
	  app.use(express.static(__dirname + '/public'));
	});

	app.configure('development', function(){
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	});

	app.configure('production', function(){
	  app.use(express.errorHandler()); 
	});

// Jade Routes ////////////////////////////////////////////////////////////////////////
	
	app.get('/', routes.index);
	app.get('/spectator', routes.spectator);
	app.get('/performer', routes.performer);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


// SOCKET.IO SERVER
var sio = io.listen(app);

// SOCKET.IO WEB SOCKETS
sio.sockets.on('connection', function(client) {

// BUILD CLIENTS LIST
  clients.push(client);

  send(JSON.stringify({ "clients": clients.length }));

  client.on('device-orientation', function(data) {
	console.log('device-orientation MESSAGE received');
	console.log(data);
	console.log(data.gamma); // gamma is the left-to-right tilt in degrees, where right is positive
	console.log(data.beta); // beta is the front-to-back tilt in degrees, where front is positive
	console.log(data.alpha); // alpha is the compass direction the device is facing in degrees

	send(JSON.stringify({ 
		"gamma": data.gamma, 
		"beta": data.beta, 		
		"alpha": data.alpha
	 }));

  });


}); 





