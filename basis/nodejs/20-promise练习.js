// ex1
const promise = new Promise((resolve, reject) => {
  reject('Hattori') // 触发 reject
})
promise.then(val => console.log('Success1: ' + val)).catch(
  e => console.log('Error1: ' + e)
)


// ex2
const pm = new Promise((resolve, reject) => {
  resolve('Hattori') // 触发 resolve
  // 只有一个结果，非成功即失败
  setTimeout(() => reject('Yoshi'), 500)
})
pm.then(value => console.log('Success2: ' + value)).catch(
  e => console.log('Error2: ' + e)
)