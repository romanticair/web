/**
 * 纯 js 封装 ajax 请求
 * 
 * @param {Object} options [请求字段参数]
 * @returns
 */
function ajax(options={}) {
	// 默认 GET 请求
	options.type = (options.type || 'GET').toUpperCase()
	// 默认响应值类型 JSON
	options.dataType = options.dataType || 'JSON'
	// 默认异步请求
	options.async = options.async || true
	// 默认请求内容类型
	options.contentType = options.contentType || 'application/x-www-form-urlencoded'
	// 默认超时 2s
	options.timeout = options.timeout || 2000
	// 处理访问携带的参数
	let params = parseData(options.data)
	let xhr = new XMLHttpRequest()
	xhr.responseType = options.dataType
	xhr.onload = function () {
		if (xhr.status === 200) {
			if (options.success) {
				// options.success(xhr.responseText)
				// xhr.response 返回的是 contentType 类型
				options.success(xhr.response)
			}
			else {
				// return JSON(xhr.responseText)
				return xhr.response
			} 
		}
		else {
			options.error && options.error()
		}
	}

	xhr.ontimeout = function () {
		console.log('请求超时，请重试')
	}

	if (options.type === 'GET') {
		xhr.open('GET', options.url + '?' + params, options.async)
		xhr.send(null)
	} else if (options.type === 'POST') {
		xhr.open('POST', options.url, options.async)
		xhr.setRequestHeader('Content-Type', options.contentType)
		xhr.send(params)
	}

	// 文件上传进度跟踪，目前没利用到
	// xhr.upload.onprogress = function (ev) {
	// 	let progress = parseInt(ev.loaded / ev.total * 100) + '%'
	// }
}


/**
 * 解析并处理请求字段参数
 *
 * @param {Object} data
 * @returns {String}
 */
function parseData(data) {
	let arr = []
	for (let param in data) {
		arr.push(param + '=' + data[param])
	}
	arr.push(('randomNumber=' + Math.random()).replace('.', ''))
	// arr.push('randomNumber=' + Math.random().toString().replace(/\D/g, ''))
	return encodeURIComponent(arr.join('&'))
	// let result = '' 
	// for (let param in data) {
	// 	result += param + '=' + data[param] + '&'
	// }
	// return encodeURIComponent(result.substring(0, result.length - 1))
}


function uploadfile() {
	// body...
}
