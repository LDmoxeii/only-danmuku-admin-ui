import request from '@/utils/request'
import type { PageData } from '@/api/_types'

const base = '/admin/interact'

export async function loadDanmu(params: { pageNum: number; pageSize?: number; videoId?: string | number }): Promise<PageData<any>> {
  return await request<PageData<any>>({ url: `${base}/loadDanmu`, method: 'post', params })
}

export async function delDanmu(danmukuId: string | number): Promise<void> {
  return await request<void>({ url: `${base}/delDanmu`, method: 'post', params: { danmukuId } })
}

export async function loadComment(params: { pageNum: number; pageSize?: number; videoId?: string | number }): Promise<PageData<any>> {
  return await request<PageData<any>>({ url: `${base}/loadComment`, method: 'post', params })
}

export async function delComment(commentId: string | number): Promise<void> {
  return await request<void>({ url: `${base}/delComment`, method: 'post', params: { commentId } })
}

