<template>
  <div>
    <el-table
      ref="dataTable"
      :data="dataSource.list || []"
      :height="tableHeight"
      :stripe="options.stripe"
      :border="options.border"
      header-row-class-name="table-header-row"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="options.selectType && options.selectType === 'checkbox'"
        type="selection"
        :selectable="selectedHandler"
        width="50"
        align="center"
      />
      <el-table-column
        v-if="options.showIndex"
        label="序号"
        type="index"
        width="60"
        align="center"
      />
      <template v-for="(column, index) in columns" :key="index">
        <template v-if="(column as any).scopedSlots">
          <el-table-column
            :prop="(column as any).prop"
            :label="(column as any).label"
            :align="(column as any).align || 'left'"
            :width="(column as any).width"
          >
            <template #default="scope">
              <slot :name="(column as any).scopedSlots" :index="scope.$index" :row="scope.row"></slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :prop="(column as any).prop"
            :label="(column as any).label"
            :align="(column as any).align || 'left'"
            :width="(column as any).width"
            :fixed="(column as any).fixed"
          />
        </template>
      </template>
    </el-table>
    <div class="pagination" v-if="showPagination">
      <el-pagination
        v-if="dataSource.totalCount"
        background
        :total="dataSource.totalCount"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="dataSource.pageSize"
        :current-page="dataSource.pageNum"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlepageNumChange"
        style="text-align: right"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type DataSource = { list: any[]; pageSize: number; pageNum: number; totalCount: number }
type Options = { stripe?: boolean; border?: boolean; tableHeight?: number; selectType?: string; showIndex?: boolean }

const emit = defineEmits<{ (e: 'rowSelected', rows: any[]): void; (e: 'rowClick', row: any): void }>()
const props = defineProps<{ 
  dataSource: DataSource
  showPagination?: boolean
  options?: Options
  extHeight?: number
  columns: any[]
  fetch?: () => void
  initFetch?: boolean
  selected?: (row: any, index: number) => boolean
}>()

const showPagination = computed(() => props.showPagination ?? true)
const options = computed(() => props.options ?? ({} as Options))
const extHeight = computed(() => props.extHeight ?? 70)

const topHeight = 50 + 20 + 72 + 10 + 65
const tableHeight = ref(options.value.tableHeight ? options.value.tableHeight : window.innerHeight - topHeight - extHeight.value)

const init = () => { if (props.initFetch ?? true) props.fetch && props.fetch() }
init()

const dataTable = ref<any>()
const clearSelection = () => { dataTable.value?.clearSelection() }
const setCurrentRow = (rowKey: string, rowValue: any) => {
  const row = props.dataSource.list.find((item: any) => item[rowKey] === rowValue)
  dataTable.value?.setCurrentRow(row)
}
defineExpose({ setCurrentRow, clearSelection })

const handleRowClick = (row: any) => emit('rowClick', row)
const handleSelectionChange = (rows: any[]) => emit('rowSelected', rows)
const handlePageSizeChange = (size: number) => { props.dataSource.pageSize = size; props.dataSource.pageNum = 1; props.fetch && props.fetch() }
const handlepageNumChange = (pageNum: number) => { props.dataSource.pageNum = pageNum; props.fetch && props.fetch() }
const selectedHandler = (row: any, index: number) => (props.selected ? props.selected(row, index) : true)
</script>

<style lang="scss">
.pagination { padding-top: 10px; }
.el-pagination { justify-content: right; }
.el-table__body tr.current-row > td.el-table__cell { background-color: #e6f0f9; }
.el-table__body tr:hover > td.el-table__cell { background-color: #e6f0f9 !important; }
</style>

