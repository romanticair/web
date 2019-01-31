# Websocket 聊天室

> 聊天室是通过 Websocket 协议进行通信的一个小案例，对用户的连接状态控制和
> 信息同步转发等操作进行练习，最终使不同用户间的信息能够同步共享。



## 数据库设计

聊天室用户数据持久化是用 mysql 数据库，相对应的 npm 包就是 `mysql`，本案例只用到了该
包的少许 API，[查看更多 mysql 相关信息](https://github.com/mysqljs/mysql/tree/v0.9)。



创建一个名为 chatroom 的数据库，和一个名为 room 的表，表的数据结构如下：

| Filed | Type  | Null | Key | Default | Extra |
| :------: | :---: | :--: | :--: | :--: | :--: |
|    id    |  int  |  NO   |   PRI   |  NULL  | auto_increment |
| username | varchar(32) |  NO  |      |  NULL  |      |
| password | varchar(32) |  NO  |      |  NULL  |      |
|  online  |  bit(1)  |   NO   |      |  b'0'  |      |



## 聊天室设计

1. 注册和登录接口处于同一页面。
2. 客户端未登录账户访问聊天室页面时，直接跳转回登录/注册页面。
3. 已登录的用户不可再次登录，因此不会造成强制下线或同一用户同时出现在两个窗口。
4. 一个客户端可以登录多个账户，在线的聊天内容同步化。
5. 对于一些错误或非服务器服务范围内的操作，皆返回 `404.html` 页面。





以上叙述是该服务器主要服务的响应部分，详细内容请看[案例源码](https://github.com/romanticair/web/blob/master/demo/chatroom/src/ws.js)。

> 说明：main.js、test_main.html 两文件与聊天室案例的运行无关。



## 功能实现

> 这里将所有的服务器逻辑都写在单文件 `ws.js` 里，登录/注册页面为 `test_ws.html`，聊天室页面为 `index.html`。




### 服务器
#### 导入必要库

引入几个必要的库，利用它们提供的底层支持和简洁、易用的接口，加快开发速度。

```js
const http = require('http')
const fs = require('fs')
const mysql = require('mysql')
const io = require('socket.io')
// 引入封装了验证账号和密码的正则表达式接口
const regs = require('../libs/regs')
```



#### 部署外层服务

连接数据库服务接口，创建并开启服务器，再用 websocket 监听 http 服务器。

```js
// 默认 10 个服务器连接池，控制连接与断开的频率
let db = mysql.createPool({host: 'localhost', user: 'siri', password: 'siripassword', database: 'chatroom'})
// 存储已登录的用户名，用于页面跳转后的验证
let userList = []
let httpServer = http.createServer((req, res) => {
  // TODO 服务路由以及其它相关操作
})

httpServer.listen(3000, () => {
  console.log('listening on *:3000')
})

// 每个连接的 sock 的不一样
let sockList = []
let wsServer = io.listen(httpServer)
wsServer.on('connection', sock => {
  // TODO 客户端连接服务器时所有的监听接口
})
```



#### 服务路由

有了服务器，我们来设置路由，避免客户端页面无响应（转圈圈）。路由只有一个分支，第一个即是特殊对待聊天室页面（index.html）的访问，也就是：想要进入聊天室，得看看你有没有登录，没有的话得回到登录页面登录。
否则就记录用户信息，并允许其进入聊天室。检查有没有登录主要依靠一个标识符 `online` ，将 `online` 为开（b'1'）的所有用户与顶层用户列表进行匹配过滤，找出已登录但未在聊天室的用户。

> 客户端输入账号登录成功后服务端将数据库中相应用户的 online 字段更新为 1，断开时重置为 0。



另一个则是其它页面的通用接口，访问时则要看看给的文件路径在不在当前目录下，若不在则 404 错误，否则
读取全文，并将其内容 toString 返回给客户端。

```js
let httpServer = http.createServer((req, res) => {
	if (req.url === '/index' || req.url === '/') {
    // 原理为遍历 name 和 userList，找出已登录但未在聊天室的用户，允许为其层现页面。
    // 注意：这里是异步操作
    db.query('SELECT name FROM room WHERE online=1', (err, data) => {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.writeHead(404)
        res.write('服务器读取数据失败')
        res.end()
      } else {
        // 得到已登录但未渲染页面给该用户的名字，即未记录入全局列表 userList
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
            // 记录入列表
            userList.push(who[0].name)
            res.end()
          })
        }
      }
    })
  } else {
    fs.readFile(__dirname + req.url, (err, data) => {
      if (err) {
        // 也可以在这里读入 404.html 的内容返回给客户端
        res.writeHead(404)
        res.write('Not Found')
      } else {
        res.write(data.toString())
      }
      res.end()
    })
  }
}
```



#### 核心逻辑处理

监听了 http 服务器，我们就拥有了**事件触发** 或者说是**状态变更**时的行为控制机制，在此我们于用户访问页面时（连接服务器）接收到一个 `sock`，进而在该 `sock` 上注册一些事件，主要包括登录，注册，广播，下线四个事件，事件对应有一个状态码，非 0 即 1，0 代表成功，1 反之。因为 Websocket 是双向通信的一个协议，要使服务器主动向客户端发送数据，客户端这边还得接受才行，现在先写好服务器这边的逻辑。



下面的 `online、cur_user` 标识符是用来区分开登录页面和聊天室页面的，因为即使使用 `location` 跳转到同一页面，也会触发 `disconnect`。致使这里的 `online` 状态有点别扭，但这样实现比 `cookie` 方便得多，只需要在聊天室页面主动发送 `scan` 即可知道是谁在登录（虽然也需要借助客户端访问 cookie 一下），`cookie` 还需要在`req.headers.cookie` 里面解析分析以及登录时的键值设置，不好实现同一客户端登录多个用户的情况。

```js
wsServer.on('connection', sock => {
  sockList.push(sock)
  let cur_user = null
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
          // 如果已经登录了，则提示已登录信息
          let isLogin = userList.some(name => user === name)
          if (isLogin) {
            sock.emit('login_ret', 1, '该用户已经登录')
          } else {
            db.query(`UPDATE room SET online=1 WHERE id=${data[0].id}`, err => {
              if (err) {
                sock.emit('login_ret', 1, '服务繁忙，请稍后重试')
              } else {
                online = true
                sock.emit('login_ret', 0, '登录成功')
              }
            })
          }
        }
      })
    }
  })

  // 广播接口
  sock.on('chat', (name, msg) => {
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

  // 登录后跳转页面前在服务端输出一下，可以不要
  sock.on('online', (name, msg) => {
    console.log(`${name} ${msg}`)
  })

  sock.on('scan', username => {
    cur_user = username
  })

  // 断开连接
  sock.on('disconnect', () => {
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
}
```



[socket.io 服务端 API](// https://socket.io/docs/server-api/)


> 好啦，服务端的业务我们已经实现好了，接下来实现一下客户端的。




### 客户端
#### 登录/注册
客户端需要引入 websocket，才能使用该协议的特性，在这里使用 `<script src="http://localhost:3000/socket.io/socket.io.js"></script>进行链入，或者也可以引入其它路径的在线资源。



登录时，将表单中的信息发送给服务端验证，类似于发送 ajax。登录成功后临时设置 cookie 键值对，随后
跳转页面。注册的逻辑也是相似的，就不多啰嗦了。

```html
<script>
  window.onload = function () {
    // 必须连接服务端才行
    const sock = io.connect('ws://localhost:3000/')
    let name = document.getElementById('username')
    let passwd = document.getElementById('password')
    let login = document.getElementById('login')
    let register = document.getElementById('register')

    // 登录
    login.onclick = () => {
      sock.emit('login', name.value, passwd.value)
      sock.once('login_ret', (code, msg) => {
        if (code) {
          console.log('登录失败 ' + msg)
        } else {
          alert('登录成功')
          // 主动发请求，表示本客户是刚刚登陆跳转过来的
          sock.emit('online', name.value, '请求上线')
          // 页面跳转，需保存已登录的用户状态，这里用 cookie，暂时先简单处理
          document.cookie = 'username=' + name.value
          setTimeout(() => {
            window.location = 'http://localhost:3000/index'
          }, 1000)
        }
      })
    }

    // 注册
    register.onclick = () => {
      sock.emit('reg', name.value, passwd.value)
      sock.once('reg_ret', (code, msg) => {
        if (code) {
          console.log('注册失败 ' + msg)
        } else {
          console.log('注册成功')
        }
      })
    }
  }
</script>
```



>  注意避免多次注册事件。



#### 聊天室页面

承接在登录页面跳转过来的情境，获取 `cookie` 的 `username` 键值，主动发送给服务端表明身份，此时服务端的 `cur_user` 就是该键值。然后对应的一个是主动群发消息事件，另一个是接受别人的消息事件。对于自己发送的消息在当前页面显示的是样式 `.mine` 的颜色，而另一个是样式 `li` 的颜色，从而区分开是谁发了消息。

```html
<script src="http://localhost:3000/socket.io/socket.io.js"></script>
<script>
  window.onload = () => {
    const sock = io.connect('ws://localhost:3000/')
    let oText = document.getElementById('msg')
    let submit = document.querySelector('input[type="button"]')
    let chat = document.getElementById('chat')
    let username = document.cookie.split('=')[1]
    document.querySelector('.wrapper > h1').innerText = 'I am ' + username

    // 主动给服务器表名身份
    sock.emit('scan', username)
    submit.onclick = () => {
      sock.emit('chat', username, oText.value)
      sock.once('chat_ret', (code, msg) => {
        if (code) {
          alert('发送失败，' + msg)
        } else {
          let oLi = document.createElement('li')
          oLi.innerHTML = `<h4>${username}</h4><p>${oText.value}</p>`
          oLi.className = 'mine'
          chat.appendChild(oLi)
          oText.value = ''
        }
      })
    }

    sock.on('everyone', (sender, msg) => {
      let oLi = document.createElement('li')
      oLi.innerHTML = `<h4>${sender}</h4><p>${msg}</p>`
      chat.appendChild(oLi)
    })
  }
</script>
```
