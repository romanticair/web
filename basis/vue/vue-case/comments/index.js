const app = new Vue({
  el: '#app',
  data: {
    username: '',
    message: '',
    list: []
  },
  methods: {
    handleSend () {
      if (this.username.trim() === '') {
        window.alert('请输入昵称')
        return
      }

      if (this.message.trim() === '') {
        window.alert('请输入留言内容')
        return
      }
      
      this.list.push({
        name: this.username,
        message: this.message
      })

      this.message = ''
    },
    handleReply (index) {
      let name = this.list[index].name
      this.message = '回复@' + name + '：'
      this.$refs.message.focus()
    },
    handleDelete (index) {
      this.list.splice(index, 1)
    }
  }
})
