var foo = 'bbb'

exports.foo = 'foo'
exports.add = function (x, y) {
	return x + y
}

exports.readFile = function(path, callback) {
	console.log('File path is: ', path)
}

var age = 20
exports.age = 18

function add (x, y) {
	return x - y
}