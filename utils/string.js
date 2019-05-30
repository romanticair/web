/**
 * 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
 */
function trim(str) {
  // 兼容性 - 特殊字符编码 https://blog.csdn.net/xyanghomepage/article/details/25116247
  // var trimer = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g')
  // return String(str).replace(trimer, '')
  return str.replace(/^\s+|\s+$/g, '')
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


// 重复
function repeat(str, n) {
  var t = ''
  for (var i = 0; i < n; i++) {
    t += str
  }

  return t
}

// key 的出现次数
function count(str, key){
  return str.split(key).length - 1
}


module.exports = {
  trim: trim
}
