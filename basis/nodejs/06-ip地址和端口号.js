// ip 地址用来定位计算机
// 端口号用来定位具体的应用程序
// 所有需要联网通信的应用程序都会占用一个端口号

var http = require('http');
var server = http.createServer();

server.on('request', function (req, res) {
	console.log('收到请求，请求路径是：' + req.url);
	console.log('客户端地址和端口是：' + res.socket.remoteAddress, res.socket.remotePort);

	res.end('Hi! this is nodejs.');
});

server.listen(5000, function () {
  console.log('服务器启动成功，请访问我');
});