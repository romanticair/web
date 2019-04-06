1.语法
<?php 
// 此处是 PHP 代码, PHP 语句以;结尾
 ?>


2.注释
// 这是一条单行注释
# 井号也可以注释(生僻)
/*
这是多行注释块
它横跨了
多行
*/


3.大小写不敏感
<!-- 下面的输出都一样 -->
<?php 
ECHO "hello, world!<br>";
echo "hello, world!<br>";
Echo "hello, world!<br>";
 ?>
<!-- 例外,变量对大小写敏感 -->
<!-- 下面只有第一句会显示$color变量的值 -->
<?php
$color="red";
echo "My car is " . $color . "<br>";
echo "My house is " . $COLOR . "<br>";
echo "My boat is " . $coLOR . "<br>";
?>


4.变量
<!-- 不必声明类型,为变量赋值时自动转换 -->
<?php
$txt="whoami";
$x=5;
$y=6;
$z=$x+$y;
echo $z;
?>


5.变量作用域
<!-- local(局部),global(全局),static(静态) -->
<?php 
$x=5;       // global

function myText(){
	$y=10;  //local
	echo "<p>test local variable: </p>";
	echo "variable x is: $x";
	echo "<br>";
	echo "variable y is: $y";
}

myText();
echo "<p>test the variable out of the function";
echo "variable x is: $x";
echo "<br>";
echo "variable y is: $y";
?>

<!-- 访问全局变量 -->
<?php 
$x=5;
$y=10;

function myTest(){
	global $x, $y;
	$y=$x+$y;
	/*
	名为 $GLOBALS[index] 的数组中存储了所有的全局变量,下标
	存有变量名,该数组可以在函数内部访问,可直接更新全局变量,
	与上面两句等价
	*/
	// $GLOBALS['y']=$GLOBALS['x']+$GLOBALS['y'];
}

myTest();
echo $y;  // output 15
?>