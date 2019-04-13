/**
 * 1. JS            数据类型结构
 * 2. DOM           相关
 * 3. Event         相关
 * 4. BOM           相关
 * 5. Ajax、jsonp   通信
 * 6. random        相关
 */

/**
 * ================== JS 数据类型结构 =====================
 */

function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}
function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]'
}
function isRegExp(reg) {
  return Object.prototype.toString.call(reg) === '[object RegExp]'
}
function isNumber(num) {
  return Object.prototype.toString.call(num) === '[object Number]'
}
function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]'
}
function isBoolean(boolean) {
  return Object.prototype.toString.call(boolean) === '[object Boolean]'
}
function isDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]'
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
function isUndefined(arg) {
  return Object.prototype.toString.call(arg) === "[object Undefined]"
}
// 简单判断是否为window对象或DOM对象之一，返回一个bool值
function isElement(arg) {
  var s = Object.prototype.toString.call(arg)
  return s.indexOf("[object HTML") !== -1 || s.indexOf("[object Window]") !== -1
}


/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由 {} 或者 new Object 类似方式创建
 * 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 */
function isPlain(obj){
  var hasOwnProperty = Object.prototype.hasOwnProperty,
      key
  if (!obj || !isObject(obj) ||
     //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
     //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性
     //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
     !('isPrototypeOf' in obj)
   ) {
    return false
  }

  //判断new fun()自定义对象的情况
  //constructor不是继承自原型链的
  //并且原型中有isPrototypeOf方法才是Object
  if (obj.constructor &&
    !hasOwnProperty.call(obj, "constructor") &&
    !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
    return false
  }

  //判断有继承的情况
  //如果有一项是继承过来的，那么一定不是字面量Object
  //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
  for (key in obj) {}
  return key === undefined || hasOwnProperty.call(obj, key)
}


/**
 * [cloneObject 对象深度拷贝]
 * @param  {Object} source      [description]
 *
 * @return {Object}             [description]
 */
function cloneObject(source) {
  // 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
  // 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等等
  var result = source, i, len
  if (!source
    || source instanceof Number
    || source instanceof String
    || source instanceof Boolean) {
    return result
  } else if (isArray(source)) {
    result = []
    var resultLen = 0
    for (i = 0, len = source.length; i < len; i++) {
      result[resultLen++] = cloneObject(source[i])
    }
  } else if (isPlain(source)) {
    result = {}
    for (i in source) {
      if (source.hasOwnProperty(i)) {
        result[i] = cloneObject(source[i])
      }
    }
  }

  return result
}


/**
 * [extend 对象浅复制]
 * @param  {[type]} destination [description]
 * @param  {[type]} source      [description]
 *
 * @return {[type]}             [description]
 */
function extend(destination, source) {
  for (var attr in source) {
    if (source.hasOwnProperty(attr)) {
      destination[attr] = source[attr]
    }
  }
}


/**
 * 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
 */
function uniqArray(arr) {
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
 * 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
 */
function trim(str) {
  // 兼容性 - 特殊字符编码 https://blog.csdn.net/xyanghomepage/article/details/25116247
  // var trimer = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g')
  // return String(str).replace(trimer, '')
  return str.replace(/^\s+|\s+$/g, '')
}


/**
 * 去除数组中的空白元素
 */
function deleteBlank(arr) {
  var ret = [], i, len
  var re = new RegExp(/^\s*$/)
  for (i = 0; len = arr.length; i < len; i++) {
    if (!re.test(arr[i])) {
      ret.push(arr[i])
    }
  }

  return ret
}


/**
 * 一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
 * 其中fn函数可以接受两个参数：item 和 index
 */
function each(arr, fn) {
  var i, len
  for (i = 0, len = arr.length; i < len; i++) {
    fn(arr[i], i)
  }
}


/**
 * 获取一个对象里面第一层元素的数量，返回一个整数
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 */
function getObjectLength(obj) {
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



/**
 * ================== DOM ==========================
 */

/**
 * 兼容性获取元素样式
 *
 * @param {object} ele
 * @param {string} attr 
 */
function getStyle(ele, attr) {
  // lt IE8
  if (ele.currentStyle) {
    return ele.currentStyle[attr]
  } else {
    return window.getComputedStyle(ele, null)[attr]
  }
}


/**
 * 兼容性阻止事件冒泡
 *
 * @param {object} ev
 */
function stopBubble (ev) {
  if (ev.cancelBubble) {
    ev.cancelBubble = true
  }
  else {
    ev.stopPropagation()
  }
}


/**
 * 兼容性阻止默认事件
 *
 * @param {object} ev
 */
function stopDefault (ev) {
  if (ev.returnValue) {
    ev.returnValue = false
  }
  else {
    // not lt IE8
    ev.preventDefault()
  }
  // or
  // return false
}


/**
 * 判断元素有无 className
 *
 * @param {HTMLElement} element 元素
 * @param {string} className className
 */
function hasClass(element, className) {
  var classNames = element.className
  if (!classNames) {
    return false
  }
  classNames = classNames.split(/\s+/)
  for (var i = 0, len = classNames.length; i < len; i++) {
    if (classNames[i] === className) {
      return true
    }
  }
  return false
}


/**
 * 添加元素 className
 *
 * @param {HTMLElement} element 元素
 * @param {string} className className
 */
function addClass(element, className) {
  if (!hasClass(element, className)) {
    element.className = element.className ? [element.className, className].join(' ') : className
  }
}


/**
 * 删除元素 className
 *
 * @param {HTMLElement} element 元素
 * @param {string} className className
 */
function removeClass(element, className) {
  if (className && hasClass(element, className)) {
    var classNames = element.className.split(/\s+/)
    for (var i = 0, len = classNames.length; i < len; i++) {
      if (classNames[i] === className) {
        classNames.splice(i, 1)
        break
      }
    }
  }
  element.className = classNames.join(' ')
}


/**
 * 判断 siblingNode 和 element 是否为同一个父元素下同一级的元素
 */
function isSiblingNode(element, siblingNode) {
  return element.parentNode === siblingNode.parentNode
}


// 获取元素绝对位置的横坐标和纵坐标距离(距离顶级 HTMLDocument 距离，不受滚动影响)
// iframe 中不适用
function getElementPagePosition(element) {
  if (element.getBoundingClientRect) {
    var rect = element.getBoundingClientRect()
    return {
      left: rect.left + document.documentElement.scrollLeft,
      top: rect.top + document.documentElement.scrollTop
    }
  }

  var left = 0, top = 0
  var current = element
  while (current !== null){
    left += current.offsetLeft
    top += current.offsetTop
    current = current.offsetParent
    // current = current.parentNode
  }

  return {
    left: left,
    top: top
  }
}


// 获取元素相对于浏览器窗口左上角的距离
// 注意：不是文档左上角，如果是相对于文档左上角，需要减去 scrollTop、scrollLeft
function getElmentViewportPosition(element) {
  if (element.getBoundingClientRect) {
    var rect = element.getBoundingClientRect()
    return {
      left: rect.left,
      top: rect.top
    }
  }

  var offset = getElementPagePosition(element)
  if (document.compatMode === 'CSS1Compat') {
    return {
      left: offset.left - document.documentElement.scrollLeft,
      top: offset.top - document.documentElement.scrollTop
    }
  }

  // BackCompat
  return {
    left: offset.left - document.body.scrollLeft,
    top: offset.top - document.body.scrollTop
  }
}


/**
 * 获取浏览器窗口尺寸(不包括滚动卷起的宽高)
 */
function getViewPortSize() {
  if (document.compatMode === 'CSS1Compat') {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  }

  // window.innerWidth 比下面的值大(包括滚动条)
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }
}


/**
 * 获取网页总尺寸(包括滚动卷起的宽高)
 */
function getPageSize(){
  if (document.compatMode == "CSS1Compat"){
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight
    }
  }

  return {
    width: document.body.scrollWidth,
    height: document.body.scrollHeight
  }
}


/**
 * [getAndSetScript 在页面中注入js脚本]
 * @param  {[type]} url     [description]
 * @param  {[type]} charset [description]
 * @return {[type]}         [description]
 */
function getAndSetScript(url, charset) {
  var script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  charset && script.setAttribute('charset', charset)
  script.setAttribute('src', url)
  script.async = true
  return script
}


/**
 * DOM 对象 CSS 属性缓冲变化
 *
 * @param {Object} obj
 * @param {Object} json
 * @param {Function} cb
 */
function startMove(obj, json, cb) {
  clearInterval(obj.timer)
  if (json['opacity']) {
    // opacity 可传入范围 [0, 1] | [1, 100]，若是前者则转成后者，方便计算
    json['opacity'] = json['opacity'] < 1 ? json['opacity'] * 100 : json['opacity']
  }
  obj.timer = setInterval(function() {
    var stop = false
    for(var attr in json) {
      var cur = 0
      // 颜色渐变要特殊处理
      if(attr === 'opacity') {
        cur = Math.round(parseFloat(getStyle(obj, attr)) * 100)
      }
      else {
        cur = parseInt(getStyle(obj, attr))
      }
      // 到达目标才清除定时器
      if (cur === json[attr]) {
        stop = true
      }

      var speed = (json[attr] - cur) / 6
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
      if(attr === 'opacity') {
        obj.style.filter = 'alpha(opacity:' + (cur + speed) + ')'
        obj.style.opacity = (cur + speed) / 100
      }
      else {
        obj.style[attr] = cur + speed + 'px'
      }
    }

    if (stop) {
      clearInterval(obj.timer)
      if (cb) cb()
    }
  }, 30)
}


/**
 * 图片资源预加载
 *
 * @param {Array}    resourceArr
 * @param {function} cb
 */
function preLoading(resourceArr, cb) {
  var i = 0
  var len = resourceArr.length
  each(resourceArr, function (val, index) {
    var img = new Image()
    img.onload = function () {
      i++
      if (i == len && cb) {
        cb(val)
      }
    }
    img.onerror = function () {
      if (cb) cb(val)
    }

    img.src = url
  })
}


/**
 * mini $
 *
 * @param  {string} selector     选择器
 * @return {Array.<HTMLElement>} 返回匹配的元素列表
 */
function $(selector) {
  // (1).从后往前找，先将最后那个选择器经 find 找到。即传入参数(最后那个选择器字符串)给 direct，direct
  // 用下面几个正则匹配该选择器，归类，解析字符串并分配相应的 fn，然后执行 actions[fn]，凡是符
  // 合 actions[fn] 规则的，都添加到一个数组里并返回，如果只有一个选择器则不进行 filterParents。

  // (2).如果 selector 不止一个，那么将要用到 filterParents 来过滤父节点了，实际上它是用于过滤
  // 由 (1) 得到的元素，向上找直到找到 break 或找不到为止(null)，通过 matches 来决定是否保留该元素。

  // (3).在 filterParents 中，它有自己的 actions[fn] 规则，用于匹配已收集元素的父节点。actions
  // 和正在遍历的父节点一同传入给 direct，由其执行，满足匹配规则的，则放入"保留"数组，否则剔除该元素，
  // 即 (1) 匹配到的元素，通过不断递归筛选，最终返回剩下的元素。
  var idReg = /^#([\w_\-]+)/
  var classReg = /^\.([\w_\-]+)/
  var tagReg = /^\w+$/i
  var attrReg = /(\w+)?\[([^=\]]+)(?:=(["'])?([^\]"']+)\3?)?\]/

  var context = document
  function blank() {}

  function direct(part, actions) {
    // part 为当前待匹配的选择器
    // 此函数只负责筛选选择器数据然后执行 actions 对应的 fn 命令
    actions = actions || {
      id: blank,
      className: blank,
      tag: blank,
      attribute: blank
    }
    var fn
    // 取第二个参数之后的参数, 待匹配的父元素...
    var params = [].slice.call(arguments, 2)
    // id
    if (result = part.match(idReg)) {
      fn = 'id'
      // 不要#，只取id名
      params.push(result[1])
    }
    // class
    else if (result = part.match(classReg)) {
      fn = 'className'
      params.push(result[1])
    }
    // tag
    else if (result = part.match(tagReg)) {
      fn = 'tag'
      params.push(result[0])
    }
    // attribute
    else if (result = part.match(attrReg)) {
      fn = 'attribute'
      // div[data-type="2"]
      var tag = result[1]
      var key = result[2]
      var value = result[4]
      params.push(tag, key, value)
    }

    return actions[fn].apply(null, params)
  }

  function filterParents(parts, ret) {
    var parentPart = parts.pop()
    var result = []
    var actions = {
      id: function (el, id) {
        return (el.id === id)
      },
      className: function (el, className) {
         return hasClass(el, className)
      },
      tag: function (el, tag) {
        return (el.tagName.toLowerCase() === tag)
      },
      attribute: function (el, tag, key, value) {
        var valid = true
        if (tag) {
          valid = actions.tag(el, tag)
        }
        valid = valid && el.hasAttribute(key)
        if (value) {
          valid = valid && (value === el.getAttribute(key))
        }
        return valid
      }
    }

    for (var i = 0, len = ret.length; i < len; i++) {
      var node = ret[i]
      var p = node
      // 一直往上找，直到找到或者 null 为止
      while (p = p.parentNode) {
        var matches = direct(parentPart, actions, p)
        if (matches) {
          break
        }
      }

      if (matches) {
        // 将匹配选择器的元素继续递归筛选，上一级元素找到(存在)的，ret[i] 可以保留
        result.push(node)
      }
    }

    // 还有父级，继续递归往上找，result 作为此次匹配到的元素
    return parts[0] && result[0] ? filterParents(parts, result) : result
  }

  function find(parts, context) {
    var part = parts.pop()
    var actions = {
      id: function (id) {
        return [
          document.getElementById(id)
        ]
      },
      className: function (className) {
        var result = []
        if (context.getElementsByClassName) {
          result = context.getElementsByClassName(className)
        } else {
          var temp = context.getElementsByTagName('*')
          for (var i = 0, len = temp.length; i < len; i++) {
            var node = temp[i]
            if (hasClass(node, className)) {
              result.push(node)
            }
          }
        }
        return result
      },
      tag: function (tag) {
        return context.getElementsByTagName(tag)
      },
      attribute: function (tag, key, value) {
        var result = []
        var temp = context.getElementsByTagName(tag || '*')
        for (var i = 0, len = temp.length; i < len; i++) {
          var node = temp[i]
          if (value) {
            var v = node.getAttribute(key);
            (v === value) && result.push(node)
          } else if (node.hasAttribute(key)) {
            // 只传了键，没传值值
            result.push(node)
          }
        }
        return result
      }
    }

    var ret = direct(part, actions)

    // to array
    ret = [].slice.call(ret)
    // 前面没有选择器或者此次找不时直接返回，id 也需要 ret[0] 获取
    return parts[0] && ret[0] ? filterParents(parts, ret) : ret
  }

  // 没有考虑 > + ~ 等嵌套关系，只有空格
  var result = find(selector.split(/\s+/), context)
  return result
}



/**
 * ================== Event ==========================
 */

function addEvent(element, event, listener, boolean) {
  var delegate = boolean ? true : false
  var event = event.replace(/^on/i, '').toLowerCase()
  if (element.addEventListener) {
    element.addEventListener(event, listener, delegate)
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, listener, delegate)
  } else {
    // 几乎都支持标准写法了，下面这句可以去掉
    element['on' + event] = listener
  }
}


function removeEvent(element, event, listener, boolean) {
  var delegate = boolean ? true : false
  var event = event.replace(/^on/i, '').toLowerCase()
  if (element.removeEventListener) {
    // 不能移除匿名函数，需要移除已注册具名的回调才生效
    element.removeEventListener(event, listener, delegate)
  } else if (element.detachEvent) {
    element.detachEvent('on' + event, listener)
  } else {
    element['on' + event] = null
  }
}


function delegateEvent(element, tag, eventName, listener) {
  addEvent(element, eventName, function (ev) {
    var target = ev.target || ev.strElement
    // target.tagName 是大写的
    if (target.localName === tag.toLowerCase()) {
      listener.call(target, ev)
    }
  }, true)
}


/**
 * 兼容性绑定滚轮事件
 *
 * @param {Object} element
 * @param {Function} listener
 */
function mouseScroll (element, listener) {
  if (navigator.userAgent.search('Firefox') !== -1) {
    // FireFox
    addEvent(element, 'DOMMouseScroll', listener)
  } else {
    addEvent(element, 'mousewheel', listener)
  }
}


/**
 * 获取pc或移动端的触摸或点击事件名
 *
 * @returns {Array} [Description]
 */
function getDeviceTouch () {
  var isMobile = /Mobile/i.test(navigator.userAgent)
  if (isMobile) {
    return ['touchstart', 'touchmove', 'touchend']
  }

  return ['mousedown', 'mousemove', 'mouseup']
}



/**
 * ================== BOM ==========================
 */

// 判断是否为IE浏览器，返回-1或者版本号
function isIE() {
  return /msie ([\d\.]+)/i.test(navigator.userAgent) ? document.documentMode : -1
}


// Cookie 索引键是否有效
function isValidCookieName(cookieName) {
    // http://www.w3.org/Protocols/rfc2109/rfc2109
    // Syntax:  General
    // The two state management headers, Set-Cookie and Cookie, have common
    // syntactic properties involving attribute-value pairs.  The following
    // grammar uses the notation, and tokens DIGIT (decimal digits) and
    // token (informally, a sequence of non-special, non-white space
    // characters) from the HTTP/1.1 specification [RFC 2068] to describe
    // their syntax.
    // av-pairs   = av-pair *(";" av-pair)
    // av-pair    = attr ["=" value] ; optional value
    // attr       = token
    // value      = word
    // word       = token | quoted-string

    // http://www.ietf.org/rfc/rfc2068.txt
    // token      = 1*<any CHAR except CTLs or tspecials>
    // CHAR       = <any US-ASCII character (octets 0 - 127)>
    // CTL        = <any US-ASCII control character
    //              (octets 0 - 31) and DEL (127)>
    // tspecials  = "(" | ")" | "<" | ">" | "@"
    //              | "," | ";" | ":" | "\" | <">
    //              | "/" | "[" | "]" | "?" | "="
    //              | "{" | "}" | SP | HT
    // SP         = <US-ASCII SP, space (32)>
    // HT         = <US-ASCII HT, horizontal-tab (9)>

    return (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24'))
        .test(cookieName)
}


function setCookie(cookieName, cookieValue, expiredays) {
  if (!isValidCookieName(cookieName)) {
    return
  }

  var expires
  if (expiredays != null) {
    expires = new Date()
    expires.setTime(expires.getTime() + expiredays * 24 * 60 * 60 * 1000)
  }

  document.cookie =
    cookieName + '=' + encodeURIComponent(cookieValue)
    + (expires ? '; expires=' + expires.toUTCString() : '')
}


function getCookie(cookieName) {
  if (isValidCookieName(cookieName)) {
    // \x24 == $，注意：cookie分割是以 ' ;' 分割的，而开头和尾直接为空
    var reg = new RegExp('(^| )' + cookieName + '=([^;]*)(;|\x24)')
    var result = reg.exec(document.cookie)
    if (result) {
      return result[2] || null
    }
  }

  return null
}


function removeCookie (cookieName) {
  setCookie(cookieName, 'a', -1)
}



/**
 * ================== Ajax、jsonp ==========================
 */

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
  extend(opt, options)
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
      xhr.setRequestHeader('Content-Type', opt.contentType);
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
  var callbackName = getRndName('jsonp_')
  window[callbackName] = onsuccess
  var script = getAndSetScript(url + '&callback=' + callbackName, charset)
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
 * ================== random ==========================
 */

/**
 * [getRndName 获取一个随机的5位字符串]
 * @param  {[type]} prefix [description]
 *
 * @return {String}        [prefix + 5位字符串]
 */
function getRndName(prefix) {
  return prefix + Math.random().toString(36).replace(/[^a-z]/g, '').substr(0, 5)
}

/**
 * 随机 rgb 颜色
 *
 * @returns {string}
 */
function getRandomColor () {
  var r = Math.floor(Math.random() * 256)
  var g = Math.floor(Math.random() * 256)
  var b = Math.floor(Math.random() * 256)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}
