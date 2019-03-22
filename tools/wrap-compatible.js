/****************************************************
 *
 * 封装一些常用的兼容处理方法
 *
 * 注意：wrap-*.js 也许需要一同导入使用
 ****************************************************
 1. 获取元素样式
 2. 获取屏幕宽度
 3. 阻止事件冒泡
 4. 阻止默认事件
 5. 事件绑定
 6. 解除事件绑定
 7. 滚轮事件
 8. PC和移动端 -- 触摸和点击事件
/

/**
 * 兼容性获取元素样式
 *
 * @param {object} ele
 * @param {string} attr 
 */
function getStyle(ele, attr) {
  // lt IE8
  if (ele.currentStyle) {
    return ele.currentStyle[attr]
  } else {
    return window.getComputedStyle(ele, null)[attr]
  }
}


/**
 * 兼容性获取屏幕宽度
 */
function getClientWidth() {
	if (window.innerWidth) {
		return window.innerWidth
	}
	// window.innerWidth 比下面的值大一点
	else if (document.compatMode === 'CSS1Compat') {
		return document.documentElement.clientWidth
	}
	return document.body.clientWidth
}


/**
 * 兼容性阻止事件冒泡
 *
 * @param {object} ev
 */
function stopBubble (ev) {
	if (ev.cancelBubble) {
		ev.cancelBubble = true
	}
	else {
		ev.stopPropagation()
	}
}


/**
 * 兼容性阻止默认事件
 *
 * @param {object} ev
 */
function stopDefault (ev) {
	if (ev.returnValue) {
		ev.returnValue = false
	}
	else {
		// not lt IE8
		ev.preventDefault()
	}
	// or the follow method
	// return false
}


/**
 * 兼容性事件绑定
 *
 * @param {object} target
 * @param {string} type
 * @param {function} fn
 */
function bind (target, type, fn) {
	if (target.addEventListener) {
		// 不能移除匿名函数，(需要解除时)要同一回调函数才成功
		target.addEventListener(type, fn, false)
	}
	else if (target.attachEvent) {
    // IE6 7 8
		target.attachEvent('on' + type, fn)
	}
	else {
		target['on' + type] = fn
	}
}


/**
 * 兼容性解除事件绑定
 *
 * @param {object} target
 * @param {string} type
 * @param {function} cb
 */
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
 * 兼容性绑定滚轮事件
 *
 * @param {object} target
 * @param {function} fn
 */
function mouseScroll (target, fn) {
	if (navigator.userAgent.search('Firefox') != -1) {
		// FireFox
		bind(target, 'DOMMouseScroll', fn)
	}
	else {
		// Not FireFox
		bind(target, 'mousewheel', fn)
	}
}


/**
 * 兼容PC和移动端 -- 触摸和点击事件
 */
function device () {
	var isMobile = /Mobile/i.test(navigator.userAgent)
	if (isMobile) {
		touchstart = 'touchstart'
		touchmove = 'touchmove'
		touchend = 'touchend'
	}
	else {
    touchstart = 'mousedown'
    touchmove = 'mousemove'
    touchend = 'mouseup'
	}
}
