var isMobile = /Mobile/i.test(navigator.userAgent)
if (isMobile) {
	var touchstart = 'touchstart'
	var touchmove = 'touchmove'
	var touchend = 'touchend'
} else {
  var touchstart = 'mousedown'
  var touchmove = 'mousemove'
  var touchend = 'mouseup'
}

function bind (target, type, fn) {
	if (target.addEventListener) {
		target.addEventListener(type, fn, false)
	}
	else if (target.attachEvent) {
		target.attachEvent('on' + type, fn)
	}
	else {
		target['on' + type] = fn
	}
}

function unbind (target, type, cb) {
	if (target.removeEventListener) {
		// 需要移除已注册具名的回调才生效
		target.removeEventListener(type, cb, false)
	}
	else if (target.detachEvent) {
		target.detachEvent('on' + type, cb)
	}
	else {
		target['on' + type] = null
	}
}

/**
 * 滑动列表，能够定向实现横纵两个方向的滑动效果
 *
 * @param {Object} box
 * @param {Object} options
 */
function Scroller (box, options) {
	this.box = box
	this.scroller = this.box.querySelector('#scroller')
	this.boxH = this.box.offsetHeight
	this.scrollerH = this.scroller.offsetHeight
	this.direction = options.direction
	this.speed = options.speed
	this.callback = options.callback
	this.onActive = false

	this.init()
}

Scroller.prototype.init = function () {
	this.bind()
	this.generateScroller()
}

Scroller.prototype.bind = function () {
	var _this = this

	bind(document, touchmove, function (ev) {
		// 防止页面滚动
		ev.preventDefault()
	})

	bind(this.scroller, touchend, function (ev) {
		if (_this.onActive) {
			var target = ev.target || ev.srcElement
			if (target.nodeName === 'LI') {
				for (var i = 0; i < _this.scroller.children.length; i++) {
					// this.scroller.children[i].classList.contains('active')
					_this.scroller.children[i].classList.remove('active')
				}

				target.classList.add('active')
			}
		}
	})
}

Scroller.prototype.generateScroller = function () {
	var _this = this
	var downY = 0
	var preY = 0
	var downT = 0
	var timer = null
	var page = 0
	var speed = 0
	var range = 50
	var onoffT, onoffB

	bind(this.scroller, touchstart, start)

	function start (ev) {
		ev.preventDefault()
		// 防止页面滚动
		var touch = ev.changedTouches ? ev.changedTouches[0] : ev
		onoffT = false
		onoffB = false
		_this.onActive = true
		downY = touch.pageY
		preY = touch.pageY
		downT = _this.scroller.offsetTop

		bind(document, touchmove, move)
		bind(document, touchend, end)
	}

	function move (ev) {
		_this.onActive = false
		var touch = ev.changedTouches ? ev.changedTouches[0] : ev
		var step = touch.pageY - downY
		speed = touch.pageY - preY
		preY = touch.pageY

		// 不能超出上(下拉过多)下(上拉过多)界限
		// 上 top >= 0 下 top <= (this.boxH - this.scrollerH)
		if (_this.scroller.offsetTop >= 0) {
			if (!onoffT) {
				onoffT = true
				downY = touch.pageY
				step = touch.pageY - downY
			}

			_this.scroller.style['top'] = step/3 + 'px'
		}

		else if (_this.scroller.offsetTop <= (_this.boxH - _this.scrollerH)) {
			if (!onoffB) {
				onoffB = true
				downY = touch.pageY
				step = touch.pageY - downY
			}
			_this.scroller.style['top'] = (step/3 + _this.boxH - _this.scrollerH) + 'px'
		}

		else {
			_this.scroller.style['top'] = downT + step + 'px'
		}
	}

	function end (ev) {
		unbind(document, touchmove, move)
		unbind(document, touchend, end)

		if (!_this.onActive) {
			clearInterval(timer)
			timer = setInterval(function () {
				if ((Math.abs(speed) <= 1) || (_this.scroller.offsetTop > range) || (_this.scroller.offsetTop  < _this.boxH - _this.scrollerH - range)) {
					clearInterval(timer)
					// 滑到最后在界限外放手? 归位
					if (_this.scroller.offsetTop >= 0) {
						_this.scroller.style['transition'] = '.2s'
						_this.scroller.style['top'] = 0
					}

					else if (_this.scroller.offsetTop <= _this.boxH - _this.scrollerH) {
						_this.scroller.style['transition'] = '.2s'
						_this.scroller.style['top'] = _this.boxH - _this.scrollerH + 'px'
					}
				}
				
				else {
					speed *= 0.9
					_this.scroller.style['top'] = _this.scroller.offsetTop + speed + 'px'
				}
			}, 13)
		}
	}

	bind(_this.scroller, 'transitionend', function () {
		_this.scroller.style['transition'] =  ''
	})
}

Scroller.prototype.getDate = function () {}
