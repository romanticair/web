var http = require('http')
var fs = require('fs')
var template = require('art-template')
var path = require('path')
var server = http.createServer()
var rootDir = 'L:/www'

server.on('request', function (req, res) {
	// 1. 如果是文件，直接读取响应
	// 2. 如果是目录，读取渲染目录列表
	// 3. 如果目录并且有该目录中有 index.html 则直接渲染目录中的 index.html
	var url = req.url
	var urlPath = path.join(rootDir, url)
	fs.stat(urlPath, function (err, stats) {
		console.log(urlPath)
		if (err) {
			return res.end('404 Not Found.')
		}
		if (stats.isFile()) {
			fs.readFile(urlPath, function (err, data) {
				if (err) {
					return res.end('404 Not Found.')
				}
				res.end(data)
			})
		} else if (stats.isDirectory()) {
			var templateStr = fs.readFileSync('./resource/templatexx.html').toString()
			var files = fs.readdirSync(urlPath)
			// var data = files.map(function (item) {
      //   return {
      //     url: 
      //     name: 
      //     type: 
      //   }
      // })
      var htmlStr = template.render(templateStr, {
      	files: files
      })

      res.end(htmlStr)
		}
	})
})

server.listen(3000, function () {
  console.log('running...')
})