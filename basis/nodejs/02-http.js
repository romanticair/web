// 使用 Node 非常轻松的构建一个 Web 服务器
// 在 Node 中专门提供了一个核心模块：http
// http 这个模块的职责就是帮你创建编写服务器的

// 1.加载 http 核心模块
var http = require('http');
// 2.使用 http.createServer() 方法创建一个 Web 服务器
var server = http.createServer();
// 3.服务器的功能--提供服务(对数据的服务)
// 3.1 发请求
// 3.2 接收请求
// 3.3 处理请求
// 3.4 给个反馈（发送响应）
// 3.5 注册 request 请求事件
// 3.6 当客户端请求过来，就会自动触发服务器的 request 请求事件,
//     然后执行第二个参数：回调处理函数
server.on('request', function () {
  console.log('客户端发来请求');
});

// 4.绑定端口号, 启动服务器
server.listen(3000, function () {
	console.log('服务器启动成功, 请来http://127.0.0.1:3000访问我');
});