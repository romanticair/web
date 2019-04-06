import React from 'react'

export default class BindEvent extends React.Component {
	constructor() {
		super()
		this.state = {
			msg: '哈哈',
      name: 'zs',
      age: 22,
      gender: '男'
		}
	}

	render() {
		return <div>
      {/* 需求：点击按钮，把修改 msg 的值 */}
			<button onClick={ () => this.show('哈哈', '栀子')}>按钮</button>
			<h3>{this.state.msg}</h3>
			{/* 如果只是把文本框的 value 属性绑定到 state 状态，但如果不提供 onChagne 处理函数的话，得到的文本框将会是一个只读的文本框 */}
      {/* 当为文本框绑定 value 值以后，要么同时提供一个 readOnly， 要么提供一个 onChange 处理函数 */}
      {/* <input type="text" style={{ width: '100%' }} value={this.state.msg} readOnly /> */}
      <input type="text" style={{ width: '100%' }} value={ this.state.msg } onChange={(e) => this.txtChanged(e)} ref='txt'></input>	
		</div>
	}

	txtChanged = (e) => {
    console.log('有变化了')
		// 在 onChange 事件中，获取文本框的值，有两种方案
    // 方案1：通过事件参数 e 来获取；
    console.log(e.target.value)
    console.log(this.refs.txt.value)
    const newValu = e.target.value
    this.setState({
    	msg: newValu
    })
	}

		show = (arg1, arg2) => {
		console.log('show 方法被调用了' + arg1 + arg2)
    this.setState({
    }, function () {
    	console.log('this is a callback func. ' + this.state.msg)
    })
	}
}