// [TODO]
// 1.顶部搜索栏随页面滚动背景透明度降低
// 2.轮播图轮播控制
// 3.秒杀倒计时
window.onload = function () {
  var header = document.getElementsByClassName('header')[0]
  var topBar = header.firstElementChild
  var banner = document.querySelector('.jd-ad')
  var hl = document.querySelector('.seckill-icon').nextElementSibling
  var hr = hl.nextElementSibling
  var ml = hr.nextElementSibling.nextElementSibling
  var mr = ml.nextElementSibling
  var sl = mr.nextElementSibling.nextElementSibling
  var sr = sl.nextElementSibling

  var time = 4 * 3600

  // 基于轮播图高度改变透明度
  window.onscroll = function () {
    var bannerHeight =  banner.offsetHeight
    if (this.scrollY > bannerHeight) {
      return false
    } else {
      var opacity = this.scrollY / bannerHeight * 0.85
      topBar.style.backgroundColor = 'rgba(201,21,35,' + opacity + ')'
    }
  }

  Swiper('carrousel', 'controller', 2000)

  // 轮播图自动轮播
  function Swiper(carrousel, controller, time) {
    var oUi = document.getElementsByClassName(carrousel)[0]
    var liArr = document.getElementsByClassName(controller)[0].children
    var carrouselObj = oUi.children[0]
    var count = liArr.length
    var index = 1
    var toX, carrouselWidth
    // 进入页面后图片开始自动轮播
    var timer = setInterval(viewChange, time)

    // 给点点控制节点加属性,并注册点击切换图片事件
    for (var i=0; i<count; i++) {
      liArr[i].index = i
      // 移动端是 ontouchstart
      liArr[i].onclick = function () {
        // 当前索引值
        index = this.index
        // 立即更新一次，而不是 1s 后
        viewChange(index)
        // 清除定时器
        clearInterval(timer)
        // 切换轮播图
        timer = setInterval(viewChange, time)
      }
    }

    function viewChange() {
      index++
      carrouselWidth = carrouselObj.offsetWidth
      // 如果到了最后一张图，则直接回到第一张图
      // 注意：头尾分别增加了两张图，避免切换时过于急促而不好看
      if (index > count) {
        index = 1
        toX = carrouselWidth
      }
      // 同时更新点点显示
      activeChange(index-1)
      toX = carrouselWidth * index
      oUi.style.transform = 'translateX(-' + toX + 'px)'
    }

    // 摘除激活类并点点
    function activeChange(index) {
      for (var i=0; i<count; i++) {
        liArr[i].classList.remove('active')
      }
      liArr[index].classList.add('active')
    }
  }

  // 秒杀倒计时
  setInterval(function () {
    secKill()
  }, 1000)

  function secKill() {
    time--
    var hour = Math.floor(time / 3600)
    var min = Math.floor(time % 3600 / 60)
    var sec = time % 60
    hl.innerText = Math.floor(hour / 10)
    hr.innerText = hour % 10
    ml.innerText = Math.floor(min / 10)
    mr.innerText = min % 10
    sl.innerText = Math.floor(sec / 10)
    sr.innerText = sec % 10
  }
}
