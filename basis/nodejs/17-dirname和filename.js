console.log(__filename)
console.log(__dirname)

var fs = require('fs')
var path = require('path')

// 模块中的路径表示和文件操作中的相对路径标识不一致
// 模块中路径就是相对当前文件模块，不受执行命令所处位置影响
require('./02-http')

// ./data.json 相对于当前文件路径
// ./data.json 相对于执行 node 命令所处的终端路径

// 文件操作路径中，相对路径设计的就是相对于执行 node 命令所处的路径
// fs.readFile('L:\romantic-air\pocket\web\nodejs\data.json', 'utf8', function (err, data) {
//   if (err) {
//     throw err
//   }
//   console.log(data)
// })

// console.log(__dirname + '/data.json')
// L:\romantic-air\pocket\web\nodejs\data.json

fs.readFile(path.join(__dirname, './data.json'), 'utf8', function (err, data) {
  if (err) {
    throw err
  }
  console.log(data)
})