import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElLoading } from 'element-plus'
import Message from './message'
import router from '../router'
import VueCookies from 'vue-cookies'

let loading: ReturnType<typeof ElLoading.service> | null = null
const instance: AxiosInstance = axios.create(
    {
        withCredentials: true,
        baseURL: '/api',
        timeout: 10 * 1000,
    }
)
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
instance.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8'

const tansParams = (params: Record<string, any> = {}): string => {
  let result = ''
  const add = (key: string, val: any) => {
    if (val === undefined || val === null || val === '') return
    result += `${encodeURIComponent(key)}=${encodeURIComponent(val)}&`
  }
  const build = (prefix: string, obj: any) => {
    if (Array.isArray(obj)) obj.forEach((v) => add(prefix, v))
    else if (Object.prototype.toString.call(obj) === '[object Object]') Object.keys(obj).forEach((k) => build(`${prefix}[${k}]`, obj[k]))
    else add(prefix, obj)
  }
  Object.keys(params).forEach((prop) => build(prop, params[prop]))
  return result
}

instance.interceptors.request.use(
  (config: any) => {
    if (config.showLoading) {
      loading = ElLoading.service({ lock: true, text: '加载中......', background: 'rgba(0, 0, 0, 0.7)' })
    }
    const token = (VueCookies as any).get('Authorization')
    const authHeader = token ? (String(token).startsWith('Bearer ') ? String(token) : `Bearer ${token}`) : ''
    config.headers = config.headers || {}
    if (authHeader) config.headers['Authorization'] = authHeader
    config.headers['X-Requested-With'] = 'XMLHttpRequest'

    // GET params → url
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    if (config.uploadProgressCallback && !config.onUploadProgress) {
      config.onUploadProgress = config.uploadProgressCallback
    }

    if (config.data instanceof FormData && config.headers && config.headers['Content-Type']) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error: any) => {
    if (error?.config?.showLoading && loading) loading.close()
    Message.error('请求发送失败')
    return Promise.reject('请求发送失败')
  }
)

instance.interceptors.response.use(
  (response: any) => {
    const { showLoading, errorCallback, showError = true } = response.config || {}
    if (showLoading && loading) loading.close()
    const responseData = response.data
    const respType = response?.request?.responseType || response?.config?.responseType
    if (respType === 'arraybuffer' || respType === 'blob') return responseData
    if (responseData?.code === 20000) return responseData.data
    if (responseData?.code === 901) {
      router.push('/login')
      return Promise.reject({ showError: false })
    }
    if (errorCallback) errorCallback(responseData)
    const msg = responseData?.message || responseData?.msg || '请求失败'
    if (showError) Message.error(msg)
    return Promise.reject({ showError, msg, message: msg, code: responseData?.code })
  },
  (error: any) => {
    const { showLoading, errorCallback, showError = true } = error?.config || {}
    if (showLoading && loading) loading.close()
    const status = error?.response?.status
    const responseData = error?.response?.data
    const backendMsg = responseData?.message || responseData?.msg
    if (!error?.response) {
      const msg = '网络异常'
      const callbackData = { status, msg, message: msg }
      if (errorCallback) errorCallback(callbackData)
      if (showError) Message.error(msg)
      return Promise.reject({ showError, msg, message: msg, status })
    }
    if (status === 401) {
      if (errorCallback) errorCallback(responseData || { status, msg: backendMsg || '未登录或登录已过期', message: backendMsg || '未登录或登录已过期' })
      router.push('/login')
      const msg = backendMsg || '未登录或登录已过期'
      return Promise.reject({ showError: false, msg, message: msg, status })
    }
    let msg = ''
    if (status === 403) {
      msg = backendMsg || '没有权限执行当前操作'
    } else if (status === 429) {
      msg = backendMsg || '请求过于频繁'
    } else {
      msg = backendMsg || '系统异常'
    }
    if (errorCallback) errorCallback(responseData || { status, msg, message: msg })
    if (showError) Message.error(msg)
    return Promise.reject({ showError, msg, message: msg, status })
  }
)

export interface RequestConfig<D = any> extends AxiosRequestConfig<D> {
  showLoading?: boolean
  errorCallback?: (msg: any) => void
  showError?: boolean
  uploadProgressCallback?: (e: ProgressEvent) => void
}

const request = <T = any>(config: RequestConfig): Promise<T> => {
  return instance.request<any, T>(config)
}

export default request

