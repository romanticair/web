var http = require('http');
var server = http.createServer();

server.on('request', function (req, res) {
	// 在服务端默认发送的数据，其实是 utf8 编码的内容
  // 但是浏览器不知道你是 utf8 编码的内容
  // 浏览器在不知道服务器响应内容的编码的情况下会按照当前操作系统的默认编码去解析
  // 中文操作系统默认是 gbk
  // 解决方法就是正确的告诉浏览器我给你发送的内容是什么编码的
  // 在 http 协议中，Content-Type 就是用来告知对方我给你发送的数据内容是什么类型
  // res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  // res.end('hello 世界')
  var url = req.url;
  if(url === '/plain') {
  	// text/plain 就是普通文本
  	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  	res.end('hello 世界');
  } else if (url === '/html') {
    // 如果你发送的是 html 格式的字符串，则也要告诉浏览器我给你发送是 text/html 格式的内容
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<h1>hello 世界</h1>');
  }
});

server.listen(3000, function() {
	console.log('服务器启动成功, 请来http://127.0.0.1:3000访问我');
});