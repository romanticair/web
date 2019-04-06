// 手风琴插件,将其写入jquery的原型
// 仅对li有效

// $.fn == $.prototype == jquery.prototype
$.fn.accordion = function(colors, width){
	var colors = colors || []; // 琴子的颜色
	var width = width || 0;    // 鼠标进入区域后其它琴子的宽度

	var $li = this.find('li');
	var boxLength = this.width();  // 获取盒子大小
	var maxLength = boxLength - width * ($li.length - 1); // 表示当前的琴子宽度
	var averageLength = boxLength / $li.length;  // 各个琴子的宽度都相同

	// 更改li的颜色,each是jquery的遍历方法
	$li.each(function (index, dom) {
		$(dom).css('backgroundColor', colors[index]);
	});

	// 给li注册鼠标经过事件
	$li.on('mouseenter', function(){
		$(this).stop().animate({width: maxLength}).siblings().stop().animate({width: width});
  })
    .on('mouseleave', function(){
		$li.stop().animate({width: averageLength});
	});
};