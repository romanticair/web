/**
 * Created by User on 2018/10/21.
 */

// running man
var Person = function(ctx){
  // 帧图行走的属性
  this.ctx = ctx || document.querySelector('canvas').getContext('2d')
  this.canvasWidth = this.ctx.canvas.width
  this.canvasHeight = this.ctx.canvas.height
  // 人物默认选第一张图, 上0 左1 右2 3下
  this.direction = 0
  // 控制同一方向中不同动作
  this.index = 0
  // 行走速度
  this.speed = 10
}

// 初始化
Person.prototype.init = function(imageUrl) {
  this.loadImage(imageUrl)
}

// 加载图片
Person.prototype.loadImage = function(imageUrl) {
  var that = this
  var image = new Image()
  image.onload = function(){
    // 加载图片完成后执行以下代码
    // 获取图片大小
    // 绑定加载完成事件
    that.imageWidth = image.width
    that.imageHeigth = image.height
    that.personWidth = that.imageWidth / 4
    that.personHeight = that.imageHeigth / 4
    // 原点
    that.x0 = that.canvasWidth / 2 - that.personWidth / 2
    that.y0 = that.canvasHeight / 2 - that.personHeight / 2
    // 图片左顶点位置,行走后改变
    that.location = {x:that.x0, y:that.x0}
    that.drawImage(image)
    that.controler(image)
  }
  image.src = imageUrl
}

// 绘画图片
Person.prototype.drawImage = function(image) {
  // 先清除之前的绘画
  this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)
  // index控制同一方向的不同动作
  this.ctx.drawImage(image,
    this.index*this.personWidth, this.direction*this.personHeight,
    this.personWidth, this.personHeight,
    this.location.x, this.location.y,
    this.personWidth, this.personHeight
    )

  this.index++
  if (this.index > 3) {
      this.index = 0
  }
}

Person.prototype.controler = function(image){
  var that = this
  // 控制帧图
  document.onkeydown = function(event) {
    if(event.keyCode == 40) {
      // 前
      that.direction = 0
      that.location.y += that.speed
      that.drawImage(image)
    }
    else if (event.keyCode == 37) {
      // 左
      that.direction = 1
      that.location.x -= that.speed
      that.drawImage(image)
    }
    else if (event.keyCode == 39) {
      // 右
      that.direction = 2
      that.location.x += that.speed
      that.drawImage(image)
    }
    else if (event.keyCode == 38) {
      // 后
      that.direction = 3
      that.location.y -= that.speed
      that.drawImage(image)
    }
  }
}
