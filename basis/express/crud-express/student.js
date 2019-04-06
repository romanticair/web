/**
 * student.js
 * 数据操作文件模块
 * 职责：操作文件中的数据，只处理数据，不关心业务
 *
 * 这里才是我们学习 Node 的精华部分：奥义之所在
 * 封装异步 API
 */

var fs = require('fs')
var dbPath = './db.json'

/**
 * 获取学生列表
 * @param  {Function} callback 回调函数
 */
exports.find = function (callback) {
	fs.readFile(dbPath, 'utf8', function (err, data) {
		if (err) {
			callback(err)
		}
		// console.log(typeof data, JSON.parse(data).students)
		callback(null, JSON.parse(data).students)
	})
}

/**
 * 添加用户数据
 * @param  {Object}   student  学生对象
 * @param  {Function} callback 回调函数
 */
 exports.save = function (newStudent, callback) {
 	fs.readFile(dbPath, 'utf8', function (err, data) {
 		if (err) {
 			callback(err)
 		}
 		var students = JSON.parse(data).students
 		// id 不应重复且不能用已使用过的,即每次 + 1
 		newStudent.id = students[students.length - 1].id + 1
    // 把用户传递的对象保存到数组中
 		students.push(newStudent)
 		// 把对象转化为字符串
 		students = JSON.stringify({
 			students: students
 		})
 		// 以字符串形式写回数据库
 		fs.writeFile(dbPath, students, function (err) {
 			if (err) {
 				return callback(err)
 			}
 		})
 		callback(null)
 	})
}

/**
 * 查询用户信息
 * @param {Number}   id       学生编号
 * @param {Function} callback 回调函数
 */
exports.findById = function (id, callback) {
	fs.readFile(dbPath, 'utf8', function (err, data) {
		if (err) {
 			return callback(err)
 		}
 		var students = JSON.parse(data).students
 		var ret = students.find(function (item) {
 			return item.id === id
 		})
 		// 若没找到则 err
 		if (!ret) {
 			callback('data not found.')
 		}
		callback(null, ret)
	})
}

/**
 * 更新用户信息
 * @param {String}   student  学生编号
 * @param {Function} callback 回调函数
 */
exports.update = function (student, callback) {
	fs.readFile(dbPath, 'utf8', function (err, data) {
		if (err) {
 			return callback(err)
 		}
 		var students = JSON.parse(data).students
 		// 一定要把 id 字符串转成数字
 		student.id = parseInt(student.id)
 		// 你要修改谁，就需要把谁找出来
    // EcmaScript 6 中的一个数组方法：find
    // 需要接收一个函数作为参数
    // 当某个遍历项符合 item.id === student.id 条件的时候，find 会终止遍历，同时返回遍历项
 		var ret = students.find(function (item) {
 			return item.id === student.id
 		})
    // 遍历拷贝对象(引用同一对象)
 		for (var key in student) {
 			ret[key] = student[key]
 		}
 		
 		newData = JSON.stringify({
 			students: students
 		})
 		fs.writeFile(dbPath, newData, function (err) {
 			if (err) {
 				return callback(err)
 			}
 			callback(null)
 		})
	})
}

 /**
 * 删除用户
 * @param {Number}   id       学生编号
 * @param {Function} callback 回调函数
 */
exports.deleteById = function (id, callback) {
	fs.readFile(dbPath, 'utf8', function (err, data) {
		if (err) {
			callback(err)
		}
		var students = JSON.parse(data).students
		// console.log(typeof data, typeof JSON.parse(data), typeof students)
    // findIndex 方法专门用来根据条件查找元素的下标
		var index = students.findIndex(function (item) {
			return item.id === id
		})
    // 根据下标从数组中删除对应的学生对象
		students.splice(index, 1)
		var newData = JSON.stringify({
			students: students
		})
		// 以字符串形式写回数据库
		fs.writeFile(dbPath, newData, function (err) {
			if (err) {
				callback(err)
			}
			callback(null)
		})
	})
}
