/*
  radio-select 组件
 */
Vue.component('radio-select', {
  name: 'radio-select',
  template: `
    <div>
      <h5>{{ title }}</h5>
      <div v-for="(option, index) in options">
        <input v-model="pickedValue" :value="option" :id="keys[index]" type="radio"> 
        <label :for="keys[index]">{{ option }}</label>
      </div>
    </div>
  `,
  props: {
    title: {
      type: String,
      default: '问题未命名'
    },
    name: {
      type: String,
      default: 'radioname'
    },
    options: {
      type: Array,
      default: () => {
        return []
      },
      // required: true
    }
  },
  data () {
    // preprocess
    let keys = []
    this.options.forEach((option, index) => {
      keys.push(this.name + index)
    })

    return {
      pickedValue: '',
      keys: keys
    }
  },
  methods: {},
  watch: {
    pickedValue (val) {
      this.$emit('pick', val)
    }
  }
})

/*
  multi-select 组件
 */
Vue.component('multi-select', {
  name: 'multi-select',
  template: `
<div>
  <h5>{{ title }}</h5>    
  <div v-for="(option, index) in options">
    <input v-model="pickedValues" :value="option" :id="keys[index]" type="checkbox">
    <label for="keys[index]">{{ option }}</label>
  </div>
</div>
  
  `,
  props: {
    title: {
      type: String,
      default: '问题未命名'
    },
    name: {
      type: String,
      default: 'multiname'
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    let keys = []
    this.options.forEach((option, index) => {
      keys.push(this.name + index)
    })

    return {
      pickedValues: [],
      keys: keys
    }
  },
  methods: {},
  watch: {
    pickedValues: {
      handler (val) {
        this.$emit('pick', val)
      },
      deep: true
    }
  }
})

/*
  text-type 组件
 */
Vue.component('text-type', {
  name: 'text-type',
  template: `
    <div>
      <span>{{ title }}</span>
      <div>
        <textarea v-model="curValue" :name="name" cols="30" rows="10" :placeholder="tips">
        {{ text }}
      </textarea>
    </div>
  </div>
  `,
  props: {
    title: {
      type: String,
      default: '问题未命名'
    },
    name: {
      type: String,
      default: 'textname'
    },
    tips: {
      type: String,
      default: 'Please input here.'
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      curValue: this.text
    }
  },
  watch: {
    curValue (val) {
      this.$emit('pick', val)
    }
  }
})
