let app = new Vue({
  el: '#app',
  data: {
    question: {
      gender: {
        male: '男',
        female: '女',
        keep: '保密'
      },
      hobbies: {
        reading: '看书',
        swimming: '游泳',
        running: '跑步',
        movie: '看电影',
        music: '听音乐'
      },
      intro: ''
    },
    finished: false,
    activePage: 1,
  },
  // 硬编码的方式，换 ->
  methods: {
    // 也可以直接自定义 directive 指令
    nextStep () {
      if (this.activePage < Object.keys(this.question).length) {
        this.activePage++
        this.finished = this.validateChoice()
      }
    },
    lastStep () {
      if (this.activePage > 0) {
        this.activePage--
        this.finished = this.validateChoice()
      }
    },
    getChoiceValue () {},
    validateChoice () {
      let choiceNodes = this.getInputNode()
      for (let i = 0, len1 = choiceNodes.length; i < len1; i++) {
        let items = choiceNodes[i]
        let checked = false
        let count = 0

        for (let j = 0, len2 = items.length; j < len2; j++) {
          let node = items[j]
          if (node.name === 'gender') {
            // 单选，跳过剩下的遍历
            if (node.checked) {
              checked = true
              break
            }

          } else if (node.name === 'hobby') {
            // 累加勾上计数
            if (node.checked) {
              count++
            }

          } else {
            count = node.value.length
          }
        }

        if (items[0].name === 'gender' && !checked) {
          return false
        }

        if (items[0].name === 'hobby' && count !== 3) {
          return false
        }

        if (items[0].name === 'intro' && count <= 20) {
          return false
        }
      }

      return true
    },
    getInputNode () {
      let appNode = this.$el
      let genderNode = appNode.querySelectorAll('input[name="gender"]')
      let hobbyNode = appNode.querySelectorAll('input[name="hobby"]')
      let introNode = appNode.querySelectorAll('textarea[name="intro"]')

      return [genderNode, hobbyNode, introNode]
    },
    resetPage () {
      let nodes
      let index = this.activePage
      
      if (index === 1) {
        nodes = this.$el.querySelectorAll('input[name="gender"]')
      } else if (index === 2) {
        nodes = this.$el.querySelectorAll('input[name="hobby"]')
      } else {
        nodes = this.$el.querySelectorAll('textarea[name="intro"]')
      }

      Array.prototype.forEach.call(nodes, node => {
        if (node.name === 'intro') {
          node.value = ''
        } else {
          node.checked = false
        }
      })
    }
  },
  computed: {
    pageCount () {
      return Object.keys(this.question).length
    }
  }
})
