var type = require('./type.js')
var isElement = type.isElement
var isArray = type.isArray


/**
 * 兼容性获取元素样式
 *
 * @param {object} ele
 * @param {string} attr 
 */
function getStyle(ele, attr) {
  if (ele.style[attr]) {
    return ele.style[attr]
  } else if (ele.currentStyle) {
    // lt IE8
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
    // lt IE8
    ev.returnValue = false
  } else {
    ev.preventDefault()
  }
  // or
  return false
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
function getElementViewportPosition(element) {
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
      } else {
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

      } else {
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
  if (isElement(selector)) {
    // 方便 $($dom) $(dom)
    return selector
  }
  
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

  // 复数和单数可切换，找不时这里设置成返回 null 而不是空 Array
  // return result.length > 0 ? result[0] :
    // result.length === 0 ? null : result
}




/**
 * ================== Event ==========================
 */

// 为了便于查找绑定过的事件，增加了一级命名空间
$.event = {
  listeners: []
}

$.event.addEvent = function(element, type, listener, boolean) {
  type = type.replace(/^on/i, '').toLowerCase()
  var delegate = boolean ? true : false
  var lsn = $.event.listeners

  var realListener = function (ev) {
    if (typeof listener === 'function') {
      listener.call(element, ev)
    }
  }

  if (element.addEventListener) {
    element.addEventListener(type, realListener, delegate, boolean)
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, realListener)
  } else {
    // 几乎都支持标准写法了，下面这句也可以去掉
    element['on' + type] = realListener
  }

  lsn[lsn.length] = [element, type, listener, realListener]
  return element
}

$.event.removeEvent = function(element, type, listener, boolean) {
  type = type.replace(/^on/i, '').toLowerCase()
  var delegate = boolean ? true : false
  var lsn = $.event.listeners
  var len = lsn.length

  while (len--) {
    var item = lsn[len]
    var isRemoveAll = !listener
    // listener存在时，移除element的所有以listener监听的type类型事件
    // listener不存在时，移除element的所有type类型事件
    if (item[1] === type
      && item[0] === element
      && (isRemoveAll || item[2] === listener)) {
        var realListener = item[3]
        if (element.removeEventListener) {
          element.removeEventListener(type, realListener, delegate, boolean)
        } else if (element.detachEvent) {
          element.detachEvent('on' + type, realListener)
        }

        lsn.splice(len, 1)
    }
  }

  return element
}

$.event.delegateEvent = function(element, tag, eventName, listener) {
  $.event.addEvent(element, eventName, function (ev) {
    var event = ev || window.event
    var target = event.target || event.srcElement
    var arr = isArray(tag) ? tag : [tag]

    each(arr, function (t) {
      if (target && target.tagName === t.toUpperCase()) {
        listener.call(target, event)
      }
    })
  }, true)
}

$.event.addEnterEvent = function(element, listener) {
  return $.event.addEvent(element, 'keypress', function (ev) {
    var event = ev || window.event
    var code = event.which || event.keyCode
    
    if (code === 13) {
      listener.call(element, event)
    }
  })
}


$.on = function (selector, event, listener) {
  return $.event.addEvent($(selector), event, listener)
}

$.click = function (selector, listener) {
  return $.event.addEvent($(selector), 'click', listener)
}

$.enter = function (selector, listener) {
  return $.event.addEnterEvent($(selector), listener)
}

$.un = function (selector, event, listener) {
  return $.event.removeEvent($(selector), event, listener)
}

$.delegate = function (selector, tag, event, listener) {
  return $.event.delegateEvent($(selector), tag, event, listener)
}
