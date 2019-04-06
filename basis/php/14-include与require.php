1.include 和 require
<!-- 
include 和 require 语句是相同的，除了错误处理方面：
    require 会生成致命错误（E_COMPILE_ERROR）并停止脚本
    include 只生成警告（E_WARNING），并且脚本会继续

语法:
include 'filename';
或
require 'filename';
 -->

footer.php
<?php
echo "<p>Copyright © 2006-" . date("Y") . " W3School.com.cn</p>";
?>

<!-- 引用该页脚文件 -->
<html>
<body>
	<h1>欢迎访问我们的首页！</h1>
	<p>一段文本。</p>
	<p>一段文本。</p>
	<?php include 'footer.php';?>
</body>
</html>


menu.php
<?php
echo '<a href="/index.asp">首页</a> -
<a href="/html/index.asp">HTML 教程</a> -
<a href="/css/index.asp">CSS 教程</a> -
<a href="/js/index.asp">JavaScript 教程</a> -
<a href="/php/index.asp">PHP 教程</a>';
?>

<!-- 网站中所有页面均引用该标准菜单文件 -->
<html>
<body>
	<div class="menu">
		<?php include 'menu.php';?>
	</div>
	<h1>欢迎访问我的首页！</h1>
	<p>Some text.</p>
	<p>Some more text.</p>
</body>
</html>


vars.php
<?php
$color='银色的';
$car='奔驰轿车';
?>

<!-- 调用文件中使用这些变量 -->
<html>
<body>
	<h1>欢迎访问我的首页！</h1>
	<?php
	include 'vars.php';
	echo "我有一辆" . $color . $car "。";
	?>
</body>
</html>