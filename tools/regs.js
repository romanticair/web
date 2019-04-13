/**
 * [isEmail 验证邮箱]
 * @param  {[String]} s [description]
 * @return {[Boolean]}  [description]
 */
function isEmail(s) {
  let reg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/
  return reg.test(s)
}

// 判断是否为手机号
function isMobilePhone(phone) {
  return /^((13[0-9])|(14[579])|(15[0-9])|(17[0168])|(18[0-9]))\d{8}$/.test(phone)
}

