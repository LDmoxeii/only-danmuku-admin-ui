<template>
  <div class="top-panel">
    <el-card>
      <el-form :model="searchForm" label-width="70px" label-position="right">
        <el-row>
          <el-col :span="5">
            <el-form-item label="视频名称">
              <el-input class="password-input" v-model="searchForm.videoNameFuzzy" clearable placeholder="支持模糊搜索" @keyup.enter="loadDataList" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="分类">
              <el-cascader style="width: 100%" v-model="searchForm.categoryIdArray" :options="categoryList" :clearable="true" :props="{ value: 'categoryId', label: 'categoryName', checkStrictly: true }" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="推荐">
              <el-select clearable placeholder="请选择推荐状态" v-model="searchForm.recommendType">
                <el-option :value="1" label="未推荐" />
                <el-option :value="2" label="已推荐" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ paddingLeft: '10px' }">
            <el-button type="success" @click="loadDataList()">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
  <el-card class="table-data-card">
    <Table ref="tableInfoRef" :columns="columns" :fetch="loadDataList" :dataSource="tableData" :options="tableOptions" :extHeight="tableOptions.extHeight">
      <template #videoCover="{ row }">
        <div class="cover-info">
          <Cover :source="row.videoCover" :width="160" />
          <div class="duration">{{ proxy.Utils.convertSecondsToHMS(row.duration) }}</div>
        </div>
      </template>
      <template #videoName="{ row }">
        <div class="video-info">
          <div class="video-name">{{ row.videoName }}</div>
          <div class="user-name iconfont icon-upzhu">{{ row.nickName }}</div>
          <div class="video-count">
            <span class="iconfont icon-play-solid">{{ row.playCount }}</span>
            <span class="iconfont icon-like-solid">{{ row.likeCount }}</span>
            <span class="iconfont icon-danmu-solid">{{ row.danmuCount }}</span>
            <span class="iconfont icon-comment-solid">{{ row.commentCount }}</span>
            <span class="iconfont icon-toubi">{{ row.coinCount }}</span>
            <span class="iconfont icon-collection-solid">{{ row.collectCount }}</span>
          </div>
        </div>
      </template>
      <template #statusName="{ row }">
        <span :style="{ color: statusMap[row.status] }">{{ row.statusName }}</span>
      </template>
      <template #recommendType="{ row }">
        {{ row.recommendType == 2 ? '已推荐' : '未推荐' }}
      </template>
      <template #slotOperation="{ row }">
        <div class="row-op-panel">
          <a class="a-link" href="javascript:void(0)" @click.prevent="showDetail(row)">详情</a>
          <el-divider direction="vertical" />
          <template v-if="row.status == 3">
            <a class="a-link" href="javascript:void(0)" @click="audit(row)">审核</a>
            <el-divider direction="vertical" />
          </template>
          <template v-if="row.status == 4">
            <a class="a-link" href="javascript:void(0)" @click="recommend(row)">{{ row.recommendType == 2 ? '取消推荐' : '推荐' }}</a>
            <el-divider direction="vertical" />
          </template>
          <a class="a-link" href="javascript:void(0)" @click.prevent="delAccount(row)">删除</a>
        </div>
      </template>
    </Table>
  </el-card>
  <VideoDetail ref="videoDetailRef" />
  <VideoAudit ref="auditRef" @reload="loadDataList" />
</template>

<script setup lang="ts">
import {getCurrentInstance, ref} from 'vue'
import Cover from '@/components/Cover.vue'
import VideoDetail from './VideoDetail.vue'
import VideoAudit from './VideoAudit.vue'
import {deleteVideo, loadVideoList, recommendVideo} from '@/api/video'
import {loadCategory as apiLoadCategory} from '@/api/category'

const { proxy } = getCurrentInstance() as any

const columns = [
  { label: '视频封面', prop: 'videoCover', width: 180, scopedSlots: 'videoCover', align: 'center' },
  { label: '视频名称', prop: 'videoName', width: 320, scopedSlots: 'videoName' },
  { label: '状态', prop: 'statusName', width: 120, scopedSlots: 'statusName', align: 'center' },
  { label: '推荐', prop: 'recommendType', width: 80, scopedSlots: 'recommendType', align: 'center' },
  { label: '发布时间', prop: 'postTime', width: 180, align: 'center' },
  { label: '操作', prop: 'operation', width: 220, scopedSlots: 'slotOperation', align: 'center' }
]

const statusMap: Record<number, string> = { 1: '#909399', 2: '#E6A23C', 3: '#409EFF', 4: '#67C23A', 5: '#F56C6C' }

const tableInfoRef = ref<any>()
const tableOptions = ref<any>({ extHeight: 0 })
const searchForm = ref<any>({})
const tableData = ref<any>({ pageNum: 1, pageSize: 15 })

const loadDataList = async () => {
  const params: any = { pageNum: tableData.value.pageNum, pageSize: tableData.value.pageSize, ...searchForm.value }
  if (params.categoryIdArray && params.categoryIdArray.length == 2) params.categoryId = params.categoryIdArray[1]
  else if (params.categoryIdArray && params.categoryIdArray.length == 1) params.categoryParentId = params.categoryIdArray[0]
  delete params.categoryIdArray
  const data = await loadVideoList(params)
  Object.assign(tableData.value, data)
}

const categoryList = ref<any[]>([])
const loadCategory = async () => {
  categoryList.value = await apiLoadCategory()
}
loadCategory()

const videoDetailRef = ref<any>()
const showDetail = (data: any) => { videoDetailRef.value.show(data) }

const auditRef = ref<any>()
const audit = (row: any) => { auditRef.value.show(row.videoId) }

const delAccount = (data: any) => {
  proxy.Confirm({
    message: `确定要删除【${data.videoName}】吗？`,
    okfun: async () => {
      await deleteVideo({ videoId: data.videoId })
      proxy.Message.success('操作成功')
      loadDataList()
    },
  })
}

const recommend = (data: any) => {
  const recommendName = data.recommendType == 1 ? '推荐' : '取消推荐'
  proxy.Confirm({
    message: `确定要【${recommendName}】【${data.videoName}】吗？`,
    okfun: async () => {
      await recommendVideo({ videoId: data.videoId })
      proxy.Message.success('操作成功')
      loadDataList()
    },
  })
}
</script>

<style lang="scss" scoped>
.detail-tree-panel { height: calc(100vh - 273px); overflow: auto; width: 100%; }
.cover-info { min-width: 0; width: 160px; position: relative; }
.cover-info .duration { position: absolute; right: 0; bottom: 0; padding: 3px; border-radius: 5px 0 5px 0; background: rgba(0,0,0,0.7); opacity: .8; color: #fff; font-size: 13px; }
.video-info .user-name { margin-top: 5px; color: var(--text3); font-size: 14px; }
.video-info .user-name::before { margin-right: 5px; }
.video-info .video-count { margin-top: 10px; color: var(--text3); display: flex; align-items: center; }
.video-info .video-count .iconfont { font-size: 14px; margin-right: 20px; }
.video-info .video-count .iconfont::before { font-size: 18px; margin-right: 5px; }
</style>
