import request from '@/utils/request'
import type { ActualTimeStatisticsInfo, WeekStatisticsItem } from './types'

const base = '/index'

export async function getActualTimeStatisticsInfo(): Promise<ActualTimeStatisticsInfo> {
  return await request<ActualTimeStatisticsInfo>({ url: `${base}/getActualTimeStatisticsInfo`, method: 'post' })
}

export async function getWeekStatisticsInfo(params: { dataType: number }): Promise<WeekStatisticsItem[]> {
  return await request<WeekStatisticsItem[]>({ url: `${base}/getWeekStatisticsInfo`, method: 'post', params })
}

