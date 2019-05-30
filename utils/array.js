/**
 * 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
 */
function uniq(arr) {
  var hash = {},
      ret = [],
      i, len
  for (i = 0, len = arr.length; i < len; i++) {
    var key = arr[i]
    if (hash[key]) {
      continue
    }

    ret.push(key)
    hash[key] = true
  }

  return ret
}


/**
 * 去除数组中的空白元素
 */
function deleteBlank(arr) {
  var ret = [], i, len
  var re = new RegExp(/^\s*$/)
  for (i = 0, len = arr.length; i < len; i++) {
    if (!re.test(arr[i])) {
      ret.push(arr[i])
    }
  }

  return ret
}


/**
 * 一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
 * 其中 fn 函数可以接受两个参数：item 和 index
 */
function each(arr, fn) {
  var i, len
  for (i = 0, len = arr.length; i < len; i++) {
    fn.call(arr[i], arr[i], i)
  }
}


/*求两个集合的并集*/
function union(a, b) {
  var arr = a.concat(b)
  return uniq(arr)
}


/*求两个集合的交集*/
function intersect(a, b) {
  var src = uniq(a)
  return src.filter(function(item) {
    return b.indexOf(item) > -1
  })
}


/*删除指定的一个元素*/
function remove(arr, ele) {
  var a = [].concat(arr)
  var index = a.indexOf(ele)
  if(index > -1) {
    a.splice(index, 1)
  }

  return a
}


/*将类数组转换为数组的方法*/
function toArray(arr) {
  if(Array.isArray(arr)) {
    return [].concat(arr)
  }
  
  // 不包括函数  
  return Array.prototype.slice.call(arr)
  // return JSON.parse(JSON.stringify(arr))
}


/*最大值*/
function max(arr) {
  return Math.max.apply(null, arr)
}


/*最小值*/
function min(arr) {
  return Math.min.apply(null, arr)
}


/*求和*/
function sum(arr) {
  return arr.reduce((pre, cur) => { pre + cur })
}


/*平均值*/
function average(arr) {
  return sum(arr) / arr.length
}

module.exports = {
  uniq: uniq,
  deleteBlank: deleteBlank,
  each: each,
}
