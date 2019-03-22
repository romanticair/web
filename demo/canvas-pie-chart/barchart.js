/**
 * Created by User on 2018/10/21.
 */
var BarChart = function(ctx){
  this.ctx = ctx || document.querySelector('canvas').getContext('2d')
  this.canvasWidth = this.ctx.canvas.width
  this.canvasHeight = this.ctx.canvas.height
  //Բ�뾶
  this.radius = 150
  //Բ��ƫ�ƴ�С
  this.dx = 50
  this.dy = 50
  //Բ��(���������·�ƫ this.dx&dy)
  this.x0 = this.canvasWidth / 2 + this.dx
  this.y0 = this.canvasHeight / 2 + this.dy
  //��ͼ�ϱ���������ͼ�ļ��
  this.titleDistance = 20
  //�����ϱ�����������,�ı���ļ��
  this.descDistance = 10
  //���������С�Լ�����
  this.descSize = {x0: 10, y0: 10, dx: 25, dy: 15}
  this.titleFont = '14px Microsoft YaHei'
  this.descFont = '12px Microsoft YaHei'
}

BarChart.prototype.init = function(data){
  var data = this.addAngles(data)
  this.drawBarChart(data)
}

// �������ϽǶ�(��ռ����)
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
    //���Ʊ�ͼ
    that.ctx.beginPath()
    that.ctx.moveTo(that.x0, that.y0)
    var curColor = that.getRandomColor()
    that.ctx.fillStyle = curColor
    that.ctx.arc(that.x0, that.y0, that.radius, startAngle, endAngle)
    that.ctx.fill()
    //�ڱ�ͼ����ӱ�������
    that.drawTitle(item.title, startAngle, item.angle / 2, curColor)
    //�ڻ�������ӱ�������
    that.drawDesc(item.title, i, curColor)
    //�µĿ�ʼ����һ�ν�����λ��
    startAngle = endAngle
  })
}

// �ڱ�ͼ�ϻ��������ı�
BarChart.prototype.drawTitle = function(title, startAngle, angle, color) {
  // ��Բ������������߶�������
  var lineLength = this.radius + this.titleDistance
  var x = this.x0 + Math.cos(startAngle+angle) * (lineLength)
  var y = this.y0 + Math.sin(startAngle+angle) * (lineLength)
  this.ctx.beginPath()
  this.ctx.moveTo(this.x0, this.y0)
  // ͬһ��ɫ
  this.ctx.strokeStyle = color
  this.ctx.lineTo(x, y)
  this.ctx.font = this.titleFont
  // �������ⳤ��
  var textWidth = this.ctx.measureText(title).width
  if(x > this.x0){
    // ��Բ���ұ�,���ֿ���
    this.ctx.lineTo(x + textWidth, y)
    this.ctx.textAlign = 'left'
  } else {
    // ��Բ�����,���ֿ���
    this.ctx.lineTo(x - textWidth, y)
    this.ctx.textAlign = 'right'
  }
  // Ϊ������Ӷ��뷽ʽ
  this.ctx.textBaseline = 'bottom'
  this.ctx.stroke()
  this.ctx.fillText(title, x, y)
}

// �ڻ����ϻ��������ı�
BarChart.prototype.drawDesc = function(title, i, color) {
  // �������
  var x = this.descSize.x0
  var y = this.descSize.y0 + i*(this.descSize.dy+this.descDistance)
  // �����ı���㼰���
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
