// 在 Node 中，每个模块内部都有一个自己的 module 对象
// 该 module 对象中，有一个成员叫：exports 也是一个对象
// 也就是说如果你需要对外导出成员，只需要把导出的成员挂载到 module.exports 中

// 我们发现，每次导出接口成员的时候都通过 module.exports.xxx = xxx 的方式很麻烦，点儿的太多了
// Node 为了操作，专门提供了一个变量：exports 等于 module.exports

// var module = {
//   exports: {
//     foo: 'bar',
//     add: function
//   }
// }

// 也就是说在模块中还有这么一句代码
// var exports = module.exports

// 两者一致，说明可以使用任意一方来导出内部成员
// console.log(exports === module.exports)

// exports.foo = 'bar'
// module.exports.add = function (x, y) {
//   return x + y
// }


// 当一个模块需要导出单个成员的时候
// 直接给 exports 赋值是不管用的

// exports.a = 123
// exports = {}
// exports.foo = 'bar'
// module.exports.b = 456

// 给 exports 赋值会断开和 module.exports 之间的引用
// 同理，给 module.exports 重新赋值也会断开

// 这里导致 exports !== module.exports
// module.exports = {
//   foo: 'bar'
// }

// 但是这里又重新建立两者的引用关系
// exports = module.exports
// exports.foo = 'hello'

// {foo: bar}
exports.foo = 'bar'

// {foo: bar, a: 123}
module.exports.a = 123

// 真正去使用的时候：
// 导出多个成员：exports.xxx = xxx
// 导出多个成员也可以：module.exports = {
//                    }
// 导出单个成员：module.exports

// 谁来 require 我，谁就得到 module.exports
// 默认在代码的最后有一句：
// 		一定要记住，最后 return 的是 module.exports
// 		不是 exports
// 所以给 exports 重新赋值不管用