<template>
  <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="1000px" @close="dialogConfig.show = false">
    <div class="cut-image-panel">
      <VueCropper
        ref="cropperRef"
        class="cropper"
        :img="sourceImage"
        outputType="png"
        :autoCrop="true"
        :autoCropWidth="props.cutWidth"
        :autoCropHeight="Math.round(props.cutWidth * props.scale)"
        :fixed="true"
        :fixedNumber="[1, props.scale]"
        :centerBox="true"
        :full="false"
        :fixedBox="true"
        @realTime="prview"
        mode="100%"
      />
      <div class="preview-panel">
        <div class="preview-image">
          <img :src="previewsImage" />
        </div>
        <el-upload :multiple="false" :show-file-list="false" :http-request="selectFile" :accept="proxy.imageAccept">
          <el-button class="select-btn" type="primary">选择图片</el-button>
        </el-upload>
      </div>
    </div>
    <div class="info">
      建议上传至少{{ props.cutWidth }}*{{ Math.round(props.cutWidth * props.scale) }}的图片
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { ref, getCurrentInstance, nextTick, inject } from 'vue'

const { proxy } = getCurrentInstance() as any

const props = defineProps<{ cutWidth?: number; scale?: number }>()

const dialogConfig = ref({
  show: false,
  title: '上传图片',
  buttons: [ { type: 'primary', text: '确定', click: () => { cutImage() } } ]
})

const cropperRef = ref<any>()
const previewsImage = ref<string>('')
const prview = () => {
  cropperRef.value.getCropData((data: string) => { previewsImage.value = data })
}

const sourceImage = ref<string>('')
const selectFile = (file: any) => {
  const f: File = file.file
  const reader = new FileReader()
  reader.readAsDataURL(f)
  reader.onload = ({ target }: any) => { sourceImage.value = target.result }
}

const show = () => {
  dialogConfig.value.show = true
  sourceImage.value = ''
  nextTick(() => { previewsImage.value = '' })
}
defineExpose({ show })

const cutImageCallback = inject<(v: { coverImage: File }) => void>('cutImageCallback')
const cutImage = () => {
  const cropW = Math.round(cropperRef.value.cropW)
  const cropH = Math.round(cropperRef.value.cropH)
  if (cropW === 0 || cropH === 0) { proxy.Message.warning('请选择图片'); return }
  if (cropW < (props.cutWidth ?? 400) || cropH < Math.round((props.cutWidth ?? 400) * (props.scale ?? 0.5))) {
    proxy.Message.warning(`图片尺寸至少满足(${props.cutWidth}*${Math.round((props.cutWidth ?? 400) * (props.scale ?? 0.5))}`)
    return
  }
  cropperRef.value.getCropBlob((blob: Blob) => {
    const file = new File([blob], 'temp.' + blob.type.substring(blob.type.indexOf('/') + 1), { type: blob.type })
    dialogConfig.value.show = false
    cutImageCallback && cutImageCallback({ coverImage: file })
  })
}
</script>

<style lang="scss" scoped>
.cut-image-panel { display: flex; }
.cropper { flex: 1; height: 500px; }
.preview-panel { width: 200px; margin-left: 20px; text-align: center; }
.preview-image { width: 100%; height: 200px; background: #f6f6f6; display: flex; align-items: center; }
.preview-panel img { width: 100%; }
.select-btn { margin-top: 20px; }
.info { color: #6b6b6b; }
</style>

