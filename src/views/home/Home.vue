<template>
  <el-card class="box-card">
    <template #header>
      <div class="part-title">视频数据</div>
    </template>
    <div class="video-data-list">
      <div :class="['video-data-item', item.preDataType === currentDataPart.preDataType ? 'active' : '']" v-for="item in dataPartList" :key="item.preDataType" @click="loadWeekDataHandler(item)">
        <div class="video-data-title">
          <div :class="['name iconfont', item.icon]">{{ item.name }}</div>
          <div class="pre-count">{{ item.preCount }}</div>
        </div>
        <div class="total-count">{{ item.totalCount }}</div>
      </div>
    </div>
  </el-card>

  <el-card class="week-data-panel">
    <div ref="chartRef" class="data-chart"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, nextTick, shallowRef } from 'vue'
import * as echarts from 'echarts'
import { getActualTimeStatisticsInfo as apiGetActualTimeStatisticsInfo, getWeekStatisticsInfo } from '@/api/index'


type DataPart = {
  name: string
  icon: string
  totalCountKey: string
  preDataType: number
  totalCount: number
  preCount: number
}

const dataPartList = ref<DataPart[]>([
  { name: '用户数', icon: 'icon-user', totalCountKey: 'userCount', preDataType: 2, totalCount: 0, preCount: 0 },
  { name: '播放', icon: 'icon-play-solid', totalCountKey: 'playCount', preDataType: 1, totalCount: 0, preCount: 0 },
  { name: '评论', icon: 'icon-comment-solid', totalCountKey: 'commentCount', preDataType: 6, totalCount: 0, preCount: 0 },
  { name: '弹幕', icon: 'icon-danmu-solid', totalCountKey: 'danmuCount', preDataType: 7, totalCount: 0, preCount: 0 },
  { name: '点赞', icon: 'icon-like-solid', totalCountKey: 'likeCount', preDataType: 3, totalCount: 0, preCount: 0 },
  { name: '收藏', icon: 'icon-collection-solid', totalCountKey: 'collectCount', preDataType: 4, totalCount: 0, preCount: 0 },
  { name: '投币', icon: 'icon-toubi', totalCountKey: 'coinCount', preDataType: 5, totalCount: 0, preCount: 0 }
])

const loadActualTimeStatisticsInfo = async () => {
  const data = await apiGetActualTimeStatisticsInfo()
  const totalCountInfo = data.totalCountInfo
  const preDayData = data.preDayData
  dataPartList.value.forEach((item: any) => {
    item.totalCount = totalCountInfo[item.totalCountKey]
    item.preCount = preDayData[item.preDataType] ? preDayData[item.preDataType] : 0
  })
}
loadActualTimeStatisticsInfo()

const chartRef = ref<HTMLDivElement | null>(null)
const dataChart = shallowRef<echarts.ECharts | null>(null)
const init = () => {
  nextTick(() => {
    if (chartRef.value) {
      dataChart.value = echarts.init(chartRef.value)
      loadWeekData()
    }
  })
}
init()

const currentDataPart = ref<DataPart>(dataPartList.value[0]!)
const loadWeekDataHandler = (item: DataPart) => {
  currentDataPart.value = item
  loadWeekData()
}

const loadWeekData = async () => {
  const list = await getWeekStatisticsInfo({ dataType: currentDataPart.value.preDataType })
  if (!dataChart.value) return
  const dateArray: string[] = []
  const dataCountArray: number[] = []
  list.forEach((item: any) => {
    dateArray.push(item.statisticsDate)
    dataCountArray.push(item.statisticsCount)
  })

  const option: echarts.EChartsOption = {
    title: { text: `近7天${currentDataPart.value.name}量` },
    tooltip: { trigger: 'axis' },
    legend: { data: [currentDataPart.value.name] },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: [{ type: 'category', boundaryGap: false, data: dateArray }],
    yAxis: [{ type: 'value' }],
    series: [{
      name: currentDataPart.value.name,
      type: 'line',
      data: dataCountArray,
      smooth: true,
      itemStyle: { color: '#ff6699' },
      lineStyle: { color: '#ff6699' }
    }]
  }
  dataChart.value.setOption(option, true)
}
</script>

<style lang="scss" scoped>
.part-title { font-size: 18px; margin-bottom: 20px; }
.video-data-list {
  display: grid; grid-gap: 20px; grid-template-columns: repeat(4, 1fr); padding-bottom: 10px;
  .video-data-item { cursor: pointer; background: #f5fcfe; padding: 20px; border-radius: 5px; }
  .video-data-title { display: flex; justify-content: space-between; align-items: center; }
  .video-data-title .iconfont { color: var(--text3); font-size: 14px; }
  .video-data-title .iconfont::before { font-size: 20px; margin-right: 5px; float: left; }
  .video-data-title .pre-count { color: #ff4684; }
  .total-count { margin-top: 10px; font-weight: bold; color: var(--blue); font-size: 20px; }
  .active { background: #ff4684; }
  .active .video-data-title .iconfont, .active .video-data-title .pre-count, .active .total-count { color: #fff; }
}
.data-chart { height: 400px; }
.week-data-panel { margin-top: 10px; }
</style>
