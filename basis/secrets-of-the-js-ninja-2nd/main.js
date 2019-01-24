function assert(real, msg) {
  return real ? msg : 'Assert wrong.'
}

// 1. 性能分析
function timer(fn, arg) {
  console.time(fn.name + ' PT')
  fn(arg)
  console.timeEnd(fn.name + ' PT')
}

// 2. 给定元素(根节点)开始递归遍历 DOM 树
function traverseDOM(ele, fn) {
  // 处理当前节点
  fn(ele)
  ele = ele.firstElementChild
  while (ele) {
    // 遍历所有子节点
    traverseDOM(ele, fn)
    ele = ele.nextElementSibling
  }
}

// 2.1 生成器遍历 DOM 树
function* DOMTraversal(ele) {
  yield ele
  ele = ele.firstElementChild
  while (ele) {
    // yield* 将迭代控制转移到另一个 DOMTraversal 生成器上
    yield* DOMTraversal(ele)
    ele = ele.nextElementSibling
  }
}

// 3. 实现异步从服务器获取数据
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

// 链式调用 Promise
getJSON('data/ninjas.json')
  .then(ninjas => getJSON([ninjas[0].missionsUrl]))
  .then(missions => getJSON([missions[0].detailUrl]))
  .then(mission => assert(mission !== null, 'Ninjas mission obtained'))
  .catch(e => {
    console.log('Something wrong.')
  })


// 4. 了解原型链和 setPrototypeOf defineProperty API
function setPrototypeOf_and_defineProperty() {
  const yoshi = { skulk: true}
  const hattori = { sneak: true}
  const kuma = { creep: true}

  assert('skulk' in yoshi, 'Yoshi can skulk')
  assert('sneak' in hattori, 'hattori can skulk')
  assert('creep' in kuma, 'kuma can skulk')

  // 将对象 hattori 设置为 yoshi 对象的原型，即改变了指向
  Object.setPrototypeOf(yoshi, hattori)
  assert('sneak' in yoshi, 'yoshi can skulk')
  assert(!('creep' in hattori), 'hattori can not skulk')

  Object.setPrototypeOf(hattori, kuma)
  assert('creep' in hattori, 'hattori can skulk')
  assert('creep' in yoshi, 'yoshi alse can skulk')

  // 继承链时不建议使用 yoshi.prototype = hattori.prototype
  // 因为 hattori 原型上发生变化都会被同步到 yoshi 原型上

  // 配置对象(constructor)的属性：
  // 1.configue 为 true 时可修改或删除属性
  // 2.enumerable 为 true 时可在 for-in 循环对象属性时出现
  // 3.value 指定属性的值，默认 undefined
  // 4.writable 为 true，则可通过赋值语句修改属性值
  // 5.get 定义 getter 函数，访问属性时调用，不可与 value 和 writable 同时用
  // 6.set 定义 setter 函数，设置属性时调用，不可与 value 和 writable 同时用

  let ninja = {}
  ninja.weapon = 'kusarigama'
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

  // 解决 constructor 属性被覆盖问题
  function Food() {}
  Food.prototype.sugar = function () {}

  function Melon() {}
  Melon.prototype = new Food()

  // 定义一个新的不可枚举的 constructor 属性，属性值为 Food
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
}

// 5. getter setter
function get_set() {
  const ninjiaCollection = {
    ninjas: ['Yoshi', 'Kuma', 'Hattori'],
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

  // es6 class 中也可以做出同样的约束，而且语法相同
  // or Object defineProperty 定义 getter setter
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
}

// 6. 代理 proxy
function proxy_obj() {
  // 通过代理控制对另一个对象的访问
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

  // 使用代理实现数组负索引功能
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
}

// 7. map set
function map_and_set() {
  // map
  const ninjaIslandMap = new Map()
  const ninjas1 = {name: 'Yoshi'}
  const ninjas2 = {name: 'Hattori'}
  const ninjas3 = {name: 'Kuma'}
  ninjaIslandMap.set(ninjas1, {homeIsland: 'Honshu'})
  ninjaIslandMap.set(ninjas2, {homeIsland: 'Hokkaido'})

  assert(ninjaIslandMap.get(ninjas1).homeIsland === 'Honshu')
  assert(ninjaIslandMap.get(ninjas2).homeIsland === 'Hokkaido')
  assert(ninjaIslandMap.get(ninjas3).homeIsland === undefined, 'not found')
  assert(ninjaIslandMap.size === 2)
  assert(ninjaIslandMap.has(ninjas1) && ninjaIslandMap.has(ninjas2))

  ninjaIslandMap.delete(ninjas1)
  assert(!ninjaIslandMap.has(ninjas1))

  ninjaIslandMap.clear()
  assert(ninjaIslandMap.size === 0)

  // set
  const ninjas = new Set(['Yoshi', 'Hattori', 'Kuma', 'Hattori'])
  assert(ninjas.has('Hattori') && ninjas.size === 3)
  ninjas.add('Yagyu')
  assert(ninjas.has('Yagyu'))
  ninjas.delete('Hattori')
  for (let ninja of ninjas) {
    console.log(ninja)
  }
  // 可用列表实现并集交集，差集
}

// 8. 正则捕获引用，反向引用
function regs() {
  // 捕获的引用，反向引用匹配 HTML 标签的内容, \1 指向第一个捕获
  let html = '<b class="hello">Hello</b><i>world!</i>'
  const pattern = /<(\w+)([^>]*)>(.*?)<\/\1>/g
  let match = pattern.exec(html)
  assert(match[0] === '<b class="hello">Hello</b>')
  assert(match[1] === 'b')
  assert(match[2] === ' class="hello"')
  // 目标内容
  assert(match[3] === 'Hello')

  // 再执行一次，则得到类似的结果
  match = pattern.exec(html)
  console.log(match)
  // Array(4) [ "<i>world!</i>", "i", "", "world!" ]

  // 对替代字符串内获取捕获，而不是使用反向引用，使用 $1、$2 等标记捕获序号
  // 将驼峰字符串转化成短横线链接字符串
  let test = 'fontFamily'
  assert(test.replace(/([A-Z])/g, '-$1').toLowerCase() === 'font-family')

  // 将短横线链接字符串转化成驼峰字符串
  function upper(all, letter) {
    return letter.toUpperCase()
  }

  let test2 = 'border-bottom-width'
  assert(test2.replace(/-(\w)/g, upper) === 'borderBottomWidth')

  // 一种查询字符串压缩技术
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

  // 匹配 Unicode
  let text = '\u5FCD\u8005\u30D1\u30EF\u30FC'
  const matchAll = /[\w\u0080-\uFFFF_-]+/g
  assert(text.match(matchAll), 'Regexp matches non-ASCII!')
}

// 9. 确定 DOM 自闭合元素被正确解析
function convert(html) {
  const tags = /^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i
  return html.replace(/(<(\w+)[^>]*?)\/>/g, (all, front, tag) => {
    return tags.test(tag) ? all : front + '></' + tag + '>'
  })
}

assert(convert('<a/>') === '<a></a>', 'Check anchor conversion.')
assert(convert('<hr/>') === '<hr/>', 'Check hr conversion.')

// 10. 将元素标签转为一系列 DOM 节点
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

// 11. 获取样式属性计算后的值
function fetchComputedStyle(element, property) {
  const computedStyles = getComputedStyle(element)
  if (computedStyles) {
    // 将驼峰转为中横线分隔
    property = property.replace(/([A-Z])/g, '-$1').toLowerCase()
    return computedStyles.getPropertyValue(property)
  }
}

// 12. 自定义事件
function custom_events() {
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
}
