var url='http:cnblogs.com/qiyeboy/';
var page=require('webpage').create();
page.onConsoleMessage = function(msg)
{
	console.log('Page title is ' + msg);
};

page.open(url, function(status)
{
	var title=page.evaluate(function()
	{
		return document.title;
	})
	console.log('page title is ' + title);
	phantom.exit();
});