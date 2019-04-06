var http = require('http')
var fs = require('fs');
var server = http.createServer()

var rootDir = 'L:/www'

server.on('request', function (req, res) {
	var url = req.url
	if (url === '/') {
		url = '/index.html'
	}
	fs.readFile(rootDir + url, function (err, data) {
		if (err) {
			return res.end('404 Not Found')
		}
		res.end(data)
	})
})

server.listen(3000, function () {
	console.log('server running...')
})