<template>
  <div v-if="dataSource.list != null && dataSource.list.length === 0">
    <NoData msg="空空如也" />
  </div>
  <template v-for="item in dataSource.list" :key="item?.id || JSON.stringify(item)">
    <slot :data="item"></slot>
  </template>
  <div class="pagination" v-if="showPagination && dataSource.pageTotal > 1">
    <el-pagination
      v-if="dataSource.pageTotal > 1"
      background
      :total="dataSource.totalCount"
      :current-page="dataSource.pageNum"
      layout="prev, pager, next"
      @current-change="handlepageNumChange"
      :page-size="dataSource.pageSize"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type DataSource = { list: any[]; pageNum: number; pageSize: number; totalCount: number; pageTotal: number }
const props = defineProps<{ dataSource: DataSource; showPagination?: boolean }>()
const emit = defineEmits<{ (e: 'loadData'): void }>()
const showPagination = computed(() => props.showPagination ?? true)
const handlepageNumChange = (pageNum: number) => { props.dataSource.pageNum = pageNum; emit('loadData') }
</script>

<style lang="scss" scoped>
.pagination {
  padding: 10px 0px 5px 0px;
  text-align: right;
  overflow: hidden;
  height: 50px;
  :deep(.el-pagination) { float: right; }
}
</style>

