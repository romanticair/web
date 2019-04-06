// 可直接把父类，理解成原型对象 prototype
class Person {
  constructor(name, age){
    this.name = name
    this.age = age
  }

  sayHello(){
    console.log('大家好')
  }
}

class American extends Person {
	constructor(name, age) {
    // 如果一个子类，通过 extends 关键字继承了父类，那么在子类的 constructor 构造函数中，必须优先调用一下 super()
    // super 是一个函数，而且它是父类的构造器,子类中的 super 其实就是父类的 constructor 构造器的一个引用
		super(name, age)
	}
}

class Chinese extends Person {
	constructor(name, age, Id) {
		super(name, age)
    // 语法规范：在子类中，this 只能放到 super 之后使用
		this.Id = Id
	}
}

const a = new American('Jack', 20)
const c = new Chinese('张三', 22)
console.log(a)
a.sayHello()
console.log(c)
c.sayHello()