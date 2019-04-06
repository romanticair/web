var http = require('http')
var fs = require('fs');
var server = http.createServer()

// Apache 服务器软件，默认有一个 www 目录，
// 所有存放在 www 目录中的资源都可以通过网址来浏览
// 127.0.0.1:80/a.txt
// 127.0.0.1:80/index.html
// 127.0.0.1:80/apple/login.html

var rootDir = 'L:/www'

server.on('request', function (req, res) {
	var url = req.url;
	if (url === '/') {
		fs.readFile(rootDir + '/index.html', function (err, data) {
			if (err) {
				// return 有两个作用：
        //  1. 方法返回值
        //  2. 阻止代码继续往后执行
        return res.end('404 Not Found')
			}
			res.end(data)
		})
	} else if (url === '/demo.txt') {
		fs.readFile(rootDir + '/demo.txt', function (err, data) {
			if (err) {
        return res.end('404 Not Found')
			}
			res.end(data)
		})
	} else if (url === '/index') {
			fs.readFile(rootDir + '/index.html', function (err, data) {
			if (err) {
        return res.end('404 Not Found')
			}
			res.end(data)
		})
	} else if (url === '/temp/index.html') {
		fs.readFile(rootDir + '/temp/index.html', function (err, data) {
			if (err) {
        return res.end('404 Not Found')
			}
			res.end(data)
		})
	}
})

// 3. 绑定端口号，启动服务
server.listen(3000, function () {
  console.log('running...')
})