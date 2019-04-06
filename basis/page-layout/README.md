# 开发中常用知识点
## 盒子垂直居中对齐
+ 子盒子在父盒子中如何水平垂直居中对齐?
+ Solution：

  [Click to view the source code](box-alignment/index.html)
  1. position + margin
  ```css
  .parent{
    position: relative;
  }
  .child {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -100px;
  }
  ```
  2. position + transform
  ```css
  .parent {
    position: relative;  
  }
  .child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  ```
  3. flex + 对齐方式
  ```css
  .parent {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ```
  4. table-cell + 对齐方式 + inline-block
  ```css
  .parent {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
  .child {
    display: inline-block;
    vertical-align: middle;
  }
  ```


## 清除浮动

+ 如何清除脱标元素给父盒子造成的影响?
+ Solution：
  
  [Click to view the source code](./clear-floating/overflow-pseudo-class.html)
  1. 主动为父盒子设置和子盒子一样的高度 `height: 200px;`
  2. 为父盒子样式属性设置 `overflow: hidden;`
  3. 为父盒子加一个类 clearfix
  ```css
  .clearfix::after{
    content: "";
    width: 0;
    height: 0;
    display: table;
    visibility:hidden;
    clear: both;
  }
  ```
---
+ 如何清除脱标元素给兄弟元素造成的影响?
+ Solution：

  [Click to view the source code](./clear-floating/wall-clear.html)
  1. 为本身元素属性设置 `overflow: hidden;`
  2. 在两个盒子间创建一个块级标签，即隔墙法，为其设置属性 `clear:both;`



## 清除图片下间隙

+ 如何清除 img 标签所产生的间隙?
+ Solution：
  
  [Click to view the source code](gap-of-img/soution.html)
  1. 为 img 标签设置 `vertical-align: middle;`
  2. 为 img 标签设置 `display: block;`
  3. 为 img 标签设置 `float: left;`
  4. 为 img 父级标签设置 `font-size: 0;`




## 页面布局

### 一、静态布局
+ 可以说静态布局是最易上手的，其大多数是在 ***PC端*** 中层现。今天 `2018-11-25` 简单的仿做了博雅主页，目的就是为了练习静态布局。
+ 博雅主页还是挺简洁大气的，虽然我做出来的没有原稿好看，毕竟这也不是真正的原稿，省略了很多元素，而且是我第一次切图，还是挺怀疑一些尺寸值的，也许是个人<>
刚入门吧。不过拾色器确实出了个小错误，topbar 区域字体的 #818496 识别成了 #678496。

  [Click to view the source code](./kind-of-layout/static/index.html)
  1. 在上面的案例中涉及到的尺寸和布局知识主要是 `px` 和 `relative` `absolute`，当然也有用到 `100%` 相对父盒子的宽高。
  2. 所以在 `window.resize` 事件被触发的过程中，一旦窗口尺寸被拉伸小于 `margin: auto` 所在盒子的宽度时，页面就没有那么好的体验啦。
  3. 要不要浮动，看布局需求。偶尔浮动一下，博雅里我直接给父盒子加高，清除浮动，其实有些不加也不受影响。
  4. 记得子绝父相，兄弟之间用 `margin`，父子之间用 `padding`，当然在这里我也没有完全遵循，最后的 `recruit` 区域没考虑好，加大了计算量。在此吸取吸取教训。
  5. Done.



### 二、流式布局

+ 给元素的宽上 `%` 而不是 `px` 单位，让其随波逐流，可从南极漂到北极。
+ 元素大小会变化，但整体布局一般不会改变。
+ max-width, min-width 辅助，防止过度拉伸致使页面布局混乱。



### 三、弹性布局

+ 突然间发现一个有趣的小案例 -- 百度外卖，主要是布局和动画效果构成这个移动端页面，而且呢是基于 rem 单位布局的，借此学习下。
+ 这里只实现布局和动画效果，无业务逻辑。
+ 首先呢，分析设计稿：
	1. 设计稿将尺寸分成 20 等份，以 iphone5 320x568 作为基准值，用 rem 作为单位进行布局，所以 640x* 的稿子在 iphone5 下，html 的 font-size 值等于 640 / 20 = 32px
	2. 其它不同设备进行访问时，device-width 也会不同，因此要监听设备来改变 html 的 font-size，计算公式即 device-width / 20
	3. 而页面中的元素要借助 rem 来计算尺寸，例如原稿中顶部通栏高度 120px，在这里就要写成 120/32*1rem，即尺寸大于 ihpone5 的，元素尺寸会相应变大，小于的反之，从而达到协调
	4. 因此，通过一个小公式改变 html 的 font-size 的值，用 rem 来写页面样式，虽是基于 iphone 写出来的，但却能 `适配` 众多设备
	
+ 老样子，移动适配必不可少，sublime meta:vp + tab 即可生成，然后加入动态计算适配代码
	`document.querySelector('html').style.fontSize = window.screen.width / 20 + 'px'`
	
+ 新知识 - sass，建立独立的目录，将页面样式都写入 *.scss 文件，为了降低客户端请求次数，在 index.scss 中通过 `@import` 语句代入其它模块，进而合并，借助 Koala 开源软件动态编译 scss 文件。
+ 导入样式文件的顺序避免被覆盖，注意先来后到的需求呀。
+ sass 的语法很简单，却能够为我们省下很多时间，而且样式代码也有了逻辑，更易于维护。在这里我用到了 `@mixin` 与 `@include` 配合，`@function @return` 以及传参，操作起来简直如鱼得水啊，如下小片段代码。
  ```sass
  //将 px 转换为 rem 单位
  @function p2r($px) {
    @return ($px/32)*1rem;
  }

  //设置尺寸
  @mixin size($width, $height) {
    width: p2r($width);
    height: p2r($height);
  }

  //设置背景图并且水平居中显示
  @mixin bgc($url) {
    position: absolute;
    background: url($url)no-repeat center/100% 100%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  //星球背景尺寸 640 x 384 且在容器内水平居中
  .sphere {
    @include size(640, 384);
    @include bgc('../image/page8/sphere7.png');
    bottom: 0;
  }
  ```
  
+ page7 用到了 `transform` 的 `rotateZ`，然后借助 `translateY` 实现了自定义半径绕中心点的多个弧(点)的定位。
+ 用`一圈` 340 按份数(`28deg`)和顺序来算方向。`rotateZ` 之后，由于坐标轴改变了方向，所以 `translate` 的位移方向也就变化了，因此可以为其设置半径 240，以中心为原点朝着 `rotateZ(28deg*n)` 方向偏移一个半径的距离，如下小片段代码。
  ```sass
  .gift1 {
    @include size(35, 29);
    @include bgc('../image/page7/gift1.png');
    transform: rotateZ(28deg) translateY(p2r(240));
  }

  .gift2 {
    @include size(93, 79);
    @include bgc('../image/page7/gift2.png');
    transform: rotateZ(28deg*2) translateY(p2r(240));
  }
  ```

+ 到最后做动画时，碰到坑。以下面方式实现水平居，动画里使用 `translate*` 结束后元素回不到居中位置。不清楚原理，据说是 `translate` 的参考点不一样，动画之后改变了 `position` 的 `left` 值而造成的?
  ```sass
    left: 50%;
    transform: translateX(-50%);
  ```
  
  解决方案即是替换上面代码为
  ```sass
    width: p2r(200);
    left: 50%;
    margin-left: p2r(-(200/2));
  ```
  
+ 巨坑二，`event.js` 不断报错，一旦 `tap or longTap` 即触发，如下
  ```
    touch.js:128 Uncaught TypeError: Cannot read property 'trigger' of undefined
    at touch.js:128
  ```
  而现在我还没搞明白是什么原因，写项目的整个过程没有处理过冒泡和捕获，所以事件应该没有受阻呀，也不可能被我覆盖了。
  发现只是报错，事件还是能够响应的。估计是其它方法传值时出了错。

+ 用到了 swiper 提供的一些事件，以及移动端 `tap longTap` 事件，对动画进行动态控制。

+ 学习了一波动画知识 `animation`，几个小示例
  自定义动画1 -- 右向左滑入
```css
@keyframes slideLeft {
  from {
    transform: translateX(-50%);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
```

  自定义动画2 -- 上下抖动
```css
@keyframes upDownJitter {
  25% {
    transform: translateY(-5%);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-5%);
  }
  100% {
    transform: none;
  }
}
```
  `transform-origin` 使元素相对于自身的某一个位置作为动画的参考点，尤其是在做弧度运动时尤其重要。

+ sass 遍历语法，从 1 到 10，然后给 div 10个同级元素加宽度值
```sass
div {
  @for $i from 1 through 10 {
    &:nth-child(#{$i}): {
      width: ($ipx);
    }
  }
}
```

+ `audio` 对象拥有 `audio.play audio.pause audio.pause` 等属性和方法，用于对该媒体对象进行播放，停止等控制。
  `<audio autoplay loop src="music/bird.mp3"></audio>` 进入页面自动播放 + 暂停操作等会使媒体对象进度重置

+ `@mixin` 和 `@function` 没有抽离，可以把它们丢进 mixin.scss 和 func.scss 文件，而自定义的动画组应该放到哪里呢，慢慢学习架构、管理。




### 四、响应式布局

+ 响应式布局即是能够在不同窗口尺寸下层现不同布局，提高用户体验的一种页面排版控制方案，常常要借助于媒体查询 `@media` ，即根据不同客户机的尺寸层现不同的页面。
+ 其实背后的原理也就是根据窗口尺寸的不同(往往是一个范围内层现某个页面)，对元素进行控制(隐藏，伸缩等等)。
+ 微金所 



### 五、自适应布局

+ 这里以京东移动端首页为练手案例，学习标签的选取，类名命名，移动端适配，以及 css 和 js 控制，最终使其达到页面自适应的效果，也就是页面随着缩放，页面元素能够按 `100%` 缩放。
+ 所涉及的内容有布局上的 `圣杯模型` `元素浮动`，效果的 `透明度渐变的固定顶部搜索栏` `轮播图切换` `倒计时` 等。

  [Click to view the source code](./kind-of-layout/adaptive/index.html)
  1. 首先需要做移动端适配，`viewport`，缩放比例 `scale`，市面上多数手机是 `2倍` 缩放，这里并没有考虑太多，只是让其 `initial-scale=1.0`。
  2. 以 phone4 的宽 `320px` 为最低尺寸，最大尺寸是 `640px`，即限制了一个自适应范围。要知道手机的像素大多是PC端的几倍，即手机一个像素相当于PC的 `n倍`，也就是更清晰了,因此 `设计稿` 的尺寸被设计成要求的 `n倍` 即 `640px`，而不是iphone4的 `320px`。
  3. 整个页面主要采用的是 `width: 100%`，高度由内容来撑，有几处需要用到 `float`，所以在不设父盒子高的情况下要添加 `clearfix`。
  4. 居中需要 `margin` 或与 `left/top: 50%` 相配合，当然 `translateX/Y` 也是可以的。
  5. 对于 `abox>a>img` 结构，使子元素都转块 `block`, `width: n%`，让 img 按比例缩放，自然会撑开父盒子，不设置宽高的话就层现原图，如果要多行并排，则给 li 父盒子 `width: columnNum`
  6. 精灵图很节省空间，注意尺寸问题，要不要限定一个 `background-size` 尺寸大小(图的尺寸缩放效果，定位也需要按缩放后的计算)，接着给元素 `width, height`，给定展示区域大小，然后定位图中要获取的位置 `background-position`。
  7. `box-sizing: border-box` 即怪异模式，让 `padding, border` 的尺寸都算进 `width, height` 里面，不过确实很省时。比如两边浮动各占 `50%`，突然想加个 `1px border`，此时知道会发生什么了吧。
  8. 圣杯模型，两边宽度固定，高度随意，中间宽度伸缩。即中间盒子要设 `width: 100%`，有多种方案，但万变不离其中，能够达到两边固定中间伸缩效果的都符合该模型。
  9. 轮播图的实现效果很一般，没有触摸滑动控制的效果，而且没做尾端切换时的过渡效果，显得有点怪异。可以加一些控制监测，如 `touchstart touchmove touchend` 移动端事件，根据 `e.touches[0].clientX` 移动距离决定是否切换到下一张图。
  10. 利用原生js的 `nodeElement.style.transform/transition` 属性动态设置其展示效果，这样更好的提高用户体验。
  11. 轮播图 html 元素首尾两端多放一张照片，实现无缝衔接，否则很难看。
  12. Done.

