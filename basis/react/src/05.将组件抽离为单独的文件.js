import React from 'react'
import ReactDOM from 'react-dom'

// 导入 Hello 组件
// 默认如果不做单独的配置的话，不能省略 .jsx 后缀名
// import Hello from './components/Hello.jsx'
import Hello from '@components/Hello'

const dog = {
  name: '大黄',
  age: 3,
  gender: '雄'
}
ReactDOM.render(<div>
  汪汪!!!<Hello {...dog}></Hello>
</div>, document.getElementById('app'))