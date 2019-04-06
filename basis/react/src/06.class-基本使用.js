function Person(name, age) {
  this.name = name
  this.age = age
}

// info 属性，直接挂载给了构造函数，所以它是静态属性
Person.info = 'aaaa'
const p1 = new Person('王多多', 18)
console.log(p1)
console.log(p1.name)
console.log(p1.age)
console.log(Person.info)
console.log('---------------------------------')

class Animal {
  // 这是类中的构造器
  // 每一个类中，都有一个构造器，如果我们程序员没有手动指定构造器，那么，可以认为类内部有个隐形的、看不见的 空构造器，类似于 constructor(){}
  // 构造器的作用，就是，每当 new 这个类的时候，必然会优先执行 构造器中的代码
  constructor(name, age) {
    // 实例属性
    this.name = name
    this.age = age
  }
}

const a1 = new Animal('大黄', 3)
console.log(a1)
console.log(a1.name)
console.log(a1.age)