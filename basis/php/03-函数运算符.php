1.字符串 strlen 函数
<!-- 返回字符串长度，以字符计 -->
<?php 
echo strlen("hello world!");          // output 12
?>


2.字符串 strpos 函数
<!-- 检索字符串内指定的字符或文本
找到返回字符位置,否则返回false -->
<?php 
echo strpos("hello world!", "world"); // output 6
?>


3.常量
<!-- 被定义后无法更改,常量名前无 $ 符号
定义常量,需用 define 函数,其有三个参数,
依次为常量名,常量值,常量名对大小写是否不敏感(默认 false) -->
<?php 
define("GREETING", "Welcome to my house!", true);
echo GREETING;
echo greeting;                        // the same output.
?>


4.赋值运算符
<!-- 各类编程语言中都相同 -->
<?php 
$x=10; 
$y=6;
echo ($x + $y); // 输出 16
echo ($x - $y); // 输出 4
echo ($x * $y); // 输出 60
echo ($x / $y); // 输出 1.6666666666667
echo ($x % $y); // 输出 4

$y+=1;
echo $y;        // output 7
echo ++$y;      // output 8 
?>


5.字符串运算符
<!-- . 串接 -->
<?php
$a="Hello";
$b=$a . "wolrd!";
echo $b;        // output Hello world!

$x="Hello";
$x.="world!";
echo $x;        // output Hello world!
?>


6.比较运算符
<!--
==          等于(有隐式转换)
===         全等(包括类型)
!=、<>      不等
!==         不全等(完全不同)
其它都类似
-->


7.逻辑运算符
<!-- xor 异或,其它类似 -->


8.数组运算符
<!--
+      联合(但不覆盖重复的键)
===    两数组拥有相同键值对,且顺序相同则返回 true
-->
<?php
$x = array("a" => "red", "b" => "green"); 
$y = array("c" => "blue", "d" => "yellow"); 
$z = $x + $y; 			// $x 与 $y 的联合
var_dump($z);
var_dump($x == $y);
var_dump($x === $y);
var_dump($x != $y);
var_dump($x <> $y);
var_dump($x !== $y);
?>