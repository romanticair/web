/**
 * Descartes笛卡尔心形曲线 -- 倒心形
 * 绘制单个桃心
 * x = 16 * sin(t)**3
 * y = 13*cos(t) - 5*cos(2*t) - 2*cos(3*t) - cos(4*t)
 *
 * @params {Object} ctx
 * @params {Number} size
 */
function DescartesHeart(ctx, size) {
  this.ctx = ctx || document.querySelector('canvas').getContext('2d')
  // 桃心大小
  this.size = size || 15
  this.point = 20 * this.size
  // 默认占整个窗口
  this.ctx.canvas.width = window.innerWidth
  this.ctx.canvas.height = window.innerHeight
  this.x0 = this.ctx.canvas.width / 2
  this.y0 = this.ctx.canvas.height / 2
  this.init()
}

/* 把心形曲线每个点给算出来，存储到数组里 */
DescartesHeart.prototype.init = function() {
  this.allPoints = []
  var step, vector, radian = Math.PI * 2
  for (var i = 0; i <= this.point; i++) {
      step = i / this.point * radian
      vector = {
          x: (16 * Math.pow(Math.sin(step), 3)) * this.size,
          y: -(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step)) * this.size
      }
      this.allPoints.push(vector)
  }
  // 初始化完曲线点 -- 画图
  this.drawHeart()
}

DescartesHeart.prototype.drawHeart = function() {
  // 在画布中心把桃心画出来
  var vector
  this.ctx.moveTo(this.x0, this.y0)
  this.ctx.beginPath()
  this.ctx.fillStyle = 'red'
  for (var i = 0; i < this.point; i++) {
      vector = this.allPoints[i]
      this.ctx.lineTo(this.x0 + vector.x, this.y0 + vector.y)
  }
  this.ctx.fill()
}


/**
 * 贝塞尔三阶曲线 -- 分成四块圆弧曲线分别绘画,一块4个点控制
 * 绘制桃心 + 烟雨
 *
 * @params {Object} ctx
 */
var BezierHeart = function(ctx) {
  this.ctx = ctx || document.querySelector('canvas').getContext('2d')
  this.canvasWidth = this.ctx.canvas.width = window.innerWidth
  this.canvasHeight = this.ctx.canvas.height = window.innerHeight
  this.canvasHalfWidth = this.canvasWidth / 2
  this.canvasHalfHeight = this.canvasHeight / 2
  this.x0 = this.canvasHalfWidth - 306
  this.y0 = 50
  this.canvasBgColor = '00061a'
  this.opacity = '0.1'
}

BezierHeart.prototype.draw = function() {
  var x0 = this.x0
  var y0 = this.y0
  // draw bezier heart
  this.ctx.fillStyle = hexToRGBA(this.canvasBgColor, this.opacity)
  this.ctx.beginPath()
  // left half -- left -> center -> down -> draw -> bottom -> left
  this.ctx.moveTo(0, 0)
  this.ctx.lineTo(this.canvasHalfWidth, 0)
  //顶部凹槽
  this.ctx.lineTo(304 + x0, 97 + y0)
  this.ctx.bezierCurveTo(282 + x0, -5 + y0, 80 + x0, -6 + y0, 76 + x0, 165 + y0)
  this.ctx.bezierCurveTo(74 + x0, 251 + y0, 184 + x0, 300 + y0, 304 + x0, 447 + y0)
  this.ctx.lineTo(this.canvasHalfWidth, this.canvasHeight)
  this.ctx.lineTo(0, this.canvasHeight)
  // right half -- right -> center -> down -> draw -> bottom -> right
  this.ctx.moveTo(this.canvasWidth, 0)
  this.ctx.lineTo(this.canvasHalfWidth, 0)
  this.ctx.lineTo(304 + x0, 97 + y0)
  this.ctx.bezierCurveTo(326 + x0, -5 + y0, 528 + x0, -6 + y0, 532 + x0, 165 + y0)
  this.ctx.bezierCurveTo(534 + x0, 251 + y0, 424 + x0, 300 + y0, 304 + x0, 447 + y0)
  this.ctx.lineTo(this.canvasHalfWidth, this.canvasHeight)
  this.ctx.lineTo(this.canvasWidth, this.canvasHeight)
  this.ctx.closePath()
  this.ctx.fill()
}

var Raindrop = function(ctx, id, size, speed, color) {
  this.id = id
  this.ctx = ctx || document.querySelector('canvas').getContext('2d')
  this.size = size || randomBetween(5, 20)
  this.speed = speed || randomBetween(1, 10)
  this.color = color || 'hsl(' + randomBetween(0, 360) + ',100%,55%)'
  this.canvasBgColor = '00061a'
  this.x = randomBetween(0, this.ctx.canvas.width)
  this.y = randomBetween(this.ctx.canvas.height, 0)
}

Raindrop.prototype.fall = function() {
  this.y += this.speed
  if (this.y > this.ctx.canvas.height) {
      // 到了最底部，重新回到上顶部继续下滴
      this.x = randomBetween(0, this.ctx.canvas.width)
      this.y = randomBetween(this.ctx.canvas.height, 0)
  }
  // 保存当前图形状态(旋转,坐标轴,) -- 状态入栈
  this.ctx.save()
  this.ctx.beginPath()
  var gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
  gradient.addColorStop(0, '#fff')
  gradient.addColorStop(0.5, this.color)
  gradient.addColorStop(1, hexToRGBA(this.canvasBgColor, 0))
  this.ctx.rect(this.x, this.y, this.size, this.speed)
  this.ctx.fillStyle = gradient
  this.ctx.fill()
  this.ctx.closePath()
  //恢复到上一个图形状态 -- 栈顶弹出
  this.ctx.restore()
}

var Controller = function(ctx) {
  this.ctx = ctx || document.querySelector('canvas').getContext('2d')
  this.raindropMinSize = 1
  this.raindropMaxSize = 4
  this.raindropMinSpeed = 5
  this.raindropMaxSpeed = 20
  this.raindropNum = 50
  this.raindropArr = []
  this.raindropMinHue = 0
  this.raindropMaxHue = 360
  this.init()
}

Controller.prototype.init = function() {
  // 1.绘制矩形--填充窗口背景
  // 2.绘制桃心
  // 3.绘制烟雨
  var that = this
  var size, speed, color, raindrop
  var canvasBgColor = '#00061a'
  var bezierHeart = new BezierHeart(this.ctx)
  this.ctx.fillStyle = canvasBgColor
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  for (var id = 0; id < this.raindropNum; id++) {
    size = randomBetween(this.raindropMinSize, this.raindropMaxSize)
    speed = randomBetween(this.raindropMinSpeed, this.raindropMaxSpeed)
    // hsl(hue色调{0,360}, saturation饱和度, lightness亮度)
    color = 'hsl(' + randomBetween(this.raindropMinHue, this.raindropMaxHue) + ',100%,55%)'
    raindrop = new Raindrop(this.ctx, id, size, speed, color)
    this.raindropArr.push(raindrop)
  }

  function drawAll() {
    bezierHeart.draw()
    for (var id = 0; id < that.raindropNum; id++) {
        that.raindropArr[id].fall()
    }
  }

  function animate() {
    drawAll()
    // 根据浏览器的性能自己决定绘制动画的速率 -- setInterval(x)
    window.requestAnimationFrame(animate)
  }

  window.requestAnimationFrame(animate)
}

// 随机坐标
function randomBetween(min, max) {
  if (arguments.length < 2) {
    max = min
    min = 0
  }
  return Math.floor(Math.random() * (max - min) + min)
}

// 颜色的十六进制格式转成RGRB颜色格式
function hexToRGBA(hex, opacity) {
  var rgb = ''
  hex.match(/.{2}/g).forEach(function(n) {
      rgb += parseInt(n, 16) + ','
  })
  return 'rgba(' + rgb + opacity + ')'
}

// 鼠标事件
function mouseTrail(x, y) {
  ctx.save()
  // 将一个源（新的）图像绘制到目标（已有）的图像上
  ctx.globalCompositeOperation = 'overlay'
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.arc(x, y, 50, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

ctx = document.querySelector('canvas').getContext('2d')
window.addEventListener('mousemove', function(cursor) {
  mouseTrail(cursor.x, cursor.y)
})