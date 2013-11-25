var socket = io.connect('http://localhost:3000');
//var socket = io.connect('http://xxxx.com:3000');

// Socket�ڑ�
socket.on('connect', function(message) {
	console.log('connect');
	$('#sessionId').text('session id = ' + socket.socket.transport.sessid);
	$('#transportName').text('transport name = ' + socket.socket.transport.name);
});
// ���b�Z�[�W��M
socket.on('message', function(message) {
	$('#message').append($('<div>').text(message.value));
});
// �X�g���[�N��M
socket.on('stroke', function(message) {
	console.log('received stroke');
	var ctx = board.$canvas[0].getContext('2d');
	board.writeStroke(ctx, message);
});
// ���b�Z�[�W��M
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

// ���b�Z�[�W���M����
// �p�����[�^�[message�̗v�f"action"��Socket�̒ʐM��ʂ��w�肵�܂��B
socket.sendMessage = function(message) {
	socket.emit(message.action, message);
};
