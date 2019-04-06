class Person {
	constructor(name, age) {
		this.name = name
		this.age = age
	}
}

class American extends Person {}
class Chinese extends Person{}

const a = new American('Jack', 20)
const c = new Chinese('张三', 22)
console.log(a)
console.log(c)