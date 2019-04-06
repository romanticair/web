// 在 nodejs 使用 mongodb 要安装 mongoose 插件
var mongoose = require('mongoose')

// 1.连接 MongoDB 数据库
mongoose.connect('mongodb://localhost/test')
// 下面这句在高版本废除了
// mongoose.connect('mongodb://localhost/test', {useMongoClient: true})

// 尚未知道这句的用处
mongoose.Promise = global.Promise

// 2.创建模型 -- 设计数据库
// MongoDB 是动态的，非常灵活，只需要在代码中设计你的数据库就可以了
// mongoose 这个包就可以让你的设计编写过程变的非常的简单
var Cat = mongoose.model('Cat', {name: String})

// 3.写入数据
for (var i = 0; i < 30; i++) {
	// 实例化一个 Cat
	var kitty = new Cat({name : '喵' + i})
	// 持久化保存 kitty 实例
	kitty.save(function (err) {
		if (err) {
			console.log(err)
		} else {
			console.log('meow')
		}
	})
}