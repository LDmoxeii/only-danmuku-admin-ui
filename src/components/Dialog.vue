<template>
  <el-dialog
    :show-close="showClose"
    :draggable="draggable"
    :model-value="show"
    :close-on-click-modal="false"
    class="cust-dialog"
    :top="top + 'px'"
    :width="width"
    @close="close"
  >
    <template #header>
      <div v-if="title" class="title">{{ title }}</div>
      <slot v-else name="header"></slot>
    </template>
    <div class="dialog-body" :style="{ 'max-height': maxHeight + 'px', padding: padding + 'px' }">
      <slot></slot>
    </div>
    <template v-if="(buttons && buttons.length > 0) || showCancel">
      <div class="dialog-footer">
        <el-button link @click="close" v-if="showCancel"> 取消 </el-button>
        <el-button v-for="btn in buttons" :key="btn.text" :type="(btn as any).type || 'primary'" @click="(btn as any).click">
          {{ (btn as any).text }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{ 
  draggable?: boolean
  title?: string
  show?: boolean
  showClose?: boolean
  showCancel?: boolean
  top?: number
  width?: string
  buttons?: Array<{ text: string; type?: string; click: () => void }>
  padding?: number
}>()

const maxHeight = window.innerHeight - (props.top ?? 50) - (!props.buttons || props.buttons.length === 0 ? 70 : 120)

const emit = defineEmits<{ (e: 'close'): void }>()
const close = () => emit('close')
</script>

<style lang="scss">
.cust-dialog {
  padding: 0px !important;
  margin-bottom: 5px !important;
  .el-dialog__header { padding: 16px; }
  .title { font-size: 20px; }
  .dialog-body { min-height: 80px; overflow: auto; overflow-x: hidden; padding: 20px; }
  .dialog-footer { border-top: 1px solid #ddd; text-align: right; padding: 5px 20px; }
}
</style>

