import request from '@/utils/request'

// ABR HLS resource URLs exposed via the same /api gateway (rewritten to /admin on dev)
export const abrMasterUrl = (fileId: string | number) => `/api/video/abr/videoResource/${fileId}/master.m3u8`
export const abrPlaylistUrl = (fileId: string | number, quality: string) =>
  `/api/video/abr/videoResource/${fileId}/${quality}/index.m3u8`
export const abrSegmentUrl = (fileId: string | number, quality: string, ts: string) =>
  `/api/video/abr/videoResource/${fileId}/${quality}/${ts}`

// 档位列表（POST）
export const fetchAbrVariants = (fileId: string | number) =>
  request<{ qualities: string[]; variantJson: string }>({
    url: '/video/abr/variants',
    method: 'post',
    data: { fileId }
  })
