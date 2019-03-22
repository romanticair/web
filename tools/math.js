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
getRound(num, len) {
  return Math.round(num * Math.pow(10, len)) / Math.pow(10, len)
}

/**
 * 生成指定范围内的随机数
 *
 * @param {number} start
 * @param {number} end
 */
function rnd (start, end) {
  return Math.random() * (end - start) + start
}


/**
 * 生成指定范围内的随机整数
 *
 * @param   {number} min
 * @param   {number} max
 * @returns {number}
 */

function randomBetween(min, max) {
  if (arguments.length < 2) {
    max = min
    min = 0
  }
  return Math.floor(Math.random() * (max - min) + min)
}
