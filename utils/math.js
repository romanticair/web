/**
* [combine 组合运算]
* @param  {array}  arr   [参与组合运算的数组]
* @param  {number} size  [组合运算的基数]
* @return {array}        [组合结果集]
*/
function combine(arr, size) {
  let allResult = []

  /* Algorithm
    f([1, 2, 3, 4], 3, [])
    one:
      f([2, 3, 4], 2, [1])
        f([3, 4], 1, [1, 2]) size === 1 -> [[1, 2, 3]]
        f([3, 4], 1, [1, 2]) size === 1 -> [[1, 2, 3], [1, 2, 4]]
    two:
      f([3, 4], 2, [2]) size === arrLen -> [[1, 2, 3], [1, 2, 4], [2, 3, 4]]

      其它递归类似
  */

  !(function f(arr, size, result) {
    let arrLen = arr.length
    if (size > arrLen) {
      // 剩余数比组合基数小，无法构成组合
      return
    }

    if (size === arrLen) {
      // 最后一个组合
      allResult.push([].concat(result, arr))

    } else {
      for (let i = 0; i < arrLen; i++) {
        let newResult = [].concat(result)
        newResult.push(arr[i])

        if (size === 1) {
          allResult.push(newResult)
        } else {
          let newArr = [].concat(arr)
          newArr.splice(0, i + 1)
          f(newArr, size - 1, newResult)
        }
      }
    }
  })(arr, size, [])

  return allResult
}


/**
* [getRound 四舍五入保留小数]
* @param  {number}  num  [待转化的浮点数]
* @param  {number}  len  [保留小数位数]
* @return {number}
*/
function getRound(num, len) {
  return Math.round(num * Math.pow(10, len)) / Math.pow(10, len)
}


/*将阿拉伯数字翻译成中文的大写数字*/
function digit2Word (num) {
  var AA = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  var BB = ['', '十', '百', '仟', '萬', '億', '点', '']
  var n = ('' + num).replace(/(^0*)/g, '').split('.'),
      re = ''
  for (var i = n[0].length - 1, k = 0; i >= 0; i--; k++) {
    switch(k) {
      case 0:
        re = BB[7] + re
        break
      case 4:
        if(!new RegExp('0{4}//d{' + (n[0].length - i - 1) + '}$').test(n[0])){
          re = BB[4] + re
        }
        break
      case 8:
        re = BB[5] + re
        BB[7] = BB[5]
        k = 0
        break
    }

    if(k % 4 == 2 && n[0].charAt(i + 2) != 0 && n[0].charAt(i + 1) == 0) {
      re = AA[0] + re
    }

    if(n[0].charAt(i) != 0) {
      re = AA[n[0].charAt(i)] + BB[k % 4] + re
    }
  }

  // 加上小数部分(如果有小数部分)
  if(n.length > 1) {
    re += BB[6]
    for(var i = 0, len = n[1].length; i < len; i++) {
      re += AA[n[1].charAt(i)]
    }
  }

  if(re == '一十') {
    re = '十'
  }

  if(re.match(/^一/) && re.length == 3) {
    re = re.replace('一', '')
  }

  return re
}


/*将数字转换为大写金额*/
function digit2RMB (num) {
  //判断如果传递进来的不是字符的话转换为字符
  if(typeof num == 'number') {
    num = new String(num)
  }

  num = num.replace(/,/g, '').replace(/ /g, '').replace(/￥/g, '')

  if(isNaN(num)) {
    return String.prototype.toString.call(num) + 'is not a number.'
  }

  //字符处理完毕后开始转换，采用前后两部分分别转换
  var part = num.split('.')
  var newchar = ''

  //小数点前进行转化
  var len = part[0].length
  for(var i = len - 1; i >= 0; i--) {
    if(len > 10) {
      return '数值已超拾亿单位，暂不提供转化'
    }

    var tmpnewchar = ''
    var perchar = part[0].charAt(i)

    switch(perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar
        break
      case '1':
        tmpnewchar = '壹' + tmpnewchar
        break
      case '2':
        tmpnewchar = '贰' + tmpnewchar
        break
      case '3':
        tmpnewchar = '叁' + tmpnewchar
        break
      case '4':
        tmpnewchar = '肆' + tmpnewchar
        break
      case '5':
        tmpnewchar = '伍' + tmpnewchar
        break
      case '6':
        tmpnewchar = '陆' + tmpnewchar
        break
      case '7':
        tmpnewchar = '柒' + tmpnewchar
        break
      case '8':
        tmpnewchar = '捌' + tmpnewchar
        break
      case '9':
        tmpnewchar = '玖' + tmpnewchar
        break
    }

    switch(len - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar + '元'
        break
      case 1:
        if(perchar != 0) tmpnewchar = tmpnewchar + '拾'
        break
      case 2:
        if(perchar != 0) tmpnewchar = tmpnewchar + '佰'
        break
      case 3:
        if(perchar != 0) tmpnewchar = tmpnewchar + '仟'
        break
      case 4:
        tmpnewchar = tmpnewchar + '万'
        break
      case 5:
        if(perchar != 0) tmpnewchar = tmpnewchar + '拾'
        break
      case 6:
        if(perchar != 0) tmpnewchar = tmpnewchar + '佰'
        break
      case 7:
        if(perchar != 0) tmpnewchar = tmpnewchar + '仟'
        break
      case 8:
        tmpnewchar = tmpnewchar + '亿'
        break
      case 9:
        tmpnewchar = tmpnewchar + '拾'
        break
    }

    var newchar = tmpnewchar + newchar
  }

  //小数点之后进行转化
  if(num.indexOf('.') != -1) {
    if(part[1].length > 2) {
      // alert('小数点之后只能保留两位,系统将自动截断')
      part[1] = part[1].substr(0, 2)
    }

    for(i = 0; i < part[1].length; i++) {
      tmpnewchar = ''
      perchar = part[1].charAt(i)
      switch(perchar) {
        case '0':
          tmpnewchar = '零' + tmpnewchar
          break
        case '1':
          tmpnewchar = '壹' + tmpnewchar
          break
        case '2':
          tmpnewchar = '贰' + tmpnewchar
          break
        case '3':
          tmpnewchar = '叁' + tmpnewchar
          break
        case '4':
          tmpnewchar = '肆' + tmpnewchar
          break
        case '5':
          tmpnewchar = '伍' + tmpnewchar
          break
        case '6':
          tmpnewchar = '陆' + tmpnewchar
          break
        case '7':
          tmpnewchar = '柒' + tmpnewchar
          break
        case '8':
          tmpnewchar = '捌' + tmpnewchar
          break
        case '9':
          tmpnewchar = '玖' + tmpnewchar
          break
      }

      if(i == 0) tmpnewchar = tmpnewchar + '角'
      if(i == 1) tmpnewchar = tmpnewchar + '分'
      newchar = newchar + tmpnewchar
    }
  }

  //替换所有无用汉字
  while(newchar.search('零零') != -1) {
    newchar = newchar.replace('零零', '零')
  }

  newchar = newchar.replace('零亿', '亿')
  newchar = newchar.replace('亿万', '亿')
  newchar = newchar.replace('零万', '万')
  newchar = newchar.replace('零元', '元')
  newchar = newchar.replace('零角', '')
  newchar = newchar.replace('零分', '')

  if(newchar.charAt(newchar.length - 1) == '元') {
    newchar = newchar + '整'
  }

  return newchar
}
