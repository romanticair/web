<?php

echo 'value1', 'value2';

// print 只能打印一个数据
print 'value1';


// 一般调试时用于输出数据以及数据类型
var_dump('value1');

echo false;
// 一般用 var_dump
var_dump(false);

var_dump(array('1', '2'));


// 普通嵌入
<p><?php echo "hello"; ?></p>

<!-- 语法混编 -->
<?php if ($age >= 18) { ?>
	<p>adult</p>
<?php } else { ?>
	<p>child</p>
<?php } ?>

<!-- 更长久的用法 -->
<?php if ($age > 18): ?>
	<p>adult</p>
<?php else: ?>
	<p>child</p>
<?php endif ?>


// 指令式的语法
if(true){
	echo "hello";
}

if(true):
	echo "hello";
else:
	echo :"world";
endif;



1.变量
2.指令式语法
3.foreach
4.函数作用域问题
5.字符串拼接



读取文件内容
$contents=file_get_contents("filename.txt");
解析文本内容至数组(拆分成行)
$line=explode("\n", $contents);
$line=explode("|", $contents);


判读变量是否已定义
isset 会掩盖 Undefined index 警告

判读变量是否为空
empty

empty()