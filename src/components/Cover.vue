<template>
  <div
    class="image-panel"
    ref="coverRef"
    :style="{
      'border-radius': borderRadius,
      width: width ? width + 'px' : '100%',
      height: width ? width * scale + 'px' : '100%',
    }"
  >
    <el-image
      :lazy="lazy"
      :src="fileSource || fileImage"
      :fit="fit"
      v-if="fileSource || fileImage"
      @click="showViewerHandler"
    >
      <template #placeholder>
        <div class="loading" :style="{ height: loadingHeight + 'px' }">
          <img :src="proxy.Utils.getLocalImage('playing.gif')" />
        </div>
      </template>
      <template #error>
        <img :src="proxy.Utils.getLocalImage(img404)" class="el-image__inner" :style="{ 'object-fit': fit }" />
      </template>
    </el-image>
    <div v-else class="no-image">请选择图片</div>
    <el-image-viewer
      :hide-on-click-modal="true"
      @close="() => { showViewer = false }"
      v-if="showViewer"
      :url-list="imageList"
      :teleported="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from 'vue'

const { proxy } = getCurrentInstance() as any

const props = defineProps<{ 
  source?: string | File
  width?: number
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down' | string
  preview?: boolean
  defaultImg?: string
  img404?: string
  borderRadius?: string
  lazy?: boolean
  scale?: number
}>()

const fit = props.fit ?? 'scale-down'
const img404 = props.img404 ?? '404_cover.png'
const borderRadius = props.borderRadius ?? '5px'
const lazy = props.lazy ?? true
const scale = props.scale ?? 0.6

const fileImage = ref<string | ArrayBuffer | null>()
const fileSource = computed(() => {
  if (!props.source && !props.defaultImg) {
    fileImage.value = null
    return null
  }
  if (!props.source && props.defaultImg) {
    return proxy.Utils.getLocalImage(props.defaultImg)
  }
  if (props.source instanceof File) {
    const reader = new FileReader()
    reader.readAsDataURL(props.source)
    reader.onload = ({ target }: any) => {
      fileImage.value = target.result
    }
    return
  } else if (typeof props.source === 'string') {
    return `${proxy.Api.sourcePath}${props.source}`
  } else {
    return
  }
})

const imageList = computed(() => {
  if (!props.preview) return []
  const sourceImg = proxy.Api.sourcePath + (props.source as string).replace(proxy.imageThumbnailSuffix, '')
  return [sourceImg]
})

let showViewer = ref(false)
const showViewerHandler = () => {
  if (!props.preview) return
  showViewer.value = true
}

const coverRef = ref<HTMLDivElement | null>(null)
const loadingHeight = ref<number>()
onMounted(() => {
  if (coverRef.value) loadingHeight.value = coverRef.value.clientWidth * scale
})
</script>

<style lang="scss" scoped>
.image-panel {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  :deep(.el-image) { width: 100%; height: 100%; }
  :deep(.is-loading) { display: none; }
  :deep(.el-image__wrapper) { position: relative; vertical-align: top; width: 100%; height: 100%; display: flex; }
  .icon-image-error { margin: 0px auto; font-size: 20px; color: #838383; height: 100%; }
  .loading { width: 100%; display: flex; align-items: center; justify-content: center; }
  .loading img { width: 20px; }
  .no-image { text-align: center; color: #9f9f9f; }
}
</style>

