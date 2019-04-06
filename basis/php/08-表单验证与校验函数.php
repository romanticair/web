1.表单验证
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>Document</title>
</head>
<body>
	<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
		Name: <input type="text" name="name">
		E-mail: <input type="text" name="email">
		Website: <input type="text" name="website">
		Comment: <textarea name="comment" rows="5" cols="40"></textarea>
		Gender:
		<input type="radio" name="gender" value="female">Female
		<input type="radio" name="gender" value="male">Male
	</form>
</body>
</html>


<!-- $_SERVER["PHP_SELF"]返回当前执行脚本的文件名,将表单数据发送到页面本身,
则不会跳到另一张页面-->


2.htmlspecialchars() 函数
<!-- 把特殊字符转换为 HTML 实体,防止注入攻击(跨站点脚本攻击XSS) -->

3.trim() 函数
<!-- 去除用户输入数据中不必要的字符(空格,制表符,换行) -->

3.stripslashes() 函数
<!-- 去除反斜杠 -->

4.自定义一个检查函数
<?php 
定义变量并设置为空
$name = $email = $gender = $comment = $website = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$name = test_input($_POST["name"]);
	$email = test_input($_POST["email"]);
	$gender = test_input($_POST["gender"]);
	$comment = test_input($_POST["comment"]);
	$website = test_input($_POST["website"]);
}

function test_input($data){
	$data = trim($data);
	$data = stripcslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>