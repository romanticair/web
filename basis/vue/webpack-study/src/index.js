/**
 * Created by User on 2018/11/14.
 */

// main.js 是我们项目的JS入口文件
// 1. 导入 Jquery
// import * from * 是ES6中导入模块的方式
// 由于ES6的代码，太高级了，浏览器解析不了，所以这一行执行会报错
import $ from 'jquery'
//nodejs 语法不管用
//const $ = require('jquery')

// 使用 import 语法，导入 CSS样式表
import './css/index.css'
import './css/index.less'
import './css/index.scss'

// 注意：webpack, 默认只能打包处理 JS 类型的文件，无法处理其它的非 JS 类型的文件；
// 如果要处理非JS类型的文件，我们需要手动安装一些合适第三方 loader 加载器；
// 1. 如果想要打包处理 css 文件，需要安装 cnpm i style-loader css-loader -D
// 2. 打开 webpack.config.js 这个配置文件，在里面，新增一个配置节点，叫做 module, 它是一个对象；在这个 module 对象身上，有个 rules 属性，这个 rules 属性是个 数组；这个数组中，存放了，所有第三方文件的 匹配和 处理规则；

// 注意：webpack 处理第三方文件类型的过程：
// 1. 发现这个要处理的文件不是JS文件，然后就去配置文件中，查找有没有对应的第三方 loader 规则
// 2. 如果能找到对应的规则，就会调用对应的 loader 处理这种文件类型；
// 3. 在调用 loader 的时候，是从后往前调用的；
// 4. 当最后的一个 loader 调用完毕，会把处理的结果，直接交给 webpack 进行打包合并，最终输出到 bundle.js 中去

$(function () {
  $('li:odd').css('backgroundColor', 'pink')
  $('li:even').css('backgroundColor', function () {
    return '#' + 'D97664'
  })
})
// 经过刚才的演示，Webpack 可以做什么事情?
// 1. webpack 能够处理JS文件的互相依赖关系；
// 2. webpack 能够处理JS的兼容问题，把高级的、浏览器不是别的语法，转为低级的，浏览器能正常识别的语法

// 刚才运行的命令格式：webpack 要打包的文件的路径打包好的输出文件的路径

// 使用 webpack-dev-server 这个工具，来实现自动打包编译的功能
// 1. 运行 npm i webpack-dev-server -D 把这个工具安装到项目的本地开发依赖
// 2. 安装完毕后，这个工具的用法， 和 webpack 命令的用法，完全一样
// 3. 由于，我们是在项目中，本地安装的 webpack-dev-server， 所以无法把它当作脚本命令，在powershell终端中直接运行（只有那些安装到全局 -g 的工具，才能在终端中正常执行）
// 4. 注意：webpack-dev-server 这个工具，如果想要正常运行，要求，在本地项目中，必须安装 webpack
// 5. webpack-dev-server 帮我们打包生成的 bundle.js 文件，并没有存放到实际的物理磁盘上；而是直接托管到了电脑的内存中，所以我们在项目根目录中，根本找不到这个打包好的 bundle.js;
// 6. 我们可以认为，webpack-dev-server 把打包好的文件，以一种虚拟的形式，托管到了咱们项目的根目录中，虽然我们看不到它，但是可以认为，和 dist src node_modules 平级，有一个看不见的文件，叫做 bundle.js


/* ----------------- ES6 --------------------- */
// class 关键字，是ES6中提供的新语法，是用来实现 ES6 中面向对象编程的方式
class Person {
  // 使用 static 关键字，可以定义静态方法
  // 注意：class里面函数不用添加 function
  // 而且只能添加静态方法而不是属性? 需要更高级的语法?
  // static person = "hello";    此语句报错
  static person(){
    console.log('hello, haha')
  }
}

//访问 Person 类的静态方法
console.log(Person.person())
// 在 webpack 中，默认只能处理一部分 ES6 的新语法，一些更高级的ES6语法或者 ES7 语法，webpack 是处理不了的；这时候，就需要借助于第三方的 loader，来帮助webpack 处理这些高级的语法，当第三方loader 把高级语法转为低级的语法之后，会把结果交给 webpack 去打包到 bundle.js 中
// 通过 Babel，可以帮我们将高级的语法转换为低级的语法 (目前有更新, v6 -> v7 架构有变更，以下是v6的)
// 1. 在 webpack 中，可以运行如下两套命令，安装两套包，去安装 Babel 相关的loader功能：
// 1.1 第一套包：cnpm i babel-core babel-loader babel-plugin-transform-runtime -D
// 1.2 第二套包：cnpm i babel-preset-env babel-preset-stage-0 -D
// 2. 打开 webpack 的配置文件，在 module 节点下的 rules 数组中，添加一个 新的 匹配规则：
// 2.1 { test:/\.js$/, use: 'babel-loader', exclude:/node_modules/ }
// 2.2 注意：在配置 babel 的 loader规则的时候，必须把 node_modules 目录，通过 exclude 选项排除掉：原因有俩：
// 2.2.1 如果不排除 node_modules， 则Babel 会把 node_modules 中所有的第三方 JS 文件，都打包编译，这样会非常消耗CPU，同时，打包速度非常慢；
// 2.2.2 哪怕最终 Babel 把所有 node_modules 中的JS转换完毕了，但是项目也无法正常运行！
// 3. 在项目的根目录中，新建一个叫做 .babelrc 的Babel 配置文件属于JSON格式，所以在写 .babelrc 配置的时候，必须符合JSON语法规范：不能写注释，字符串必须用双引号
// 3.1 在 .babelrc 配置内容
//   "presets": ["env", "stage-0"],
//   "plugins": ["transform-runtime"]
// }
// 4. 目前安装的 babel-preset-env, 是比较新的ES语法，之前安装的是 babel-preset-es2015, 现在出了一个更新的语法插件，叫做 babel-preset-env，它包含了所有的和 es*相关的语法

// 但是目可执行的大多是按 v7 配置的(.babelrc -> .babelrc.js 文件)
// https://babeljs.io/docs/en/config-files#config-function-api
function Animal(name) {
  this.name = name
}
Animal.info = 3
var a1 = new Animal('小花花')
// 这是静态属性：
console.log(Animal.info)
// 这是实例属性：
console.log(a1.name)
/* ----------------- Vue --------------------- */
// 在webpack中尝试使用 Vue
// 在 webpack 中，使用 import Vue from 'vue' 导入的Vue构造函数，功能不完整，只提供了 runtime-only 的方式，并没有提供像网页中那样的使用方式
// import Vue from 'vue'
// import Vue from '../node_modules/vue/dist/vue.js'
// 回顾包的查找规则：
// 1.找项目根目录中有没有 node_modules 的文件夹
// 2.在 node_modules 中根据包名，找对应的 vue 文件夹
// 3.在 vue 文件夹中，找一个叫做 package.json 的包配置文件
// 4.在 package.json 文件中，查找一个 main 属性【main属性指定了这个包在被加载时候，的入口文件】

// var login = {
//   template: '<h1>这是login组件，是使用网页中形式创建出来的组件</h1>'
// }

// 1. 导入 login 组件
// import login from './login.vue'
// 默认，webpack 无法打包 .vue 文件，需要安装相关的loader： 
//  cnpm i vue-loader vue-template-compiler -D
//  在配置文件中，新增loader哦配置项 { test:/\.vue$/, use: 'vue-loader' }
// var vm = new Vue({
// 	el: '#app',
// 	data: {
// 		msg: 123
// 	},
	// components: {
  //   login
  // }
  /* render: function (createElements) { //在webpack中，如果想要通过 vue，把一个组件放到页面中去展示，vm实例中的 render 函数可以实现
    return createElements(login)
  } */
//   render: c => c(login) // es6简写语法
// })

// 总结梳理：webpack 中如何使用 vue
// 1. 安装vue的包：cnpm i vue -S
// 2. 由于在 webpack 中，推荐使用 .vue 这个组件模板文件定义组件，所以需要安装能解析这种文件的loader, cnpm i vue-loader vue-template-complier -D
// 3. 在 main.js 中，导入 vue 模块, import Vue from 'vue'
// 4. 定义一个 .vue 结尾的组件，其中组件有三部分组成 template script style
// 5. 使用 import login from './login.vue' 导入这个组件
// 6. 创建 vm 的实例 var vm = new Vue({ el: '#app', render: c => c(login) })
// 7. 在页面中创建一个 id 为 app 的div元素，作为我们 vm 实例要控制的区域

import p, { title as subtitle, content } from './export_var.js'
// output: person, title, content
console.log(p)
console.log(subtitle + '---' + subtitle)

/* ----------------- Vue 导包组件 --------------------- */
// 1. 导入模块
import Vue from 'vue'
import VueRouter from 'vue-router'
// 1.安装路由
Vue.use(VueRouter)
// 2.导入 App 组件
import app from './App.vue'
// 3.导入 Account 组件
// import account from './main/Account.vue'
// import goodsList from './main/GoodsList.vue'
// 4.创建路由对象
// var router = new VueRouter({
//   routes: [
//     { path: '/account', component: account },
//     { path: '/goodslist', component: goodslist }
//   ]
// })

// 导入自定义路由模块
import router from './router.js'

var vm = new Vue({
  el: '#app',
  render: c => c(app),// 5.render会把 el 指定的容器中，所有的内容都清空覆盖，所以不要把路由的 router-view 和 router-link 直接写到 el 所控制的元素中
  router // 6.将路由对象挂载到 vm 上
})
// 注意：App 这个组件是通过 VM 实例的 render 函数，渲染出来的， render 函数如果要渲染组件，渲染出来的组件，只能放到 el: '#app' 所指定的元素中
// Account 和 GoodsList 组件，是通过路由匹配监听到的，所以这两个组件只能展示到属于路由的 <router-view></router-view> 中去