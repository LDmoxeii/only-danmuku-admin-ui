<template>
  <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="90%" :showCancel="false" @close="closeWin">
    <div class="video-detail">
      <div class="video-info">
        <el-tabs v-model="activeName">
          <el-tab-pane label="视频分P" name="video">
            <div class="video-tips">红色标题代表视频有更新</div>
            <el-scrollbar :max-height="400" class="video-list">
              <div :class="['video-item', index === currentP - 1 ? 'active' : '']" v-for="(item, index) in videoFileList" :key="item.fileId" @click="selectVideo(index + 1)">
                <div class="playing" v-if="index === currentP - 1"></div>
                <div :class="['title', item.updateType == 1 ? 'update' : '']" :title="item.title">P{{ index + 1 }} {{ item.fileName }}</div>
                <div class="duration">{{ proxy.Utils.convertSecondsToHMS(item.duration) }}</div>
              </div>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="基本信息" name="base">
            <div class="video-base-info">
              <div class="base-info-item"><div class="item-title">标题：</div><div class="item-value">{{ videoInfo.videoName }}</div></div>
              <div class="base-info-item"><div class="item-title">发布人：</div><div class="item-value">{{ videoInfo.nickName }}</div></div>
              <div class="base-info-item"><div class="item-title">类型：</div><div class="item-value">{{ videoInfo.postType == 1 ? '自制' : (videoInfo.postType == 2 ? '转载' : '未知') }}</div></div>
              <div v-if="videoInfo.postType == 2" class="base-info-item"><div class="item-title">资源说明：</div><div class="item-value">{{ videoInfo.originInfo }}</div></div>
              <div class="base-info-item"><div class="item-title">标签：</div><div class="item-value">{{ videoInfo.tags }}</div></div>
              <div class="base-info-item"><div class="item-title">简介：</div><div class="item-value">{{ videoInfo.introduction }}</div></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="video-play">
        <Player ref="playerRef" :autoplay="false"></Player>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {mitter} from '@/eventbus/eventBus'
import {loadVideoPList} from '@/api/admin_video'
import {getCurrentInstance, nextTick, ref} from 'vue'

const { proxy } = getCurrentInstance() as any

const dialogConfig = ref<any>({ show: false })
const activeName = ref<string>('video')
const videoInfo = ref<any>({})
const videoFileList = ref<any[]>([])
const playerRef = ref<any>()
const currentP = ref<number>(1)

const show = (data: any) => {
  dialogConfig.value.show = true
  videoInfo.value = Object.assign({}, data)
  currentP.value = 1
  loadPList()
}

const loadPList = async () => {
  videoFileList.value = await loadVideoPList({ videoId: videoInfo.value.videoId })
  nextTick(() => {
    playerRef.value.showPlayer(window.innerHeight - 150)
    selectVideoFile()
  })
}

const selectVideo = (index: number) => { currentP.value = index; selectVideoFile() }
const selectVideoFile = () => { mitter.emit('changeP', videoFileList.value[currentP.value - 1].fileId) }

const closeWin = () => { dialogConfig.value.show = false; playerRef.value?.destroyPlayer?.() }

defineExpose({ show })
</script>

<style lang="scss" scoped>
.video-detail { display: flex; }
.video-info { width: 400px; margin-right: 10px; }
.video-list { padding-right: 10px; }
.video-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-radius: 4px; cursor: pointer; }
.video-item:hover { background: #fff; }
.video-item .playing { width: 8px; height: 8px; background: #67c23a; border-radius: 50%; }
.video-item .title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; margin: 0 8px; }
.video-item .update { color: red; }
.video-item .duration { margin-left: 5px; }
.video-item.active { background: #fff; }
.video-play { flex: 1; }
</style>


