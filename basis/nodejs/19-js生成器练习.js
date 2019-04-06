// ex1
function *EvenGenerator() {
  let num = 2
  while(true) {
    yield num
    num += 2
  }
}

let generator1 = EvenGenerator()
let a1 = generator1.next().value
let a2 = generator1.next().value
let a3 = EvenGenerator().next.value
let a4 = generator1.next().value
console.log(a1, a2, a3, a4) // 2 4 undefined 6


// ex2
function *NinjaGenerator() {
  yield 'Yoshi'
  return 'Hattori'
  yield 'Hanzo'
}

let ninjas = []
for(let ninja of NinjaGenerator()){
  ninjas.push(ninja)
}
console.log(ninjas) // ['Yohis']


// ex3
function *Gen(val) {
  val = yield val * 2
  yield val
}

let generator2 = Gen(2)
let v1 = generator2.next(3).value
let v2 = generator2.next(5).value
console.log(v1, v2) // 4 5