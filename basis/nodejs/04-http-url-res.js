var http = require('http');

// 1.创建服务器
var server = http.createServer();

// 2.监听请求
server.on('request', function (req, res) {
	console.log('客户端访问 ' + req.url);
	// res.write('hello!');
	// res.write('this message come from server!');
	
	// 上面的方式麻烦,推荐使用 end 更简洁
	// 它构造响应消息的同时将其发送出去
	// res.end('hello!');

	// 根据不同的请求路径发送不同的响应结果
  // 1.获取请求路径
  //    req.url 获取到的是端口号之后的那一部分路径
  //    也就是说所有的 url 都是以 / 开头的
  // 2.判断路径处理响应
	var url = req.url;
	if (url === '/') {
		res.end('index page');
	} else if (url === '/login') {
		res.end('login page');
	} else if (url === '/foo') {
		res.end('foo page');
	} else if (url === '/products') {
		var products = [{
			  name: '苹果 X',
        price: 8888
      },
      {
        name: '菠萝 X',
        price: 5000
      },
      {
        name: '小辣椒 X',
        price: 1999
      }
		];
		// 响应内容只能是二进制数据或者字符串
    // 数字  (x)
    // 对象  (x)
    // 数组  (x)
    // 布尔值(x)
    res.end(JSON.stringify(products));
	} else {
		res.end('404 Not Found.');
	}
});

// 3.绑定端口号,启动服务器
server.listen(3000, function () {
	console.log('服务器启动成功, 请来http://127.0.0.1:3000访问我');
});