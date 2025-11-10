<template>
  <div class="cover" :style="{ height: 200 * sc + 'px' }">
    <el-image :src="coverFile" fit="scale-down" width="200" v-if="coverFile">
      <template #error>
        <div class="iconfont icon-image-error"></div>
      </template>
    </el-image>
    <div class="mask" @click="selectImage">{{ coverImage ? '重新上传' : '上传' }}</div>
  </div>
  <ImageCoverCut ref="imageCoverCutRef" :cutWidth="cutWidth" :scale="sc" />
</template>

<script setup lang="ts">
import ImageCoverCut from './ImageCoverCut.vue'
import { ref, getCurrentInstance, watch, provide, toRefs, computed } from 'vue'

const { proxy } = getCurrentInstance() as any

const props = defineProps<{ coverImage?: string | File; cutWidth?: number; scale?: number }>()
const emit = defineEmits<{ (e: 'update:coverImage', v: any): void; (e: 'change', v: any): void }>()
const { coverImage, cutWidth } = toRefs(props)
const sc = computed(() => props.scale ?? 1)

const coverFile = ref<string | null>(null)

const convertFile2Base64 = (file: File) => new Promise<string>((resolve) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = ({ target }: any) => resolve(target.result)
})

watch(coverImage, async (val) => {
  if (!val) { coverFile.value = null; return }
  if (typeof val === 'string') {
    coverFile.value = proxy.Api.sourcePath + val
  } else if (val instanceof File) {
    coverFile.value = await convertFile2Base64(val)
  } else {
    coverFile.value = null
  }
}, { immediate: true })

const imageCoverCutRef = ref<any>()
const selectImage = () => { imageCoverCutRef.value.show() }

provide('cutImageCallback', ({ coverImage }: { coverImage: File }) => {
  emit('update:coverImage', coverImage)
  emit('change', coverImage)
})
</script>

<style lang="scss" scoped>
.cover { width: 170px; background: #f0f0f0; position: relative; }
.mask { width: 100%; position: absolute; left: 0; bottom: 0; height: 30px; background: rgba(0,0,0,0.7); opacity: .8; z-index: 1; color: #fff; text-align: center; cursor: pointer; }
</style>
