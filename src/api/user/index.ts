import request from '@/utils/request'
import type { LoadUserParams, LoadUserResult } from './types'

const base = '/admin/user'

export async function loadUser(params: LoadUserParams): Promise<LoadUserResult> {
  return await request<LoadUserResult>({ url: `${base}/loadUser`, method: 'post', params })
}

export async function changeStatus(params: { userId: string | number; status: number }): Promise<void> {
  return await request<void>({ url: `${base}/changeStatus`, method: 'post', params })
}

