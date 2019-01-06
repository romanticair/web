/******************************
 * 用 jquery 简单封装一些页面特效
 ******************************/

/**
 * 手风琴效果
 *
 * @param {object|string} ele DOM 元素节点
 * @param {number} width 激活时，其它元素显示的宽度
 * @param {Array} decorator 琴子的颜色或照片
 */

function accordion(ele, width, decorator) {
  // 处理 string 或 jquery 和 js 对象
  $ele = ele.length > 1 ? $(ele).eq(0) : $(ele)
  width = width || 0
  decorator = decorator || []
  var $liArr = $ele.find('li')
  var boxWidth = $ele.width()
  var activeWidth = boxWidth - ($liArr.length - 1) * width
  var averageWidth = boxWidth / $liArr.length

  if (decorator) {
    // var style = decorator[0].indexOf('.') === -1 ? 'backgroundColor' : 'backgroundImage'
    if (decorator[0].indexOf('.') === -1) {
      $liArr.each(function (i, el) {
        $(el).css('backgroundColor', decorator[i])
      })
    } else {
      $liArr.each(function (i, el) {
        $(el).css('backgroundImage', 'url(' + decorator[i] + ')')
      })
    }
  }

  $liArr.on('mouseenter', function () {
    $ele.stop().animate({width: boxWidth+1})
    $(this).stop().animate({width: activeWidth}, function () {
        $ele.stop().animate({width: boxWidth})
      })
      .siblings().stop().animate({width: width})

  })
  $ele.on('mouseleave', function () {
    $ele.stop().animate({width: boxWidth+1})
    $liArr.stop().animate({width: averageWidth})
    setTimeout(function () {
      $ele.css({width: boxWidth})
    }, 400)
  })
}


/**
 * 来自四面八方的弹幕效果
 *
 * @param {object} options 按钮，文本域，装弹幕的盒子节点，颜色组
 */

function barrage(options) {
  if (!options.button && !options.input) {
    return false
  }
  var $btn = options.button.length > 1 ? $(options.button).eq(0) : $(options.button)
  var $input = options.input.length > 1 ? $(options.input).eq(0) : $(options.input)
  var $box = options.container ? $(options.container) : $('body')
  var colors = options.color ? options.color : null
  var width, height, disX, disY

  // 指定弹幕潇洒的尺寸
  width = $box.width()
  height = $box.height()
  // 投放弹幕起始点在盒子边界外
  disX = 200
  disY = 200

  // 注册触发弹幕事件
  $btn.on('click', function () {
    // 如果有盒子，则要让父级 relative 定位和 overflow hidden
    var msg = $input.val()
    var color = colors ? colors[rndBetween(0, colors.length)] : rndColor()
    var speed = rndBetween(5000, 10000)
    // var startX = rndBetween(-disX, width + disX)
    var startX, startY, endX, endY
    // 为区域值分配概率
    startX = probabilityDistributor([-disX, 0, width, width + disX], [0.4, 0.3, 0.4])

    // 确定起始位置，确保弹幕都在容器外围生成
    if (startX < 0 || startX > width) {
      // 左右两侧
      startY = rndBetween(-disY, height + disY)
    } else {
      // 中间部位，Y 值不允许在中间，避免在可视区域生成弹幕，石头剪刀布决定上下吧
      if (Math.random() < 0.5) {
        startY = rndBetween(-disY, 0)
      } else {
        startY = rndBetween(height, height + disY)
      }
    }

    // 起始位置可能在边边角角(没达到360°)，所以要控制它们往空间大(对角)的区域移动，避免在可视区域消失
    // 使其超出容器宽度，再控制高度即可
    if (startX < 0 || startX > width) {
      if (startX < 0) {
        endX = rndBetween(width, width + disX)
      } else {
        endX = rndBetween(-disX, 0)
      }

      if (startY < height/3) {
        // 上部
        endY = rndBetween(height/3, height + disY)
      } else if (startY > height * 2/3) {
        // 下部
        endY = rndBetween(-disY, height/3)
      } else {
        // 中间
          endY = rndBetween(-disY, height + disY)
        }
      }
    else {
      // startX 在中间，则 startY 在上下边界外，走反方向即可
      endX = rndBetween(disX, width - disX)
      if (startY > height) {
        endY = rndBetween(-disY, 0)
      } else {
        endY = rndBetween(height, height + disY)
      }
    }

    $('<span></span>').text(msg)
      .css('position', 'absolute')
      .css('color', color)
      .css('left', startX)
      .css('top', startY)
      .animate({'left': endX, 'top': endY}, speed, 'linear', function () {
        // 终点站到了
        $(this).remove()
      })
      .appendTo($box)

    // 清空文本域
    $input.val('')
  })
  // 注册回车键发弹幕事件
  $input.on('keydown', function (ev) {
    if (ev.keyCode === 13) {
      $btn.trigger('click')
    }
  })
}

function rndColor() {
  var r = Math.floor(Math.random() * 256)
  var g = Math.floor(Math.random() * 256)
  var b = Math.floor(Math.random() * 256)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
  // var colors = ["red", "green", "hotpink", "pink", "cyan", "yellowgreen", "purple", "deepskyblue"]
  // return colors[rndBetween(0, colors.length - 1)]
}

function rndBetween(left, right) {
  return parseInt(Math.random() * (right - left) + left)
}


/**
 * 区间范围内指定发生概率的分配器，返回经过随机处理的值
 *
 * @param {Array} rangeVal 区间取值范围
 * @param {Array} prob 在某一区间出现的概率组
 */
function probabilityDistributor (rangeVal, prob) {
  // 将它们变成区域，总和 100
  var offset = 0
  // 放一个 0 在第一位
  prob.splice(0, 0, 0)
  for (var i = 0; i < prob.length; i++) {
    prob[i] = prob[i] * 100 + offset
    offset = prob[i]
  }

  var rnd = rndBetween(0, 100)
  for (var i = 0; i < prob.length - 1; i++) {
    if (prob[i] < rnd && rnd < prob[i+1]) {
      return rndBetween(rangeVal[i], rangeVal[i+1])
    }
  }
}


/**
 * 优雅的回到页面顶部
 *
 * @param {object|string} ele DOM 元素节点
 * @param {number} top 开始显示的位置
 * @param {number} speed 移动速度
 */

function backToHead(ele, top, speed) {
  $ele = ele.length > 1 ? $(ele).eq(0) : $(ele)
  top = top ? top : 1000
  speed = speed ? speed : 1000

  // 注册滚动事件
  $(window).scroll(function () {
    if ($(this).scrollTop() >= top) {
      $ele.stop().fadeIn(speed)
    } else {
      $ele.stop().fadeOut(speed)
    }
  })

  // 注册点击回到顶部事件
  $ele.click(function () {
    $('html').stop().animate({scrollTop: 0}, speed)
  })
}
