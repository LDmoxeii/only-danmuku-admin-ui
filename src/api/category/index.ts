import request from '@/utils/request'
import type { CategoryItem } from './types'

const base = '/admin/category'

export async function loadCategory(): Promise<CategoryItem[]> {
  return await request<CategoryItem[]>({ url: `${base}/loadCategory`, method: 'post' })
}

export async function saveCategory(params: { parentId: number | string; categoryId?: number | string; categoryCode: string; categoryName: string; icon?: string; background?: string }): Promise<void> {
  return await request<void>({ url: `${base}/saveCategory`, method: 'post', params })
}

export async function delCategory(categoryId: number | string): Promise<void> {
  return await request<void>({ url: `${base}/delCategory`, method: 'post', params: { categoryId } })
}

export async function changeSort(params: { parentId: number | string; categoryIds: string }): Promise<void> {
  return await request<void>({ url: `${base}/changeSort`, method: 'post', params })
}

