/**
 * Created by User on 2018/11/15.
 */
const path = require('path')
// 启用热更新的第 1 步
const webpack = require('webpack')
// 导入在内存中生成 HTML 页面的插件
// 只要是插件，都一定要放到 plugins 节点中去
// 这个插件的两个作用：
// 1. 自动在内存中根据指定页面生成一个内存的页面
// 2. 自动，把打包好的 bundle.js 追加到页面中去
const htmlWebpackPlugin = require('html-webpack-plugin')
// vue-loader v15 requires an accompanying webpack plugin to function properly
const vueLoaderPlugin = require('vue-loader/lib/plugin')

// 这个配置文件，起始就是一个JS文件，通过Node中的模块操作，向外暴露了一个配置对象
module.exports = {
  entry: path.resolve(__dirname, './src/index.js'), //在配置文件中，需要手动指定入口和出口
  output: { // 输出文件相关的配置
    // 指定打包好的文件输出到哪个目录中
    path: path.resolve(__dirname, './dist'),
    // 指定输出文件的名称
    filename: 'bundle.js'
  },
  devServer: {// 这是配置 dev-server 命令参数的第二种形式，相对来说这种方式麻烦一些
    // --open --port 3000 --contentBase src --hot
    //在 cmd 用 npm start 开启服务器
    open: true, // 自动打开浏览器
    port: 3000, // 设置启动时候的运行端口
    contentBase: 'src', // 指定托管的根目录
    hot: true // 启用热更新的第 2 步
  },
  plugins: [ // 配置插件的节点
    new webpack.HotModuleReplacementPlugin(), // new 一个热更新的模块对象，这是启用热更新的第 3 步
    new htmlWebpackPlugin({ // 创建一个在内存中生成 HTML 页面的插件
      template: path.resolve(__dirname, './src/index.html'), // 指定模板页面，将来会根据指定的页面路径，去生成内存中的页面
      filename: 'index.html'// 指定生成的页面的名称
    }),
    new vueLoaderPlugin()
  ],
  module: { // 此节点用于配置所有第三方模块加载器
    rules: [ // 所有第三方模块的匹配规则
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
      {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
      {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
      {test: /\.(png|jpg|jpeg|svg)$/, use: 'file-loader'},
      // { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=7631&name=[hash:8]-[name].[ext]' }, // 处理 图片路径的 loader
      // limit 给定的值是图片的大小，单位是byte，如果引用的图片大于或等于给定的limit值，则不会被转为base64格式的字符串,否则会被转为base64的字符串
      {test: /\.(woff|woff2|eot|ttf|otf)$/, use: 'url-loader'},
      {test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},// 配置 Babel 来转换高级的ES语法
      {test: /\.vue$/, use: 'vue-loader'} // 处理 .vue 文件的 loader
    ]
  },
  // resolve: {
  //   alias: { //修改 Vue 被导入时包的路径(为了导入 *.vue 文件的组件) -- 不推荐
  //     "vue$": "vue/dist/vue.js"
  //   }
  // }
}

// 当我们在控制台，直接输入 webpack 命令执行的时候，webpack 做了以下几步：
// 1. 首先，webpack 发现，我们并没有通过命令的形式，给它指定入口和出口
// 2. webpack 就会去项目的根目录中，查找一个叫做 `webpack.config.js` 的配置文件
// 3. 当找到配置文件后，webpack 会去解析执行这个配置文件，当解析执行完配置文件后，就得到了配置文件中，导出的配置对象
// 4. 当 webpack 拿到配置对象后，就拿到了配置对象中，指定的入口和出口，然后进行打包构建；