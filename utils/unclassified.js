/**
 * 根据 key 获取网址参数值
 */
function getUrlParam(key){
  var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
  var r = window.decodeURIComponent(window.location.search).substr(1).match(reg)
  return r && r[2]
}


/**
 * 获取全部url参数,并转换成json对象
 */
function getUrlParams (url) {
  var url = url ? url : window.location.href
  var s = url.substring(url.indexOf('?') + 1),
      params = s.split('&'),
      r = {}

  for (var i = 0, len = params.length; i < len; i++) {
    var pos = params[i].indexOf('=')
    if (pos == -1) {
      continue
    }

    var key = params[i].substring(0, pos)
    var value = window.decodeURIComponent(params[i].substring(pos + 1))

    r[key] = value
  }

  return r
}


/**
 * 删除 url 中指定的参数，返回更改后的 url
 */
function deleteUrlParam(url, key){
  var baseUrl = url.split('?')[0] + '?'
  var query = url.split('?')[1]

  if (query.indexOf(key) > -1) {
    var ret = {}
    var arr = query.split('&')

    for (var i = 0, len = arr.length; i < len; i++) {
      var item = arr[i].split('=')
      ret[item[0]] = item[1]
    }

    var url = baseUrl + JSON.stringify(ret).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&')
    delete ret[key]
  }
  
  return url
}

/**
 * 图片压缩
 * @param  {[type]}   file [压缩文件]
 * @param  {[type]}   obj  [压缩参数]
 * @param  {Function} cb   [回调函数]
 * @return {[type]}        [返回压缩前和压缩后的格式]
 */
function imageCompress(file, obj, cb) {
  /*
    obj = {
      width: 图片宽,
      height: 图片高,
      quality: 图像质量，
      blob: 是否转换成Blob
    }
  */
  
  //将以base64的图片url数据转换为Blob
  function convertBase64Url2Blob(url) {
    var arr = url.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new Blob([u8arr], {type: mime})
  }

  // canvas 绘制图片
  function canvasDataURL(oldBase64) {
    var img = new Image()
    img.src = oldBase64
    img.onload = function(){
      var self = this
      // 默认按比例压缩
      var w = self.width,
          h = self.height,
          scale = w / h

      w = obj.width || w
      h = obj.height || (w / scale)

      // 默认图片质量为0.7
      var quality = 0.7
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var oWidth = document.createAttribute('width')
      var oHeight = document.createAttribute('height')

      oWidth.nodeValue = w
      oHeight.nodeValue = h
      canvas.setAttributeNode(oWidth)
      canvas.setAttributeNode(oHeight)
      ctx.drawImage(self, 0, 0, w, h)

      // 图像质量
      if(obj.quality && obj.quality <= 1 && obj.quality > 0){
        quality = obj.quality
      }

      // quality值越小，所绘制出的图像越模糊
      var base64 = canvas.toDataURL('image/jpeg', quality)
      
      // 回调函数返回base64的值
      if (obj.blob) {
        cb && cb(convertBase64Url2Blob(base64), convertBase64Url2Blob(oldBase64))
      }else{
        cb && cb(base64, oldBase64)
      }
    }
  }

  // 读取图片的 base64 格式
  var ready = new FileReader()
  ready.readAsDataURL(file)
  ready.onload = function(){
    canvasDataURL(this.result)
  }
}


/**
* 光标所在位置插入字符，并设置光标位置
* 
* @param {dom} 输入框
* @param {val} 插入的值
* @param {posLen} 光标位置所处值的索引值
*/
function setCursorPosition (dom,val,posLen) {
  var cursorPosition = 0
  if(dom.selectionStart){
    cursorPosition = dom.selectionStart
  }

  insertAtCursor(dom,val)
  dom.focus()
  dom.setSelectionRange(dom.value.length,cursorPosition + (posLen || val.length))
}

/*光标所在位置插入字符*/
function insertAtCursor(dom, val) {
  if (document.selection){
    dom.focus()
    sel = document.selection.createRange()
    sel.text = val
    sel.select()
  } else if (dom.selectionStart || dom.selectionStart == '0'){
    let startPos = dom.selectionStart
    let endPos = dom.selectionEnd
    let restoreTop = dom.scrollTop
    dom.value = dom.value.substring(0, startPos) + val + dom.value.substring(endPos, dom.value.length)
    if (restoreTop > 0){
      dom.scrollTop = restoreTop
    }

    dom.focus()
    dom.selectionStart = startPos + val.length
    dom.selectionEnd = startPos + val.length
  } else {
    dom.value += val
    dom.focus()
  }
}
