// Express 提供了一种更好的方式
// 专门用来包装路由的
var express = require('express')
var Student = require('./student-mongodb')

// 1. 创建一个路由容器
var router = express.Router()

// 2. 把路由都挂载到 router 路由容器中

/*
 * 渲染学生列表主页
 */
 router.get('/', function (req, res) {
	Student.find(function (err, students) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		res.render('index.html', {
			fruits: [
				'苹果',
				'香蕉',
				'哈木瓜'
			],
			students: students
		})
	})
})

router.get('/students', function (req, res) {
	Student.find(function (err, students) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		res.render('index.html', {
			fruits: [
				'苹果',
				'香蕉',
				'哈木瓜'
			],
			students: students
		})
	})
})

/*
 * 渲染添加学生页面
 */
router.get('/students/add', function (req, res) {
	res.render('add.html')
})

/*
 * 处理添加学生 post 表单
 */
router.post('/students/add', function (req, res) {
	// 1. 获取表单数据
  // 2. 处理
  //    将数据保存到 db.json 文件中用以持久化
  // 3. 发送响应
	new Student(req.body).save(function (err) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		res.redirect('/students')
	})
})

/*
 * 渲染编辑学生信息页面
 */
router.get('/students/edit', function (req, res) {
	// 1. 在客户端的列表页中处理链接问题(需要有 id 参数)
  // 2. 获取要编辑学生的 id
  // 3. 渲染编辑页面
  //    根据 id 把学生信息查出来
  //    使用模板引擎渲染页面
  
  // console.log(req.query.id) 本插件没有自动为 id 两端添加 " 符号
  // 所以不用执行 replace 操作也可以
	// Student.findById(req.query.id.replace(/"/g, ''), function (err, student) {
	Student.findById(req.query.id, function (err, student) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		res.render('edit.html', {
			student: student
		})
	})
})

/*
 * 用户更新数据后跳回主页
 */
router.post('/students/update', function (req, res) {
  // 1. 获取表单数据 -- req.body
  // 2. 更新
  // 3. 发送响应

  // replace
  //    字符串模式
  //      简单，但是不支持全局和忽略大小写问题
  //    正则表达式模式
  //      强大，支持全局和忽略大小写
	var id = req.body.id.replace(/"/g, '')
	Student.findByIdAndUpdate(id, req.body, function (err) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		res.redirect('/students')
	})
})

/*
 * 删除用户后跳回主页
 */
router.get('/students/delete', function (req, res) {
	var id = req.query.id.replace(/"/g, '')
	Student.findByIdAndRemove(id, function (err) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		res.redirect('/students')
	})
})

// 3. 把 router 导出
module.exports = router
