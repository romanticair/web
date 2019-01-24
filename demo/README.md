# 用 jQuery 简单封装两个小案例

[jQuery 官网](http://api.jquery.com/)

[示例源码](effects.js)

## 手风琴
> 这里实现的只是横坐标方向的，考虑的情况不多，不然咋叫简单封装呢。好啦，咋们来娱乐一下。

<br/>

实现思路：
1. 获取包裹手风琴的盒子，并将其转成 jQuery 对象。获取指定的显示宽度(除激活琴子外的琴子)，以及容器盒子的宽度。
2. 获取容器下的 `li` 标签列表，计算激活琴子的显示宽度和光标移开琴子容器时每个琴子的平均宽度。
3. 给每个 `li` 节点对象注册 `mouseenter` 和 `mouseleave` 事件，两者都是负责光标移入移出时各琴子的宽度渐变。

<br/>

函数体接受三个参数，分别为 ele, width, decorator，然后利用参数计算出各配置，下面看代码和注释

```js
// 无论是 JS DOM 对象还是字符串，都转成 jQuery 对象(传 jQuery 对象也可以)
$ele = ele.length > 1 ? $(ele).eq(0) : $(ele)
// 若指定了宽度则按宽度来显示其余琴子，否则，被激活的琴子占满宽
width = width || 0
// 可以接受颜色组或图片地址来上样式
decorator = decorator || []
var $liArr = $ele.find('li')
var boxWidth = $ele.width()
var activeWidth = boxWidth - ($liArr.length - 1) * width
var averageWidth = boxWidth / $liArr.length

if (decorator) {
  // 通过 '.' 来判断有无文件
  if (decorator[0].indexOf('.') === -1) {
    $liArr.each(function (i, el) {
      $(el).css('backgroundColor', decorator[i])
    })
  } else {
    $liArr.each(function (i, el) {
      $(el).css('backgroundImage', 'url(' + decorator[i] + ')')
    })
  }
}
```

<br/>

两个事件里，`stop()` 清除未完成的动画不可少，顺序也很重要。你可能很好奇，为什么在 "真正的动画" 开始前，给她增加一个像素，并且是动画，而不是 css，然后又在动画回调后复位了。


在这儿，我找不到更好的解决方法来保证她在动画执行时最后一个琴子完全不下坠，即使已经设置 `overflow: hidden;`。但可以发现这是个速度增长的问题，虽然激活琴子的动画在其它琴子前面执行(队列不会延时太迟)，但现实是 `1 : $liArr.length - 1` 的增长速度差异，导致最后一个琴子发生闪烁和上下剧烈抖动。我试着给她们的动画加 speed 比例来调整增长速度，结果不理想，很难达到同步增长一致性。所以在两个事件里都添加多增加 `1px` 的动画，因为直接上 css 也崩，为什么只有 animate 拯救我 o(╥﹏╥)o。若大伙们有可行的解决方案，还请多多指教。

<br/>

```js
$liArr.on('mouseenter', function () {
  $ele.stop().animate({width: boxWidth+1})
  $(this).stop().animate({width: activeWidth}, function () {
      $ele.stop().animate({width: boxWidth})
    })
    .siblings().stop().animate({width: width})

})
$ele.on('mouseleave', function () {
  $ele.stop().animate({width: boxWidth+1})
  $liArr.stop().animate({width: averageWidth})
  setTimeout(function () {
    $ele.css({width: boxWidth})
  }, 400)
})
```

<br/>

## 来自四面八方的弹幕效果

函数体接受一个 `options` 对象，该参数必须包含 `button` 和 `input` 两个属性，`container` 和 `color` 是可选的，前两者分别表示触发弹幕发射按钮，承载信息的文本域；后两者分别表示弹幕潇洒的舞台(我要整个世界)，弹幕字体随机颜色组(我的颜色更多)。


实现思路：
1. 获取了相关条件参数，处理得到三个 jQuery 对象和弹幕舞台的大小。
2. 给按钮注册点击事件，使其获取文本域的信息、随机颜色、随机速度、随机起始点，通过规则约束控制，最后在舞台盒子外围坐标随机生成弹幕，往我们控制的方向去移动。
3. 给文本域注册 `keydown` 事件，输入弹幕内容时，直接敲 `Enter` 就能够触发按钮的 `click` 的事件。

<br/>

> 规则约束是为了避免弹幕直接在可视区域生成，于可视区域消失，这个魔术会吓着人的。

<br/>

一起来看代码和注释

```js
if (!options.button && !options.input) {
  return false
}
// 和手风琴类似的
var $btn = options.button.length > 1 ? $(options.button).eq(0) : $(options.button)
var $input = options.input.length > 1 ? $(options.input).eq(0) : $(options.input)
var $box = options.container ? $(options.container) : $('body')
var colors = options.color ? options.color : null
var width, height, disX, disY
// 辅助(也许你有其它想法)，使投放弹幕起始点在盒子边界外，先往下看
disX, disY = 200
$btn.on('click', function () {
  var msg = $input.val()
  var color = colors ? colors[rndBetween(0, colors.length)] : rndColor()
  var speed = rndBetween(5000, 10000)
  var startX, startY, endX, endY
  // 为区域范围值分配发生概率
  startX = probabilityDistributor([-disX, 0, width, width + disX], [0.4, 0.3, 0.4])
})
```
<br/>

这儿有三个函数：


***rndBetween*** 即是 `parseInt(Math.random() * (right - left) + left)` 计算后的值。

***rndColor*** 返回一个随机颜色。

***probabilityDistributor*** 是一个区间范围内指定发生概率的分配器，返回经过随机处理的值。例如参数一 `[-5, 0, 5, 10]`，参数二 `[0.4, 0.3, 0.4]`，指定了 `[-5, 0]` 区间发生的概率为 0.4，`[0, 5]` 发生的概率为 0.3，以此类推。


经过上面的计算，我们已经拥有弹幕内容，颜色，速度，以及在舞台外围随机生成的 `startX`，接着来看约束规则。

<br/>

> 注意：下面这两块代码也是在按钮点击事件函数命名空间下的。

<br/>

```js
// 利用走斜对角自定义的规则，确保弹幕都在容器外围生成。
if (startX < 0 || startX > width) {
  // 左右两侧，startY 可以在很大一块区域，动动手画图
  startY = rndBetween(-disY, height + disY)
} else {
  // 否则在舞台中间，Y 值不允许在中间，避免了在可视区域生成弹幕，石头剪刀布决定上下吧
  if (Math.random() < 0.5) {
    startY = rndBetween(-disY, 0)
  } else {
    startY = rndBetween(height, height + disY)
  }
}

// 上面的规则保证了起始位置一定是在舞台外围，下面是确保散场规则
// 为避免在可视区域消失，这里要使其超出容器宽度，再控制高度即可(本示例按距边界1/3来计算)
if (startX < 0 || startX > width) {
  if (startX < 0) {
    endX = rndBetween(width, width + disX)
  } else {
    endX = rndBetween(-disX, 0)
  }

  if (startY < height/3) {
    // 起始点在左右两侧且位于上部，用斜对角规则来控制
    endY = rndBetween(height/3, height + disY)
  } else if (startY > height * 2/3) {
    // 下部
    endY = rndBetween(-disY, height/3)
  } else {
    // 中间
      endY = rndBetween(-disY, height + disY)
    }
  }
else {
  // startX 在中间，那么 startY 在上下边界外，endY 走反方向即可(猜拳)
  endX = rndBetween(disX, width - disX)
  if (startY > height) {
    endY = rndBetween(-disY, 0)
  } else {
    endY = rndBetween(height, height + disY)
  }
}
```

<br/>

自定义的规则难免有不足之处，你会发现弹幕在某些方向出现的概率很低。当然，我们的概率发生分配器是没有问题的，通过调整分配的概率确实能
改变上下或左右发生的概率。漏洞出现在规则本身，`disX` 和 `disY` 以及 1/3 的舞台尺寸和对角界限，这几处让我感到设计本身的不完美，难道我还能打你嘛？
就是因为凭一个随机数来确定另三个随机数，虽然可以颠倒一些顺序，但最终还是处于随机数 **相互约束** 的窘境，况且不想硬编码，我是无奈得两匹呀！除非，除非你帮我 (,,･∀･)ﾉ゛ ？


自认为，上面的代码还是挺臃肿的，多少个 `if` 语句了都。但不论如何，弹幕照常有吐槽，咋们的效果还是不错的，管你是丑小鸭还是白天鹅，通通飞起来。

<br/>

```js
// 接着，直接将文本节点，样式属性，动画给加上
$('<span></span>').text(msg)
  .css('position', 'absolute')
  .css('color', color)
  .css('left', startX)
  .css('top', startY)
  .animate({'left': endX, 'top': endY}, speed, 'linear', function () {
    // 表演结束
    $(this).remove()
  })
  // 弹幕的舞台
  .appendTo($box)

// 清空文本域
$input.val('')
```

最后注册按键事件即可。

<br/>

End.

若有不足，还请高人指教。
