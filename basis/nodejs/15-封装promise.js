var fs = require('fs')

function pReadFile(filePath) {
	var promise = new Promise(function (resolve, reject) {
		fs.readFile(filePath, 'utf8', function (err, data) {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
	// 也可以在上面直接返回
	return promise
}


pReadFile('./data/a.txt')
	.then(function (data) {
		console.log(data)
		return pReadFile('./data/b.txt')
	})
	.then(function (data) {
		console.log(data)
		return pReadFile('./data/c.txt')
	})
	.then(function (data) {
		console.log(data)
		console.log('end')
	})
