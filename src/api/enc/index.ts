import request from '@/utils/request'

// 管理端：签发加密播放 token（稿件态 filePostId）
export const issueEncToken = (filePostId: string | number) =>
  request<{ token: string; expireAt: number; allowedQualities?: string }>({
    url: '/admin/video/enc/token',
    method: 'post',
    data: { filePostId }
  })

// 管理端：加密资源 URL（会由服务端替换 __TOKEN__）
export const encMasterUrl = (filePostId: string | number, token: string) =>
  `/api/video/enc/videoResource/${filePostId}/master.m3u8?token=${encodeURIComponent(token)}`

export const encPlaylistUrl = (filePostId: string | number, quality: string, token: string) =>
  `/api/video/enc/videoResource/${filePostId}/${quality}/index.m3u8?token=${encodeURIComponent(token)}`

export const encSegmentUrl = (filePostId: string | number, quality: string, ts: string) =>
  `/api/video/enc/videoResource/${filePostId}/${quality}/${ts}`
