import request from '@/utils/request'

const base = '/account'

export async function checkCode(): Promise<{ checkCode: string; checkCodeKey: string }> {
  return await request<{ checkCode: string; checkCodeKey: string }>({ url: `${base}/checkCode`, method: 'post' })
}

export async function login(params: { account: string; password: string; checkCode: string; checkCodeKey: string }): Promise<{ userId: string; account: string; nickName: string; token: string }> {
  return await request<{ userId: string; account: string; nickName: string; token: string }>({ url: `${base}/login`, method: 'post', params })
}

