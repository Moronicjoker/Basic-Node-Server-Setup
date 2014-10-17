var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('mime');
var WebSocketServer = require('websocket').server;

// HTTP Server
var server = http.createServer(function(req, res) {
	var reqObject = url.parse(req.url, true);
	var action = reqObject.pathname;
	console.log('action:',req.headers.host,' - ',action,'-');
	try {
		if(action == '/'){
			var file = fs.readFileSync('./index.html');
			res.writeHead(200, {'content-type': 'text/html'});
		} else {
			var file = fs.readFileSync('.'+action);	
			res.writeHead(200, {'Content-Type': mime.lookup('.'+action)});
		};
	} catch (e) {
		if (e.code === 'ENOENT') {
			console.log('File: '+ action +' not found!');
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.end(req.url + " not found.");
			return;
		} else {
			throw e;
		}
	};
	res.end(file, 'binary');
// to use port 80 on ubuntu: sudo node JSFILE
}).listen(80);

// WEBSOCKET Server
wsServer = new WebSocketServer({
	httpServer: server
});

var connectionIDCounter = 0;
var allConnections = {};

wsServer.on('request',function(request) {
	var connection = request.accept(null,request.origin);
	connection.id = connectionIDCounter ++;
	allConnections[connection.id] = connection;
	// on message
	connection.on('message',function(message){
			console.log('message.utf8Data: ',message.utf8Data);			
			connection.send( 'Hi yourself! :)' );
	});
	// on close
	connection.on('close',function() {
		delete allConnections[connection.id];
	});
});


