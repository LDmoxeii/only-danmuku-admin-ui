<template>
  <div class="account-panel">
    <el-form
      class="login-panel"
      :model="formData"
      :rules="rules"
      ref="formDataRef"
    >
      <div class="login-title">登录</div>
      <el-form-item prop="email">
        <el-input
          size="large"
          clearable
          placeholder="请输入账号"
          v-model="formData.account"
          maxLength="150"
        >
          <template #prefix>
            <span class="iconfont icon-account"></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          size="large"
          placeholder="请输入密码"
          v-model="formData.password"
        >
          <template #prefix>
            <span class="iconfont icon-password"></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="checkCode">
        <div class="check-code-panel">
          <el-input
            size="large"
            placeholder="请输入验证码"
            v-model="formData.checkCode"
            @keyup.enter="doSubmit"
          >
            <template #prefix>
              <span class="iconfont icon-checkcode"></span>
            </template>
          </el-input>
          <img
            :src="checkCodeInfo.checkCode"
            class="check-code"
            @click="changeCheckCode()"
          />
        </div>
      </el-form-item>
      <el-button type="primary" size="large" class="op-btn" @click="doSubmit">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { checkCode, login } from '@/api/account'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance() as any
const router = useRouter()

const checkCodeInfo = ref<any>({})
const changeCheckCode = async () => {
  const data = await checkCode()
  checkCodeInfo.value = data
}
changeCheckCode()

const formData = ref<any>({})
const formDataRef = ref<any>()
const rules = {
  account: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }],
  checkCode: [{ required: true, message: '请输入图片验证码' }]
}

const doSubmit = () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    const params: any = { ...formData.value }
    params.checkCodeKey = checkCodeInfo.value.checkCodeKey
        try {
      const data = await login(params)
      if (data.token) {
        proxy.VueCookies.set('Authorization', data.token)
      }
      router.push('/home')
      proxy.Message.success('��¼�ɹ�')
      proxy.VueCookies.set('account', data)
    } catch (e) {
      changeCheckCode()
      throw e
    }