import type { PageData, PageParam } from '@/api/_types'

export interface GetDanmukuPageRequest extends PageParam {
  videoNameFuzzy?: string | null
}

export type DanmukuItem = {
  danmukuId: string | number | null
  videoId: string | null
  videoName: string | null
  videoCover: string | null
  userId: string | null
  nickName: string | null
  text: string | null
  mode: number | null
  color: string | null
  time: number | null
  postTime: string | null
}

export type GetDanmukuPageResponse = PageData<DanmukuItem>

export interface GetVideoCommentPageRequest extends PageParam {
  videoNameFuzzy?: string | null
}

export type VideoCommentItem = {
  commentId: string | number | null
  pCommentId: string | number | null
  videoId: string | null
  videoName: string | null
  videoCover: string | null
  userId: string | null
  nickName: string | null
  avatar: string | null
  replyUserId: string | null
  replyNickName: string | null
  content: string | null
  imgPath: string | null
  topType: number | null
  likeCount: number | null
  hateCount: number | null
  postTime: string | null
}

export type GetVideoCommentPageResponse = PageData<VideoCommentItem>

export type DeleteDanmukuRequest = {
  danmukuId: string | number
}

export type DeleteCommentRequest = {
  commentId: string | number
}
