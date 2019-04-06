1.验证名字
<!-- 检查 name 字段是否包含字母和空格,无效则存储错误消息 -->
<!-- preg_match() 函数检索字符串的模式 -->
<?php
$name = test_input($_POST["name"]);
if (!preg_match("/^[a-zA-Z ]*$/", $name)) {
	$nameErr = "只允许字母和空格!";
}
?>


2. 验证 E-mail
<!-- 检查 e-mail 地址语法是否有效。无效则存储一条错误消息 -->
<?php 
$email = test_input($_POST["email"]);
if (!preg_match("/([\w\-]+\@[\w\-]+\.[\w\-])/", $email)) {
	$email = "invalid email.";
}?>


3.验证 URL
检查 URL 地址语法是否有(这条正则表达式同时允许 URL 中的斜杠)
<?php 
$website = test_input($_POST["website"]);
if (!preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%
=~_|]/i",$website)) {
  $websiteErr = "无效的 URL"; 
}
?>