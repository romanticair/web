// 在 Node 中，采用 EcmaScript 进行编码
// 没有 BOM、DOM 和浏览器中的 JavaScript 不一样

// 浏览器中的 JavaScript 是没有文件操作的能力的
// 但是 Node 中的 JavaScript 具有文件操作的能力

// fs 是 file-system 的简写，就是文件系统的意思
// 在 Node 中如果想要进行文件操作，就必须引入 fs 这个核心模块
// 在 fs 这个核心模块中，就提供了所有的文件操作相关的 API
// 例如：fs.readFile 就是用来读取文件的

// 1. 使用 require 方法加载 fs 核心模块
var fs = require('fs');

// 2. 写内容到文件
// 第一个参数：文件路径
// 第二个参数：文件内容
// 第三个参数：回调函数
//    成功
//    	error null
//    失败
//    	error 错误对象
fs.writeFile('./resouce/test-fs.txt', '嗨嗨！我正在用nodejs写内容到文件', function(error) {
    if (error) {
        console.log('写入失败');
    } else {
        console.log('写入成功了');
    }
});


// 要把数据从缓存区输入到硬盘,所以先结束写操作
var fs = require('fs');
// 3. 读取文件
// 第一个参数就是要读取的文件路径
// 第二个参数是一个回调函数
//    成功
//    	data 数据
//    	error null
//    失败
//    	data undefined没有数据
//    	error 错误对象
fs.readFile('./resouce/test-fs.txt', function(error, data) {
    // console.log(data);
    // <Buffer e5 97 a8 e5 97 a8 ef bc 81 e6 88 91 e6 ad a3
    // e5 9c a8 e7 94 a8 6e 6f 64 65 6a 73 e5 86 99 e5 86 85
    // e5 ae b9 e5 88 b0 e6 96 87 e4 bb b6>
    // 文件中存储的都是二进制数据
    // 为什么看到的不是 0 和 1 呢？原因是二进制转为 16 进制了
    // 但是无论是二进制01还是16进制，人类都不认识
    // 所以要通过 toString 方法把其转为我们能认识的字符
    console.log(data);
    console.log(error);
    if (error) {
        console.log('读取文件失败了');
    } else {
        console.log(data.toString());
    }
});