/****************************************************
 *
 * 封装常用的 Web api
 *
 * 注意：wrap-*.js 也许需要一同导入使用
 ****************************************************

 1. 设置 Cookie 缓存
 2. 根据键值索引获取对应 Cookie 缓存
 3. 根据键值索引删除对应 Cookie 缓存
 4. 获取包含 ClassName 的 DOM 元素
/

/**
 * 设置 Cookie 缓存
 * Google 和 搜狗浏览器在本地设置不上，部署上服务器才起效
 *
 * @param {string} key
 * @param {string} val
 * @param {number|string} overdueDays
 */
function setCookie (key, val, expiresDay) {
	if (expiresDay) {
		var date = new Date()
		date.setDate(date.getDate() + expiresDay)
		document.cookie = key + '=' + val + ';expires=' + date.toGMTstring() + ';path=/'
	}
	else {
		document.cookie = key + '=' + val
	}
}


/**
 * 根据键值索引获取对应 Cookie 缓存
 *
 * @param {string} key
 * @returns {string} [the value of key]
 */
function getCookie (key) {
	var arr = document.cookie.split('; ')
	for (var i = 0; i < arr.length; i++) {
		var item = arr[i].split('=')
		if (item[0] === key) {
			return item[1]
		}
	}

	return false
}


/**
 * 根据键值索引删除对应 Cookie 缓存
 *
 * @param {string} key
 */
function removeCookie (key) {
	setCookie(key, 'a', -1)
}


/**
 * 获取包含 ClassName 的 DOM 元素
 *
 * @param {object} parent
 * @param {string} className
 * @param {object}
 */

function getByClass(parent, className) {
	var ele = parent.getElementsByTagName('*')
	// 匹配一个单词
	var re = new RegExp('\\b' + className + '\\b')
	var result = []
	for (var i = 0; i < ele.length; i++) {
		if (re.test(ele[i].className)) {
			result.push(ele[i])
		}
	}

	return result
}
