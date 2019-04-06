// 1.引包
var express = require('express')
// 2.创建服务器应程序 -- 原来的 http.createServer()
var app = express()

// 在 Express 中开放资源 -- 贼简单
// 公开指定目录 -- 即可访问该目录下的资源
app.use('/public/', express.static('./public/'))
app.use('/static/', express.static('./static/'))
// app.use('/node_modules/', express.static('./node_modules/'))

// 3.响应 get 请求
app.get('/index', function (req, res) {
	// 可直接通过 req.query 获取查询字符串参数
	// /index?name=kitty&gender=1 -> {name:'kitty',gender:'1'}
	console.log(req.query)
	res.send('Hello, 我是 Express!')
})

app.get('/comment', function (req, res) {
	// req.query
  // 在 Express 中使用模板引擎有更好的方式：res.render('文件名， {模板对象})
  // 尝试去看 art-template 官方文档：如何让 art-template 结合 Express 来使用
})

// 当服务器收到 get 请求 / 的时候，执行回调处理函数
app.get('/', function (req, res) {
	res.send(`
		<!DOCTYPE html>
		<html lang="en">
		  <head>
		      <meta charset="UTF-8" />
		    <title>Document</title>
		  </head>
		<body>
		  <h1>hello Express！你好</h1>
		</body>
		</html>
		`)
})

// 3.相当于 server.listen
app.listen(3000, function () {
  console.log('app is running at port 3000.')
})