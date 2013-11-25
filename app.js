
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});

// for socket.io
var server = http.createServer(app);
server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

var socketIO = require('socket.io');
var io = socketIO.listen(server);

// Socket接続
io.sockets.on('connection', function(socket) {
	console.log('connection');
	// メッセージ送信
	socket.on('message', function(message) {
		console.log('message');
		io.sockets.emit('message', {value: message.value});
	});
	// ストローク送信
	socket.on('stroke', function(message) {
		console.log('stroke');
		io.sockets.emit('stroke', message);
	});
	// チャット送信
	socket.on('chat', function(message) {
		console.log('chat');
		var date = new Date();
		message.date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
		message.time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		io.sockets.emit('chat', message);
	});
	// Socket切断
	socket.on('disconnect', function() {
		console.log('disconnect');
	});
});
