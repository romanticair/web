Vue.component('comment-list', {
  template: `
    <div v-if="list.length" class="list-container">
      <div v-for="(item, i) in list">
        <div class="list-item">
          <span>{{ item.name + '：' }}</span>
          <div class="list-msg">
            <p>{{ item.message }}</p>
            <a class="list-reply" @click="handleReply(i)">回复</a>
            <a class="list-delete" @click="handleDelete(i)">删除</a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="list-empty">留言列表为空</div>
  `,
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
