var page = require('webpage').create();
page.open('http://www.cnblogs.com/qiyeboy/', function(status){
	console.log('status: ' + status);
	if(status === 'success'){
		page.render('qiye.png');
		// page.render('qiye.pdf');
	}
	phantom.exit();
});


/*
不仅可以将页面转化为不同的文件格式，还可以对视图进行
缩放和裁剪，用到page对象中两个很重要的属性:
viewportSize 和 clipRect。
*/


// 以下仅截取了顶端一角
// var page = require('webpage').create();
// page.viewportSize = {width: 1024, height: 768};
// page.clipRect = {top: 0, left: 0, width: 512, height: 256};