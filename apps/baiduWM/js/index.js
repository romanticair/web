$(document).ready(function () {
	var mySwiper = new Swiper('.swiper-container', {
		direction: 'vertical',
  })

	// 加动画效果
  // loading，进入页面 0.5秒 后开始 loading 和 riding
  setTimeout(function () {
    // 加类名 animate 启动动画效果
    $('.loading').addClass('animate')
  }, 500)

  // loading 完后淡淡退出，进入 welcome 页面的同时为其添加 animate 类
  $('.loading .rider').on('animationend', function () {
    $('.loading').fadeOut(500, function () {
      $('.welcome').addClass('animate')
    })
  })

  // 长按 go 按钮进入下一个页面
  $('.welcome .circle-box').on('longTap', function () {
    $('.welcome').fadeOut(1000, function () {
      $('.slider-1').addClass('animate')
    })
  })

  // scroll-p1 展示过后进入 p2 进入 p3，display block <-> none 切换
  $('.slider-1 .scroll-p1').on('animationend', function () {
    setTimeout(function () {
      $('.scroll-p1').css('display', 'none')
      $('.scroll-p2').css('display', 'block').on('animationend', function () {
        setTimeout(function () {
          $('.scroll-p2').css('display', 'none')
          $('.scroll-p3').css('display', 'block')
        }, 1000)
      })
    }, 1000)
  })

  // slider-3 的照片 -- 动态替换
  var imgArr = {
    'license': ['url(image/page4/license.png)', 'url(image/page4/license1.png)'],
    'oil': ['url(image/page4/oil.png)', 'url(image/page4/oil1.png)'],
    'evil': ['url(image/page4/evil.png)', 'url(image/page4/evil1.png)'],
    'bear': ['url(image/page4/bear3.png)', 'url(image/page4/bear3-1-1.png)', 'url(image/page4/bear3-2-1.png)', 'url(image/page4/bear3-3-1.png)']
  }

  // 切换 swiper
  mySwiper.on('slideChange', function () {
    // 重置动画和默认样式
    // console.log(this.activeIndex, this.previousIndex)
    $('.swiper-slide').eq(this.previousIndex).removeClass('animate')
    $('.swiper-slide').eq(this.activeIndex).addClass('animate')

    // 进入 slide-3 则不给直接滑动了，只有触碰播放动画完才给滑动
    if (this.activeIndex == 2) {
      $('.swiper-slide').eq(2).addClass('swiper-no-swiping')
        .on('tap', function () {
          setTimeout(function () {
            $('.slider-3 .bear').css('background-image', imgArr.bear[1])
            $('.slider-3 .license').css('background-image', imgArr.license[1])
          }, 500)
          setTimeout(function () {
            $('.slider-3 .bear').css('background-image', imgArr.bear[2])
            $('.slider-3 .oil').css('background-image', imgArr.oil[1])
          }, 1000)
          setTimeout(function () {
            $('.slider-3 .bear').css('background-image', imgArr.bear[3])
            $('.slider-3 .evil').css('background-image', imgArr.evil[1])

            // 关闭动画 -- 否则下面的执行可能异常
            $('.license').css({
              'animation': 'none',
              'opacity': '1'
            })
            $('.oil').css({
              'animation': 'none',
              'opacity': '1'
            })
            $('.evil').css({
              'animation': 'none',
              'opacity': '1'
            })

            // 牌子下坠
            $('.license').animate({
              'transform': 'translateY(200%)',
              'opacity': 0
            })
            $('.oil').animate({
              'transform': 'translateY(200%)',
              'opacity': 0
            })
            $('.evil').animate({
              'transform': 'translateY(200%)',
              'opacity': 0
            })

            $('.swiper-slide').eq(2).removeClass('swiper-no-swiping')
          }, 1500)
        })
    }

    // 刚从 slider-2 离开，则重置样式 -- 图片
    if (this.previousIndex == 2) {
      $('.slider-3 .bear').css('background-image', imgArr.bear[0])
      // 清除上次遗留的样式
      $('.slider-3 .license').css('background-image', imgArr.license[0]).attr('style', '')
      $('.slider-3 .oil').css('background-image', imgArr.oil[0]).attr('style', '')
      $('.slider-3 .evil').css('background-image', imgArr.evil[0]).attr('style', '')
    }
  })

  // 音频对象
  var oAudio = $('audio')[0]
  // 音乐控制器
  $('.music').on('tap', function (ev) {
    // touch bug，触发两次，注释掉 MSPointerDown pointerdown，有点延迟
    // 停止状态则开启
    if (oAudio.paused) {
      oAudio.play()
      $(this).css('background-image', 'url(image/play.png)')
    }
    // 播放状态则关闭
    else {
      oAudio.pause()
      $(this).css('background-image', 'url(image/pause.png)')
    }
  })
})