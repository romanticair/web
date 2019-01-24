# 读 javascript 忍者秘籍

> 本文是作者阅读 javascript 忍者秘籍这本书过程中所记录零散知识和学习的一部分，也相当于收录一下个人认为简洁有趣的代码吧。

> 我很喜欢这本书，客观地说，它能够将文字和代码完美结合，表现出一种紧凑、凝练很简洁，知识多、用法巧且易懂的效果，为我在前端行走地道路上扫掉了很多盲点，同时也开拓了解决问题的思路。



## 一、性能分析

将我们编写出来的代码进行时间性能测试，计算出执行该业务函数所需的时间成本。另外还有 `console.profile` 测试，该 api 提供的信息和分析入手点更多。下面是一个简单测试参数 `fn` 函数的执行时间，执行完后输出执行所消耗的时间。

[Console 相关API](https://developer.mozilla.org/zh-CN/docs/Web/API/Console)

```js
function timer(fn, arg) {
  console.time(fn.name + ' PT')
  fn(arg)
  console.timeEnd(fn.name + ' PT')
}
```



## 二、递归遍历 DOM 节点树

参数一 `ele` 是根节点，以该节点为起始点向下遍历所有子节点。参数二 `fn` 是个函数，在遍历节点树中为每个节点调用该函数一次，至于函数要对该节点动什么手脚，取决于你要传入的函数。

```js
function traverseDOM(ele, fn) {
  // 处理当前节点
  fn(ele)
  ele = ele.firstElementChild
  while (ele) {
    traverseDOM(ele, fn)
    ele = ele.nextElementSibling
  }
}
```



下面也是一个拥有同样功能的函数，每调用它一次都会获得一个返回值直至无生成值产生，我们通常将这类函数称为生成器，即调用时计算一次并返回该值，而不是一次性将整个仓库丢给你。我们可以通过`DOMTraversal.next().value` 不断获取下一个生成的值，直到最后一个返回值 `undefined` 出现。

该函数只接收一个参数 `ele`，即根节点。从该节点开始向下遍历所有子节点，每调用一次返回一个节点，所以需要外部调用该生成器并接受其返回值。如果要为根节点下所有子节点调用一函数，比如 `fn`，则需要在外部遍历生成器的同时将生成器返回的节点作为遍历体中 `fn` 函数的参数即可。

[yield* 语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield*)

```js
function* DOMTraversal(ele) {
  yield ele
  ele = ele.firstElementChild
  while (ele) {
    // yield* 将迭代控制转移到另一个 DOMTraversal 生成器上
    yield* DOMTraversal(ele)
    ele = ele.nextElementSibling
  }
}
```




## 三、Promise
### 实现异步获取服务器数据

异步处理 `ajax` 请求，如果该承诺成功兑现，`resolve` 函数将会改变 `Promise` 对象的状态，并将成功的结果作为`then` 第一参数（onResolved 函数）的参数，即我们获取请求数据后要如何处理这些数据的一个函数。如果失败，通过 `reject` 函数改变状态，同样将失败原因作为 `catch` 第一参数的参数（如果有的话），也可以在 `then` 的第二参数实现该失败处理函数。

[Promise 相关API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

```js
function getJSON(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.onload = () => {
      try {
        if (this.status === 200) {
          resolve(JSON.stringify(this.response))
        } else {
          reject(this.status + ' ' + this.responseText)
        }
      } catch (e) {
        reject(e.message)
      }
    }

    request.onerror = () => {
      reject(this.status + ' ' + this.responseText)
    }

    request.send()
  })
}

getJSON('data/ninjas.json')
  .then(ninjas => {
    assert(ninjas !== null, 'Ninjas obtained')
  })
  .catch(e => {
    console.log('Something wrong.')
  })
  
// 链式调用 Promise，每个 then 都会返回一个 Promise 对象，该对象拥有上一个 Promise 对象的结果和状态
getJSON('data/ninjas.json')
  .then(ninjas => getJSON([ninjas[0].missionsUrl]))
  .then(missions => getJSON([missions[0].detailUrl]))
  .then(mission => assert(mission !== null, 'Ninjas mission obtained'))
  .catch(e => {
    console.log('Something wrong.')
  })
```



## 四、了解 setPrototypeOf defineProperty API

### setPrototypeOf

[Object 相关API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

```js
const yoshi = { skulk: true}
const hattori = { sneak: true}
const kuma = { creep: true}

assert('skulk' in yoshi, 'Yoshi can skulk')
assert('sneak' in hattori, 'hattori can skulk')

// 将对象 hattori 设置为 yoshi 对象的原型，即改变了 yoshi 的原型指向
Object.setPrototypeOf(yoshi, hattori)
assert('sneak' in yoshi, 'yoshi can skulk')
assert(!('creep' in hattori), 'hattori can not skulk')

Object.setPrototypeOf(hattori, kuma)
assert('creep' in hattori, 'hattori can skulk')
assert('creep' in yoshi, 'yoshi alse can skulk')
```



### defineProperty

```js
let ninja = {}
ninja.weapon = 'kusarigama'

// 为 ninja 对象自定义 sneaky 属性的规则，可以约束遍历、写读等操作
Object.defineProperty(ninja, 'sneaky', {
  configurable: false,
  enumerable: false,
  value: true,
  writable: true
})

assert('sneaky' in ninja, 'We can access the new property.')
for (let prop in ninja) {
  assert(prop != undefined, 'An enumerated property: ' + prop)
}

// 继承，解决 constructor 属性被覆盖的问题
function Food() {}
Food.prototype.sugar = function () {}

function Melon() {}
Melon.prototype = new Food()
// 继承链时不建议使用 Melon.prototype = Food.prototype
// 因为 Food 原型上发生的变化都会同步到 Melon 原型上

// 定义一个新的不可枚举的 constructor 属性，属性值为 Food 对象，避免被覆盖
// 不设置的话，constructor 指向仍为 Melon
Object.defineProperty(Melon.prototype, 'constructor', {
  enumerable: false,
  value: Food,
  writable: true
})

let melon = new Melon()
assert(melon.constructor === Food, 'restablished!')

for (let prop in Melon.prototype) {
  assert(prop === 'sugar', 'the only enumerate property is sugar!')
}
```



## 五、了解 getter 和 setter

对读取、设置对象属性值作出一定的约束，符合规则才能获取或修改。

```js
const ninjiaCollection = {
  ninjas: ['Yoshi', 'Kuma', 'Hattori'],
  // es6 class 中也可以做出同样的约束，而且语法相同
  get firstNinja() {
    console.log('Getting firstNinja')
    return this.ninjas[0]
  },
  set firstNinja(val) {
    console.log('Setting firstNinja')
    this.ninjas[0] = val
  }
}

assert(ninjiaCollection.firstNinja === 'Yoshi', 'Yoshi is the first ninja')
ninjiaCollection.firstNinja = 'Hachi'
assert(ninjiaCollection.firstNinja === 'Hachi' && ninjiaCollection.ninjas[0] === 'Hachi', 'Now Hachi is the first ninja')

// or 用 defineProperty 定义 getter、setter
function Ninja() {
  let _skillLevel = 0
  Object.defineProperty(this, 'skillLevel', {
    get: () => {
      console.log('Getting firstNinja')
      return _skillLevel
    },
    set: val => {
      console.log('Setting firstNinja')
      _skillLevel = val
    }
  })
}

const ninja = new Ninja()
assert(typeof ninja._skillLevel === undefined, 'Cannot access a private property')
assert(ninja.skillLevel === 0, 'The getter works fine!')
ninja.skillLevel = 10
assert(ninja.skillLevel === 10, 'The value was updated')
```



## 六、代理 Proxy

### 控制对另一个对象属性的访问

[Proxy Doc](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

```js
// 类似的，只是这次为通过代理约束。
const emperor = {name: 'Komei'}
const representative = new Proxy(emperor, {
  get: (target, key) => {
    console.log('Reading ' + key + ' through a proxy')
    return key in emperor ? target[key] : 'Do not bother the emperor!'
  },
  set: (target, key, value) => {
    console.log('Writing ' + key + ' through a proxy')
    target[key] = value
  }
})

assert(emperor.name === 'Komei', 'name is Komei')
assert(representative.name === 'Komei', 'get the name property through a proxy')
assert(emperor.nickname === undefined, 'emperor does not have a nickname')
assert(representative.nickname === 'Do not bother the emperor!', 'The proxy jumps in when we make inproper requests')

representative.nickname = 'Tenno'
assert(emperor.nickname === 'Tenno', 'emperor does not have a nickname')
assert(representative.nickname === 'Tenno', 'The nickname is alse accesible through the proxy')
```



### 实现数组负索引功能

Python 的列表可以通过 `list[-1]` 访问最后一个，`list[-2]` 访问倒数第二个，甚至 `list[1:]` 切片技术截取从索引 1 到最后一个。这里简单实现了数组的负索引，至于切片效果，通过 `array.slice(1, array.length)` 进行获取，大体也差不多的。

```js
function createNegativeArrayProxy(array) {
  if (!Array.isArray(array)) {
    throw new TypeError('Expected an array')
  }

  return new Proxy(array, {
    get: (target, index) => {
      index = +index
      return target[index < 0 ? target.length + index : index]
    },
    set: (target, index, val) => {
      index = +index
      return target[index < 0 ? target.length + index : index] = val
    }
  })
}

const ninjas = ['Yoshi', 'Kuma', 'Hattori']
const proxiedNinjas = createNegativeArrayProxy(ninjas)
assert(proxiedNinjas[0] === 'Yoshi', 'found')
assert(proxiedNinjas[2] === 'Hattori', 'found')
assert(proxiedNinjas[-1] === 'Hattori', 'found')
assert(proxiedNinjas[-2] === 'Kuma', 'found')
assert(proxiedNinjas[-3] === 'Yoshi', 'found')
```



## 七、了解 Map And Set

### map

根据键获取键对应的值，这里不同于 {} 对象，Map 的键甚至可以是对象和特殊值，而不仅限于字符串。下面为建立一字典容器，设置键值对，获取键值，容器大小，以及删除已有键值对和清空整个容器。

[Map 相关API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)

```js
const ninjaIslandMap = new Map()
const ninjas1 = {name: 'Yoshi'}
const ninjas2 = {name: 'Hattori'}
const ninjas3 = {name: 'Kuma'}
ninjaIslandMap.set(ninjas1, {homeIsland: 'Honshu'})
ninjaIslandMap.set(ninjas2, {homeIsland: 'Hokkaido'})

assert(ninjaIslandMap.get(ninjas1).homeIsland === 'Honshu')
assert(ninjaIslandMap.get(ninjas2).homeIsland === 'Hokkaido')
assert(ninjaIslandMap.get(ninjas3).homeIsland === undefined)
assert(ninjaIslandMap.size === 2)
assert(ninjaIslandMap.has(ninjas1) && ninjaIslandMap.has(ninjas2))

ninjaIslandMap.delete(ninjas1)
assert(!ninjaIslandMap.has(ninjas1))

ninjaIslandMap.clear()
assert(ninjaIslandMap.size === 0)
```



### set

集合结构，即相同项只能有一项，不可共存，下面为建立集合容器，检测数据是否存在，移除数据，支持 `for of` 遍历，除此之外还有，还有并集、交集、差集运算。

[Set 相关API](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)

```js
const ninjas = new Set(['Yoshi', 'Hattori', 'Kuma', 'Hattori'])

assert(ninjas.has('Hattori') && ninjas.size === 3)
ninjas.add('Yagyu')
assert(ninjas.has('Yagyu'))
ninjas.remove('Hattori')

for (let ninja of ninjas) {
  console.log(ninja)
}
```



## 八、正则捕获引用，反向引用

### 反向引用匹配 HTML 标签的内容

有时候，我们需要检测、匹配一些前后一致的字符串，但这些字符串是未确定的，例如标签对。在此我们可以使用正则的捕获引用，以第一个匹配的结果作为后一个的匹配规则，下面是利用捕获引用获取标签对内的文本节点。

```js
let html = '<b class="hello">Hello</b><i>world!</i>'
// 捕获的引用，\1 指向第一个捕获
const pattern = /<(\w+)([^>]*)>(.*?)<\/\1>/g
let match = pattern.exec(html)
assert(match[0] === '<b class="hello">Hello</b>')
assert(match[1] === 'b')
assert(match[2] === ' class="hello"')

// 目标内容
assert(match[3] === 'Hello')

// 再执行一次，则得到类似的结果(<i>world!</i>)
match = pattern.exec(html)
console.log(match)
```



### 驼峰字符串转化成短横线链接字符串

```js
// 对替代字符串内获取捕获，而不是使用反向引用，使用 $1、$2 等标记捕获序号
let test = 'fontFamily'
assert(test.replace(/([A-Z])/g, '-$1').toLowerCase() === 'font-family')
```



### 短横线链接字符串转化成驼峰字符串

```js
function upper(all, letter) {
  return letter.toUpperCase()
}

let test2 = 'border-bottom-width'
assert(test2.replace(/-(\w)/g, upper) === 'borderBottomWidth')
```



### 一种查询字符串压缩技术

该压缩技术即是对 URL 地址后面的参数进行压缩，整合冗余的参数键值对到单个 `=` 号上，用 `,` 分隔键值。

```js
function compress(source) {
  const keys = {}
  source.replace(/([^=&]+)=([^&]*)/g, function (full, key, value) {
    keys[key] = (keys[key] ? keys[key] + ',' : '') + value
  })

  const result = []
  for (let key in keys) {
    result.push(key + '=' + keys[key])
  }

  return result.join('&')
}

assert(compress('foo=1&foo=2&blah=a&blah=b&foo=3') === 'foo=1,2,3&blah=a,b')
```



### 匹配 Unicode

根据特定的转义字符和指定一个范围匹配 Unicode 字符串。

```js
let text = '\u5FCD\u8005\u30D1\u30EF\u30FC'
const matchAll = /[\w\u0080-\uFFFF_-]+/g
assert(text.match(matchAll), 'Regexp matches non-ASCII!')
```



## 九、确定 DOM 自闭合元素被正确解析

编写 HTMl 页面时，我们有可能会疏忽掉未闭合的标签，或者干脆不写，兼容性处理好的浏览器可能会帮我们自动补全那些需要成对出现但未成对的标签，如果闭合不符合规范将会对文档结构的解析造成很大的影响，现在我们大概可以将该处理函数简化成下面这种方式，给定一个包含不需要自闭的标签字符串，通过正则匹配传入的字符串来决定哪些标签需补全，哪些不用，最终返回处理后的结果。

```js
function convert(html) {
  const tags = /^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i
  return html.replace(/(<(\w+)[^>]*?)\/>/g, (all, front, tag) => {
    return tags.test(tag) ? all : front + '></' + tag + '>'
  })
}

assert(convert('<a/>') === '<a></a>', 'Check anchor conversion.')
assert(convert('<hr/>') === '<hr/>', 'Check hr conversion.')
```



## 十、将元素标签转为一系列 DOM 节点

个人觉得这是一个不实用的方法，依靠函数补全父节点的不完整性，并不是件值得赞扬的事儿。当然了，这里只是练练手，通过匹配传入的字符串可以确定标签应有的标签深度（嵌套层数），从而决定是否需要填补父级标签对使其完整。

```js
function getNodes(htmlString, doc) {
  const map = {
    '<td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    '<th': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    '<tr': [2, '<table><thead>', '</thead></table>'],
    '<option': [1, '<select multiple>', '</select>'],
    '<optgroup': [1, '<select multiple>', '</select>'],
    '<legend': [1, '<fieldset>', '</fieldset>'],
    '<thead': [1, '<table>', '</table>'],
    '<tbody': [1, '<table>', '</table>'],
    '<tfoot': [1, '<table>', '</table>'],
    '<colgroup': [1, '<table>', '</table>'],
    '<caption': [1, '<table>', '</table>'],
    '<col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  }

  const tagName = htmlString.match(/<\w+/)
  let mapEntry = tagName ? map[tagName[0]] : null
  if (!mapEntry) {
    mapEntry = [0, ' ', ' ']
  }

  let div = (doc || document).createElement('div')
  div.innerHTML = mapEntry[1] + htmlString + mapEntry[2]
  while (mapEntry[0]--) {
    div = div.lastChild
  }

  return div.childNodes
}

assert(getNodes('<td>test</td><td>test2</td>').length === 2, 'Get two nodes back froum the method.')
assert(getNodes('<td>test</td>')[0].nodeName === 'TD', 'Verify that we are getting the rigth node.')
```



## 十一、获取样式属性计算后的值

一个获取元素样式属性计算过后的属性值。

[getComputedStyle Doc](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle)

```js
function fetchComputedStyle(element, property) {
  const computedStyles = getComputedStyle(element)
  if (computedStyles) {
    // 将驼峰转为中横线分隔
    property = property.replace(/([A-Z])/g, '-$1').toLowerCase()
    return computedStyles.getPropertyValue(property)
  }
}
```



## 十二、自定义事件

当浏览器提供的内置事件不能满足于我们的需求时，可以凭借 `CustomEvent` 构造函数自定义我们想要的事件，第一参数 `eventType` 是指事件的类型（名字），第二参数是一个对象，里面囊括所要描述的信息。这里自定义了 `ajax-start` 和 `ajax-complete` 两个事件，可轻易地从事件名判断出事件监听的时间点或触发点，而且每个事件都是完全独立的。

[CustomEvent Doc](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)

```js
function triggerEvent(target, eventType, eventDetail) {
  const event = new CustomEvent(eventType, {
    detail: eventDetail
  })

  target.dispatchEvent(event)
}

function performAjaxOperation() {
  triggerEvent(document, 'ajax-start', {
    url: 'my-url'
  })
  setTimeout(() => {
    triggerEvent(document, 'ajax-complete')
  }, 5000)
}

// 示例测试
const btn = document.getElementById('clickMe')
btn.addEventListener('click', () => {
  performAjaxOperation()
})

document.addEventListener('ajax-start', e => {
  document.getElementById('whirlyThing').style.display = 'inline-block'
  assert(e.detail.url === 'my-url', 'pass in event data')
})

document.addEventListener('ajax-complete', e => {
  document.getElementById('whirlyThing').style.display = 'none'
})
```
