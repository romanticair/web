var http = require('http')
var fs = require('fs')
var template = require('art-template')
var server = http.createServer()
var rootDir = 'L:/www'

server.on('request', function (req, res) {
	var url = req.url
	fs.readFile('./resource/templatexx.html', function (err, data) {
		if (err) {
			return res.end('404 Not Found')
		}
		// 将得到的文件名和目录名替换到 template.html 中
		fs.readdir(rootDir, function (err, files) {
			if (err) {
				return res.end('Can not find www dir.')
			}
			// 这里只需要使用模板引擎解析替换 data 中的模板字符串就可以了
      // 数据就是 files
      // 然后去你的 template.html 文件中编写你的模板语法就可以了
			var htmlStr = template.render(data.toString(), {
				title: 'demo demo',
				files: files
			})

			// 3. 发送解析替换过后的响应数据
      res.end(htmlStr)
		})
	})
})

server.listen(3000, function () {
  console.log('running...')
})