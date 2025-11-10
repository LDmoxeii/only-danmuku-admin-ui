import axios, { AxiosInstance } from 'axios'
import { ElLoading } from 'element-plus'
import Message from './message'
import router from '../router'
import VueCookies from 'vue-cookies'

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'
const responseTypeJson = 'json'

let loading: ReturnType<typeof ElLoading.service> | null = null

const instance: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: '/api',
  timeout: 10 * 1000
})

// request interceptor
instance.interceptors.request.use(
  (config: any) => {
    if (config.showLoading) {
      loading = ElLoading.service({
        lock: true,
        text: '加载中......',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    return config
  },
  (error: any) => {
    if ((error?.config?.showLoading) && loading) {
      loading.close()
    }
    Message.error('请求发送失败')
    return Promise.reject('请求发送失败')
  }
)

// response interceptor
instance.interceptors.response.use(
  (response: any) => {
    const { showLoading, errorCallback, showError = true, responseType } = response.config || {}
    if (showLoading && loading) {
      loading.close()
    }
    const responseData = response.data
    if (responseType === 'arraybuffer' || responseType === 'blob') {
      return responseData
    }
    if (responseData?.code === 20000) {
      return responseData
    } else if (responseData?.code === 404) {
      router.push('/404')
      return
    } else if (responseData?.code === 901) {
      router.push('/login')
      return Promise.reject({ showError: false })
    } else {
      if (errorCallback) {
        errorCallback(responseData)
      }
      return Promise.reject({ showError, msg: responseData?.info })
    }
  },
  (error: any) => {
    if ((error?.config?.showLoading) && loading) {
      loading.close()
    }
    return Promise.reject({ showError: true, msg: '网络异常' })
  }
)

interface RequestConfig {
  url: string
  params?: Record<string, any>
  dataType?: 'json' | 'form'
  showLoading?: boolean
  responseType?: 'json' | 'blob' | 'arraybuffer'
  showError?: boolean
  uploadProgressCallback?: (e: ProgressEvent) => void
  errorCallback?: (resp: any) => void
}

const request = (config: RequestConfig) => {
  const { url, params = {}, dataType, showLoading = true, responseType = responseTypeJson as any, showError = true } = config
  let contentType = contentTypeForm
  const formData = new FormData()
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key] === undefined ? '' : params[key])
  })
  if (dataType != null && dataType === 'json') {
    contentType = contentTypeJson
  }
  const rawCookieToken = (VueCookies as any).get('Authorization') as string | undefined
  const decodedToken = rawCookieToken ? decodeURIComponent(rawCookieToken) : ''
  const authHeader = decodedToken ? (decodedToken.startsWith('Bearer ') ? decodedToken : `Bearer ${decodedToken}`) : ''
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'X-Requested-With': 'XMLHttpRequest'
  }
  if (authHeader) headers['Authorization'] = authHeader

  return instance
    .post(url, formData, {
      onUploadProgress: (event) => {
        if (config.uploadProgressCallback) {
          config.uploadProgressCallback(event)
        }
      },
      responseType: responseType as any,
      headers,
      showLoading,
      errorCallback: config.errorCallback,
      showError
    } as any)
    .catch((error) => {
      if (error.showError) {
        Message.error(error.msg)
      }
      return null
    })
}

export default request

