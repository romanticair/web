// https://socket.io/docs/server-api/
const http = require('http')
const fs = require('fs')
const mysql = require('mysql')
const io = require('socket.io')
const regs = require('../libs/regs')

let db = mysql.createPool({host: 'localhost', user: 'siri', password: 'siripassword', database: 'chatroom'})

// 存储已登录的用户名，用于页面跳转后的验证
let userList = []
let httpServer = http.createServer((req, res) => {
  if (req.url === '/index' || req.url === '/') {
    // console.log(req.headers.cookie)
    // io=626Ky_cqDBpixd3YAAAB; username=bilybily
    // 暂时先简单处理
    /*
    let cookieList = req.headers.cookie ? req.headers.cookie.split('; ') : []
    let exist = cookieList.some((value, i) => {
      let username = value.split('=')[1]
      // return userList.some(user => user === username)
      return userList.includes(username)
    })
    */

    // online 作标识符，遍历 name 和 userList，找出已登录但未在聊天室的用户，为其层现页面
    // 异步操作
    db.query('SELECT name FROM room WHERE online=1', (err, data) => {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.writeHead(404)
        res.write('服务器读取数据失败')
        res.end()
      } else {
        // 得到已登录但未渲染页面给该用户的名字
        let who = data.filter((user, i) => !userList.includes(user.name))
        let online = who.length > 0 ? false : true
        if (data.length < 1 || online) {
          // 没登录则直接跳回登录页面
          res.setHeader('Location', '/test_ws.html')
          res.statusCode = 302
          res.end()
        } else {
          fs.readFile(__dirname + '/index.html', (err, data) => {
            if (err) {
              res.setHeader('Content-Type', 'text/plain; charset=utf-8')
              res.writeHead(404)
              res.write('服务器读取数据失败')
            } else {
              res.write(data.toString())
            }
            userList.push(who[0].name)
            res.end()
          })
        }
      }
    })
  } else {
    fs.readFile(__dirname + req.url, (err, data) => {
      if (err) {
        res.writeHead(404)
        res.write('Not Found')
      } else {
        res.write(data.toString())
      }
      res.end()
    })
  }
})

httpServer.listen(3000, () => {
  console.log('listening on *:3000')
})

let sockList = []
let wsServer = io.listen(httpServer)
wsServer.on('connection', sock => {
  sockList.push(sock)
  let cur_user = null
  // let cur_id = null
  let online = false

  // 注册接口
  sock.on('reg', (user, passwd) => {
    if (!regs.username.test(user)) {
      sock.emit('reg_ret', 1, '用户名不符合规范')
    } else if (!regs.password.test(passwd)) {
      sock.emit('reg_ret', 1, '密码不符合规范')
    } else {
      db.query(`SELECT * FROM room WHERE name='${user}'`, (err, data) => {
        if (err) {
          sock.emit('reg_ret', 1, '数据库出错')
        } else if (data.length > 0) {
          sock.emit('reg_ret', 1, '用户名已存在')
        } else {
          db.query(`INSERT INTO room (name, password) VALUES('${user}', '${passwd}')`, err => {
            if (err) {
              sock.emit('reg_ret', 1, '服务繁忙，请稍后重试')
            } else {
              sock.emit('reg_ret', 0, '注册成功')
            }
          })
        }
      })
    }
  })

  // 登录接口
  sock.on('login', (user, passwd) => {
    if (!regs.username.test(user)) {
      sock.emit('login_ret', 1, '用户名不符合规范')
    } else if (!regs.password.test(passwd)) {
      sock.emit('login_ret', 1, '密码不符合规范')
    }
    else {
      db.query(`SELECT id,password FROM room WHERE name='${user}'`, (err, data) => {
        if (err) {
          sock.emit('login_ret', 1, '数据库出错')
        } else if (data.length < 1) {
          sock.emit('login_ret', 1, '该用户不存在')
        } else if (data[0].password !== passwd) {
          sock.emit('login_ret', 1, '密码不正确')
        } else {
          // 如果已经登录了，则提示信息
          let isLogin = userList.some(name => user === name)
          if (isLogin) {
            sock.emit('login_ret', 1, '该用户已经登录')
          } else {
            db.query(`UPDATE room SET online=1 WHERE id=${data[0].id}`, err => {
              if (err) {
                sock.emit('login_ret', 1, '服务繁忙，请稍后重试')
              } else {
                // cur_user = user
                // cur_id = data[0].id
                // userList.push(cur_user)
                online = true
                sock.emit('login_ret', 0, '登录成功')
              }
            })
          }
        }
      })
    }
  })

  // 聊天接口
  sock.on('chat', (name, msg) => {
    // 广播
    if (!msg) {
      sock.emit('chat_ret', 1, '信息不能为空')
    } else {
      sockList.forEach((socket, i) => {
        if (socket !== sock) {
          socket.emit('everyone', name, msg)
        }
      })
      sock.emit('chat_ret', 0, '发送成功')
    }
  })

  // 登录后跳转页面前在服务端输出一下
  sock.on('online', (name, msg) => {
    // online = true
    // cur_user = name
    console.log(`${name} ${msg}`)
  })

  sock.on('scan', username => {
    cur_user = username
  })

  // 断开连接
  sock.on('disconnect', () => {
    // 即使是在同一页面使用 location 跳转，也会触发 disconnect，致使 online 状态有点别扭
    if (!online) {
      db.query(`UPDATE room SET online=0 WHERE name='${cur_user}'`, err => {
        if (err) {
          console.log('数据库出错', err)
        }
      })

      // 将断开的 sock 和离开聊天室的用户过滤掉
      sockList = sockList.filter(item => item !== sock)
      userList.splice(userList.indexOf(cur_user), 1)
    }

    // 在聊天室里离开时才会触发
    if (cur_user) {
      console.log(cur_user, '断开连接')
      cur_user = null
    }
  })
})
