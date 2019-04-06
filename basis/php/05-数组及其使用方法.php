1.数组类型
<!--
索引数组 - 带有数字索引(自动分配)
关联数组 - 带有指定键的数组
多维数组 - 包含一个或多个数组
-->
<?php
$cars=array("Volvo","BMW","SAAB");
echo "I like " . $cars[0] . ", " . $cars[1] . " and " . $cars[2] . ".";
?>


2.count
<!-- 返回数组长度(元素个数) -->
<?php 
$cars=array("Volvo","BMW","SAAB");
echo count($cars);
?>


3.遍历索引数组
<?php
$cars=array("Volvo","BMW","SAAB");
$arrlength=count($cars);

for($x=0;$x<$arrlength;$x++) {
  echo $cars[$x];
  echo "<br>";
}
?>


4.关联数组
<!-- 能够分配给数组指定键 -->
<?php 
// method1
$age=array("Perter"=>"35","Ben"=>"37","Joe"=>"43");
// method2
$age['Perter']="35";
$age['Ben']="37";
$age['Joe']="43";

echo "Peter is " . $age['Peter'] . " years old.";
?>


5.遍历关联数组
<?php
$age=array("Perter"=>"35","Ben"=>"37","Joe"=>"43");

foreach ($age as $key => $key_value) {
	echo "Key=" . $key . ", Value=" . $key_value;
	echo "<br>";
}
?>


6.数组排序
sort()   - 以升序对数组排序
rsort()  - 以降序对数组排序
asort()  - 根据值，以升序对关联数组进行排序
ksort()  - 根据键，以升序对关联数组进行排序
arsort() - 根据值，以降序对关联数组进行排序
krsort() - 根据键，以降序对关联数组进行排序

<?php
$cars=array("Volvo","BMW","SAAB");
sort($cars);         // 按字母升序,rsort(降序)

$numbers=array(3,5,1,22,11);
sort($numbers);      // 按数字升序,rsort(降序)

$age=array("Bill"=>"35","Steve"=>"37","Peter"=>"43");
ksort($age);         // 根据(键)对进行升序排序
asort($age);         // 根据(值)对进行升序排序
?>