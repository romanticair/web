var webPage=require('webpage');
var page=webPage.create();
var postBody='user=username&password=password';
page.open('http://www.google.com/', 'POST', postBody, function(status)
{
	console.log('status: ' + status);
});


//第二重-----
var settings={
	operation: 'POST';
	encoding: 'utf8';
	headers:{
		'Content-Type': 'application/json'
	},
	data: JSON.stringify(
	{
		some: 'data';
		another: ['custom', 'data']
	})
};
page.open('http://www.custom.api/', settings, function(status)
{
	console.log('status: ' + status);
});


//第三重-----
page.onInitialized=function()
{
	page.evaluate(function()
	{
		document.addEventListener('DOMContentLoaded', function()
		{
			console.log('DOM content has loaded.');
		}, false);
	});
};


//第四重-----
page.onLoadFinished=function(status)
{
	console.log('status: '+ status);
};