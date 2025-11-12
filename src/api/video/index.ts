import request from '@/utils/request'
import type { PageData } from '@/api/_types'

const base = '/admin/videoInfo'

export async function loadVideoList(params: { pageNum: number; pageSize?: number; videoNameFuzzy?: string; status?: number }): Promise<PageData<any>> {
  return await request<PageData<any>>({ url: `${base}/loadVideoList`, method: 'post', params })
}

export async function loadVideoPList(videoId: string | number): Promise<any[]> {
  return await request<any[]>({ url: `${base}/loadVideoPList`, method: 'post', params: { videoId } })
}

export async function recommendVideo(videoId: string | number): Promise<void> {
  return await request<void>({ url: `${base}/recommendVideo`, method: 'post', params: { videoId } })
}

export async function auditVideo(params: { videoId: string | number; status: number; reason?: string }): Promise<void> {
  return await request<void>({ url: `${base}/auditVideo`, method: 'post', params })
}

export async function deleteVideo(videoId: string | number): Promise<void> {
  return await request<void>({ url: `${base}/deleteVideo`, method: 'post', params: { videoId } })
}

