var app = new Vue({
  el: '#app',
  data: {
    goodsList: {
      eletronics: [
        {
          id: 1,
          cate: '电子产品',
          name: 'iPhone7',
          price: 6188,
          store: 10,
          count: 1,
          selected: false
        },
        {
          id: 2,
          cate: '电子产品',
          name: 'iPad Pro',
          price: 5888,
          store: 10,
          count: 1,
          selected: false
        },
        {
          id: 3,
          cate: '电子产品',
          name: 'MacBook Pro',
          price: 21488,
          store: 10,
          count: 1,
          selected: false
        }
      ],
      supplies: [
        {
          id: 1,
          cate: '生活产品',
          name: '洗衣粉',
          price: 12,
          store: 10,
          count: 1,
          selected: false
        },
        {
          id: 2,
          cate: '生活产品',
          name: '洗发露',
          price: 14,
          store: 10,
          count: 1,
          selected: false
        },
        {
          id: 3,
          cate: '生活产品',
          name: '牙膏',
          price: 8,
          store: 10,
          count: 1,
          selected: false
        }
      ],
      foods: [
        {
          id: 1,
          cate: '饮食产品',
          name: '西兰花',
          price: 6,
          store: 10,
          count: 1,
          selected: false
        },
        {
          id: 2,
          cate: '饮食产品',
          name: '西红柿',
          price: 3,
          store: 10,
          count: 1,
          selected: false
        },
        {
          id: 3,
          cate: '饮食产品',
          name: '榴莲',
          price: 18,
          store: 10,
          count: 1,
          selected: false
        }
      ]
    },
    selectedAll: false
  },
  methods: {
    reduceCount: function (key, index) {
      if (this.goodsList[key][index] !== 1) {
        this.goodsList[key][index].count--
      }
    },
    addCount: function (key, index) {
      let goods = this.goodsList[key][index]
      if (goods.count < goods.store) {
        goods.count++
      }
    },
    removeGoods: function (key, index) {
      this.goodsList[key].splice(index, 1)
    },
    selectGoods: function (key, index) {
      let goods = this.goodsList[key][index]
      goods.selected = !goods.selected
    },
    selectAll: function () {
      this.selectedAll = !this.selectedAll
      for (let key in this.goodsList) {
        this.goodsList[key].forEach(goods => {
          goods.selected = this.selectedAll
        })
      }
    }
  },
  computed: {
    totalPrice: function () {
      let total = 0
      for (let key in this.goodsList) {
        let goods = this.goodsList[key]
        for (let i = 0, len = goods.length; i < len; i++) {
          if (goods[i].selected) {
            total += goods[i].price * goods[i].count
          }
        }
      }

      return total.toString().replace(/\B(?=(\d{3})+$)/g, ',')
    },
  }
})
