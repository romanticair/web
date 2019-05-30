var type = require('./type.js')
var isArray = type.isArray
var isPlain = type.isPlain


/**
 * [deepClone 对象深度拷贝]
 * @param  {Object} source      [description]
 *
 * @return {Object}             [description]
 */
function deepClone(source) {
  // 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
  // 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等等
  var result = source, i, len
  if (!source
    || source instanceof Number
    || source instanceof String
    || source instanceof Boolean) {

    return result

  } else if (isArray(source)) {
    var resultLen = 0
    result = []

    for (i = 0, len = source.length; i < len; i++) {
      result[resultLen++] = deepClone(source[i])
    }

  } else if (isPlain(source)) {
    result = {}
    for (i in source) {
      if (source.hasOwnProperty(i)) {
        result[i] = deepClone(source[i])
      }
    }
  }

  return result
}


/**
 * [clone 对象浅复制]
 * @param  {[type]} destination [description]
 * @param  {[type]} source      [description]
 *
 * @return {[type]}             [description]
 */
function clone(destination, source) {
  for (var attr in source) {
    if (source.hasOwnProperty(attr)) {
      destination[attr] = source[attr]
    }
  }
}


/**
 * [extend 模仿 $.extend]
 */
function extend() {
  var target, options, src, copy, key, clone
  var deep, copyIsArray, len, i = 0

  // 默认不递归
  deep = typeof arguments[i] === 'boolean' ? (++i && arguments[0]) : false
  target = arguments[i++]

  // 对象,函数才可以复制
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {}
  }

  for (len = arguments.length; i < len; i++) {
    options = arguments[i]

    // 中间的参数未设置就跳过 extend(a, b, ,c)
    if (options == null) {
      continue
    }

    for (key in options) {
      if (options.hasOwnProperty(key)) {
        src = target[key]
        copy = options[key]

        // 循环引用，或者是基本类型且数值相同
        if (target === copy || src === copy) {
          continue
        }

        // 只能递归纯对象和数组
        if (deep && copy && (isPlain(copy) || (copyIsArray = Array.isArray(copy)))) {
          // src 可能不是两个对象之一，需判断，可能要初始化赋值
          if (copyIsArray) {
            copyIsArray = false
            clone = Array.isArray(src) ? src : []
          } else {
            clone = isPlain(src) ? src : {}
          }

          target[key] = extend(deep, clone, copy)
        } else if (copy !== undefined) {
          target[key] = copy
        }
      }
    }
  }

  return target
}


/**
 * 获取一个对象里面第一层元素的数量，返回一个整数
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 */
function getLength(obj) {
  'use strict'
  if (Object.keys) {
    return Object.keys(obj).length
  }

  // 下面是 Object.keys 的 polyfill
  var hasOwnProperty = Object.prototype.hasOwnProperty,
    hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
    dontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ],
    dontEnumsLength = dontEnums.length

  return function(obj) {
    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
      throw new TypeError('getObjectLength called on non-object')
    }

    var result = [],
      prop, i

    for (prop in obj) {
      if (hasOwnProperty.call(obj, prop)) {
        result.push(prop)
      }
    }

    if (hasDontEnumBug) {
      for (i = 0; i < dontEnumsLength; i++) {
        if (hasOwnProperty.call(obj, dontEnums[i])) {
          result.push(dontEnums[i])
        }
      }
    }
    return result.length
  }(obj)
}

module.exports = {
  clone: clone,
  extend: extend,
  getLength: getLength,
}
