function isValueNumber (value) {
  return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9][0-9]*$)|(^-?0{1}$)/).test(value + '')
}

Vue.component('input-number', {
  template: '<div class="input-number">' +
    '<input type="text" :value="currentValue" @change="handleChange" @keydown="handleKeydown">' + 
    '<button @click="handleDown" :disabled="currentValue <= min">-</button>' +
    '<button @click="handleUp" :disabled="currentValue >= max">+</button>' +
  '</div>'
  ,
  props: {
    min: {
      type: Number,
      default: -Infinity
    },
    max: {
      type: Number,
      default: Infinity
    },
    value: {
      type: Number,
      default: 0,
      // required: true
    },
    step: {
      type: Number,
      default: 1
    }
  },
  data: function () {
    console.log(this.value)
    return {
      currentValue: this.value
    }
  },
  methods: {
    handleDown: function () {
      if (this.currentValue > this.min) {
        this.currentValue = this.currentValue - this.step
      }
    },
    handleUp: function () {
      if (this.currentValue < this.max) {
        this.currentValue = this.currentValue + this.step
      }
    },
    updateValue: function (value) {
      if (value > this.max) this.currentValue = this.max;
      if (value < this.min) this.currentValue = this.min;
    },
    handleChange: function (event) {
      let value = event.target.value.trim()
      if (isValueNumber(value)) {
        value = Number(value)
        this.currentValue = value
        // 限定范围
        this.updateValue()
      } else {
        event.target.value = this.currentValue
      }
    },
    handleKeydown: function (event) {
      // ↑ 38, ↓ 40
      let code = event.keyCode
      if (code === 38) {
        this.handleUp()
      } else if (code === 40) {
        this.handleDown()
      }
    }
  },
  watch: {
    // 暂时未用到，但谨记，设计组件原则(API来源)：props, events, slots
    currentValue: function (value) {
      this.$emit('input', value)
      this.$emit('on-change', value)
    },
    value: function (value) {
      this.updateValue(value)
    }
  },
  mounted: function () {
    // 相当初始化，确保 value 在范围之内
    this.updateValue(this.value)
  }
})
