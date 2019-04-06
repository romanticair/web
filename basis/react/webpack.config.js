const path = require('path')
// 在内存中自动生成 index 页面的插件
const HtmlWebPackPlugin = require('html-webpack-plugin')

// 创建一个插件的实例对象
const htmlPlugin = new HtmlWebPackPlugin({
	// 源文件和在内存生成首页的名称
	template: path.resolve(__dirname, './src/index.html'),
	filename: 'index.html'
})

// 向外暴露一个打包的配置对象,因为 webpack 是基于Node构建的,所以 webpack 支持所有Node API和语法
// webpack 默认只能打包处理 .js 后缀名类型的文件,像 .png .vue 无法主动处理，所以要配置第三方的loader
module.exports = {
	mode: 'development',
  // 在 webpack 4.x 中，有一个很大的特性，就是约定大于配置规定，默认打包入口路径是 src -> index.js
  plugins: [htmlPlugin],
  module: {// 所有第三方模块的配置规则
  	rules: [
  		{test: /\.js|jsx$/, use: 'babel-loader', exclude: /node_modules/},
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
  		{test: /\.ttf|woff|woff2|eot|svg$/, use: 'url-loader'},
  		{test: /\.scss$/, use: ['style-loader', 'css-loader?modules&localIdentName=[path][name]-[local]-[hash:5]', 'sass-loader']},
  	]
  },
	resolve: {
		extensions: ['.js', '.jsx', '.json'],// 表示这几个文件的后缀名可以省略不写
		alias: {// 表示别名
			'@': path.resolve(__dirname, './src')// 这样，@ 就表示项目根目录中 src 的这一层路径
		}
  }
}