Vue.component('beau-button', {
  name: 'beau-button',
  template: `
    <button @click="handleClick" :disabled="banned" class="beau-btn">
      <slot></slot>
    </button>
  `,
  props: {
    banned: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
})
