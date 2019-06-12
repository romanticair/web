Vue.directive('clickoutside', {
  bind: function (el, binding, vnode) {
    function documentHandle (e) {
      // 按键和点击事件合并一起处理
      let code = e.keyCode

      // click 外部, keydown 两事件的 el.contains(e.target) 皆为 true
      if (el.contains(e.target) && !code) {
        return false
      }

      if (code && code !== 27) {
        return false
      }

      if (binding.expression) {
        binding.value(e)
      }
    }

    // el.__vueClickOutside__ = documentHandle
    el.__vueDocumentHandle__ = documentHandle
    document.addEventListener('click', documentHandle)

    // v-clickoutsize.esc -- 修饰符处理
    if (binding.modifiers.esc) {
      document.addEventListener('keydown', documentHandle)
    }
  },
  unbind: function (el, binding) {
    document.removeEventListener('click', el.__vueDocumentHandle__)
    if (binding.modifiers.esc) {
      document.removeEventListener('keydown', __vueDocumentHandle__)
    }

    delete el.__vueDocumentHandle__
  },
  update: function (el, binding, vnode, oldVnode) {
    if (binding.value === binding.oldValue) {
      return false
    }

    // 暂未实现使 update 钩子中支持表达式的更新
    // upbind, bind?
  },
})


/*
Vue.directive('escglobal', {
  bind: function (el, binding) {
    function documentHandle (e) {
      if (e.keyCode !== 27) {
        return false
      }

      if (binding.expression) {
        binding.value(e)
      }
    }

    el.__vueESCGlobal__ = documentHandle
    document.addEventListener('keydown', documentHandle)
  },
  unbind: function (el, binding) {
    document.removeEventListener('keydown', el.__vueESCGlobal__)
    delete el.__vueESCGlobal__
  }
})
*/
