import React from 'react'
import ReactDOM from 'react-dom'

let a = 10
let str = 'Hello, China'
let boo = false
let title = 'hello'
const h1 = <h1>红红火火</h1>
const arr = [
	<h2>这是个h2</h2>,
	<h3>这是个h3</h3>
]
const arrStr = ['小红', '小白', '小明', '大雷']

// 定义一个空数组，将来用来存放名称标签【方案1】
const nameArr = []
// 注意：React 中，需要把 key 添加给被 forEach 或 map 或 for 循环直接控制的元素
arrStr.forEach(item => {
	const tmp = <h5 key={item}>{item}</h5>
	nameArr.push(tmp)
})

// 数组的 map 方法, map 中必须写 return
const result = arrStr.map(item => {
	return item + 'Plus ---'
})

console.log(result)

// 调用 render 函数渲染 jsx XML 比 HTML 严格多了
// 什么情况下需要使用 {} 呢？当我们需要在 JSX 控制的区域内，写 JS 表达式了，则需要把 JS 代码写到 {} 中
ReactDOM.render(<div>
	{a + 2}
	<hr />
	{str}
	<hr />
	{boo} ? '条件为真' : '条件为假'
	<p title={title}>这是p标签</p>
	{h1}
	{/* {arr} */}
	{
		// 这是条注释
	}
	<hr />
	{nameArr}
	<hr />
	{arrStr.map(item => <div key={item}><h3>{item}</h3></div>)}
	<hr />
	<p className="el">这是在 react 里定义类名的方式</p>
	<label htmlFor="foru">这是 html 里的为 for</label>
</div>, document.getElementById('app'))