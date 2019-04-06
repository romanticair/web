var http = require('http')
var fs = require('fs');
var server = http.createServer()

var rootDir = 'L:/www'

server.on('request', function(req, res) {
  var url = req.url
  fs.readFile('./resource/template.html', function(err, data) {
    if (err) {
        return res.end('404 Not Found')
    }
    // 1. 如何得到 rootDir 目录列表中的文件名和目录名
    // fs.readdir
    // 2. 如何将得到的文件名和目录名替换到 template.html 中
    // 2.1 在 template.html 中需要替换的位置预留一个特殊的标记（就像以前使用模板引擎的标记一样）
    // 2.2 根据 files 生成需要的 HTML 内容
    fs.readdir(rootDir, function(err, files) {
      if (err) {
          return res.end('Can not find root dir.')
      }
      // 2.1 生成需要替换的内容
      var content = ''
      files.forEach(function(item) {
          // 在 EcmaScript 6 的 ` 字符串中，可以使用 ${} 来引用变量
          content += `
  	       	<tr>
			      <td data-value="a"><a class="icon dir" href="/L:/www">${item}/</a></td>
			      <td class="detailsColumn" data-value="0"></td>
			      <td class="detailsColumn" data-value="1509589967">2017/11/2 上午10:32:47</td>
		    		</tr>
  				`
      })

      // 2.3 替换
     	data = data.toString()
     	data = data.replace('^_^', content)
      // 3. 发送解析替换过后的响应数据
     	res.end(data)
    })
  })
})

// 3. 绑定端口号，启动服务
server.listen(3000, function() {
    console.log('running...')
})