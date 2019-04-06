1.超全局变量
<!-- 脚本全部作用域都可访问 -->
    $GLOBALS
    $_SERVER
    $_REQUEST
    $_POST
    $_GET
    $_FILES
    $_ENV
    $_COOKIE
    $_SESSION


1.#GLOBALS
<!-- $GLOBALS[index] 的数组中存储了所有全局变量,变量名就是数组的键 -->
<?php 
$x = 75; 
$y = 25;
function addition() { 
  $GLOBALS['z'] = $GLOBALS['x'] + $GLOBALS['y']; 
}
 
addition(); 
echo $z; 
?>


2.#_SERVER
<!-- 保存有关于报头、路径和脚本位置的信息 -->
<?php 
echo $_SERVER['PHP_SELF'];
echo "<br>";
echo $_SERVER['SERVER_NAME'];
echo "<br>";
echo $_SERVER['HTTP_HOST'];
echo "<br>";
echo $_SERVER['HTTP_REFERER'];
echo "<br>";
echo $_SERVER['HTTP_USER_AGENT'];
echo "<br>";
echo $_SERVER['SCRIPT_NAME'];
?>


3.$_REQUEST
<!-- 于收集 HTML 表单提交的数据 -->
<!-- 以使用超级全局变量 $_REQUEST 来收集 input 字段的值 -->
<html>
<body>
<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
	Name: <input type="text" name="fname">
	<input type="submit">
</form>
<?php 
	$name = $_REQUEST['fname']; 
	echo $name; 
?>
</body>
</html>


4.$_POST
<!-- 广泛用于收集提交 method="post" 的 HTML 表单后的表单数据,也常用于传递变量-->
<html>
<body>
<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
	Name: <input type="text" name="fname">
	<input type="submit">
</form>
<?php 
	$name = $_POST['fname']; 
	echo $name; 
?>
</body>
</html>


5.$_GET
<!-- 可用于收集提交 HTML 表单(method="get")后的表单数据,收集URL中发送的数据 -->
<html>
<body>
<a href="test_get.php?subject=PHP&web=W3school.com.cn">测试 $GET</a>
<!-- 点击链接 "测试 $GET", 参数"subject"和"web"被发送到 "test_get.php"，然后就能够通过 $_GET 在 "test_get.php" 中访问这些值了 -->
</body>
</html>


test_get.php
<html>
<body>
<?php 
	echo "Study " . $_GET['subject'] . " at " . $_GET['web'];
?>
</body>
</html>