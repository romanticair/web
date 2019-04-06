function Person(name, age) {
  this.name = name
  this.age = age
}

// info 属性，直接挂载给了构造函数，所以它是静态属性
Person.info = 'aaaa'

// 实例方法
Person.prototype.say = function () {
  console.log('这是 Person 的实例方法')
}

// 静态方法
Person.show = function () {
  console.log('这是 Person 的静态 show 方法')
}

const p1 = new Person('王多多', 18)
console.log(p1)
p1.say()
Person.show()
console.log('---------------------------------')

class Animal {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  jiao() {
    console.log('这是 Animal 的实例方法')
  }

  // 这是 动物 类的静态方法
  static show() {
    console.log('这是 Animal 的静态 show 方法')
  }
}

const a1 = new Animal('大黄', 3)
console.log(a1)
a1.jiao()
Animal.show()