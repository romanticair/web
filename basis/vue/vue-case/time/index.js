Vue.directive('time', {
  bind (el, binding) {
    el.innerHTML = Time.getFormatTime(binding.value)
    el.__timeout__ = setInterval(() => {
      el.innerHTML = Time.getFormatTime(binding.value)
      // 一分钟一次
    }, 60000)
  },
  unbind (el) {
    clearIntval(el.__timeout__)
    delete el.__timeout__
  }
})

Vue.directive('birthday', {
  bind (el, binding) {
    // el.innerHTML = Time.getFormatDay(binding.value)
    el.innerHTML = Time.getAgeDetail(binding.value)
    el.__timeout2__ = setInterval(() => {
      // el.innerHTML = '出生了 ' + Time.getFormatDay(binding.value) + ' 天'
      el.innerHTML = Time.getAgeDetail(binding.value)
      // 一天更新一次
    }, 86400000)
  },
  unbind (el) {
    clearIntval(el.__timeout2__)
    delete el.__timeout2__
  }
})