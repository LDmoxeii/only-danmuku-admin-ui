<template>
  <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" :showCancel="true" @close="dialogConfig.show = false">
    <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
      <el-form-item label="分类编号" prop="categoryCode">
        <el-input v-model="formData.categoryCode" :show-word-limit="true" :maxlength="30" />
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="formData.categoryName" :show-word-limit="true" :maxlength="30" />
      </el-form-item>
      <template v-if="formData.parentId === 0">
        <el-form-item label="图标" prop="icon">
          <ImageUpload v-model="formData.icon" />
        </el-form-item>
        <el-form-item label="背景图" prop="icon">
          <ImageUpload v-model="formData.background" :width="300" :height="150" />
        </el-form-item>
      </template>
    </el-form>
  </Dialog>
</template>

<script setup lang="ts">
import ImageUpload from '@/components/ImageUpload.vue'
import { ref, getCurrentInstance, nextTick } from 'vue'
import { uploadImage } from '@/utils/api'

const { proxy } = getCurrentInstance() as any

const dialogConfig = ref({
  show: false,
  title: '新增分类',
  buttons: [
    { type: 'primary', text: '确定', click: () => { submitForm() } },
  ],
})

const formData = ref<any>({})
const formDataRef = ref<any>()
const rules = {
  categoryCode: [{ required: true, message: '请输入分类编号' }],
  categoryName: [{ required: true, message: '请输入分类名称' }],
}

const showEdit = (data: any) => {
  dialogConfig.value.show = true
  nextTick(() => {
    formDataRef.value?.resetFields()
    dialogConfig.value.title = data.categoryId == null ? '新增分类' : '修改分类'
    formData.value = Object.assign({}, data)
  })
}
defineExpose({ showEdit })

const emit = defineEmits<{ (e: 'reload'): void }>()
const submitForm = async () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    const params: any = { ...formData.value }
    if (params.icon instanceof File) params.icon = await uploadImage(params.icon)
    if (params.background instanceof File) params.background = await uploadImage(params.background)
    delete params.children
    const result = await proxy.Request({ url: proxy.Api.saveCategory, params })
    if (!result) return
    dialogConfig.value.show = false
    proxy.Message.success('保存成功')
    emit('reload')
  })
}
</script>

<style lang="scss" scoped>
</style>

