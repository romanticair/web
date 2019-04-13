/**
* [combine 组合运算]
* @param  {array}  arr   [参与组合运算的数组]
* @param  {number} size  [组合运算的基数]
* @return {array}        [组合结果集]
*/
function combine(arr, size) {
  let allResult = []
  /* Algorithm
    f([1, 2, 3, 4], 3, [])
    one:
      f([2, 3, 4], 2, [1])
        f([3, 4], 1, [1, 2]) size === 1 -> [[1, 2, 3]]
        f([3, 4], 1, [1, 2]) size === 1 -> [[1, 2, 3], [1, 2, 4]]
    two:
      f([3, 4], 2, [2]) size === arrLen -> [[1, 2, 3], [1, 2, 4], [2, 3, 4]]

      其它递归类似
  */
  !(function f(arr, size, result) {
    let arrLen = arr.length
    if (size > arrLen) {
      // 剩余数比组合基数小，无法构成组合
      return
    }
    if (size === arrLen) {
      // 最后一个组合
      allResult.push([].concat(result, arr))
    } else {
      for (let i = 0; i < arrLen; i++) {
        let newResult = [].concat(result)
        newResult.push(arr[i])
        if (size === 1) {
          allResult.push(newResult)
        } else {
          let newArr = [].concat(arr)
          newArr.splice(0, i + 1)
          f(newArr, size - 1, newResult)
        }
      }
    }
  })(arr, size, [])

  return allResult
}


/**
* [getRound 四舍五入保留小数]
* @param  {number}  num  [待转化的浮点数]
* @param  {number}  len  [保留小数位数]
* @return {number}
*/
function getRound(num, len) {
  return Math.round(num * Math.pow(10, len)) / Math.pow(10, len)
}


/**
 * 生成指定范围内的随机数
 *
 * @param {number} start
 * @param {number} end
 */
function rnd (start, end) {
  return Math.random() * (end - start) + start
}


/**
 * 生成指定范围内的随机整数
 *
 * @param   {number} min
 * @param   {number} max
 * @returns {number}
 */

function randomBetween(min, max) {
  if (arguments.length < 2) {
    max = min
    min = 0
  }
  return Math.floor(Math.random() * (max - min) + min)
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
 * [function crc32加密]
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function crc32(url) {
  var a = document.createElement('a')
  a.href = url
  var T = (function () {
    var c = 0,
      table = new Array(256)
      for (var n = 0; n != 256; ++n) {
        c = n
        c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
        c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
        c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
        c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
        c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
        c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
        c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
        c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
        table[n] = c
      }
      return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table
  })()
  var crc32_str = function (str) {
    var C = -1
      for (var i = 0, L = str.length, c, d; i < L;) {
        c = str.charCodeAt(i++)
        if (c < 0x80) {
          C = (C >>> 8) ^ T[(C ^ c) & 0xFF]
        } else if (c < 0x800) {
          C = (C >>> 8) ^ T[(C ^ (192 | ((c >> 6) & 31))) & 0xFF]
          C = (C >>> 8) ^ T[(C ^ (128 | (c & 63))) & 0xFF]
        } else if (c >= 0xD800 && c < 0xE000) {
          c = (c & 1023) + 64
          d = str.charCodeAt(i++) & 1023
          C = (C >>> 8) ^ T[(C ^ (240 | ((c >> 8) & 7))) & 0xFF]
          C = (C >>> 8) ^ T[(C ^ (128 | ((c >> 2) & 63))) & 0xFF]
          C = (C >>> 8) ^ T[(C ^ (128 | ((d >> 6) & 15) | ((c & 3) << 4))) & 0xFF]
          C = (C >>> 8) ^ T[(C ^ (128 | (d & 63))) & 0xFF]
        } else {
          C = (C >>> 8) ^ T[(C ^ (224 | ((c >> 12) & 15))) & 0xFF]
          C = (C >>> 8) ^ T[(C ^ (128 | ((c >> 6) & 63))) & 0xFF]
          C = (C >>> 8) ^ T[(C ^ (128 | (c & 63))) & 0xFF]
        }
      }
      return C ^ -1
  }
  var r = a.pathname + '?r=' + Math.random().toString(10).substring(2)
  if (r[0] != '/') {
    r = '/' + r
  }
  var s = crc32_str(r) >>> 0
  var is_web = location.protocol.indexOf('http') > -1
  return (is_web ? [location.protocol, a.hostname] : ['http:', a.hostname]).join('//') + r + '&s=' + s
}
