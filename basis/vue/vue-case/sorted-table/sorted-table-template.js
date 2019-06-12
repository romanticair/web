function sortByNumber (n1, n2) {
  return n1 <= n2 ? 1 : -1
}

function sortByDate (n1, n2) {
  return new Date(n1) <= new Date(n2) ? 1 : -1
}

Vue.component('sorted-table', {
  name: 'sorted-table',
  template: `
<table>
  <colgroup>
     <col v-for="col in currentColumns" :style="{'width': col.width + 'px'}" />
  </colgroup>
  <thead>
    <tr>
      <th v-for="(col, i) in currentColumns">
        <template v-if="col.sortable">
          <span>{{ col.title }}</span>
          <a :class="{'on': col._sortType === 'asc'}" @click="handleSortByAsc(i)">{{ '↑' }}</a>
          <a :class="{'on': col._sortType === 'desc'}" @click="handleSortByDesc(i)">{{ '↓' }}</a>
        </template>
        <template v-else>{{ col.title }}</template>
      </th>
    </tr>
  </thead>
  <tbody>
    <template v-for="(row, i) in currentData">
      <tr :key="i">
        <td v-for="col in currentColumns">{{ row[col.key] }}</td>
      </tr>
    </template>
  </tbody>
</table>
  `,
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