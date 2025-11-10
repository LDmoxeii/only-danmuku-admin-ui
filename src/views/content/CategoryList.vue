<template>
  <el-row :gutter="10">
    <el-col :span="16">
      <el-card class="table-data-card">
        <template #header>
          <div class="header">
            <div class="title">一级分类</div>
            <div class="btn" @click="showEdit({}, 0)">新增分类</div>
          </div>
        </template>
        <Table
          ref="tableInfoRef"
          :columns="columns"
          :fetch="loadDataList"
          :dataSource="tableData"
          :options="tableOptions"
          :extHeight="tableOptions.extHeight"
          :showPagination="false"
          @rowClick="rowClick"
        >
          <template #icon="{ index, row }">
            <div class="cover">
              <Cover :source="row.icon" defaultImg="default_image.png" />
            </div>
          </template>
          <template #background="{ index, row }">
            <div class="category-background">
              <Cover :source="row.background" fit="cover" defaultImg="default_banner.png" />
            </div>
          </template>
          <template #slotOperation="{ index, row }">
            <div class="row-op-panel">
              <a class="a-link" href="javascript:void(0)" @click="showEdit(row, 0)">修改</a>
              <el-divider direction="vertical" />
              <a class="a-link" href="javascript:void(0)" @click="delCategory(row)">删除</a>
              <el-divider direction="vertical" />
              <a href="javascript:void(0)" @click="changeSort(0, index, 'up')" :class="[index === 0 ? 'disable' : 'a-link']">上移</a>
              <el-divider direction="vertical" />
              <a href="javascript:void(0)" @click="changeSort(0, index, 'down')" :class="[index === tableData.list.length - 1 ? 'disable' : 'a-link']">下移</a>
            </div>
          </template>
        </Table>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="table-data-card">
        <template #header>
          <div class="header">
            <div class="title">二级分类</div>
            <div class="btn" @click="showEdit({}, 1)">新增二分类</div>
          </div>
        </template>
        <Table :columns="columnSub" :dataSource="subCategoryData" :options="tableOptions" :extHeight="tableOptions.extHeight" :showPagination="false">
          <template #slotOperation="{ index, row }">
            <div class="row-op-panel">
              <a class="a-link" href="javascript:void(0)" @click="showEdit(row, 1)">修改</a>
              <el-divider direction="vertical" />
              <a class="a-link" href="javascript:void(0)" @click="delCategory(row)">删除</a>
              <el-divider direction="vertical" />
              <a href="javascript:void(0)" @click="changeSort(row.parentId, index, 'up')" :class="[index === 0 ? 'disable' : 'a-link']">上移</a>
              <el-divider direction="vertical" />
              <a href="javascript:void(0)" @click="changeSort(row.parentId, index, 'down')" :class="[index === tableData.list.length - 1 ? 'disable' : 'a-link']">下移</a>
            </div>
          </template>
        </Table>
      </el-card>
    </el-col>
  </el-row>
  <CategoryEdit ref="categoryEditRef" @reload="loadDataList" />
</template>

<script setup lang="ts">
import { ref, nextTick, getCurrentInstance } from 'vue'
import Cover from '@/components/Cover.vue'
import CategoryEdit from './CategoryEdit.vue'

const { proxy } = getCurrentInstance() as any

const columns = ref<any[]>([
  { label: '图标', prop: 'icon', width: 80, scopedSlots: 'icon', align: 'center' },
  { label: '分类编号', prop: 'categoryCode', width: 120, align: 'center' },
  { label: '分类名称', prop: 'categoryName', width: 120, align: 'center' },
  { label: '背景图', prop: 'background', width: 180, scopedSlots: 'background', align: 'center' },
  { label: '稿件量', prop: 'videoCount', width: 100, align: 'center' },
  { label: '操作', scopedSlots: 'slotOperation', width: 220, align: 'center' },
])

const columnSub = ref<any[]>([
  { label: '分类编号', prop: 'categoryCode', width: 120, align: 'center' },
  { label: '分类名称', prop: 'categoryName', width: 120, align: 'center' },
  { label: '稿件量', prop: 'videoCount', width: 100, align: 'center' },
  { label: '操作', scopedSlots: 'slotOperation', width: 220, align: 'center' },
])

const tableOptions = ref<any>({ stripe: false, border: false, extHeight: 10 })
const tableData = ref<any>({ list: [], pageNum: 1, pageSize: 15, totalCount: 0 })
const tableInfoRef = ref<any>()

const loadDataList = async () => {
  const result = await proxy.Request({ url: proxy.Api.loadCategory })
  if (!result) return
  tableData.value.list = result.data
  if (currentSelectCategory.value == null && result.data.length > 0) {
    currentSelectCategory.value = result.data[0]
    subCategoryData.value.list = result.data[0].children
  } else {
    currentSelectCategory.value = result.data.find((item: any) => item.categoryId === currentSelectCategory.value.categoryId)
    subCategoryData.value.list = currentSelectCategory.value.children
  }
  nextTick(() => {
    tableInfoRef.value.setCurrentRow('categoryId', currentSelectCategory.value.categoryId)
  })
}

const currentSelectCategory = ref<any>(null)
const subCategoryData = ref<any>({ list: [], pageNum: 1, pageSize: 15, totalCount: 0 })

const rowClick = (row: any) => { subCategoryData.value.list = row.children; currentSelectCategory.value = row }

const delCategory = (data: any) => {
  proxy.Confirm({
    message: `确定要删除【${data.categoryName}】吗？`,
    okfun: async () => {
      const result = await proxy.Request({ url: proxy.Api.delCategory, params: { categoryId: data.categoryId } })
      if (!result) return
      proxy.Message.success('操作成功')
      if (currentSelectCategory.value?.categoryId === data.categoryId) currentSelectCategory.value = null
      loadDataList()
    },
  })
}

const changeSort = async (parentId: number, index: number, type: 'up' | 'down') => {
  const dataList = parentId === 0 ? tableData.value.list : currentSelectCategory.value.children
  if ((type === 'down' && index === dataList.length - 1) || (type === 'up' && index === 0)) return
  const temp = dataList[index]
  const number = type === 'down' ? 1 : -1
  dataList.splice(index, 1)
  dataList.splice(index + number, 0, temp)
  const categoryIds = dataList.map((e: any) => e.categoryId)
  const result = await proxy.Request({ url: proxy.Api.changeCategorySort, params: { parentId, categoryIds: categoryIds.join(',') } })
  if (!result) return
  proxy.Message.success('重新排序成功')
  loadDataList()
}

const categoryEditRef = ref<any>()
const showEdit = (data: any, type: number) => {
  if (type === 1 && !currentSelectCategory.value) { proxy.Message.warning('请先创建一级分类'); return }
  if (type === 0) data.parentId = 0
  else if (type === 1 && Object.keys(data).length === 0) data.parentId = currentSelectCategory.value.categoryId
  categoryEditRef.value.showEdit(Object.assign({}, data))
}
</script>

<style lang="scss" scoped>
.table-data-card {
  .header { display: flex; justify-content: space-between; }
  .header .btn { cursor: pointer; color: var(--blue2); }
  .category-background { width: 150px; height: 80px; }
}
</style>
