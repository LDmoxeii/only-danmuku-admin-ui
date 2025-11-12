import request from '@/utils/request'

const base = '/admin/setting'

export async function getSetting(): Promise<any> {
  return await request<any>({ url: `${base}/getSetting`, method: 'post' })
}

export async function saveSetting(params: Record<string, any>): Promise<void> {
  return await request<void>({ url: `${base}/saveSetting`, method: 'post', params })
}

