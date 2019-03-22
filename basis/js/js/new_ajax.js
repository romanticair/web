function ajax(url, fnSuc, fnFaild) {
	// 1.创建Ajax对象
	if(window.XMLHTTPRequest) {
		var oAjax=new XMLHTTPRequest();
	}
	else {
		var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
	}
	// 连接服务器
	oAjax.open('GET', url, true);
	oAjax.send();
	oAjax.onreadystatechange=function(){
		if(oAjax.readystate==4) {
			fnSuc(oAjax.responseText);
		}
		else {
			if(fnFaild)
			{
				fnFaild(oAjax.status);
			}
		}
	}
}