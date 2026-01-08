import type { PageData, PageParam } from '@/api/_types'

export interface GetVideoPageRequest extends PageParam {
  videoNameFuzzy?: string | null
  categoryParentId?: string | number | null
  categoryId?: string | number | null
  recommendType?: string | number | null
}

export type VideoItem = {
  videoId: string | null
  videoCover: string | null
  videoName: string | null
  userId: string | null
  nickName: string | null
  duration: number | null
  postType: number | null
  originInfo: string | null
  tags: string | null
  introduction: string | null
  status: number
  statusName: string | null
  createTime: string
  lastUpdateTime: string | null
  playCount: number | null
  likeCount: number | null
  danmukuCount: number | null
  commentCount: number | null
  coinCount: number | null
  collectCount: number | null
  recommendType: number | null
}

export type GetVideoPageResponse = PageData<VideoItem>

export type GetVideoPListRequest = {
  videoId: string | number
}

export type VideoFileItem = {
  fileId: string | null
  videoId: string | null
  fileIndex: number | null
  fileName: string | null
  fileSize: number | null
  filePath: string | null
  duration: number | null
}

export type RecommendVideoRequest = {
  videoId: string | number
}

export type AuditVideoRequest = {
  videoId: string | number
  status: number
  reason: string | null
}

export type DeleteVideoRequest = {
  videoId: string | number
}
