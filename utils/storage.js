var isValidCookieName = require('./type.js').isValidCookieName

function setCookie(cookieName, cookieValue, expiredays) {
  if (!isValidCookieName(cookieName)) {
    return
  }

  var expires
  if (expiredays != null) {
    expires = new Date()
    expires.setTime(expires.getTime() + expiredays * 24 * 60 * 60 * 1000)
  }

  document.cookie =
    cookieName + '=' + encodeURIComponent(cookieValue)
    + (expires ? '; expires=' + expires.toUTCString() : '')
}


function getCookie(cookieName) {
  if (isValidCookieName(cookieName)) {
    // \x24 == $，注意：cookie分割是以 ' ;' 分割的，而开头和尾直接为空
    var reg = new RegExp('(^| )' + cookieName + '=([^;]*)(;|\x24)')
    var result = reg.exec(document.cookie)
    if (result) {
      return result[2] || null
    }
  }

  return null
}


function removeCookie (cookieName) {
  setCookie(cookieName, 'a', -1)
}


function setStorage(key, val) {
  window.localStorage.setItem(key, JSON.stringify(val))
}


function getStorage(key) {
  return JSON.parse(window.localStorage.setItem(key))
}
