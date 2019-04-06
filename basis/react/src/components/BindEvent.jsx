import React from 'react'
// #region 介绍 React 中绑定事件的标准格式
// export default class BindEvent extends React.Component {
// 	constructor() {
// 		super()
// 		this.state = {}
// 	}

// 	render() {
// 		return <div>
// 			<button onClick={ () => this.show('哈哈', '栀子')}>按钮</button>
// 		</dvi>
// 	}

// 	show = (arg1, arg2) => {
// 		console.log('show 方法被调用了' + arg1 + arg2)
// 	}
// }
// #region

//#region 绑定事件，并在事件处理函数中，使用 this.setState
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
			<button onClick={ () => this.show('哈哈', '栀子')}>按钮</button>
		</div>
	}

	show = (arg1, arg2) => {
		console.log('show 方法被调用了' + arg1 + arg2)
		// 注意：React 中，如果想为 state 中的数据，重新赋值，不要使用 this.state.*** = 值
    // 应该调用 React 提供的 this.setState({ msg: '123' })
    // this.state.msg = 'Hi, I am back'

    // 在 React 中，推荐使用 this.setState({ }) 修改状态值
    this.setState({
    	// 在 setState ，只会把对应的 state 状态更新，而不会覆盖其它的 state 状态
    	msg: 'Two argument ' + arg1 + arg2
    }, function () {
    	console.log('this is a callback func. ' + this.state.msg)
    })
    // 注意： this.setState 方法的执行，是异步的；
    // 如果调用完 this.setState 之后想立即拿到最新的 state 值，需要使用 this.setState({}, callback)
	}
}
// #region