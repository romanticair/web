/**
 * 功能类库
 */

/**
* [util 工具类]
* @type {Object}
*/
var utils = (function () {
  /**
   * [ajax 前后端通信]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  function ajax(optionps) {
    var opt = {
      url: '',
      type: 'get',
      data: {},
      dataType: 'JSON',
      async: true,
      contentType: 'application/x-www-form-urlencoded',
      // timeout: 2000
      success: function () {},
      error: function () {}
    }

    // 可能会重置，使得以上参数相当于默认值
    extend(opt, optionps)
    if (opt.url) {
      var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
      var url = opt.url,
          type = opt.type.toUpperCase(),
          data = parseData(opt.data)

      if (type === 'GET') {
        url = url + '?' + data
        xhr.open(type, url.replace(/\?$/g, ''), opt.async)
        xhr.send()
      }
      if (type === 'POST') {
        xhr.open(type, url, opt.async)
        xhr.setRequestHeader('Content-Type', opt.contentType)
        xhr.send(data)
      }

      xhr.responseType = opt.dataType
      xhr.onload = function () {
        // 304 表示缓存是最新的，直接使用即可
        if (xhr.status === 200 || xhr.status === 304) {
          var res
          if (opt.success && opt.success instanceof Function) {
            res = xhr.responseText
            // 这里有必要判断吗
            if (typeof res === 'string') {
              res = JSON.parse(res)
            }
              opt.success.call(xhr, res)
          }
        } else if (opt.error && opt.error instanceof Function) {
          opt.error.call(xhr, null)
        }
      }
    }
  }

  function parseData(data) {
    var ret = []
    for (var key in data) {
      ret.push(key + '=' + data[key])
    }

    return encodeURIComponent(ret.join('&'))
  }

  /**
   * [jsonp 跨域通信]
   * @param  {[type]} url      [description]
   * @param  {[type]} onsucess [description]
   * @param  {[type]} onerror  [description]
   * @param  {[type]} charset  [description]
   * @return {[type]}          [description]
   */
  function jsonp(url, onsuccess, onerror, charset) {
    var callbackName = getRndName('jsonp_')
    window[callbackName] = onsuccess
    var script = getAndSetScript(url + '&callback=' + callbackName, charset)
    script.onreadystatechange = script.onload = function () {
      // script.readyState IE11 加载完是空，该版本以下为 loaded/complete
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = script.onreadystatechange = null
        if (script.parentNode) {
          // 移除 script 的 DOM 对象
          script.parentNode.removeChild(script)
        }
        // 移除全局函数
        window[callbackName] = null
      }
    }

    script.onerror = function () {
      if (onerror && isFunction(onerror)) {
        onerror()
      }
    }

    document.getElementsByTagName('head')[0].appendChild(script)
  }

  /**
   * [getAndSetScript 在页面中注入js脚本]
   * @param  {[type]} url     [description]
   * @param  {[type]} charset [description]
   * @return {[type]}         [description]
   */
  function getAndSetScript(url, charset) {
    var script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    charset && script.setAttribute('charset', charset)
    script.setAttribute('src', url)
    script.async = true
    return script
  }

  /**
   * [isFunction 判断是否为函数]
   * @param  {[type]} source [description]
   * @return {[type]}        [description]
   */
  function isFunction(source) {
    return '[object Function]' === Object.prototype.toString.call(source)
  }

  /**
   * [isIE 判断是不是低版ie]
   * @return {Boolean} [如果是ie返回版本号，不是则返回false]
   */
  function isIE() {
    var nav = navigator.userAgent.toLowerCase()
    return nav.indexOf('msie') != -1 ? parseInt(nav.split('msie')[1]) : false
  }


 /**
  * [indexOf 返回数组的指定项]
  * @param  {[type]} items [description]
  * @param  {[type]} key   [description]
  * @return {[type]}       [description]
  */
  function indexOf(items, key) {
    for (var i = 0; i < items.length; i++) {
      if (items[i] === key) {
        return 1
      }
    }

    return -1
  }

  /**
   * [extend 对象浅复制]
   * @param  {[type]} destination [description]
   * @param  {[type]} source      [description]
   * @return {[type]}             [description]
   */
  function extend(destination, source) {
    for (var attr in source) {
      if (source.hasOwnProperty(attr)) {
        destination[attr] = source[attr]
      }
    }
  }

  /**
   * [getRndName 获取一个随机的5位字符串]
   * @param  {[type]} prefix [description]
   * @return {[String]}      [prefix + 5位字符串]
   */
  function getRndName(prefix) {
    return prefix + Math.random().toString(36).replace(/[^a-z]/g, '').substr(0, 5)
  }

  /**
   * [isEmail 验证邮箱]
   * @param  {[String]} s [description]
   * @return {[Boolean]}  [description]
   */
  function isEmail(s) {
    let reg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/
    return reg.test(s)
  }

  /**
   * [function 转换图片为 base64]
   * @param  {[Object]} file [description]
   * @param  {[Function]} cb [description]
   * @return {[Type]}        [description]
   */
  // function converImageToBase64(file, cb) {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function() {
  //   cb(this.result);
  //   }
  // }

  return {
    ajax: ajax,
    jsonp: jsonp,
    isFunction: isFunction,
    isIE: isIE,
    extend: extend,
    isEmail: isEmail
  }
})()

export default utils
