/**
 * Created by User on 2018/10/21.
 */
var BarChart = function(ctx){
  this.ctx = ctx || document.querySelector('canvas').getContext('2d')
  this.canvasWidth = this.ctx.canvas.width
  this.canvasHeight = this.ctx.canvas.height
  //圆半径
  this.radius = 150
  //圆心偏移大小
  this.dx = 50
  this.dy = 50
  //圆心(往画布右下方偏 this.dx&dy)
  this.x0 = this.canvasWidth / 2 + this.dx
  this.y0 = this.canvasHeight / 2 + this.dy
  //饼图上标题描述与图的间距
  this.titleDistance = 20
  //画布上标题描述矩形,文本间的间距
  this.descDistance = 10
  //描述区域大小以及点起
  this.descSize = {x0: 10, y0: 10, dx: 25, dy: 15}
  this.titleFont = '14px Microsoft YaHei'
  this.descFont = '12px Microsoft YaHei'
}

BarChart.prototype.init = function(data){
  var data = this.addAngles(data)
  this.drawBarChart(data)
}

// 给数据上角度(所占弧度)
BarChart.prototype.addAngles = function(data){
  var total = 0
  data.forEach(function(item, i){
      total += item.num
  })
  data.forEach(function(item, i){
      item.angle = (item.num / total) * 2 * Math.PI
  })

  return data
}

BarChart.prototype.drawBarChart = function(data){
  var that = this
  var startAngle = 0
  var endAngle = 0
  console.log(startAngle, endAngle)
  data.forEach(function(item, i){
    endAngle += item.angle
    //绘制饼图
    that.ctx.beginPath()
    that.ctx.moveTo(that.x0, that.y0)
    var curColor = that.getRandomColor()
    that.ctx.fillStyle = curColor
    that.ctx.arc(that.x0, that.y0, that.radius, startAngle, endAngle)
    that.ctx.fill()
    //在饼图上添加标题描述
    that.drawTitle(item.title, startAngle, item.angle / 2, curColor)
    //在画布上添加标题描述
    that.drawDesc(item.title, i, curColor)
    //新的开始是上一次结束的位置
    startAngle = endAngle
  })
}

// 在饼图上绘制描述文本
BarChart.prototype.drawTitle = function(title, startAngle, angle, color) {
  // 由圆心延伸出来的线顶点坐标
  var lineLength = this.radius + this.titleDistance
  var x = this.x0 + Math.cos(startAngle+angle) * (lineLength)
  var y = this.y0 + Math.sin(startAngle+angle) * (lineLength)
  this.ctx.beginPath()
  this.ctx.moveTo(this.x0, this.y0)
  // 同一颜色
  this.ctx.strokeStyle = color
  this.ctx.lineTo(x, y)
  this.ctx.font = this.titleFont
  // 测量标题长度
  var textWidth = this.ctx.measureText(title).width
  if(x > this.x0){
    // 在圆心右边,文字靠左
    this.ctx.lineTo(x + textWidth, y)
    this.ctx.textAlign = 'left'
  } else {
    // 在圆心左边,文字靠右
    this.ctx.lineTo(x - textWidth, y)
    this.ctx.textAlign = 'right'
  }
  // 为文字添加对齐方式
  this.ctx.textBaseline = 'bottom'
  this.ctx.stroke()
  this.ctx.fillText(title, x, y)
}

// 在画布上绘制描述文本
BarChart.prototype.drawDesc = function(title, i, color) {
  // 矩形起点
  var x = this.descSize.x0
  var y = this.descSize.y0 + i*(this.descSize.dy+this.descDistance)
  // 描述文本起点及宽度
  var textX = x + this.descSize.dx + this.descDistance
  var textY = y + this.descSize.dy
  // var textWidth = this.ctx.measureText(title).width
  this.ctx.beginPath()
  this.ctx.moveTo(x, y)
  this.ctx.rect(x, y, this.descSize.dx, this.descSize.dy)
  this.ctx.strokeStyle = this.ctx.fillStyle = color
  this.ctx.font = this.descFont
  this.ctx.textAlign = 'left'
  this.ctx.stroke()
  this.ctx.fill()
  this.ctx.fillText(title, textX, textY)
}

BarChart.prototype.getRandomColor = function() {
  var r = Math.floor(Math.random() * 256)
  var g = Math.floor(Math.random() * 256)
  var b = Math.floor(Math.random() * 256)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}
