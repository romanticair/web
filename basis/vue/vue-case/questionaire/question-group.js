Vue.component('question-group', {
  template: `
  <div class="wrapper">
    <h3>{{ currentPage + 1 }} / {{ total }}</h3>
    <div v-for="(question, index) in questions">
      <div v-if="question.type === 'radio'">
         <radio-select ref="questions" v-show="currentPage === index" :options="question.options" :title="question.title" @pick="handlePick"></radio-select>
         <!--<radio-select ref="questions" v-show="currentPage === index" :name="question.name" :options="question.options" :title="question.title" @pick="handlePick"></radio-select>-->
      </div>
      <div v-else-if="question.type === 'multi'">
         <multi-select ref="questions" v-show="currentPage === index" :options="question.options" :title="question.title" @pick="handlePick"></multi-select>
      </div>
      <div v-else-if="question.type === 'textarea'">
         <text-type ref="questions" v-show="currentPage === index" :title="question.title" :tips="question.tips" @pick="handlePick"></text-type>
         <!--<text-type ref="questions" v-show="currentPage === index" :title="question.title" :tips="question.tips" :text="question.text" @pick="handlePick"></text-type>-->
      </div>
    </div>
    
    <div class="btn-group">
      <beau-button v-show="currentPage === total-1" :banned="disabledSubmit" @click="handleSubmit">提交</beau-button>
      <beau-button v-show="currentPage < total-1" :banned="disabledNext" @click="handleNext">下一步</beau-button>
      <beau-button v-show="0 < currentPage" @click="handlePrevious">上一步</beau-button>
      <beau-button @click="handleReset">重置</beau-button>
    </div>
  </div>
  `,
  props: {
    questions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      currentPage: 0,
      disabledSubmit: true,
      disabledNext: true
    }
  },
  methods: {
    handlePick (value) {
      let question = this.questions[this.currentPage]
      switch (question.type) {
        case 'radio':
        case 'multi':
          this.questions[this.currentPage].picked = value
          break
        case 'textarea':
          this.questions[this.currentPage].text = value
        default:
          break
      }

      this.updateDisableNext()
      this.updateDisableSubmit()
    },
    handleSubmit () {
      this.$emit('submit', this.questions)
    },
    handleNext () {
      if (this.currentPage < this.total - 1) {
        this.currentPage++
        this.updateDisableNext()
      }
    },
    handlePrevious () {
      if (this.currentPage > 0) {
        this.currentPage--
        this.updateDisableNext()
      }
    },
    handleReset() {
      let question = this.questions[this.currentPage]
      switch (question.type) {
        case 'radio':
          // this.$children[this.currentPage].pickedValue = ''
          this.$refs.questions[this.currentPage].pickedValue = ''
          break
        case 'multi':
          this.$refs.questions[this.currentPage].pickedValues = []
          break
        case 'textarea':
          this.$refs.questions[this.currentPage].curValue = ''
          break
        default:
          break
      }
    },
    updateDisableNext () {
      let flag = false
      let question = this.questions[this.currentPage]
      if (question.type === 'radio') {
        if (!question.picked) {
          flag = true
        }

      } else if (question.type === 'multi') {
        if (question.picked.length !== 3) {
          flag = true
        }

      } else if (question.type === 'textarea') {
        if (question.text.length < 10) {
          flag = true
        }
      }

      this.disabledNext = flag
    },
    updateDisableSubmit () {
      let flag = false
      this.questions.forEach(question => {
        if (question.type === 'radio') {
          if (!question.picked) {
            flag = true
          }

        } else if (question.type === 'multi') {
          if (question.picked.length !== 3) {
            flag = true
          }

        } else if (question.type === 'textarea') {
          if (question.text.length < 20) {
            flag = true
          }
        }
      })

      this.disabledSubmit = flag
    }
  },
  computed: {
    total () {
      return this.questions.length
    }
  }
})
