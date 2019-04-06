import React from 'react'
import CmtItem from '@/components/CmtItem2'
import cssobj from '@/css/cmtlist.scss'
import 'bootstrap/dist/css/bootstrap.css'

// 如果在引用某个包的时候，这个包被安装到了 node_modules 目录中，
// 则，可以省略 node_modules 这一层目录，直接以包名开始引入自己的 模块 或 样式表
// 自己规定： 第三方的 样式表，都是以 .css 结尾， 这样，我们不要为 普通的 .css 启用模块化
//           自己的样式表，都要以 .scss 或 .less 结尾， 只为 .scss 或 .less 文件启用模块化
export default class CmtList extends React.Component {
	constructor() {
		super()
		this.state = { // 评论列表数据
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
			<h1 className={[cssobj.title, 'test'].join(' ')}>简单封装果果 By SCSS</h1>	
			{/* <button className={[bsObj.btn, bsObj['btn-primary']].join(' ')}>按钮</button> */}
      <button className="btn btn-primary">按钮啊</button>
			{this.state.CommentList.map(item => <CmtItem {...item} key={item.id}></CmtItem>)}
		</div>
	}
}