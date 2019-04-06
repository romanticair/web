var webPage=require('webpage');
var page=webPage.create();
page.includeJs('https://ajax.googleapis.com/ajax/libs.jquery/1.8.2/jquery.min.js',
	function()
	{
		page.evaluate(function()
		{
			// jQuery is loaded, now manipulate the DOM
			var $loginForm = $('form# login');
			$loginForm.find('input[name="username"]').value('phantomjs');
			$loginForm.find('input[name="password"]').value('c45p3r');
		});
	}
);
