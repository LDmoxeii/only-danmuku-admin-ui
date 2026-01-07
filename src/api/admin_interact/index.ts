import request from '@/utils/request'
import type {
  DeleteCommentRequest,
  DeleteDanmukuRequest,
  GetDanmukuPageRequest,
  GetDanmukuPageResponse,
  GetVideoCommentPageRequest,
  GetVideoCommentPageResponse
} from './types'

const base = '/interact'

export async function loadDanmu(data: GetDanmukuPageRequest): Promise<GetDanmukuPageResponse> {
  return await request<GetDanmukuPageResponse>({ url: `${base}/page`, method: 'post', data })
}

export async function delDanmu(data: DeleteDanmukuRequest): Promise<void> {
  return await request<void>({ url: `${base}/delDanmuku`, method: 'post', data })
}

export async function loadComment(data: GetVideoCommentPageRequest): Promise<GetVideoCommentPageResponse> {
  return await request<GetVideoCommentPageResponse>({ url: `${base}/getVideoCommentPage`, method: 'post', data })
}

export async function delComment(data: DeleteCommentRequest): Promise<void> {
  return await request<void>({ url: `${base}/delComment`, method: 'post', data })
}

