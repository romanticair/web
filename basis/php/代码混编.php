<?php

echo 'value1', 'value2';

// print ֻ�ܴ�ӡһ������
print 'value1';


// һ�����ʱ������������Լ���������
var_dump('value1');

echo false;
// һ���� var_dump
var_dump(false);

var_dump(array('1', '2'));


// ��ͨǶ��
<p><?php echo "hello"; ?></p>

<!-- �﷨��� -->
<?php if ($age >= 18) { ?>
	<p>adult</p>
<?php } else { ?>
	<p>child</p>
<?php } ?>

<!-- �����õ��÷� -->
<?php if ($age > 18): ?>
	<p>adult</p>
<?php else: ?>
	<p>child</p>
<?php endif ?>


// ָ��ʽ���﷨
if(true){
	echo "hello";
}

if(true):
	echo "hello";
else:
	echo :"world";
endif;



1.����
2.ָ��ʽ�﷨
3.foreach
4.��������������
5.�ַ���ƴ��



��ȡ�ļ�����
$contents=file_get_contents("filename.txt");
�����ı�����������(��ֳ���)
$line=explode("\n", $contents);
$line=explode("|", $contents);


�ж������Ƿ��Ѷ���
isset ���ڸ� Undefined index ����

�ж������Ƿ�Ϊ��
empty

empty()