const mysql = require('mysql')
const fs = require('fs')
const server = require('http').createServer()
const url = require('url')

// 连接数据库并建立连接池，默认 10 个
let db = mysql.createPool({host: 'localhost', user: 'siri', password: 'siripassword', database: 'chatroom'})

server.on('request', (req, res) => {
  // true 解析字段名
  let {pathname, query} = url.parse(req.url, true)
  if (pathname === '/' || pathname === '/index') {
    // 聊天室页面
    // 检查有没有登录（这里没处理，拒绝所有访问 /index 的请求），没登录的话跳转到 /login
    let isLogin = false
    if (isLogin) {
      fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
          return res.end('服务繁忙，请稍后重试')
        }
        res.end(data.toString())
      })
    } else {
      res.statusCode = 302
      res.setHeader('Location', '/login')
      res.end()
    }
  } else if (pathname === '/tologin') {
    // 登录操作
    let {user, passwd} = query
    res.setHeader('Content-Type', 'application/json')
    // 校验数据
    if (!/^\w{6,32}$/.test(user)) {
      res.write(JSON.stringify({code: 1, msg: '用户名不符合规范'}))
      res.end()
    } else if (!/^.{6,32}$/.test(passwd)) {
      res.write(JSON.stringify({code: 1, msg: '密码不符合规范'}))
      res.end()
    } else {
      // 校验账号密码一致性
      db.query(`SELECT id,password FROM room WHERE name='${user}'`, (err, data) => {
        if (err) {
          res.write(JSON.stringify({code: 1, msg: '数据库出错'}))
          res.end()
        } else if (data.length === 0) {
          res.write(JSON.stringify({code: 1, msg: '该用户名不存在'}))
          res.end()
        } else if (data[0].password !== passwd) {
          res.write(JSON.stringify({code: 1, msg: '用户名或密码错误'}))
          res.end()
        }
        else {
          // 登录成功，记录登录状态，跳转页面
         db.query(`UPDATE room SET online=1 WHERE id='${data[0].id}'`, err => {
           if (err) {
              res.write(JSON.stringify({code: 1, msg: '数据库更新状态发生错误'}))
            } else {
              // 不做任何处理，通过测试即可
              // res.statusCode = 302
              // res.setHeader('Location', '/index')
              res.write(JSON.stringify({err: 0, msg: '登录成功'}))
            }
            res.end()
          })
        }
      })
    }
  } else if (pathname === '/reg') {
    // 注册操作
    let {user, passwd} = query
    res.setHeader('Content-Type', 'application/json')
    // 校验数据
    if (!/^\w{6,32}$/.test(user)) {
      res.write(JSON.stringify({code: 1, msg: '用户名不符合规范'}))
      res.end()
    } else if (!/^.{6,32}$/.test(passwd)) {
      res.write(JSON.stringify({code: 1, msg: '密码不符合规范'}))
      res.end()
    } else {
      // 校验用户名是否重复
      db.query(`SELECT * FROM room WHERE name='${user}'`, (err, data) => {
        if (err) {
          res.write(JSON.stringify({code: 1, msg: '数据库出错'}))
          res.end()
        } else if (data.length > 0) {
          res.write(JSON.stringify({code: 1, msg: '用户名已存在'}))
          res.end()
        } else {
          // 更新数据库
          db.query(`INSERT INTO room (name, password, online) VALUES('${user}', '${passwd}', 0)`, err => {
            if (err) {
              res.write(JSON.stringify({code: 1, msg: '服务繁忙，请稍后重试'}))
              return res.end()
            }
            res.write(JSON.stringify({code: 0, msg: '注册成功'}))
            console.log('注册成功')
            res.end()
          })
        }
      })
    }
  } else if (pathname === '/login') {
    fs.readFile(__dirname + '/test_main.html', (err, data) => {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('服务器繁忙')
      } else {
        res.end(data.toString())
      }
    })
  }
  else {
    // 访问不存在的接口
    // <script src="/node_modules/jquery/dist/jquery.js"></script>
    // console.log(pathname) 会输出 /node_modules/jquery/dist/jquery.js
    // 由此可知路由会进此入口，可以在此读入静态文件，然后设置 Content-Type，将内容返回给页面
    // <script src="http://localhost:3000/socket.io/socket.io.js"></script> 自定义的话需要自己规定一些补全规则，lib src dist，大小写等等
    // 所以，用 express.static 设置全局静态资源路径更方便
    if (pathname.startsWith('/node_modules')) {
      fs.readFile('L://romantic-air/web/apps/chatroom/' + pathname, (err, data) => {
        if (err) {
          return res.end('链入静态文件失败')
        }
        res.setHeader('Content-Type', 'text/javascript')
        res.end(data.toString())
      })
    } else {
      fs.readFile(__dirname + '/404.html', function (err, data) {
        if (err) {
          return res.end('404')
        }
        res.statusCode = 404
        res.end(data.toString())
      })
    }
  }
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
