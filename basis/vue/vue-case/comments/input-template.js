Vue.component('v-input', {
  template: `
    <div>
      <span>昵称：</span>
      <input type="text" v-model="name" @input="handleInput($event)"></input>
    </div>
  `,
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
  },
  methods: {
    handleInput (ev) {
      this.name = ev.target.value
      this.$emit('input', this.name)
    }
  },
  watch: {
    value () {
      this.name = this.value
    }
  }
})

Vue.component('v-textarea', {
  template: `
    <div>
      <span>留言内容：</span>
      <textarea ref="message" v-model="comment" @input="handleInput($event)" placeholder="请输入留言内容"></textarea>
    </div>
  `,
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
    },
    handleInput (ev) {
      this.comment = ev.target.value
      this.$emit('input', ev.target.value)
    }
  },
  watch: {
    value () {
       this.comment = this.value
    }
  }
})
