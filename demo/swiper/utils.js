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

function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}


// 简单判断是否为window对象或DOM对象之一，返回一个bool值
function isElement(arg) {
  var s = Object.prototype.toString.call(arg)
  return s.indexOf("[object HTML") !== -1 || s.indexOf("[object Window]") !== -1
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
}


/**
 * mini $
 *
 * @param  {string} selector     选择器
 * @return {Array.<HTMLElement>} 返回匹配的元素列表
 */
function $(selector) {
  if (isElement(selector)) {
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
}


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
  addEvent(element, eventName, function (event) {
    var target = event.target || event.srcElement
    var arr = isArray(tag) ? tag : [tag]
    each(arr, function (t) {
      // target.tagName 是大写的
      if (target && target.tagName === t.toUpperCase()) {
        listener.call(target, event)
      }
    })
  }, true)
}


$.on = function (selector, event, listener) {
  return addEvent($(selector), event, listener)
}

$.un = function (selector, event, listener) {
  return removeEvent($(selector), event, listener)
}

$.click = function (selector, listener) {
  return addEvent($(selector), 'click', listener)
}

$.delegate = function (selector, tag, event, listener) {
  return delegateEvent($(selector), tag, event, listener)
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
