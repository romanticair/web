Vue.component('pane', {
  name: 'pane',
  template:
    '<div class="pane" v-show="show">' +
      '<slot>标签内容未填写</slot>' +
    '</div>'
  ,
  props: {
    // pane 标识
    name: {
      type: String
    },
    // 对应的标签页
    label: {
      type: String,
      default: ''
    },
    closable: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      show: true
    }
  },
  methods: {
    // 同步更新
    updateNav: function () {
      this.$parent.updateNav()
    }
  },
  watch: {
    // 独立组件，标题改变时，也要改变父级的
    label: function () {
      this.updateNav()
    }
  },
  mounted () {
    // 初始化时，同步父级 tabs 标签页数据
    this.updateNav()
  }
})
