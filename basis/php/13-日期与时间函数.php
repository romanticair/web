1.Date 函数
<!-- 把时间戳格式化易读的日期和时间 -->
<!-- date(format, timestamp),不指定时间戳则默认为当前日期和日期 -->
<?php
echo "今天是 " . date("Y/m/d") . "<br>";
echo "今天是 " . date("Y.m.d") . "<br>";
echo "今天是 " . date("Y-m-d") . "<br>";
echo "今天是 " . date("l");
?>


2.获得时区
<!-- 把时区设置为 "Asia/Shanghai"，然后以指定格式输出当前时间 -->
<?php 
date_default_timezone_get("Asia/Shanghai");
echo "当前时间是 " . date("h:i:sa");
?>


3.通过 mktime() 创建日期
<!-- 返回日期的 Unix 时间戳
mktime(hour,minute,second,month,day,year)-->
<?php
$d=mktime(9, 12, 31, 6, 10, 2015);
echo "创建日期是 " . date("Y-m-d h:i:sa", $d);
?>


4.strtotime() 用字符串来创建日期
<!-- 把人类可读的字符串转换为 Unix 时间
strtotime(time,now)-->
<?php
$d=strtotime("10:38pm April 15 2015");
echo "创建日期是 " . date("Y-m-d h:i:sa", $d);
?>

<?php
$d=strtotime("tomorrow");
echo date("Y-m-d h:i:sa", $d) . "<br>";
$d=strtotime("next Saturday");
echo date("Y-m-d h:i:sa", $d) . "<br>";
$d=strtotime("+3 Months");
echo date("Y-m-d h:i:sa", $d) . "<br>";
?>


5.输出下周六的日期
<?php
$startdate = strtotime("Saturday");
$enddate = strtotime("+6 weeks",$startdate);

while ($startdate < $enddate) {
  echo date("M d", $startdate),"<br>";
  $startdate = strtotime("+1 week", $startdate);
}
?>


6.输出12月31日之前的天数
<?php
$d1=strtotime("December 31");
$d2=ceil(($d1-time())/60/60/24);
echo "距离十二月三十一日还有：" . $d2 ." 天。";
?>
