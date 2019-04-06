var http = require('http');
var server = http.createServer();

// request 请求事件处理函数，需要接收两个参数：
// 1. Request 请求对象
// 请求对象可以用来获取客户端的一些请求信息，例如请求路径
// 2. Response 响应对象
// 响应对象可以用来给客户端发送响应消息
server.on('request', function(request, response) {
	// 链接根目录*/
  // http://127.0.0.1:3000/
  // http://127.0.0.1:3000/foo
  // http://127.0.0.1:3000/foo/demo
  console.log('收到客户端情况, 请求路径是' + request.url);
  // response 对象write()方法可用来给客户端发送响应数据
  // 其可多次使用，但最后一定要用 end 来结束响应，否则客户端会一直等待
  response.write('hello, client!');
  response.write('this server running by the nodejs.');

  // 告诉客户端，我的话说完了，可以呈递给用户了
  response.end();

});

server.listen(3000, function() {
	console.log('服务器启动成功, 请来http://127.0.0.1:3000访问我');
});