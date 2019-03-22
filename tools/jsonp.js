/**
 * 封装跨域 jsonp 函数
 *
 * @param {String} url  [请求地址]
 * @param {Function} cb [回调函数]
 */
function jsonp(url, cb) {
  let oScript = document.createElement('script')
  let fnName = 'jsonp' + Math.random().toString().replace('.', '')
  // 传入的 url 分四种情况，以防万一
  // https://regexr.com/
  // *jsonp.php
  // *jsonp.php?
  // *jsonp.php?callback=
  // *jsonp.php?callback=?
  if (url.charAt(url.length - 1) === '?') {
    url = url.replace(/(\?callback=\?)|\?/g, '?callback=' + fnName)
  }
  else {
    url += url.includes('callback') ? fnName : '?callback=' + fnName
  }

  oScript.src = url
  window[fnName] = cb
  document.body.appendChild(oScript)
  oScript.onload = function () {
    document.body.removeChild(oScript)
    delete window[fnName]
  }
}
