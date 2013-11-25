var board = {};

board.strokeStyle = 'black';
board.lineWidth = 1;
board.lineCap = 'round';
board.lineJoin = 'round';

$(function() {
	board.$canvas = $('#board');
	var ctx = board.$canvas[0].getContext('2d');
	var prevX;
	var prevY;
	board.isMouseDown = false;
	board.$canvas.mousemove(function(event) {
		var pageX = event.pageX;
		var pageY = event.pageY;
		var canvasLeft = $(this).offset().left;
		var canvasTop = $(this).offset().top;
		var nextX = pageX - canvasLeft;
		var nextY = pageY - canvasTop;
		if (board.isMouseDown == true) {
			var message = {
				action: 'stroke',
				prevX : prevX,
				prevY : prevY,
				nextX : nextX,
				nextY : nextY,
				color : board.strokeStyle,
				width : board.lineWidth,
				cap : board.lineCap,
				join : board.lineJoin,
			};
			board.writeStroke(ctx, message);
			socket.sendMessage(message);
		}
		
		prevX = pageX - canvasLeft;
		prevY = pageY - canvasTop;
		
		$('#pageAxis').text('page = ' + pageX + ',' + pageY);
		$('#canvasAxis').text('canvas = ' + nextX + ',' + nextY);
	});
	$(document).mousedown(function() {
		board.isMouseDown = true;
	});
	$(document).mouseup(function() {
		board.isMouseDown = false;
	});
	// カラーパレット：クリック
	$('.palette').click(function() {
		var color = $(this).css('background-color');
		board.strokeStyle = color;
		$('#brushColor').text('color = ' + board.strokeStyle);
	});
	// ブラシ：クリック
	$('.brush').click(function() {
		for (var i = 1; i < 100; i++) {
			if ($(this).hasClass('size' + i) == true) {
				board.lineWidth = i;
				break;
			}
		}
		$('#brushSize').text('size = ' + board.lineWidth);
	});
	// 保存：クリック
	$('.save').click(function() {
		var url = board.$canvas[0].toDataURL();
		$('#snapshots').append($('<img>').attr({src:url}).addClass('snapshot'));
	});
	// チャット送信：クリック
	$('#chat .submit').click(function() {
		var name = $('#console .name').val();
		var text = $('#console .text').val();
		if (name == '' || text == '') {
			return;
		}
		var message = {
			action : 'chat',
			name : name,
			text : text,
		};
		socket.sendMessage(message);
	});
});

// 指定のコンテキストとメッセージからストロークを描写します。
board.writeStroke = function(ctx, message) {
	ctx.strokeStyle = message.color;
	ctx.lineWidth = message.width;
	ctx.lineCap = message.cap;
	ctx.lineJoin = message.join;
	ctx.beginPath();
	ctx.moveTo(message.prevX, message.prevY);
	ctx.lineTo(message.nextX, message.nextY);
	ctx.stroke();
};
