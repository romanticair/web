/**
 * [function crc32加密]
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function crc32(url) {
  var a = document.createElement('a')
  a.href = url

  var T = (function () {
    var c = 0, table = new Array(256)

    for (var n = 0; n != 256; ++n) {
      c = n
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1))
      table[n] = c
    }

    return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table
  })()

  var crc32_str = function (str) {
    var C = -1
    for (var i = 0, L = str.length, c, d; i < L;) {
      c = str.charCodeAt(i++)
      if (c < 0x80) {
        C = (C >>> 8) ^ T[(C ^ c) & 0xFF]
      } else if (c < 0x800) {
        C = (C >>> 8) ^ T[(C ^ (192 | ((c >> 6) & 31))) & 0xFF]
        C = (C >>> 8) ^ T[(C ^ (128 | (c & 63))) & 0xFF]
      } else if (c >= 0xD800 && c < 0xE000) {
        c = (c & 1023) + 64
        d = str.charCodeAt(i++) & 1023
        C = (C >>> 8) ^ T[(C ^ (240 | ((c >> 8) & 7))) & 0xFF]
        C = (C >>> 8) ^ T[(C ^ (128 | ((c >> 2) & 63))) & 0xFF]
        C = (C >>> 8) ^ T[(C ^ (128 | ((d >> 6) & 15) | ((c & 3) << 4))) & 0xFF]
        C = (C >>> 8) ^ T[(C ^ (128 | (d & 63))) & 0xFF]
      } else {
        C = (C >>> 8) ^ T[(C ^ (224 | ((c >> 12) & 15))) & 0xFF]
        C = (C >>> 8) ^ T[(C ^ (128 | ((c >> 6) & 63))) & 0xFF]
        C = (C >>> 8) ^ T[(C ^ (128 | (c & 63))) & 0xFF]
      }
    }
    
    return C ^ -1
  }

  var r = a.pathname + '?r=' + Math.random().toString(10).substring(2)
  if (r[0] != '/') {
    r = '/' + r
  }

  var s = crc32_str(r) >>> 0
  var is_web = location.protocol.indexOf('http') > -1

  return (is_web ? [location.protocol, a.hostname] : ['http:', a.hostname]).join('//') + r + '&s=' + s
}



// public method for encoding
function base64_encoded(input) {
  // private property
  var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4
  var i = 0, output = ''
  input = _utf8_encode(input)

  while (i < input.length) {
    chr1 = input.charCodeAt(i++)
    chr2 = input.charCodeAt(i++)
    chr3 = input.charCodeAt(i++)
    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63

    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {  
      enc4 = 64
    }

    output = output +
    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
    _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
  }

  return output
}

// public method for decoding  
function base64_decoded(input) {
  var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4
  var i = 0, output = ''
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')

  while (i < input.length) {
    enc1 = _keyStr.indexOf(input.charAt(i++))
    enc2 = _keyStr.indexOf(input.charAt(i++))
    enc3 = _keyStr.indexOf(input.charAt(i++))
    enc4 = _keyStr.indexOf(input.charAt(i++))
    chr1 = (enc1 << 2) | (enc2 >> 4)
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    chr3 = ((enc3 & 3) << 6) | enc4
    output = output + String.fromCharCode(chr1)

    if (enc3 != 64)
      output = output + String.fromCharCode(chr2)
    }

    if (enc4 != 64)
      output = output + String.fromCharCode(chr3)
    }
  }

  output = _utf8_decode(output)
  return output
}

// private method for UTF-8 encoding
function _utf8_encode(string) {
  var utftext = ''
  string = string.replace(/\r\n/g,'\n')
  
  for (var n = 0; n < string.length; n++)
    var c = string.charCodeAt(n)
    if (c < 128) {
      utftext += String.fromCharCode(c)
    } else if((c > 127) && (c < 2048)) {
      utftext += String.fromCharCode((c >> 6) | 192)
      utftext += String.fromCharCode((c & 63) | 128)
    } else {
      utftext += String.fromCharCode((c >> 12) | 224)
      utftext += String.fromCharCode(((c >> 6) & 63) | 128)
      utftext += String.fromCharCode((c & 63) | 128)
    }
  }

  return utftext
}

// private method for UTF-8 decoding  
function _utf8_decode(utftext) {
  var string = ''
  var c = c1 = c2 = i = 0

  while ( i < utftext.length ) {
    c = utftext.charCodeAt(i)
    if (c < 128) {
      string += String.fromCharCode(c)
      i++
    } else if((c > 191) && (c < 224)) {
      c2 = utftext.charCodeAt(i+1)
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
      i += 2
    } else {
      c2 = utftext.charCodeAt(i+1)
      c3 = utftext.charCodeAt(i+2)
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
      i += 3
    }
  }

  return string
}
