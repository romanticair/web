/******************************************
* 简单封装常对元素节点、文本节点、属性节点进行
* 操作的 api
******************************************/

var wrap = (function () {
  /**
   * 获取元素父节点，类名和标签名元素列表默认访问第一个
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   */
  function parentNode(str) {
    var el = typeof str === "string" ? $(str) : str
    // IE el.parentElement
    return el.length ? el[0].parentNode : el.parentNode
  }

  /**
   * 获取元素下第一个子元素节点
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   */
  function firstChildNode(str) {
    var el = typeof str === "string" ? $(str) : str
    // firstChild 包含文本节点
    return el.length ? el[0].firstElementChild : el.firstElementChild
  }

  /**
   * 获取元素下最后一个子元素节点
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   */
  function lastChildNode(str) {
    var el = typeof str === "string" ? $(str) : str
    // lastChild 包含文本节点
    return el.length ? el[0].lastElementChild : el.lastElementChild
  }

  /**
   * 获取元素前一个兄弟元素节点
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   */
  function prevNode(str) {
    var el = typeof str === "string" ? $(str) : str
    // previousSibling 包含文本节点
    return el.length ? el[0].previousElementSibling : el.previousElementSibling
  }

  /**
   * 获取元素下一个兄弟元素节点
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   */
  function nextNode(str) {
    var el = typeof str === "string" ? $(str) : str
    // nextSibling 包含文本节点
    return el.length ? el[0].nextElementSibling : el.nextElementSibling
  }

  /**
   * 获取元素所有兄弟元素节点
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @return {Array}
   */
  function siblingNodes(str) {
    var el = typeof str === "string" ? $(str) : str
    el = el.length ? el[0] : el
    var childArr = childNodes(parentNode(el), true)
    var length = childArr.length
    var siblingsArr = []
    if (length > 1) {
      for (var i = 0; i < length; i++) {
        if (childArr[i] === el) {
          continue
        } else {
          siblingsArr.push(childArr[i])
        }
      }
    }

    return siblingsArr
  }

  /**
   * 获取元素下所有子节点或仅元素节点
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {boolean} tag 是否包含元素下的文本节点
   */
  function childNodes(str, tag) {
    tag = typeof tag === 'boolean' ? tag : false
    var el = typeof str === "string" ? $(str) : str
    if (el.length) {
      // el.childNodes 包括文本节点对象
      return tag ? el[0].children : el[0].childNodes
    } else {
      return tag ? el.children : el.childNodes
    }
  }

  /**
   * 创建新节点，在元素子集合里将新节点追加到尾部或添加到头部
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string} tagName 要创建的标签名
   * @param {string} msg 新建标签名下的文本节点 | 元素和文本节点并存
   * @param {boolean} head 是否追加到头部
   * @param {boolean} tag 是否使元素、属性、文本节点并存
   */
  function addNode(str, tagName, msg, head, tag) {
    var el = typeof str === "string" ? $(str) : str
    var newNode = document.createElement(tagName.trim())
    head = typeof head === 'boolean' ? head : false
    tag = typeof tag === 'boolean' ? tag : true
    el = el.length ? el[0] : el
    if (msg) {
      if (tag) {
        newNode.innerHTML = msg
      } else {
        newNode.innerText = msg
      }
    }

    if (head) {
      el.insertBefore(newNode, firstChildNode(el))
    } else {
      el.appendChild(newNode)
    }
  }

  /**
   * 删除元素下符合条件的元素节点，一个参数则表示全删
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string} nodeName 指定标签名的约束条件
   * @param {number} nth 指定索引的约束条件
   */
  function delNode(str, nodeName, nth) {
    var children = childNodes(str, true)
    if (nth && children.length > 0) {
      for (var i = 0, n = 1; i < children.length; i++) {
        if (children[i].localName === nodeName) {
          if (n === nth) {
            // 找到了
            parentNode(children[i]).removeChild(children[i])
            break
          }
          n++
        }
      }

      return
    }

    // 不能在循环里面直接删，会导致索引变更
    var delArr = []
    for (var i = 0; i < children.length; i++) {
      if (!nodeName) {
        delArr.push(children[i])
      } else if (children[i].localName === nodeName) {
        // or nodeName 该方法返回的都是大写的
        delArr.push(children[i])
      }
    }

    delArr.forEach(function (value) {
      parentNode(value).removeChild(value)
    })
  }

  /**
   * 修改元素的文本节点
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string} msg 文本内容
   */
  function editText(str, msg) {
    var el = typeof str === "string" ? $(str) : str
    if (el.length) {
      // 或许 document.createTextNode(msg) 更好?
      el[0].innerText = msg
    } else {
      el.innerText = msg
    }
  }

  /**
   * 替换元素的元素节点
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string|object} node string 类型可传入 [类名|ID名|标签名]
   * @param {string} msg 替换元素的文本内容
   */
  function replaceNode(str, node, msg) {
    var el = typeof str === "string" ? $(str) : str
    var newEl = typeof node === "string" ? document.createElement(node.trim()) : node
    if (msg) {
      editText(newEl, msg)
    }
    if (el.length) {
      parentNode(el[0]).replaceChild(newEl, el[0])
    } else {
      parentNode(el).replaceChild(newEl, el)
    }
  }

  /**
   * 克隆元素节点，并将其追加到另一个元素上
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string|object} to  string 类型可传入 [类名|ID名|标签名]
   */
  function cloneNodeTo(str, to) {
    var el = typeof str === "string" ? $(str) : str
    var toEl = typeof to === "string" ? $(to) : to
    // true 表示深度复制
    var aNode = el.length ? el[0].cloneNode(true) : el.cloneNode(true)
    toEl.length ? toEl[0].appendChild(aNode) : toEl.appendChild(aNode)
  }

  /**
   * 获取元素属性值
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string} attr 属性名
   */
  function getAttr(str, attr) {
    var el = typeof str === "string" ? $(str) : str
    // el.attributes
    return el.length ? el[0].getAttribute(attr) : el.getAttribute(attr)
  }

  /**
   * 设置元素自定义属性值
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {object} item 属性键值对
   */
  function setAttr(str, item) {
    var el = typeof str === "string" ? $(str) : str
    el = el.length ? el[0] : el
    for (var key in item) {
      // or document.createAttribute(key)
      // 自定义属性若包含样式，DOM 样式是不会生效的
      el.setAttribute(key, item[key])
    }
  }

  /**
   * 摘除元素指定的类名
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string} name 待摘除的类名
   */
  function removeClass(str, name) {
    var el = typeof str === "string" ? $(str) : str
    el = el.length ? el[0] : el
    if (el.classList.contains(name)) {
      el.classList.remove(name)
    }
  }

  /**
   * 添加元素指定的类名
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string} name 待添加的类名
   */
  function addClass(str, name) {
    var el = typeof str === "string" ? $(str) : str
    el = el.length ? el[0] : el
    if (!el.classList.contains(name)) {
      // or className + ' newClassName' 字符串追加
      el.classList.add(name)
    }
  }

  /**
   * 切换元素指定的类名
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string} name 待切换的类名
   */
  function toggleClass(str, name) {
    var el = typeof str === "string" ? $(str) : str
    el = el.length ? el[0] : el
    if (el.classList.contains(name)) {
      el.classList.remove(name)
    } else {
      el.classList.add(name)
    }
  }

  /**
   * 获取元素的行内样式属性值
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {string} attr 样式属性名
   */
  function getStyle(str, attr) {
    var el = typeof str === "string" ? $(str) : str
    el = el.length ? el[0] : el
    // el.style[attr] 获取到的值是行内样式
    return el.style[attr]
  }

  /**
   * 设置元素的行内样式属性值
   *
   * @param {string|object} str string 类型可传入 [类名|ID名|标签名]
   * @param {object} obj 样式属性键值
   */
  function setStyle(str, obj) {
    var el = typeof str === "string" ? $(str) : str
    el = el.length ? el[0] : el
    // el.style.* 只能设置行内样式
    for (var key in obj) {
      el.style[key] = obj[key]
    }
  }

  function $(str) {
    str = str ? str.trim() : ''
    if (!str) {
      return false
    }
    var tag = str.charAt(0)
    var name = str.substr(1)
    switch(tag) {
      case '#':
        return document.getElementById(name)
        break
      case '.':
        return document.getElementsByClassName(name)
        break
      default:
        return document.getElementsByTagName(str)
    }
  }

  return {
    parentNode: parentNode,
    firstChildNode: firstChildNode,
    lastChildNode: lastChildNode,
    prevNode: prevNode,
    nextNode: nextNode,
    siblingNodes: siblingNodes,
    childNodes: childNodes,
    addNode: addNode,
    delNode: delNode,
    editText: editText,
    replaceNode: replaceNode,
    cloneNodeTo: cloneNodeTo,
    getAttr: getAttr,
    setAttr: setAttr,
    removeClass: removeClass,
    addClass: addClass,
    toggleClass: toggleClass,
    getStyle: getStyle,
    setStyle: setStyle,
    $: $
  }
})()
