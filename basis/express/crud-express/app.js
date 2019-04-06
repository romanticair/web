var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// 配置中间组件,用于 post 表单的数据解析
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}))
// parse application/json
app.use(bodyParser.json())

// 配置渲染设置
app.engine('html', require('express-art-template'))

// 开放资源路径
app.use('/public/', express.static('./public/'))
app.use('/node_modules/', express.static('./node_modules/'))

// 导入路由
// 1.测试 fs
// var router = require('./router')
// 2.测试 mongodb
var router = require('./router-mongodb')

// 把路由容器挂载到 app 服务中
app.use(router)

app.listen(3000, function () {
	console.log('app is running.')
})