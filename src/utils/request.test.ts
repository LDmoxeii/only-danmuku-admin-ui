import { beforeEach, describe, expect, it, vi } from 'vitest'

const push = vi.fn()
const messageError = vi.fn()
const cookieGet = vi.fn()
const close = vi.fn()
let responseFulfilled: ((value: any) => any) | undefined
let responseRejected: ((reason: any) => any) | undefined

const axiosInstance = {
  defaults: {
    headers: {
      post: {},
      put: {}
    }
  },
  interceptors: {
    request: {
      use: vi.fn()
    },
    response: {
      use: vi.fn((fulfilled: (value: any) => any, rejected: (reason: any) => any) => {
        responseFulfilled = fulfilled
        responseRejected = rejected
      })
    }
  },
  request: vi.fn()
}

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => axiosInstance)
  }
}))

vi.mock('./message', () => ({
  default: {
    error: messageError
  }
}))

vi.mock('../router', () => ({
  default: {
    push
  }
}))

vi.mock('vue-cookies', () => ({
  default: {
    get: cookieGet
  }
}))

vi.mock('element-plus', () => ({
  ElLoading: {
    service: vi.fn(() => ({ close }))
  }
}))

describe('request interceptor protocol', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    if (!responseFulfilled || !responseRejected) {
      await import('./request')
    }
  })

  it('should reject business errors from http 200 with backend payload', async () => {
    const errorCallback = vi.fn()

    await expect(
      responseFulfilled?.({
        data: { code: 40240, message: '验证码错误' },
        config: { errorCallback, showError: true },
        request: {}
      })
    ).rejects.toMatchObject({
      showError: true,
      msg: '验证码错误',
      message: '验证码错误',
      code: 40240
    })

    expect(errorCallback).toHaveBeenCalledWith({ code: 40240, message: '验证码错误' })
    expect(messageError).toHaveBeenCalledWith('验证码错误')
  })

  it('should redirect to login on http 401 without generic toast', async () => {
    const errorCallback = vi.fn()

    await expect(
      responseRejected?.({
        config: { errorCallback, showError: true },
        response: {
          status: 401,
          data: { message: '未登录或登录已过期' }
        }
      })
    ).rejects.toMatchObject({
      showError: false,
      msg: '未登录或登录已过期',
      message: '未登录或登录已过期',
      status: 401
    })

    expect(push).toHaveBeenCalledWith('/login')
    expect(errorCallback).toHaveBeenCalledWith({ message: '未登录或登录已过期' })
    expect(messageError).not.toHaveBeenCalled()
  })

  it('should surface network errors with network-specific message', async () => {
    const errorCallback = vi.fn()

    await expect(
      responseRejected?.({
        config: { errorCallback, showError: true }
      })
    ).rejects.toMatchObject({
      showError: true,
      msg: '网络异常',
      message: '网络异常'
    })

    expect(errorCallback).toHaveBeenCalledWith({ status: undefined, msg: '网络异常', message: '网络异常' })
    expect(messageError).toHaveBeenCalledWith('网络异常')
  })
})
