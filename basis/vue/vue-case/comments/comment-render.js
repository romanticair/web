Vue.component('comment-list', {
  render (createElement) {
    let _this = this
    let list = []

    this.list.forEach((item, i) => {
      let node = createElement('div', {
        attrs: {
          class: 'list-item'
        }
      }, [
          createElement('span', item.name + '：'),
          createElement('div', {
            attrs: {
              class: 'list-msg'
            }
          }, [
            createElement('p', item.message),
            createElement('a', {
              attrs: {
                class: 'list-reply'
              },
              on: {
                click () {
                  // 点击回复(索引标记被评论人，可提取昵称)
                  _this.handleReply(i)
                }
              }
            }, '回复'),
            createElement('a', {
              attrs: {
                class: 'list-delete'
              },
              on: {
                click () {
                  _this.handleDelete(i)
                }
              }
            }, '删除')
          ]
        )
      ])
      
      // 将每个列表都存起来
      list.push(node)
    })

    if (this.list.length) {
      return createElement('div', {
        attrs: {
          class: 'list-container'
        }
      }, list)
    } else {
      return createElement('div', {
        attrs: {
          class: 'list-empty'
        }
      }, '留言列表为空')
    }
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    handleReply (index) {
      this.$emit('reply', index)
    },
    handleDelete (index) {
      this.$emit('delete', index)
    }
  }
})
