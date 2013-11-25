var socket = io.connect('http://localhost:3000');
//var socket = io.connect('http://xxxx.com:3000');

// Socket接続
socket.on('connect', function(message) {
	console.log('connect');
	$('#sessionId').text('session id = ' + socket.socket.transport.sessid);
	$('#transportName').text('transport name = ' + socket.socket.transport.name);
});
// メッセージ受信
socket.on('message', function(message) {
	$('#message').append($('<div>').text(message.value));
});
// ストローク受信
socket.on('stroke', function(message) {
	console.log('received stroke');
	var ctx = board.$canvas[0].getContext('2d');
	board.writeStroke(ctx, message);
});
// メッセージ受信
socket.on('chat', function(message) {
	$('#messages').append(
		$('<div>').addClass('sentence').append(
			$('<div>').addClass('datetime').append(
				$('<div>').text(message.time).addClass('time')
			).append(
				$('<div>').text(message.date).addClass('date')
			)
		).append(
			$('<div>').text(message.name).addClass('name')	
		).append(
			$('<div>').text(message.text).addClass('text')
		)
	);
	$('#messages').animate({scrollTop: $('#messages').get(0).scrollHeight}, '800');
});

// メッセージ送信処理
// パラメーターmessageの要素"action"にSocketの通信種別を指定します。
socket.sendMessage = function(message) {
	socket.emit(message.action, message);
};
