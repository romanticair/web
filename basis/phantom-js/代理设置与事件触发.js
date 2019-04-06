var page=require('webpage').create();
console.log('The default user agent is ' + page.settings.userAgent);
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:61.0) Gecko/20100101 Firefox/61.0';
page.open('http://movie.mtime.com/108737/', function(status)
{
	if(status !== 'success')
	{
		console.log('Unable to acess network');
	}
	else
	{
		var ua = page.evaluate(function()
		{
			return document.getElementById('ratingRegion').textContent;
		});
		console.log(ua);
	}
	phantom.exit();
});

//添加jQuery代码
var page=require('webpage').create();
page.open('http://www.sample.com', function()
{
	page.includeJS('http://ajax.googleapis.com/ajax/libs.jquery/1.6.1/jquery.min.js', function()
	{
		page.evaluate(function()
		{
			$('button').click();
		});
		phantom.exit();
	});
});