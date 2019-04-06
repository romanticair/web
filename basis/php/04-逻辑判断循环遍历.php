1.if
<?php 
$t=date("H");        // 当前时间Hour

if ($t<"20") {
	echo "Have a good day!";
}
?>


2.if...else
<?php 
$t=date("H");
if ($t<"20") {
	echo "Have a good day!";
} else {
	echo "Have a good night!";
}
?>


3.if...elseif...else
<?php 
$t=date("H");
if ($t<"10") {
	echo "Have a good morning!";
} elseif ($t<"20") {
	echo "Have a good day!";
} else {
	echo "Have a godd night!";
}
?>


4.switch
<?php 
switch ($x) {
	case '1':
		echo "Number 1";
		break;
	case '2':
		echo "Number 2";
		break;
	case '3':
		echo "Number 3";
		break;
	default:
		echo "No number between 1 and 3";
		break;
}
?>


5.while
<?php 
$x=1;

while ($x<=5) {
	echo "this number is: $x <br>";
	$x++;
}
?>


6.do...while
<?php
$x=1;

do {
	echo "this number is: $x <br>";
	$x++;
} while ($x<=5);
?>


7.for
<?php 
for ($x=0; $x<=10; ; $x++) { 
	echo "number is: $x <br>";
}
?>


8.foreach
<!-- 适用于数组,并用于遍历数组中每个键值对 -->
<?php 
$colors=array("red", "green", "blue", "yellow");

foreach ($colors as $value) {
	echo "$value <br>";
}
?>


9.函数
<!-- 其用法和js相似,可在形参上给默认值,不再赘述 -->