1.echo、print
<!-- echo能够输出一个以上的字符串,无返回值,比print稍快,两者用法一致 -->
<?php 
echo "<h2>PHP is fun!</h2>";
echo "I'm about to learn PHP!<br>";
echo "this", "string", "was", "...";

$txt1="Learn PHP";
$txt2="see you again.";
$cars=arary("Volvo","BMW","SAAB");

echo $txt1;
echo "Study PHP at $txt2";
echo "My car is a {$cars[0]}";
?>


2.字符串
<?php 
$x="Hello world.";
$y='Hello world.';
 ?>


3.整数
<?php 
$x=598;
var_dump($x);   // var_dump 会返回数据类型和值
echo "<br>";

$x=-345;
var_dump($x);
echo "<br>";

$x=0x8c;        // 十六进制
var_dump($x);
echo "<br>";

$x=047;         // 八进制
var_dump($x);
?>


4.浮点数
<?php 
$x=10.365;
var_dump($x);
echo "<br>";

$x=2.4e3;
var_dump($x);
echo "<br>";

$x=8e-5;
var_dump($x);
?>


5.逻辑
<?php 
$x=true;
$y=false;
?>


6.数组
<!-- PHP5.4 以上可以[var1, var2, var3]形式创建数组 -->
<?php 
$cars=array("Volvo", "BMW", "SAAB");
var_dump($cars);
?>


7.对象
<!-- 声明对象的类,使用 class 关键词 -->
<?php 
class car
{
	var $color;
	function Car($color="green"){
		$this->color = $color;
	}
	function what_color(){
		return $this->color;
	}
}
?>


8.null
<?php 
$x=null;
var_dump($x);
?>