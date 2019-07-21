/**
 * 生成指定范围内的随机数
 *
 * @param {number} start
 * @param {number} end
 */
function getRnd (start, end) {
  return Math.random() * (end - start) + start
}


/**
 * 生成指定范围内的随机整数
 *
 * @param   {number} min
 * @param   {number} max
 * @returns {number}
 */
function getRndInt(min, max) {
  if (arguments.length < 2) {
    max = min
    min = 0
  }
  return Math.floor(getRnd(min, max + 1))
}


/**
 * 随机 rgb 颜色
 *
 * @returns {string}
 */
function getRndRGB () {
  var r = Math.floor(Math.random() * 256)
  var g = Math.floor(Math.random() * 256)
  var b = Math.floor(Math.random() * 256)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}


/**
 * 获取十六进制随机颜色
 */
function getRndHexColor () {
  return '#' + (function(s) {
    return new Array(7 - s.length).join('0') + s
  })((Math.random() * 0x1000000 << 0).toString(16))
}


/**
 * [getRndString 获取一个随机的5位字符串]
 * @param  {[type]} prefix [description]
 *
 * @return {String}        [prefix + 5位字符串]
 */
function getRndString(prefix) {
  return prefix + Math.random().toString(36).replace(/[^a-z]/g, '').substr(0, 5)
}
