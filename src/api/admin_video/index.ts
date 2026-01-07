import request from '@/utils/request'
import type {
  AuditVideoRequest,
  DeleteVideoRequest,
  GetVideoPageRequest,
  GetVideoPageResponse,
  GetVideoPListRequest,
  RecommendVideoRequest,
  VideoFileItem
} from './types'

const base = '/video'

export async function loadVideoList(data: GetVideoPageRequest): Promise<GetVideoPageResponse> {
  return await request<GetVideoPageResponse>({ url: `${base}/page`, method: 'post', data })
}

export async function loadVideoPList(data: GetVideoPListRequest): Promise<VideoFileItem[]> {
  return await request<VideoFileItem[]>({ url: `${base}/getVideoPList`, method: 'post', data })
}

export async function recommendVideo(data: RecommendVideoRequest): Promise<void> {
  return await request<void>({ url: `${base}/recommendVideo`, method: 'post', data })
}

export async function auditVideo(data: AuditVideoRequest): Promise<void> {
  return await request<void>({ url: `${base}/auditVideo`, method: 'post', data })
}

export async function deleteVideo(data: DeleteVideoRequest): Promise<void> {
  return await request<void>({ url: `${base}/deleteVideo`, method: 'post', data })
}
