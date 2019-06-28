Vue.component('v-input', {
  render (createElement) {
    let _this = this
    return createElement('div', [
      createElement('span', '昵称：'),
      createElement('input', {
        attrs: {
          type: 'text'
        },
        domProps: {
          value: this.value
        },
        on: {
          input (ev) {
            _this.name = ev.target.value
            _this.$emit('input', ev.target.value)
          }
        }
      })
    ])
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      name: this.value
    }
  }
})

Vue.component('v-textarea', {
  render (createElement) {
    let _this = this
    return createElement('div', [
      createElement('span', '留言内容：'),
      createElement('textarea', {
          attrs: {
            placeholder: '请输入留言内容'
          },
          domProps: {
            value: this.value
          },
          ref: 'message',
          on: {
            input (ev) {
              _this.comment = ev.target.value
              _this.$emit('input', ev.target.value)
            }
          }
        })
    ])
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data: function () {
    return {
      comment: this.value
    }
  },
  methods: {
    focus () {
      this.$refs.message.focus()
    }
  }
})
