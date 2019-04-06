/**
 * router.js 路由模块
 * 职责：
 *   处理路由
 *   根据不同的请求方法+请求路径设置具体的请求处理函数
 * 模块职责要单一，不要乱写
 * 我们划分模块的目的就是为了增强项目代码的可维护性
 * 提升开发效率
 */

var fs = require('fs')
// Express 提供了一种更好的方式
// 专门用来包装路由的
var express = require('express')
// 这里用了自己写的增删查改函数逻辑，也可以用 ./student-mongodb 提供的API
var Student = require('./student')

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
		// console.log(typeof students)
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
	Student.save(req.body, function (err) {
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
	Student.findById(parseInt(req.query.id), function (err, student) {
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
	Student.update(req.body, function (err) {
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
	Student.deleteById(parseInt(req.query.id), function (err) {
		if (err) {
			return res.status(500).send('Server error.')
		}
		res.redirect('/students')
	})
})

// 3. 把 router 导出
module.exports = router
