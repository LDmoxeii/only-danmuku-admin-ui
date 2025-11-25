import request from '@/utils/request'

// 生成直接 GET 可访问的 URL（后台）
export const abrMasterUrl = (fileId: number) => `/admin/video/abr/videoResource/${fileId}/master.m3u8`
export const abrPlaylistUrl = (fileId: number, quality: string) =>
  `/admin/video/abr/videoResource/${fileId}/${quality}/index.m3u8`
export const abrSegmentUrl = (fileId: number, quality: string, ts: string) =>
  `/admin/video/abr/videoResource/${fileId}/${quality}/${ts}`

// 档位列表（POST）
export const fetchAbrVariants = (fileId: number) =>
  request<{ qualities: string[]; variantJson: string }>({
    url: '/video/abr/variants',
    method: 'post',
    data: { fileId }
  })
