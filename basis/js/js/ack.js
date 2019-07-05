// https://github.com/mqyqingfeng/Blog/blob/master/demos/debounce/underscore.js

// 第二版
var class2type = {}

// 生成class2type映射
'Boolean Number String Function Array Date RegExp Object Error'.split(' ').map(function(item, index) {
  class2type['[object ' + item + ']'] = item.toLowerCase()
})

function type(obj) {
  if (obj == null) {
      return obj + ''
  }

  return typeof obj === 'object' || typeof obj === 'function' ?
    class2type[Object.prototype.toString.call(obj)] || 'object' :
    typeof obj
}

function isArrayLike(obj) {
  // obj 必须有 length属性
  var length = !!obj && 'length' in obj && obj.length
  var typeRes = type(obj)

  // 排除掉函数和 Window 对象
  if (typeRes === 'function' || isWindow(obj)) {
    return false
  }

  return typeRes === 'array' || length === 0 ||
    typeof length === 'number' && length > 0 && (length - 1) in obj
}

// 1. 节流
// 激活状态下，fn 函数体持续地于间隔时间 wait 后触发
function throttle(fn, wait, options) {
  // var timestamp = 0
  var timestamp = +new Date()
  var context, args, now, remaining, result, timeoutId
  options = options ? options : {}

  function later() {
    result = fn.apply(context, args)
    timeoutId = context = args = null
    timestamp = +new Date()
  }

  function _throttle() {
    now = +new Date()
    options.leading === false && (timestamp = now)
    remaining = wait - (now - timestamp)
    context = this
    args = arguments

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      fn.apply(context, args)
      context = args = null
      timestamp = now
    } else if (options.trailing && !timeoutId) {
      timeoutId = setTimeout(later, remaining)
    }

    return result
  }

  _throttle.cancel = function () {
    clearTimeout(timeoutId)
    timeoutId = context = args = null
  }

  return _throttle
}

// 2. 防抖
// fn 函数体于由激活状态切换到非激活后的间隔时间 wait 后触发
function debounce(fn, wait, immediate) {
  var context, args, timeoutId, result, timestamp, callImmediate

  function later() {
    var remaining = wait - (+new Date() - timestamp)
    if (remaining > 0) {
      timeoutId = setTimeout(later, remaining)
    } else {
      // 立即触发的就不再触发了
      if (!immediate) {
        result = fn.apply(context, args)
      }

      timeoutId = context = args = null
    }
  }

  return function () {
    context = this
    args = arguments
    // 只要在激活状态，时间戳就不断刷新
    timestamp = +new Date()
    callImmediate = immediate && !timeoutId

    if (!timeoutId) {
      setTimeout(later, wait)
    }

    if (callImmediate) {
      result = fn.apply(context, args)
      timeoutId = context = args = null
    }
  }
}


// 3.拷贝
// 深拷贝数组，包括内嵌数据和纯对象，函数无效
// JSON.parse(JSON.stringify(arrry))
var class2type = {}
var toString = class2type.toString
var hasOwn = class2type.hasOwnProperty

function isPlainObject(obj) {
  var proto, Ctor
  if (!obj || toString.call(obj) !== "[object Object]") {
      return false
  }

  proto = Object.getPrototypeOf(obj)
  if (!proto) {
      return true
  }

  Ctor = hasOwn.call(proto, "constructor") && proto.constructor
  return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object)
}

  
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
      if (hasOwn.call(options, key)) {
        src = target[key]
        copy = options[key]

        // 循环引用，或者是基本类型且数值相同
        if (target === copy || src === copy) {
          continue
        }

        // 只能递归纯对象和数组
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          // src 可能不是两个对象之一，需判断，可能要初始化赋值
          if (copyIsArray) {
            copyIsArray = false
            clone = Array.isArray(src) ? src : []
          } else {
            clone = isPlainObject(src) ? src : {}
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


// 4.数组最大，最小值

// 5.数组扁平化

// [].concat(args) -> 扁平化一层
// Object.prototype.toString.call(args) -> 扁平化，但是结果数据类型可能与期待的不符

/**
 * 数组扁平化
 * @param  {Array}   input   要处理的数组
 * @param  {boolean} shallow 是否只扁平一层
 * @param  {boolean} strict  是否严格处理元素，不包括非数组元素
 * @param  {Array}   output  方便递归而传递的参数
 * 源码地址：https://github.com/jashkenas/underscore/blob/master/underscore.js#L528
 */
function flatten(input, shallow, strict, output) {
  // 递归使用的时候会用到output
  output = output || []
  var idx = output.length

  for (var i = 0, len = input.length; i < len; i++) {
    var value = input[i]
    // 如果是数组，就进行处理
    if (Array.isArray(value)) {
      // 如果是只扁平一层，遍历该数组，依此填入 output
      if (shallow) {
        var j = 0, length = value.length
        while (j < length) output[idx++] = value[j++]
      }

      // 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output
      else {
        flatten(value, shallow, strict, output)
        idx = output.length
      }
    }

    // 不是数组，根据 strict 的值判断是跳过不处理还是放入 output
    else if (!strict){
      output[idx++] = value
    }
  }

  return output
}

// 6.findIndex
function cb(func, context) {
   if (context === void 0) return func
   return function() {
     return func.apply(context, arguments)
  }
}

function sortedIndex(array, obj, iteratee, context) {
  var low = 0, high = array.length
  iteratee = cb(iteratee, context)

  while (low < high) {
    var mid = Math.floor((low + high) / 2)
    if (iteratee(array[mid]) < iteratee(obj)) low = mid + 1
    else high = mid
  }

  return high
}

function createIndexOfFinder(dir, predicate, sortedIndex) {
  return function (array, item, idx) {
    var length = array.length
    var i = 0

    if (typeof idx == "number") {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(length + idx, 0)
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1
      }
    }
    
    else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item)
      // 如果该插入的位置的值正好等于元素的值，说明是第一个符合要求的值
      return array[idx] === item ? idx : -1
    }

    // 判断是否是 NaN
    if (item !== item) {
      idx = predicate(array.slice(i, length), isNaN)
      return idx >= 0 ? idx + i: -1
    }

    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx
    }

    return -1
  }
}

// 用例
var indexOf = createIndexOfFinder(1, findIndex, sortedIndex);
var lastIndexOf = createIndexOfFinder(-1, findLastIndex)


// 7.通用 each
function each(obj, callback) {
  var i = 0
  // 明天补上
  if (isArrayLike(obj)) {
    for (var len = obj.length; i < len; i++) {
      // return false 退出
      if (callback.call(obj[i], i, obj[i]) === false) {
          break
      }
    }
  } else {
    for (i in obj) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break
      }
    }
  }

  return obj
}

// 8.判断两个对象是否相等
// https://segmentfault.com/a/1190000011708699

// 9.函数柯里化
/*
function subCurry(fn) {
  var args = [].slice.call(arguments, 1)
  return function () {
    return fn.apply(this, args.concat([].slice.call(arguments)))
  }
}

// len 辅助参数
function curry(fn, len) {
  // 函数体内可传入的个数
  len = len || fn.length

  return function () {
    // 传进来的参数不足，需要柯力化
    if (arguments.length < len) {
      var combined = [fn].concat(Array.prototype.slice.call(arguments))
      return curry(subCurry.apply(this, combined), len - arguments.length)
    } else {
      return fn.apply(this, arguments)
    }
  }
}
*/

var _ = {}

function curry(fn, args) {

  let allArgs = args || []
  let len = fn.length

  return function () {
    let _args = [].slice.call(arguments)
    let _allArgs = [].slice.call(allArgs)

    //在这里来调整参数的位置， 如果前面有占位符就向前补位
    if (_args.indexOf(_) !== -1){
      //有占位符  就直接concat
      _allArgs = _allArgs.concat(_args)
    }
    else {
      // 没有占位符，说明这段参数可以向前补位
      _allArgs.forEach((v, i) => {
        if (v === _ && _args.length !== 0) {
          _allArgs.splice(i, 1, _args.shift())
        }
      })

      //剩下的还是添加进参数里面
      if (_args.length != 0){
        _allArgs = _allArgs.concat(_args)
      }
    }

    // 是否达到理想参数个数，以及是否还含有空位
    if (_allArgs.length < len || _allArgs.indexOf(_) !== -1) {
      // 继续聚集参数
      return curry.call(this, fn, _allArgs)
    } else {
      return fn.apply(this, _allArgs)
    }
  }
}


var fn = curry(function(a, b, c) {
  return [a, b, c]
})

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]



// 10.偏函数 -- 属于柯里化中的一种
// 占位符
var _ = {}

function partial(fn) {
  var args = [].slice.call(arguments, 1)

  return function () {
    var len = args.length
    var position = 0
    for (var i = 0; i < len; i++) {
      args[i] = args[i] === _ ? arguments[position++] : args[i]
    }

    while (position < arguments.length) {
      args.push(arguments[position++])
    }

    return fn.apply(this, args)
  }
}


// 11.惰性函数
// 应用场景--解决每次执行函数都需要判断一次的问题，如下
function addEvent (type, el, fn) {
  if (window.addEventListener) {
    el.addEventListener(type, fn, false)
    addEvent = function (type, el, fn) {
      el.addEventListener(type, fn, false)
    }
  } else if(window.attachEvent) {
    el.attachEvent('on' + type, fn)
    addEvent = function (type, el, fn) {
      el.attachEvent('on' + type, fn)
    }
  }

  // or 覆盖, or 闭包 -- 需要先执行一次
  // addEvent(type, el, fn)
}


// 12.函数组合
// https://ramdajs.com/docs/
// 从右向左执行更加能够反映数学上的含义。
function compose() {
  // pipe -> 左向右
  var args = arguments
  var start = args.length - 1

  return function() {
    var i = start
    var result = args[start].apply(this, arguments)
    while (i--) result = args[i].call(this, result)
    return result
  }
}


// es6 -- 从左到右
const compose = (...fns) =>  
  (arg) =>  
    fns.reduce((composed, f) => f(composed),  arg) 


// 13.函数记忆
function memoize(fn, hasher) {
  var _memoize = function () {
    var args = arguments
    var cache = _memoize.cache
    // 缓存方式
    var key = hasher ? hasher.apply(this, args) : (args[0] + '')
    if (cache[key]) {
      return cache[key]
    }

    return cache[key] = fn.apply(this, args)
  }

  _memoize.cache = {}
  return _memoize
}

// hasher 转化 key 的存储格式函数
function hasher() {
  var args = Array.prototype.slice.call(arguments)
  return JSON.stringify(args)
}


// 14.乱序 -- Fisher–Yates
// https://bost.ocks.org/mike/shuffle/compare.html
function shuffle(a) {
  var j, x, i
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i)
    x = a[i - 1]
    a[i - 1] = a[j]
    a[j] = x
  }

  return a
}


// call
Function.prototype.call = function(context) {
  context = context || window
  context.fn = this

  var ret, args = []
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']')
  }

  ret = eval('context.fn(' + args + ')')
  delete context.fn
  return ret
}

// apply
Function.prototype.apply = function(context) {
  context = context || window
  context.fn = this

  // 不考虑 length 因素，直接调用
  var ret = context.fn(Array.prototype.slice.call(arguments, 1))
  delete context.fn
  return ret
}

// bind
Function.prototype.bind = function(context) {
  if (typeof context !=== 'function') {
    throw new TypeError('what was passed in needed to be a function.')
  }

  var fn = this
  var args = Array.prototype.slice.call(arguments, 1)

  // 防止返回的 _bind 被篡改，导致原函数 fn 受影响，做个中间代理(用 create 更直接)
  function proxy() {}

  function _bind() {
    var _moreArgs = Array.prototype.slice.call(arguments)
    return fn.apply(this instanceof proxy ? this : context, _moreArgs)
  }

  // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
  // 否则 new 实例化时，this 指向会变，使实例丢失原函数 fn 属性
  // _bind.prototype = this.prototype

  proxy.prototype = this.prototype
  _bind.prototype = new proxy()

  return _bind
}

// new
function new() {
  // 1
  var instance = new Object()
  var Contructor = [].shift.call(arguments) 
  // instance.__proto__ = Contructor.prototype
  // 上面这句不可行(虚值，没有改原型)，换成下面这句即可
  Object.getPrototypeOf(instance) = Contructor.prototype

  // 2，利用 create
  // var instance = create(Contructor.prototype)

  var object = Contructor.apply(instance, arguments)

  return !!object && typeof object === 'object' ? object : instance
}

// create
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
function create(prototype) {
  if (typeof prototype !== 'object' && typeof prototype !== 'object') {
    throw new TypeError('Object prototype may only be an Object')
  }

  var F = function () {}
  F.prototype = prototype
  return new F()
}

// 寄生式继承
function inherit(child, parent) {
  var instance = create(parent.prototype)
  instance.prototype.constructor = child
  child.prototype = instance
}


// or
function Parent(arguments) {
  this.arguments = arguments
}

function Child(arguments) {
  Parent.call(this, arguments)
}

Child.prototype = new Parent()
Child.prototype.constructor = Child



// 函数执行前、后所要添加的业务，装饰器
// 1.在原型链上添加
Function.prototype.before = function (fn) {
  var _s = this
  return function () {
    fn.apply(this, arguments)
    return _s.apply(this, arguments)
  }
}

Function.prototype.after = function (fn) {
  var _s = this
  return function () {
    var ret = _s.apply(this, arguments)
    fn.apply(this, arguments)
    return ret
  }
}

// test 1
function sayHello(name) {
  console.log('Hi', name)
}

sayHello = sayHello.before(function () {
  console.log('before')
}).after(function () {
  console.log('after')
})

sayHello('Lily')


// 2.独立创建一个对象
var before = function (fn, beforeFn) {
  return function () {
    beforeFn.apply(this, arguments)
    return fn.apply(this, arguments)
  }
}

var after = function (fn, afterFn) {
  return function () {
    var ret = fn.apply(this, arguments)
    afterFn.apply(this, arguments)
    return ret
  }
}

// test 2
function sayHello(name) {
  console.log('Hi', name)
}

sayHello = before(sayHello, function () {
  console.log('before')
})

sayHello('Lily')
