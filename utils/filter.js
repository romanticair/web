/**
 * 过滤 html 标签(把<>转换)
 */
function tagFilter (str) {
  return str.replace(/&/g, '&amp')
            .replace(/</g, '&lt')
            .replace(/>/g, '&gt')
            .replace(/ /g, '&nbsp')
}
