1.表单处理 $_POST 收集(form-data)
<html>
<body>
	<form action="welcome.php" method="post">
		Name: <input type="text" name="name"><br>
		E-mail: <input type="text" name="email"><br>
		<input type="submit">
	</form>
</body>
</html


welcome.php
<html>
<body>
	Welcome <?php echo $_POST["name"]; ?><br>
	Your email address is: <?php echo $_POST["email"]; ?>
</body>
</html>

output:
<!--
Welcome John
Your email address is john.doe@example.com -->


2.表单处理 $_GET 收集(form-data)
<html>
<body>
	<form action="welcome_get.php" method="get">
		Name: <input type="text" name="name"></input><br>
		E-mail: <input type="text" name="email"></input><br>
		<input type="submit">
	</form>
</body>
</html>


welcome_get.php
<html>
<body>
	Welcom <?php echo $_GET["name"]; ?><br>
	Your email address is: <?php echo $_GET["email"]; ?>		
</body>
</html>


<!-- $_GET 是通过 URL 参数传递到当前脚本的变量数组
$_POST 是通过 HTTP POST 传递到当前脚本的变量数组 -->