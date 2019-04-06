var mysql = require('mysql')

// 1.创建连接
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'siri',
	password: 'siripassword',
	database: 'test'
})
// 注意：此数据库没设计好，主键有问题

// 2.连接数据库
connection.connect()

// 3.执行数据库操作
connection.query('SELECT * FROM `user`', function (err, ret, fields) {
	if (err) throw err
	console.log('The user is: ', ret)
	// console.log(fields)
})

connection.query('INSERT INTO user VALUES("2","admin")', function (err, ret, fields) {
	if (err) throw err
	console.log('success', ret)
	// undefined
	// console.log(fields)	
})

// 4.关闭连接
connection.end()
