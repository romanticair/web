/**
 * 快速排序，升序
 */
function quickSort(arr) {
  var timestamp = Date.now()
  
  ;(function sort(arr, start, end) {
    if (start >= end) {
      return
    } else {
      // 如果一次都没交换,表示已经排序好,直接返回
      var flag = 0,
          switch_ = 1,
          s = start,
          e = end

      while (s != e) {
        if (arr[s] > arr[e]) {
          var tmp = arr[s]
          arr[s] = arr[e]
          arr[e] = tmp

          if (switch_ == 0) {
            switch_ = 1
          } else {
            switch_ = 0
          }

          flag = 1
        }

        if (switch_ == 0) {
          s++
        } else {
          e--
        }
      }

      if (flag) {
        sort(arr, start, s - 1)
        sort(arr, e + 1, end)
      }
    }
  })(arr, 0, arr.length - 1)

  console.log('耗时', Date.now() - timestamp, '毫秒')
}

function getRndArray(n, base) {
  var i = 0,
      ret = [],
      base = base || 10000

  while (i++ < n) {
    ret.push(Math.floor(Math.random() * base))
  }

  return ret
}

var arr100 = getRndArray(100)
var arr1000 = getRndArray(1000)
var arr10000 = getRndArray(10000)
var arr100000 = getRndArray(100000)

quickSort(arr100)
quickSort(arr1000)
quickSort(arr10000)
quickSort(arr100000)
