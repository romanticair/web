// 1.导入路由模块
import VueRouter from 'vue-router'

// 导入 Account 组件
import account from './main/Account.vue'
import goodsList from './main/GoodsList.vue'

// 导入 Account 的两个子组件
import login from './subcom/Login.vue'
import register from './subcom/Register.vue'

// 2. 创建路由对象并暴露接口
export default new VueRouter({
  routes: [
    {
    	path: '/account',
    	component: account,
    	children: [
	    	{ path: 'login', component: login },
	    	{ path: 'register', component: register }
    	]
    },
    { path: '/goodslist', component: goodsList}
  ]
})