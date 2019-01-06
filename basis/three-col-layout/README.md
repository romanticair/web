# 学习圣杯和双飞翼布局

> 圣杯和双飞翼布局即是可以实现三栏中两端宽度固定，中间宽度自适应布局效果的两种方式的叫法。下面三个例子将以经典三栏布局作为我们的学习参考案例。

<br/>
## 一、圣杯布局

### 浮动 + 外边距

结构如下：

```html
<div class="wrapper">
  <div class="left">left</div>
  <div class="center">center</div>
  <div class="right">right</div>
</div>
```

样式如下：

```css
.wrapper {
  overflow: hidden;
  padding: 0 100px;
}

.left {
  float: left;
  width: 100px;
  height: 300px;
  /*原本在距父级盒子左侧100px的位置，现将其拉到最左侧，刚好遮住left-padding区域*/
  margin-left: -100px;
  background: red;
}

.center {
  float: left;
  /*宽度为父盒子box-content的100%，从而达到自适应*/
  width: 100%;
  height: 300px;
  background: pink;
}

.right {
  float: left;
  width: 100px;
  height: 300px;
  /*紧贴center盒子，但由于它占据了100%，导致right盒子掉到了下方。现将其拉到距父级盒子右侧100px的位置，刚好遮住right-padding区域*/
  margin-right: -100px;
  background: blue;
}
```

<br/>
### 定位法

**结构同上**

样式如下：

```css
.wrapper {
  position: relative;
  /*水平方向具有流动性，宽度自动填充(width: auto)*/
  height: 300px;
}

.left {
  position: absolute;
  height: 300px;
  width: 100px;
  background: red;
}

.center {
  /*method 1 -- 同一方向对称属性设置后，盒子具有该方向上的流动特性，从而自动填充*/
  /*
  position: absolute;
  left: 100px;
  right: 100px;
  */
  height: 300px; 
  /*method 2 -- 未脱离文档流，本身具有流动特性，依靠外边距撑开 left right 的宽度即可*/
  margin: 0 100px;
  /*end*/
  background: pink;
}

.right {
  position: absolute;
  right: 0;
  /*method 2 -- 没加 top 时，垂直方向是层流动性的，自身会被 center 盒子挤下来*/
  top: 0;
  /*end*/
  width: 100px;
  height: 300px;
  background: blue;
}
```

<br/>
## 二、双飞翼布局

### 浮动 + 外边距

结构如下：

```html
<div class="wrapper">
  <div class="center">
    <div class="msg">center</div>
  </div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

样式如下：

```css
.wrapper {
  overflow: hidden;
}

.wrapper > div {
  float: left;
  height: 300px;
}

.left {
  width: 100px;
  /*相对父级盒子的宽度计算*/
  margin-left: -100%;
  background: red;
}

.center {
  width: 100%;
  background: pink;
}

.right {
  width: 100px;
  /*本身被挤下去了，现拉回距父盒子右侧100px的位置*/
  margin-left: -100px;
  background: blue;
}

/*踹空，让 left right 盒子来填*/
.center .msg {
  margin: 0 100px;
}
```

<br/>
End.
若有不足，还请高人指教。