import React from 'react'
import CmtItem from '@/components/CmtItem'

export default class CmtList extends React.Component {
	constructor() {
		super()
		this.state = {
				// 评论列表数据
			CommentList: [
        { id: 1, user: '张三', content: '哈哈，沙发' },
        { id: 2, user: '李四', content: '哈哈，板凳' },
        { id: 3, user: '王五', content: '哈哈，凉席' },
        { id: 4, user: '赵六', content: '哈哈，砖头' },
        { id: 5, user: '田七', content: '哈哈，楼下山炮' }
      ]
		}
	}

	render() {
		return <div>
			{/* 注意：在 JSX 中，如果想写行内样式了，不能为 style 设置字符串的值 */}
      {/* 而是应该这么写 style={ { color: 'red' } } */}
      {/* <h1 style="color:red;">这是评论列表组件</h1> */}
      {/* 在 行内样式中，如果 是 数值类型的样式，则可以不用引号包裹，如果是字符串类型的样式值，必须使用引号包裹 */}
			<h1 style={{color: 'red', fontSize: '35px', fontWeight: 200, textAlign: 'center'}}></h1>	
			{this.state.CommentList.map(item => <CmtItem {...item} key={item.id}></CmtItem>)}
		</div>
	}
}