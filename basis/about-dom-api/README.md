# 封装 DOM 操作

> DOM 将文档(页面结构)表示成一棵将树，树由元素节点，属性节点，文本节点组成，而 <html> 即是树的根。BOM 顶级窗口 window 包含了 document 属性，可以理解为 BOM 包含了 DOM，她就是代表了当前页面的 HTMLDocument 对象，因此可以通过她来操作文档内容和结构。
>
> 注意：操作节点时务必要降低性能开销问题。

[MDN Web API 参考文档](https://developer.mozilla.org/zh-CN/docs/Web/Reference/API)
[示例源码](https://developer.mozilla.org/zh-CN/docs/Web/Reference/API)

<br/>

## 关于 DOM  的几个知识点

> 访问节点时，可以遍历节点组，依据以下三个 nodeType 来匹配所需的节点类型。鉴于现代浏览器都提供了更便利的 API，所以下面的节点访问都是利用直接作用于元素节点的接口。

- nodeType 1 表示元素节点
- nodeType 2 表示属性节点
- nodeType 3 表示文本节点
- DOM 操作主要是对三大节点进行 **添加、删除、修改、替换**。其中就涉及了节点的访问操作，包括了访问子节点、父节点、兄弟节点、文本节点、属性节点等。

> 下面的示例仅包含上面所谈到的知识点。

<br/>

## getElement 接口 $

该接口便利于我们通过 **[类名|ID名|标签名]** 直接获取相匹配的节点对象

```js
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
```

<br/>

## 关系型节点访问接口

> 关系型在这里表示为在 DOM 树中沿树枝，树叶，上下左右方向访问的意思。

```js
var el = typeof str === "string" ? $(str) : str
```

这段代码在每个访问接口都需求到，即传入 **[类名|ID名|标签名|DOM object]** 都可以，下面拿访问父级节点(向上访问只能是元素节点)来说。

```js
function parentNode(str) {
  var el = typeof str === "string" ? $(str) : str
  // IE el.parentElement
  return el.length ? el[0].parentNode : el.parentNode
}
```
对，如你所见，这里 ***封装***  的很多的接口都是类似的，只是目标不同，所以拿几个献丑就够了!

<br/>

```js
function firstChildNode(str) {
  var el = typeof str === "string" ? $(str) : str
  // firstChild 包含文本节点
  return el.length ? el[0].firstElementChild : el.firstElementChild
}
```

之前对浏览器提供的关系型节点访问 API 一直分不清楚，现在也记不清，所以...，发挥烂笔头的用处吧，区分开哪个 `api name` 会包含元素节点或同时文本节点。结果发现子节点 `children` 和父节点 `parentNode` 特殊点(元素节点)，含 `*Nodes` 与 `*Child` 的几乎都是包括文本节点的。而含 `*Element*` 都是元素节点，于是我将它们都改成了纯元素节点接口。

***`lastElementChild previousElementSibling nextElementSibling` 三个都是访问元素节点的，感觉还是不好记，易混淆。***

<br/>

## 节点操作

来看一个不实用的添加节点的接口，其功能是创建一新节点，然后在给定元素的子集合里将新节点追加到尾部或添加到头部。

```js
/**
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
      // '<code>Be happy.</code>' print as string.
      newNode.innerText = msg
    }
  }

  if (head) {
    el.insertBefore(newNode, firstChildNode(el))
  } else {
    el.appendChild(newNode)
  }
}

addNode('#ad', 'h3', '<strong>买十送零活动</strong>', true)
addNode('.box', 'div', 'add <div></div> string', false, false)
```

<br/>

此函数功能为删除给定元素下符合条件的元素节点，传一个参数则表示全删。条件可以是指定要删除的标签名和删除第几个。有几个自定义的接口，看名字就可以知道她是能干嘛的，如 `childNodes`。

```js
/**
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

delNode('#msg', 'div', 3)  // 将ID为msg元素下的第三个 div 删掉
delNode('#msg', 'div')  // 将ID为msg元素下 div 全删掉
```

<br/>

## 属性节点操作

直接上代码，看注释吧!

```js
/**
 * 设置元素自定义属性值
 * @param {object} item 属性键值对
 */
function setAttr(str, item) {
  var el = typeof str === "string" ? $(str) : str
  el = el.length ? el[0] : el
  for (var key in item) {
    // or document.createAttribute(key) 创建属性节点添加
    // 自定义属性若包含样式，DOM 样式是不会生效的
    el.setAttribute(key, item[key])
  }
}
```

```js
/**
 * 添加元素指定的类名
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
```

The last one.

```js
/**
 * 设置元素的行内样式属性值
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

setStyle('.wrapper', {color: 'pink', opacity: '0.5'})
```

<br/>

以上所记录的只是浏览器提供的 API 里的冰山一角，无法在这儿一一列举，我们只需认识到她们大多都能够一针见血，有着 `WYSIWYG` 神话般的效果，待需要时，再现学现用就好啦。

<br/>

End.

若有不足，还请高人指教。
