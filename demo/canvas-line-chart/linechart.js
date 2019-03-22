// 折线图类
var LineChart = function (context) {
	// 获取上下文
	this.context = context || document.querySelector('canvas').getContext('2d')
	// 画布大小
	this.canvasWidth = this.context.canvas.width
	this.canvasHeight = this.context.canvas.height
	// 网格大小
	this.gridSize = 10
	// 箭头大小
	this.arrowSize = 10
	// 坐标系间距
	this.space = 30
	// 坐标原地
	this.x0 = this.space
	this.y0 = this.canvasHeight - this.space
	// Grid总个数
	// this.xGridLength = Math.floor(this.canvasWidth / this.gridSize)
	// this.yGridLength = Math.floor(this.canvasHeight / this.gridSize)
	// 网格线,坐标系,数据网格,箭头颜色
	this.gridColor = '#ddd'
	this.lineColor = 'red'
	this.axisColor = 'purple'
	this.dataColor = 'pink'
	this.arrowColor = 'deeppink'
}

// 初始化折线图
LineChart.prototype.init = function(data) {
	// 绘画网格线
	this.draw_grid_lines()
	// 绘画坐标轴
	this.draw_coordinates()
	// 数据可视化
	this.data_visual(data)
}

LineChart.prototype.draw_grid_lines = function() {
	var xGridTotal = Math.floor(this.canvasHeight / this.gridSize)
	var yGridTotal = Math.floor(this.canvasWidth / this.gridSize)
	this.context.strokeStyle = this.gridColor
	// 先绘制x方向
	for (var i = 0; i < xGridTotal; i++) {
		this.context.beginPath()
		this.context.moveTo(0, this.gridSize * i)
		this.context.lineTo(this.canvasWidth, this.gridSize * i)
		this.context.stroke()
	}

	// 绘制y方向
	for (var i = 0; i < yGridTotal; i++) {
		this.context.beginPath()
		this.context.moveTo(this.gridSize * i, 0)
		this.context.lineTo(this.gridSize * i, this.canvasHeight)
		this.context.stroke()
	}
}

LineChart.prototype.draw_coordinates = function() {
	// 颜色填充
	this.context.strokeStyle = this.axisColor
	this.context.fillStyle = this.arrowColor

	// x轴
	this.context.beginPath()
	this.context.moveTo(this.x0, this.y0)
	this.context.lineTo(this.canvasWidth - this.space, this.y0)
	this.context.stroke()
	// 箭头
	this.context.beginPath()
	this.context.lineTo(this.canvasWidth - this.space - this.arrowSize, this.y0 + this.arrowSize / 2)
	this.context.lineTo(this.canvasWidth - this.space - this.arrowSize, this.y0 - this.arrowSize / 2)
	this.context.lineTo(this.canvasWidth - this.space, this.y0)
	this.context.stroke()
	this.context.fill()

	// y轴
	this.context.beginPath()
	this.context.moveTo(this.x0, this.y0)
	this.context.lineTo(this.space, this.space)
	this.context.stroke()
	// 箭头
	this.context.beginPath()
	this.context.lineTo(this.x0 + this.arrowSize / 2, this.space + this.arrowSize)
	this.context.lineTo(this.x0 - this.arrowSize / 2, this.space + this.arrowSize)
	this.context.lineTo(this.space, this.space)
	this.context.stroke()
	this.context.fill()
}

LineChart.prototype.data_visual = function(data) {
	this.context.fillStyle = this.dataColor
	var headX = this.x0
	var headY = this.y0
	for (var i = 0; i < data.length; i++) {
		// 绘制数据格子
		// 格子中心点
		var x = this.x0 + data[i].x
		var y = this.y0 - data[i].y
		this.context.beginPath()
		this.context.strokeStyle = this.dataColor
		// 格子左上角
		this.context.moveTo(x - this.gridSize / 2, y - this.gridSize / 2)
		this.context.lineTo(x + this.gridSize / 2, y - this.gridSize / 2)
		this.context.lineTo(x + this.gridSize / 2, y + this.gridSize / 2)
		this.context.lineTo(x - this.gridSize / 2, y + this.gridSize / 2)
		this.context.closePath()
		this.context.fill()

		// 绘制连线
		this.context.beginPath()
		this.context.strokeStyle = this.lineColor
		this.context.moveTo(headX, headY)
		this.context.lineTo(x, y)
		this.context.stroke()

		headX = x
		headY = y
	}
}

// LineChart.prototype.data_visual = function (data) {
// 	this.context.fillStyle = this.dataColor
// 	this.context.strokeStyle = this.dataColor
// 	var that = this
//     var prevCanvasX = this.x0
//     var prevCanvasY = this.y0
//     data.forEach(function (item, i) {
//         var canvasX = that.x0 + item.x
//         var canvasY = that.y0 - item.y
//         /*绘制点*/
//         that.context.beginPath()
//         that.context.moveTo(canvasX - that.gridSize / 2, canvasY - that.gridSize / 2)
//         that.context.lineTo(canvasX + that.gridSize / 2, canvasY - that.gridSize / 2)
//         that.context.lineTo(canvasX + that.gridSize / 2, canvasY + that.gridSize / 2)
//         that.context.lineTo(canvasX - that.gridSize / 2, canvasY + that.gridSize / 2)
//         that.context.closePath()
//         that.context.fill()

//         that.context.beginPath()
//         that.context.moveTo(prevCanvasX,prevCanvasY)
//         that.context.lineTo(canvasX,canvasY)
//         that.context.stroke()
//         prevCanvasX = canvasX
//         prevCanvasY = canvasY
// })
// }
