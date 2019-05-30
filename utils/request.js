var object = require('./object.js')
var clone = object.clone

/*
  let url = 'http://demo.com/api'
  fetch(url).
    then( res => {
      console.log(res)
    }).catch( e => {
      console.log(e)
    })
  fetch(url, {
    method: 'POST',
  })
*/

function fetch(url, setting = {}) {
  //设置参数的初始值
  let opts = {
    method: (setting.method || 'GET').toUpperCase(),
    headers : setting.headers || {},
    // cookie是否一起发送
    credentials : setting.credentials || true,
    body: setting.body || {},
    // 可以设置 cors, no-cors, same-origin
    mode : setting.mode || 'cors',
    // follow, error, manual
    redirect : setting.redirect || 'follow',
    // 设置 cache 模式 (default, reload, no-cache)
    cache : setting.cache || 'default'
  }

  // 解析方式和参数
  let dataType = setting.dataType || 'json', 
      data = setting.data || ''

  // 参数格式化
  function params_format (obj) {
    let str = ''
    for (let i in obj) {
      str += `${i}=${obj[i]}&`
    }

    // return str.split('').slice(0, -1).join('')
    return str.slice(0, -1)
  }

  if (opts.method === 'GET') {
    url = url + (data ? `?${params_format(data)}` : '')
  } else {
    setting.body = data || {}
  }

  return new Promise((resolve, reject) => {
    fetch(url, opts)
    .then( async res => {
      let data = dataType === 'text' ? await res.text() :
          dataType === 'blob' ? await res.blob() :
          await res.json()

      resolve(data)
    })
    .catch( err => {
      reject(err)
    })
  })
}


/**
 * @param   {Object} options [description]
 *
 * @returns {XMLHttpRequest} [发送请求的XMLHttpRequest对象]
 */
function ajax(options) {
  var opt = {
    url: '',
    type: 'GET',
    data: {},
    dataType: 'JSON',
    async: true,
    contentType: 'application/x-www-form-urlencoded',
    // timeout: 2000
    success: function () {},
    error: function () {}
  }

  // 可能会重置，使得以上参数相当于默认值
  clone(opt, options)

  var url = opt.url, xhr
    type = opt.type.toUpperCase(),
    data = stringifyData(opt.data)

  var eventHandlers = {
    success: opt.success,
    error: opt.error
    // 可以根据 stat 再写几个监控事件
  }

  try {
    if (type === 'GET' && data) {
      url += (url.indexOf('?') >= 0 ? '' : '?') + data
      data = null
    }

    xhr = getXHR()
    xhr.open(type, url, opt.async)
    xhr.onreadystatechange = stateChangeHandler

    // 在open之后再进行http请求头设定
    if (type === 'POST') {
      xhr.setRequestHeader('Content-Type', opt.contentType)
    }

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    // xhr.responseType = opt.dataType
    xhr.send(data)
  }
  catch (err) {
    fire('error')
  }

  return xhr

  function stringifyData(data) {
    var param = []
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        param.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      }
    }
    return param.join('&')
  }

  function stateChangeHandler() {
    var stat
    if (xhr.readyState === 4) {
      try {
        stat = xhr.status
      } catch (err) {
        // 在请求时，如果网络中断，Firefox会无法取得status
        fire('error')
        return
      }

      fire(stat)
      // http://www.never-online.net/blog/article.asp?id=261
      // case 12002: // Server timeout
      // case 12029: // dropped connections
      // case 12030: // dropped connections
      // case 12031: // dropped connections
      // case 12152: // closed by server
      // case 13030: // status and statusText are unavailable

      // IE error sometimes returns 1223 when it
      // should be 204, so treat it as success
      if ((stat >= 200 && stat < 300)
        || stat === 304
        || stat === 1223) {
        fire('success')
      } else {
        fire('error')
      }

      /*
       * NOTE: Testing discovered that for some bizarre reason, on Mozilla, the
       * JavaScript <code>XmlHttpRequest.onreadystatechange</code> handler
       * function maybe still be called after it is deleted. The theory is that the
       * callback is cached somewhere. Setting it to null or an empty function does
       * seem to work properly, though.
       *
       * On IE, there are two problems: Setting onreadystatechange to null (as
       * opposed to an empty function) sometimes throws an exception. With
       * particular (rare) versions of jscript.dll, setting onreadystatechange from
       * within onreadystatechange causes a crash. Setting it from within a timeout
       * fixes this bug (see issue 1610).
       *
       * End result: *always* set onreadystatechange to an empty function (never to
       * null). Never set onreadystatechange from within onreadystatechange (always
       * in a setTimeout()).
       */
      window.setTimeout(
        function() {
          xhr.onreadystatechange = new Function()
          xhr = null
        }, 0)
    }
  }

  function fire(type) {
    // 让对应的事件处理器处理
    var handler = eventHandlers[type]
    if (!handler) {
      return
    }
    if (type !== 'success') {
      handler(xhr)
    } else {
      //处理获取xhr.responseText导致出错的情况,比如请求图片地址.
      try {
        xhr.responseText
      } catch(err) {
        return handler(xhr)
      }
      handler(xhr, xhr.responseText)
    }
  }

  function getXHR() {
    if (window.ActiveXObject) {
      try {
        return new ActiveXObject('Msxml2.XMLHTTP')
      }
      catch (e) {
        try {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
        catch (e) {}
      }
    }
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest()
    }
  }
}


/**
 * [jsonp 跨域通信]
 * @param  {[type]} url      [description]
 * @param  {[type]} onsucess [description]
 * @param  {[type]} onerror  [description]
 * @param  {[type]} charset  [description]
 *
 * @return {[type]}          [description]
 */
function jsonp(url, onsuccess, onerror, charset) {
  var callbackName = getRndString('jsonp_')
  window[callbackName] = onsuccess
  var script = getScript(url + '&callback=' + callbackName, charset)

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
 * [getScript 在页面中注入js脚本]
 * @param  {[type]} url     [description]
 * @param  {[type]} charset [description]
 * @return {[type]}         [description]
 */
function getScript(url, charset) {
  var script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  charset && script.setAttribute('charset', charset)
  script.setAttribute('src', url)
  script.async = true
  return script
}
