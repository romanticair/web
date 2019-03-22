/****************************************************
 *
 * 封装一些自定义常用函数
 *
 * 注意：wrap-*.js 也许需要一同导入使用
 ****************************************************

 1. 去除字符串两侧空格，并将中间的多个空格合并成一个(如果有)
 2. 仿 Jquery $() 获取元素
 3. 随机 rgb 颜色
 4. 数字补零
 5. DOM 对象 CSS 属性缓冲变化  
 6. 图片资源预加载
/

/**
 * 去除字符串两侧空格，并将中间的多个空格合并成一个(如果有)
 *
 * @param {string} str
 */
function trim (str) {
	return str.replace(/(^\s*)/g, '').replace(/(\s*$)/g, '').replace(/(\s+)/g, ' ')
}


/**
 * 仿 Jquery $() 获取元素
 *
 * @param {string} str
 */
function $(str) {
	var tag = str.charAt(0)
	var name = str.substr(1)
	switch(tag) {
		case '#':
			return document.getElementById(name)
			break
		case '.':
			return document.getElementsByClassName(name)
			break
		default:
			return document.getElementsByTagName(str)
	}
}


/**
 * 随机 rgb 颜色
 *
 * @returns {string}
 */
function getRandomColor () {
	var r = Math.floor(Math.random() * 256)
	var g = Math.floor(Math.random() * 256)
	var b = Math.floor(Math.random() * 256)
	return 'rgb(' + r + ',' + g + ',' + b + ')'
}


/**
 * 数字补零
 *
 * @param {number} num
 * @returns {string}
 */
function zeroize (num) {
	if (num < 10) {
		return '0' + num
	}
		return '' + num
}


/**
 * DOM 对象 CSS 属性缓冲变化
 *
 * @param {Object} obj
 * @param {Object} json
 * @param {Function} cb
 */
function startMove(obj, json, cb) {
	clearInterval(obj.timer)
	if (json['opacity']) {
		// opacity 可传入范围 [0, 1] | [1, 100]，若是前者则转成后者，方便计算
		json['opacity'] = json['opacity'] < 1 ? json['opacity'] * 100 : json['opacity']
	}
	obj.timer = setInterval(function() {
		var stop = false
		for(var attr in json) {
			var cur = 0
			// 颜色渐变要特殊处理
			if(attr === 'opacity') {
				cur = Math.round(parseFloat(getStyle(obj, attr)) * 100)
			}
			else {
				cur = parseInt(getStyle(obj, attr))
			}
			// 到达目标才清除定时器
			if (cur === json[attr]) {
				stop = true
			}

			var speed = (json[attr] - cur) / 6
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
			if(attr === 'opacity') {
				obj.style.filter = 'alpha(opacity:' + (cur + speed) + ')'
				obj.style.opacity = (cur + speed) / 100
			}
			else {
				obj.style[attr] = cur + speed + 'px'
			}
		}

		if (stop) {
			clearInterval(obj.timer)
			if (cb) cb()
		}
	}, 30)
}


/**
 * 图片资源预加载
 *
 * @param {object} resourceArr
 * @param {function} cb
 */
function preLoading(resourceArr, cb) {
	var i = 0
	resourceArr.forEach(function(url, index) {
		var img = new Image()
		img.onload = function () {
			i++
			if (i == resourceArr.length && cb) {
				cb()
			}
		}
		img.onerror = function () {
			if (cb) cb()
		}

		img.src = url
	})
}
