var Swiper = function (opt) {
  var options = {
    swiper: '.swiper',
    swiperItems: '.swiper-item',
    // 重叠面积占每个 item 的 1/5
    share: 1/5
  }

  extend(options, opt)
  var swiper = $(options.swiper)[0]
  var swiperItems = $(options.swiperItems)
  var itemWidth = parseInt(getStyle(swiperItems[0], 'width'))
  var shareWidth = itemWidth * options.share
  var len = swiperItems.length

  // 索引和样式列表(环状链条轮动，选择相应的 CSS)
  var indexQueue = initIndexQueue(len)
  var cssList = initCssList(len)

  var speed = 50, dis, touchX
  var deviceTouch = getDeviceTouch()
  var isMobile = /Mobile/i.test(navigator.userAgent)
  var touch = {
    start: deviceTouch[0],
    move: deviceTouch[1],
    up: deviceTouch[2]
  }

  function init() {
    render()
    bind()
  }

  function bind() {
    $.delegate(swiper, ['li', 'img'], touch.start, function (ev) {
      var ev = ev || window.event
      if (isMobile) {
        // 需要触发一下...
        console.log(ev)
        touchX = ev.touches[0].pageX
      } else {
        touchX = ev.pageX
      }
      $.on(swiper, touch.move, moveListener)
      $.on(swiper, touch.up, upListener)
      $.on(window, 'blur', upListener)
      stopDefault(ev)
    })
  }

  function moveListener(ev) {
    var ev = ev || window.event
    var curX
    if (isMobile) {
      curX = ev.changedTouches[0].pageX
    } else {
      curX = ev.pageX
    }
    dis = curX - touchX
    return stopDefault(ev)
  }

  function upListener(ev) {
    if(dis >= speed) {
      swiperRight()
    } else if (dis <= -speed) {
      swiperLeft()
    }

    afterUp()
  }

  function afterUp() {
    $.un(swiper, touch.move, moveListener)
    $.un(swiper, touch.up, upListener)
    $.un(window, 'blur', upListener)
  }

  function swiperLeft() {
    // 更新索引
    updateIndexQueue(true)
    // 渲染
    render()
  }

  function swiperRight() {
    updateIndexQueue(false)
    render()
  }

  function render() {
    each(indexQueue, function (nodeIndex, i) {
      swiperItems[nodeIndex].style.cssText = cssList[i]
    })
  }

  function updateIndexQueue(swiperLeft) {
    if (swiperLeft) {
      indexQueue.push(indexQueue.shift())
    } else {
      indexQueue.unshift(indexQueue.pop())
    }

    return
  }

  function initCssList(n) {
    var scale = 1/8
    var decrement = 1
    var l, r, v = 1, ret = []
    var halfIndex = Math.ceil(n / 2) - 1
    var loop = n % 2 === 0 ? n / 2 + 1 : Math.ceil(n / 2)
    var baseCssText = 'z-index: Z; transform: translate3d(Xpx, 0, Ypx) scale3d(S, S, 1);'
    var translateX = 0
    for (l = r = halfIndex; 0 < loop; l--, loop--, r++, decrement -= scale) {
      if (l === halfIndex) {
        ret.push(cssTextDealer(baseCssText, halfIndex + 1, 0, loop * 2, decrement))
        continue
      }

      translateX += itemWidth - shareWidth*v
      v++
      ret.push(cssTextDealer(baseCssText, l + 1, translateX, loop * 2, decrement))
      if (l > -1 || r < n - 1) {
        ret.unshift(cssTextDealer(baseCssText, l + 1, - translateX, loop * 2, decrement))
      }
    }

    return ret
  }

  function initIndexQueue(n) {
    var l = []
    for (var i = 0; i < n; i++) {
      l.push(i)
    }

    return l
  }

  function cssTextDealer(baseCssText, z, x, y, s) {
    return baseCssText.replace('Z', z).replace('X', x).replace('Y', y).replace(/S/g, s)
  }

  init()
}
