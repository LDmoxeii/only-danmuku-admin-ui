import request from '@/utils/request'
import type { GetVariantsRequest, GetVariantsResponse } from './types'

const base = '/video/abr'

export const abrMasterUrl = (fileId: string | number) => `/api${base}/videoResource/${fileId}/master.m3u8`
export const abrPlaylistUrl = (fileId: string | number, quality: string) =>
  `/api${base}/videoResource/${fileId}/${quality}/index.m3u8`
export const abrSegmentUrl = (fileId: string | number, quality: string, ts: string) =>
  `/api${base}/videoResource/${fileId}/${quality}/${ts}`

export const fetchAbrVariants = (data: GetVariantsRequest) =>
  request<GetVariantsResponse>({
    url: `${base}/getVariants`,
    method: 'post',
    data
  })
