Vue.component('tabs', {
  template:
    '<div class="tabs">' +
      '<div class="tabs-bar">' +
        '<div ' +
          ':class="tabCls(nav)" ' +
          'v-for="( nav, index ) in navList" ' +
          '@click="handleChange(index)">' +
          '{{ nav.label }}' +
        '</div>' +
      '</div>' +
      '<div class="tabs-content">' +
        '<slot></slot>' +
      '</div>' +
    '</div>'
  ,
  // 对于 pane 的 pane-close-btn，另设一个元素更好 （事件监听）
  props: {
    // 为了可以使用 v-model
    value: {
      type: [String, Number]
    }
  },
  data: function () {
    return {
      // 用于渲染 tabs 的标题
      navList: [],
      // 因为不可以修改 value，因此要复制一份自己维护
      currentValue: this.value
    }
  },
  methods: {
    getTabs: function () {
      // 遍历子组件，获取所有 pane 组件
      return this.$children.filter(item => {
        return item.$options.name === 'pane'
      })
    },
    updateNav: function () {
      this.navList.length = 0
      this.getTabs().forEach((pane, index) => {
        // bug 不传 name 会报错
        this.navList.push({
          label: pane.label,
          name: pane.name || index,
          closable: pane.closable
        })

        // 若无具体标识符，则用索引值代替
        if (!pane.name) pane.name = index;
        // 当前选中的 tabs 索引（只进来一次）
        if (index === 0 && !this.currentValue) {
          this.currentValue = pane.name || index
        }
      })

      this.updateStatus()
    },
    updateStatus: function () {
      let tabs = this.getTabs()
      // 显示当前选中 tab 对应的 pane 组件，隐藏其它
      tabs.forEach(tab => {
        return tab.show = tab.name === this.currentValue
      })
    },
    tabCls: function (nav) {
      return [
        'tabs-nav',
        {
          // 给选中的 tab 添加 class
          'tabs-nav-active': nav.name === this.currentValue,
          'pane-close-btn': nav.closable
        }
      ]
    },
    handleChange: function (index) {
      // 计算属性不可传参，所以用 methods - 无缓存
      let nav = this.navList[index]
      let name = nav.name
      // 更新为当前选中的 tab
      this.currentValue = name
      // 更新 value -- pane 内容块
      this.$emit('input', name)
      // 触发一个自定义事件 -- 供父级使用
      this.$emit('on-click', name)
    }
  },
  watch: {
    value: function (val) {
      this.currentValue = val
    },
    currentValue: function () {
      // tab-nav 切换时，触发更新 pane-content
      this.updateStatus()
    }
  }
})