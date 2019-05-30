var trim = require('./string').trim

/**
 * 格式化时间
 * 
 * @param  {date} 时间
 * @param  {format} 格式
 * @return {String} 字符串
 *
 * @example formatTime('2019-10-29', '{y}/{m}/{d} {h}:{i}:{s}')
 *   2019/10/29 08:00:00
 */
function formatTime(date, format) {
  if (arguments.length === 0) return null

  date = typeof date === 'object' ? date : new Date(trim(date))
  format = format || '{y}-{m}-{d} {h}:{i}:{s}'

  var dateDict = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }

  var dateString = format.replace(/{(y|m|d|h|i|s|a)+}/gi, (result, key) => {
    var value = dateDict[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }

    return value || '0'
  })

  return dateString
}


/**
 * 返回指定长度的月份集合
 * 
 * @param  {time} 时间
 * @param  {len} 长度
 * @param  {direction} 方向：  -1: 前几个月;  0: 前后几个月  1: 后几个月;   默认 1
 * @param  {connector} 连接符
 * 
 * @return {Array} 数组
 * 
 * @example   getMonths('2018-1-29', 6, 1)
 *   ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
 */
function getMonths(time, len, direction, connector) {
  var date = new Date(time)
  var yy = date.getFullYear(),
      mm = date.getMonth() + 1,
      direction = isNaN(direction) ? 1 : direction,
      connector = typeof connector === 'string' ? connector : '-'

  var getBeforeMonths = function(month) {
    var monthOfCurrentYear = month,
        monthOfPreviousYear = 0,
        currentMonths = [],
        previousMonths = []

    if (month - len < 0) {
      monthOfPreviousYear = len - monthOfCurrentYear
    }

    // 当前月开始倒序到 1 月
    for (var i = 0; i < monthOfCurrentYear; i++) {
      currentMonths.push([yy, (monthOfCurrentYear - i)].join(connector))
    }

    // 如果月份不足，则继续取今年之前的月份，12月份开始倒序
    for (var i = 1; i <= monthOfPreviousYear; i++) {
      previousMonths.push([(yy - Math.ceil(i / 12)), (12 - (i - 1) % 12)].join(connector))
    }

    return currentMonths.concat(previousMonths)
  }

  var getAfterMonths = function(month) {
    // 4月 = 12个月 - 8月
    var monthOfCurrentYear = 12 - month,
        monthOfNextYear = 0,
        currentMonths = [],
        nextMonths = []

    // 要求给6个月，结果月份不够，剩下的两个月留到下一年算
    if (len - monthOfCurrentYear > 0) {
      monthOfNextYear = len - monthOfCurrentYear
    }

    // 今年
    for (var i = 0; i <= monthOfCurrentYear; i++) {
      currentMonths.push([yy, (month + i)].join(connector))
    }

    // 明年 -- 可能不止明年，也许有大后年，所以取余计算，递归也可以
    for (var i = 1; i < monthOfNextYear; i++) {
      nextMonths.push([(yy + Math.ceil(i / 12)), (i % 13 === 0 ? 1 : i % 13)].join(connector))
    }

    return currentMonths.concat(nextMonths)
  }

  var ret
  if (direction === -1) {
    ret = getBeforeMonths(mm).reverse()
  } else if (direction === 1) {
    ret = getAfterMonths(mm)
  } else {
    ret = getBeforeMonths(mm).reverse().slice(Math.floor(len / 2)).concat(getAfterMonths(mm).slice(1, Math.floor(len / 2) + 1))
  }

  return ret.sort(function(date1, date2) {
    return new Date(date1).getTime() - new Date(date2).getTime()
  })
}



/**
 * 返回指定长度的天数集合
 * 
 * @param  {time} 时间
 * @param  {len} 长度
 * @param  {direction} 方向： -1: 前几天;  0:前后几天   1: 后几天;   默认 1
 * @param  {connector} 连接符
 * @return {Array} 数组
 *
 * @example date.getDays('2018-1-29', 6)
 *
 *   ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
 */
function getDays(time, len, direction, connector) {
  var date = new Date(time)
  var i, fromDateString, ret = []
  
  var _getDate = function(day) {
    var date = new Date(time)

    date.setDate(date.getDate() + day)
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join(connector)
  }

  direction = isNaN(direction) ? 1 : direction
  connector = typeof connector === 'string' ? connector : '-'
  fromDateString = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join(connector)

  if (direction === -1) {
    for (i = 1; i <= len; i++) {
      ret.unshift(_getDate(-i))
    }

    ret.push(fromDateString)
  } else if (direction === 1) {
    for (i = 1; i <= len; i++) {
      ret.push(_getDate(i))
    }

    [fromDateString].concat(ret)  
  } else {
    for (i = 1; i <= len; i++) {
      ret.unshift(_getDate(-i))
    }

    ret.push(fromDateString)

    for (i = 1; i <= len; i++) {
      ret.push(_getDate(i))
    }
  }

  return ret
}


// 毫秒格式化成 {yy, dd, hh, mm, ss}
function formateMillisecond(msec, calYear) {
  var y, d, h, m, s,
      sec = millisecond2Second(msec)
  
  s = sec % 60
  m =  Math.floor(sec / 60) % 60
  h =  Math.floor(sec / (60 * 60)) % 24

  if (calYear) {
    d = Math.floor(sec / (60 * 60 * 24)) % 365
    y = Math.floor(sec / (60 * 60 * 24 * 365))
  } else {
    d =  Math.floor(sec / (60 * 60 * 24))
  }

  return {
    y: y,
    d: d,
    h: h,
    m: m,
    s: s
  }
}

// 毫秒转天数
function millisecond2Day(msec) {
  return Math.floor(millisecond2Hour(msec) / 24)
}

// 毫秒转小时
function millisecond2Hour(msec) {
  return Math.floor(millisecond2Minute(msec) / 60)
}

// 毫秒转分钟
function millisecond2Minute(msec) {
  return Math.floor(millisecond2Second(msec) / 60)
}

// 毫秒转秒
function millisecond2Second(msec) {
  return Math.floor(msec / 1000)
}


/*判断 year 是否为闰年*/
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/*判断 month 是否为大月份*/
function isBigMonth(month) {
  var BIGMONTH = [1, 3, 5, 7, 8, 10, 12]  
  return BIGMONTH.indexOf(month) !== -1
}

function getSecondDiff(end, start) {
  return (new Date(end).getTime() - new Date(start).getTime()) / 1000
}

/*获取某月有多少天*/
function getDaysOfMonth(time) {
  var date = new Date(time)
  var year = date.getFullYear()
  var month = date.getMonth() + 1

  //当月份为二月时，根据是否为闰年判断天数
  if (month === 2) {
    return isLeapYear(year) ? 28 : 29
  } else if (isBigMonth(month)) {
    //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31
    return 31
  } else {
    //其他月份，天数为：30.
    return 30
  }
}

/*获取某年有多少天*/
function getDaysOfYear(time) {
  var firstDate = getFirstDayOfYear(time)
  var lastDate = getLastDayOfYear(time)
  var sec = getSecondDiff(lastDate, firstDate)
  return Math.ceil(sec / (24 * 3600))
}

/*获取某个日期是当年中的第几天*/
function getDayOfYear(time) {
  var firstDay = this.getFirstDayOfYear(time)
  var sec = getSecondDiff(time, firstDay)
  return Math.ceil(sec / (24 * 3600))
}

/*获取某个日期在这一年的第几周*/
function getWeekOfYear(time) {
  var days = this.getDayOfYear(time)
  return Math.ceil(days / 7)
}

/*获取某年的第一天*/
function getFirstDayOfYear(time) {
  var year = new Date(time).getFullYear()
  return year + '-01-01 00:00:00'
}

/*获取某年最后一天*/
function getLastDayOfYear(time) {
  var year = new Date(time).getFullYear()
  var days = getDaysOfMonth(year + '-12-01 00:00:00')
  return year + '-12-' + days + ' 23:59:59'
}
