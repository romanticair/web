/******************************************
 * 学习 Array 方法，模仿封装其中一些 API
 *
 * 1. pop、push
 * 2. shift、unshift
 * 3. slice、splice
 * 4. indexOf、lastIndexOf
 * 5. find、findIndex、includes
 * 6. sort
 * 7. some、every
 * 8. reduce、filter、map
 *
 * https://github.com/v8/v8/blob/ad82a40509c5b5b4680d4299c8f08d6c6d31af3c/src/js/array.js
 ******************************************/

// map
// 参考了 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map
// 1.检查对象类型
// 2.检查参数类型(fn, thisArg) 参数二是指传入的函数需要用到 this 环境?
// 3.拷贝 this 一份，并初始化长度为 0
// 4.根据参数要求，传参数(可能带this，call)
// 5.遍历过程中不能影响原数组和已处理过的数组
Array.prototype.myMap = function (fn, thisArg) {
  if (this == null) {
    throw TypeError('this is null or undefined')
  }
  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    throw TypeError(fn + ' is not a function')
  }

  // 防止 fn 内直接修改元素组
  let obj = Object(this)
  // 64int -> 32Unint
  let len = obj.length >>> 0

  // 为 fn 调用指定 this 对象，或者默认 null or undefined，结果是指向全局对象
  // 注意：严格模式是 undefined
  // 防止被篡改无效报错，还可以减少字节，无论如何 void 0 总是返回 undefined
  // https://segmentfault.com/q/1010000007406985/a-1020000007437795
  let _this = thisArg ? thisArg : void 0

  let arr = []
  for (let i = 0; i < len; i++) {
    // 跳过那些 <1 empty slot> 占位但为空的元素(delete)
    // 即只会在那些”有值“的索引上被调用，不会在那些被删除或从来未被赋值的索引上调用
    if (i in obj) {
      // fn.call === Function.prototype.call
      arr.push(fn.call(_this, obj[i], i, obj))
    }
  }

  return arr
}

// some
Array.prototype.mySome = function (fn) {
  if (this == null) {
    throw TypeError('this is null or undefined')
  }
  if (typeof fn !== 'function') {
    throw TypeError(fn + ' is not a function')
  }

  let obj = Object(this)
  let len = obj.length >>> 0
  let _this = arguments.length > 1 ? arguments[1] : void 0
  for (let i = 0; i < len; i++) {
    if (i in obj && fn.call(_this, obj[i], i, obj)) return true
  }
  return false
}

// every
Array.prototype.myEvery = function (fn) {
  if (this == null) {
    throw TypeError('this is null or undefined')
  }
  if (typeof fn !== 'function') {
    throw TypeError(fn + ' is not a function')
  }

  let obj = Object(this)
  let len = obj.length >>> 0
  let _this = arguments.length > 1 ? arguments[1] : void 0
  for (let i = 0; i < len; i++) {
    if (i in obj && !fn.call(_this, obj[i], i, obj)) {
      return false
    }
  }
  return true
}

// find
Array.prototype.myFind = function (fn) {
  if (this == null) {
    throw TypeError('this is null or undefined')
  }
  if (typeof fn !== 'function') {
    throw TypeError(fn + ' is not a function')
  }

  let obj = Object(this)
  let len = obj.length >>> 0
  let _this = arguments.length > 1 ? arguments[1] : void 0
  for (let i = 0; i < len; i++) {
    // 遍历整个数组，找到就返回
    if (fn.call(_this, obj[i], i, obj)) {
      return obj[i]
    }
  }
  return void 0
}

// find
Array.prototype.myFilter = function (fn) {
  // 更严格模式
  if (this === void 0 || this === null) {
    throw TypeError('this is null or undefined')
  }
  if (typeof fn !== 'function') {
    throw TypeError(fn + ' is not a function')
  }

  let obj = Object(this)
  let len = obj.length >>> 0
  let _this = arguments.length > 1 ? arguments[1] : void 0
  let arr = []
  for (let i = 0; i < len; i++) {
    if (i in obj && fn.call(_this, obj[i], i, obj)) {
      arr.push(obj[i])
    }
  }
  return arr
}

// findIndex
Array.prototype.myFindIndex = function (fn) {
  if (this === void 0 || this === null) {
    throw TypeError('this is null or undefined')
  }
  if (typeof fn !== 'function') {
    throw TypeError(fn + ' is not a function')
  }

  let obj = Object(this)
  let len = obj.length >>> 0
  let _this = arguments.length > 1 ? arguments[1] : void 0
  for (let i = 0; i < len; i++) {
    if (fn.call(_this, obj[i], i, obj)) return i
  }
  return -1
}

// sort
Array.prototype.mySort = function (fn) {
  throw 'TODO: sort'
}

// reduce
Object.defineProperty(Array.prototype, 'myReduce', {
  // value: fn => {
  value: function (fn) {
    // 发现新知识，箭头函数不能用 new 实例化，内部不存在 arguments
    // 箭头函数无自己的 this, arguments, super 等
    // 明天看下 MDN 的箭头函数说明文档
    if (this === void 0 || this === null) {
      throw TypeError('this is null or undefined')
    }
    if (typeof fn !== 'function') {
      throw TypeError(fn + ' is not a function')
    }
    // Object构造函数为给定值创建一个对象包装器
    // 如果给定值是 null 或 undefined，将会创建并返回一个空对象
    // 否则，将返回一个与给定值对应类型的对象
    // 当以非构造函数形式被调用时，Object 等同于 new Object()
    let obj = Object(this)
    let len = obj.length >>> 0
    // 数组中正在处理的当前元素的索引
    // 如果提供了 initialValue，则起始索引号为 0，否则为 1
    let i = 0
    let val
    if (arguments.length > 1) {
      val = arguments[1]
    } else {
      // 跳过空元素，防止初始值是空值(后面的空值可以跳过，初始值需另外处理)
      // 如果没有第一个条件，后面的条件可能会一直成立，无限循环的情况了
      while (i < len && !(i in obj)) {
        i++
      }

      // 没给初始值，数组也为空(包括多个空值组成的数组)，报错
      if (i >= len) {
        throw TypeError('Reduce of empty array with no initial value')
      }
      // 到这里，说明没给初始值，所以将第一个元素作为初始值，索引值从 1 开始
      val = obj[i++]
    }

    while (i < len) {
      if (i in obj) {
        val = fn(val, obj[i], i, obj)
      }
      i++
    }

    return val
  }
})
