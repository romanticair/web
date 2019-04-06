// 加载操作系统模块
var os = require('os');

// 获取当前机器的 CPU 信息
console.log(os.cpus())

// 获取当前机器的 Memory 信息 bytes
console.log(os.totalmem());


// 加载操作路径模块
var path = require('path');

// 获取拓展名
console.log(path.extname('test-fs.txt'));