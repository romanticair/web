function sortByNumber (n1, n2) {
  return n1 <= n2 ? 1 : -1
}

function sortByDate (n1, n2) {
  return new Date(n1) <= new Date(n2) ? 1 : -1
}

Vue.component('sorted-table', {
  name: 'sorted-table',
  render (createElement) {
    let ths = []
    let trs = []
    let cols = []

    this.currentData.forEach(row => {
      let tds = []
      this.currentColumns.forEach(cell => {
        tds.push(createElement('td', row[cell.key]))
      })

      trs.push(createElement('tr', tds))
    })

    let _this = this
    this.currentColumns.forEach((col, index) => {
      if (col.sortable) {
        ths.push(createElement('th', [
          createElement('span', col.title),
          // 升序
          createElement('a', {
            class: {
              on: col._sortType === 'asc'
            },
            on: {
              click () {
                _this.handleSortByAsc(index)
              }
            }
          }, '↑'),
          // 降序
          createElement('a', {
            class: {
              on: col._sortType === 'desc'
            },
            on: {
              click () {
                _this.handleSortByDesc(index)
              }
            }
          }, '↓')
        ]))
      } else {
        ths.push(createElement('th', col.title))
      }

      /*
      if (col.width) {
        cols.push(createElement('col', {
          style: {
            width: col.width + 'px'
          }
        }))
      } else {
        cols.push(createElement('col', ''))
      }
      */
      cols.push(createElement('col', {
        style: {
          width: col.width + 'px'
        }
      }))
    })

    return createElement('table', [
      createElement('colgroup', cols),
      createElement('thead', [
        createElement('tr', ths)
      ]),
      createElement('tbody', trs)
    ])
  },
  props: {
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentColumns: [],
      currentData: []
    }
  },
  methods: {
    makeColumns () {
      this.currentColumns = this.columns.map((col, i) => {
        // 给 col 添加字段标识当前排序的状态如：asc, desc
        col._sortType = 'normal'
        // 标识当前 col 在数组索引的位置，排序后更新
        col._index = i
        return col
      })
    },
    makeData () {
      this.currentData = this.data.map((row, i) => {
        // 标识当前行在数组索引中的位置，排序后更新
        row._index = i
        return row
      })
    },
    handleSortByDesc (index) {
      let key = this.currentColumns[index].key
      this.sortDealer(key, false)
      this.currentColumns[index]._sortType = 'desc'
    },
    handleSortByAsc (index) {
      let key = this.currentColumns[index].key
      this.sortDealer(key, true)
      this.currentColumns[index]._sortType = 'asc'
    },
    sortDealer (key, isAsc) {
      let sortFn = key === 'birthday' ? sortByDate : sortByNumber

      // 排序时，各主题互斥，先全部重置
      this.currentColumns.forEach((col, i) => {
        col._sortType = 'normal'
      })

      // 升序
      if (isAsc) {
        this.currentData.sort((row1, row2) => {
          return sortFn(row1[key], row2[key])
        })
      } else {
        this.currentData.sort((row1, row2) => {
          return -1 * sortFn(row1[key], row2[key])
        })
      }
    }
  },
  mounted () {
    // 初始化 currentColumns, currentData，未排序
    this.makeColumns()
    this.makeData()
  },
  watch: {
    // 如果 data 属性改变了，这里也应该同步更新
    data () {
      this.makeData()
      let sortedColumn = this.currentColumns.filter(col => {
        return col._sortType !== 'normal'
      })

      // 二次更新数据时，有排序需求则执行排序
      if (sortedColumn.length > 0) {
        let index = sortedColumn[0]._index
        if (sortedColumn[0]._sortType === 'asc') {
          this.handleSortByAsc(index)
        } else {
          this.handleSortByDesc(index)
        }
      }
    }
  }
})
