class Animal {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  // 静态属性声明失败
  // static info = { address: '北京', location: '马坡南' }

  // 实例方法
  say() {
    console.log('实例 say 方法')
  }
  // 静态方法
  static show() {
    console.log('静态 show 方法')
  }
}

const a1 = new Animal('小黄', 2)
console.log(a1)
console.log(a1.name)
a1.say()
// console.log(Animal.info)
Animal.show()