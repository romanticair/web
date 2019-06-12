let app = new Vue({
  el: '#app',
  data: {
    value: 5
  },
  methods: {
    input: function (value) {
      console.log('input-number 触发 input，传值为', value)
    },
    onChange: function (value) {
      console.log('input-number 触发 onChange，传值为', value)
    }
  }
})
