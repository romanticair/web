import React from 'react'
import ReactDOM from 'react-dom'

// 第一种创建组件的方式
function Hello(props) {
  // 如果在一个组件种 return 一个 null 则表示此组件是空的，什么都不会渲染
  // return null
  // 在组件中，必须返回一个合法的 JSX 虚拟DOM元素
  // props.name = 'zs'
  console.log(props.name)
  // 不论是 Vue 还是 React，组件中的 props 永远都是只读的,不能被重新赋值
  return <div>这是 Hello 组件 --- {props.name} --- {props.age} --- {props.gender}</div>
}

const dog = {
  name: '大黄',
  age: 3,
  gender: '雄'
}

ReactDOM.render(<div>
	I'm a dog dog...
	{/* 直接把组件的名称，以标签形式，丢到页面上即可 */}
	{/* <Hello name={dog.name} age={dog.age} gender={dog.gender}></Hello> */}
	<Hello {...dog}></Hello>
</div>, document.getElementById('app'))


/* var o2 = {
  age: 22,
  address: '中国北京',
  phone: '139999'
}

// 扩展数组表达式
var o1 = {
  name: 'zs',
  ...o2
}

console.log(o1) */