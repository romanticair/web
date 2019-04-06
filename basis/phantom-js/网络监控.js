//网络监控
var url='http:cnblogs.com/qiyeboy/';
var page=require('webpage').create();
page.onResourceRequested = function(request)
{
	console.log('require ' + JSON.stringify(request, undefined, 4));
};

page.onResourceReceived = function(response)
{
	console.log('response ' + JSON.stringify(response, undefined, 4));
};
page.open(url);
phantom.exit();