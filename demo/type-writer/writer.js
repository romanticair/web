/**
 * 模拟打印机效果
 *
 * @params {Object} obj
 * @params {Number} speed
 */

function TypeWriter(obj, speed) {
	this.speed = speed
	this.obj = obj
	this.string = obj.innerHTML
	this.progress = 0
	this.init()
}

TypeWriter.prototype.init = function() {
	var that = this
	var timer = setInterval(function () {
		that.obj.innerHTML = ''
		var char = that.string.substr(that.progress, 1)
		if (char == '<') {
			that.progress = that.string.indexOf('>', that.progress) + 1
		} else {
			that.progress++
		}
		that.obj.innerHTML = (that.string.substr(0, that.progress) + (that.progress & 1 ? '_' : ''))
		if (that.progress >= that.string.length) {
			clearInterval(timer)
		}
	}, that.speed)
}
