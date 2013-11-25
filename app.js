
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

// Socket�ڑ�
io.sockets.on('connection', function(socket) {
	console.log('connection');
	// ���b�Z�[�W���M
	socket.on('message', function(message) {
		console.log('message');
		io.sockets.emit('message', {value: message.value});
	});
	// �X�g���[�N���M
	socket.on('stroke', function(message) {
		console.log('stroke');
		io.sockets.emit('stroke', message);
	});
	// �`���b�g���M
	socket.on('chat', function(message) {
		console.log('chat');
		var date = new Date();
		message.date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
		message.time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		io.sockets.emit('chat', message);
	});
	// Socket�ؒf
	socket.on('disconnect', function() {
		console.log('disconnect');
	});
});
