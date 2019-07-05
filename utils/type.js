function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]'
}

function isRegExp(reg) {
  return Object.prototype.toString.call(reg) === '[object RegExp]'
}

function isNumber(num) {
  return Object.prototype.toString.call(num) === '[object Number]'
}

function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]'
}

function isBoolean(boolean) {
  return Object.prototype.toString.call(boolean) === '[object Boolean]'
}

function isDate(date) {
  return Object.prototype.toString.call(date) === '[object Date]'
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function isUndefined(arg) {
  return Object.prototype.toString.call(arg) === '[object Undefined]'
}


// 简单判断是否为window对象或DOM对象之一，返回一个bool值
function isElement(arg) {
  var s = Object.prototype.toString.call(arg)
  return s.indexOf('[object HTML') !== -1 || s.indexOf('[object Window]') !== -1
}

/**
 * 判断是否为IE浏览器，返回-1或者版本号
 */
function isIE() {
  return /msie ([\d\.]+)/i.test(navigator.userAgent) ? document.documentMode : -1
}


/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由 {} 或者 new Object 类似方式创建
 * 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 */
function isPlain(obj){
  var hasOwnProperty = Object.prototype.hasOwnProperty,
      key
  if (!obj || !isObject(obj) ||
     //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
     //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性
     //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
     !('isPrototypeOf' in obj)
   ) {
    return false
  }

  //判断new fun()自定义对象的情况
  //constructor不是继承自原型链的
  //并且原型中有isPrototypeOf方法才是Object
  if (obj.constructor &&
    !hasOwnProperty.call(obj, 'constructor') &&
    !hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
    return false
  }

  //判断有继承的情况
  //如果有一项是继承过来的，那么一定不是字面量Object
  //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
  for (key in obj) {}
  return key === undefined || hasOwnProperty.call(obj, key)
}


/**
 * Cookie 索引键是否有效
 */
function isValidCookieName(cookieName) {
  // http://www.w3.org/Protocols/rfc2109/rfc2109
  // Syntax:  General
  // The two state management headers, Set-Cookie and Cookie, have common
  // syntactic properties involving attribute-value pairs.  The following
  // grammar uses the notation, and tokens DIGIT (decimal digits) and
  // token (informally, a sequence of non-special, non-white space
  // characters) from the HTTP/1.1 specification [RFC 2068] to describe
  // their syntax.
  // av-pairs   = av-pair *(";" av-pair)
  // av-pair    = attr ["=" value] ; optional value
  // attr       = token
  // value      = word
  // word       = token | quoted-string

  // http://www.ietf.org/rfc/rfc2068.txt
  // token      = 1*<any CHAR except CTLs or tspecials>
  // CHAR       = <any US-ASCII character (octets 0 - 127)>
  // CTL        = <any US-ASCII control character
  //              (octets 0 - 31) and DEL (127)>
  // tspecials  = "(" | ")" | "<" | ">" | "@"
  //              | "," | ";" | ":" | "\" | <">
  //              | "/" | "[" | "]" | "?" | "="
  //              | "{" | "}" | SP | HT
  // SP         = <US-ASCII SP, space (32)>
  // HT         = <US-ASCII HT, horizontal-tab (9)>

  return (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24'))
    .test(cookieName)
}


/**
 * [isEmail 验证邮箱]
 * @param  {[String]} s [description]
 * @return {[Boolean]}  [description]
 */
function isEmail(s) {
  let reg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/
  return reg.test(s)
}


/**
 * 判断是否为手机号
 */
function isMobilePhone(phone) {
  return /^((13[0-9])|(14[579])|(15[0-9])|(17[0168])|(18[0-9]))\d{8}$/.test(phone)
}


/**
 * IOS 系统
 */
function isIOS () {
  var u = navigator.userAgent
  if (/Android|Linux/ig.test(u)) {
    // return 'Android'
    return false
  } else if (/iPhone/ig.test(u)) {
    // return 'iPhone'
    return true
  } else if (/iPad/ig.test(u)) {
    // return 'iPad'
    return false
  } else if (/Windows Phone/ig.test(u)) {
    // return 'Windows Phone'
    return false
  }

  return false
}


/**
 * PC端
 */
function isPC() {
  var userAgent = navigator.userAgent
  var mobiles = [
    'Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod'
  ]

  for (var v = 0; v < mobiles.length; v++) {
    if (userAgent.indexOf(mobiles[v]) > 0) {
      return false
    }
  }

  return true
}


/**
 * 根据给定类型检查
 */
function isType(str, type) {
  switch (type) {
    case 'phone':   //手机号码
      return /^1[3|4|5|6|7|8][0-9]{9}$/.test(str)
    case 'tel':     //座机
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str)
    case 'card':    //身份证
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str)
    case 'pwd':     //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
      return /^[a-zA-Z]\w{5,17}$/.test(str)
    case 'postal':  //邮政编码
      return /[1-9]\d{5}(?!\d)/.test(str)
    case 'QQ':      //QQ号
      return /^[1-9][0-9]{4,9}$/.test(str)
    case 'email':   //邮箱
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str)
    case 'money':   //金额(小数点2位)
      return /^\d*(?:\.\d{0,2})?$/.test(str)
    case 'URL':     //网址
      return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
    case 'IP':      //IP
      return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str)
    case 'date':    //日期时间
      return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
    case 'number':  //数字
      return /^[0-9]$/.test(str)
    case 'english': //英文
      return /^[a-zA-Z]+$/.test(str)
    case 'chinese': //中文
      return /^[\u4E00-\u9FA5]+$/.test(str)
    case 'lower':   //小写
      return /^[a-z]+$/.test(str)
    case 'upper':   //大写
      return /^[A-Z]+$/.test(str)
    case 'HTML':    //HTML标记
      return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str)
    default:
      return true
  }
}


/**
 * 严格的身份证校验
 */
function isIDCard(s) {
  var id = trim(s)

  if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(id)) {
    alert('输入的身份证长度或格式错误')
    return false
  }

  //身份证城市
  var cities = {
    11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁',
    22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽',
    35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南',
    44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州',
    53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏',
    65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'
  }

  if(!cities[parseInt(id.substr(0, 2))]) { 
    alert('身份证的地区号非法')
    return false
  }

  // 出生日期验证
  var birthday = (id.substr(6, 4) + '-' + Number(id.substr(10, 2)) + '-' + Number(id.substr(12, 2))).replace(/-/g, '/'),
    date = new Date(birthday)
  
  if(birthday != (date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate())) {
    alert('身份证的出生日期非法')
    return false
  }

  // 身份证号码校验
  var sum = 0,
    codes = '10X98765432',
    weights =  [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]

  for (var i = 0; i < weights.length; i++) {
    sum += id.charAt(i) * weights[i]
  }

  // 计算出来的最后一位身份证号码
  var last = codes.charAt(sum % 11)
  if (id.charAt(17) != last) {
    alert('身份证号非法')
    return false
  }

  return true
}


/**
 * 浏览器类型
 */
function getBrowserType() {
  var userAgent = navigator.userAgent
  // Opera浏览器
  var isOpera = userAgent.indexOf('Opera') > -1
  // IE浏览器
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  // IE的Edge浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE  
  // Firefox浏览器
  var isFF = userAgent.indexOf('Firefox') > -1
  // Safari浏览器
  var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1
  // Chrome浏览器
  var isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1

  if (isIE) {
    var ie = new RegExp('MSIE (\\d+\\.\\d+);')
    ie.test(userAgent)
    var IEVersion = parseFloat(RegExp['$1'])
    if(IEVersion == 7) return 'IE7'
    else if(IEVersion == 8) return 'IE8'
    else if(IEVersion == 9) return 'IE9'
    else if(IEVersion == 10) return 'IE10'
    else return 'IE7以下（IE版本过低）'
  }

  if (isIE11) return 'IE11'
  if (isEdge) return 'Edge'
  if (isFF) return 'FF'
  if (isOpera) return 'Opera'
  if (isSafari) return 'Safari'
  if (isChrome) return 'Chrome'
}

module.exports = {
  isPlain: isPlain,
  isArray: isArray,
  isFunction: isFunction,
  isObject: isElement,
  isValidCookieName: isValidCookieName,
}
