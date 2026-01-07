import request from '@/utils/request'
import type { ChangeStatusRequest, GetUserPageRequest, GetUserPageResponse } from './types'

const base = '/user'

export async function loadUser(data: GetUserPageRequest): Promise<GetUserPageResponse> {
  return await request<GetUserPageResponse>({ url: `${base}/page`, method: 'post', data })
}

export async function changeStatus(data: ChangeStatusRequest): Promise<void> {
  return await request<void>({ url: `${base}/changeStatus`, method: 'post', data })
}

