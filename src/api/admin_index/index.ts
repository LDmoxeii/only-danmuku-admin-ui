import request from '@/utils/request'
import type { GetActualTimeStatisticsResponse, GetWeekStatisticsInfoRequest, WeekStatisticsItem } from './types'

const base = '/index'

export async function getActualTimeStatisticsInfo(): Promise<GetActualTimeStatisticsResponse> {
  return await request<GetActualTimeStatisticsResponse>({ url: `${base}/getActualTimeStatisticsInfo`, method: 'post' })
}

export async function getWeekStatisticsInfo(data: GetWeekStatisticsInfoRequest): Promise<WeekStatisticsItem[]> {
  return await request<WeekStatisticsItem[]>({ url: `${base}/getWeekStatisticsInfo`, method: 'post', data })
}

