<template>
  <div class="account-panel">
    <el-form class="login-panel" :model="formData" :rules="rules" ref="formDataRef">
      <div class="login-title">登录</div>
      <el-form-item prop="email">
        <el-input size="large" clearable placeholder="请输入账号" v-model="formData.account" maxLength="150">
          <template #prefix>
            <span class="iconfont icon-account"></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input show-password size="large" placeholder="请输入密码" v-model="formData.password">
          <template #prefix>
            <span class="iconfont icon-password"></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="checkCode">
        <div class="check-code-panel">
          <el-input size="large" placeholder="请输入验证码" v-model="formData.checkCode" @keyup.enter="doSubmit">
            <template #prefix>
              <span class="iconfont icon-checkcode"></span>
            </template>
          </el-input>
          <img :src="checkCodeInfo.checkCode" class="check-code" @click="changeCheckCode()" alt=""/>
        </div>
      </el-form-item>
      <el-button type="primary" size="large" class="op-btn" @click="doSubmit">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, ref} from 'vue'
import {checkCode, login} from '@/api/account'
import {useRouter} from 'vue-router'

const { proxy } = getCurrentInstance() as any
const router = useRouter()

const checkCodeInfo = ref<any>({})
const changeCheckCode = async () => {
  checkCodeInfo.value = await checkCode()
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
    const params: Record<string, any> = {...formData.value}
    params.checkCodeKey = checkCodeInfo.value.checkCodeKey
    try {
      const result = await login(params as any)
      // 统一封装：Cookie仅保存纯token，不做前缀/编码，Header由请求封装补齐
      if (result.token) {
        proxy.VueCookies.set("Authorization", result.token)
      }
      await router.push('/home')
      proxy.Message.success('登录成功')
    } catch (e) {
      await changeCheckCode()
      throw e
    }
  })
}
</script>

<style lang="scss">
.account-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh);
  background: url("../../assets/login-bg.png") center, center;
  background-size: 100% 100%;
  .login-panel {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 30px;
    width: 400px;
    border-radius: 5px;
    .login-title {
      text-align: center;
      font-size: 16px;
      line-height: 40px;
    }
    .check-code-panel {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .check-code {
        margin-left: 5px;
        cursor: pointer;
      }
    }
    .op-btn {
      width: 100%;
    }
  }
}
</style>
