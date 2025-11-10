<template>
  <div class="cover-upload">
    <div class="cover" :style="{ width: (width ?? 80) + 'px', height: (height ?? 80) + 'px' }">
      <Cover :source="modelValue" :width="width ?? 80" :scale="scale"></Cover>
      <div class="iconfont icon-close" @click="cleanImg" v-if="modelValue"></div>
    </div>
    <el-upload :multiple="false" :show-file-list="false" :http-request="selectFile" :accept="proxy.imageAccept">
      <el-button class="select-btn" type="primary">选择</el-button>
    </el-upload>
  </div>
  
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import Cover from '@/components/Cover.vue'

const { proxy } = getCurrentInstance() as any

const props = defineProps<{ modelValue?: string | File; width?: number; height?: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const width = computed(() => props.width)
const height = computed(() => props.height)
const scale = computed(() => {
  if (width.value && height.value) return height.value / width.value
  return 1
})

const selectFile = (file: any) => { emit('update:modelValue', file.file) }
const cleanImg = () => { emit('update:modelValue', '') }
</script>

<style lang="scss" scoped>
.cover-upload {
  display: flex;
  align-items: flex-end;
  .cover { position: relative; margin-right: 10px; }
  .cover .icon-close { position: absolute; top: -8px; right: 0px; cursor: pointer; }
}
</style>
