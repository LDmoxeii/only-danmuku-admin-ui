import request from '@/utils/request'
import type { GetSettingResponse, SaveSettingRequest } from './types'

const base = '/setting'

export async function getSetting(): Promise<GetSettingResponse> {
  return await request<GetSettingResponse>({ url: `${base}/getSetting`, method: 'post' })
}

export async function saveSetting(data: SaveSettingRequest): Promise<void> {
  return await request<void>({ url: `${base}/saveSetting`, method: 'post', data })
}

