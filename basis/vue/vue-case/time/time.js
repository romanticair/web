let Time = {
  // 获取当前时间戳
  getUnix () {
    // return (new Date).getTime()
    return Date.now()
  },
  // 获取今天 0 点 0 分 0 秒时间戳
  getTodayUnix () {
    let date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },
  // 获取今年 1 月 1 日 0 点 0 分 0 秒时间戳
  getYearUnix () {
    let date = new Date()
    date.setMonth(0)
    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },
  // 获取标准年月日
  getLastDate (time) {
    let date = new Date(time)
    let month = date.getMonth() + 1
    let day = date.getDate()

    month = month < 10 ? '0' + (month) : month
    day = day < 10 ? '0' + (day) : day

    return date.getFullYear() + '-' + month + '-' + day
  },
  // 转换时间
  getFormatTime (timestamp) {
    /*
      < 1 min，刚刚
      < 1 hr，xx 分钟前
      < 1 day，xx 小时前
      < 1 month，xx 天前
      < 1 year, xx 年 xx 月 xx 日
    */

    let now = this.getUnix()
    let today = this.getTodayUnix()
    let year = this.getYearUnix()
    let timer = Math.floor((now - timestamp) / 1000)
    let tip = ''

    if (timer < 60) {
      tip = '刚刚'
    } else if (timer < 3600) {
      tip = Math.floor(timer / 60) + '分钟前'
    } else if (timer < 86400 && (timestamp - today) >= 0) {
      tip = Math.floor(timer / 3600) + '小时前'
    } else if (timer / 86400 < 31) {
      tip = Math.floor(timer / 86400) + '天前'
    } else {
      tip = this.getLastDate(timestamp)
    }

    return tip
  },
  // 获取 timestamp 至今的天数
  getFormatDay (timestamp) {
    let now = this.getUnix()
    let timer = Math.floor((now - timestamp) / 1000)

    return Math.floor(timer / 86400)
  },
  // 获取 timestamp 的出生岁、月、天数
  getAgeDetail (timestamp) {
    let days = this.getFormatDay(timestamp)
    // 按平均每年 365 天来算年数
    let age = Math.floor(days / 365)
    // 按平均每月 30 天来算月数
    let month = Math.floor(days % 365 / 30)
    let day = Math.floor(days % 365 % 30)

    return '你已 ' + age + ' 岁，' + month + ' 个月，' + day + ' 天'
  }
}
