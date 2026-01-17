import request from '@/utils/request'
import type {
  CategoryItem,
  ChangeCategorySortRequest,
  DeleteCategoryRequest,
  SaveCategoryRequest,
  UpdateCategoryRequest,
} from './types'

const base = '/category'

export async function loadCategory(): Promise<CategoryItem[]> {
  return await request<CategoryItem[]>({ url: `${base}/getCategoryTree`, method: 'post' })
}

export async function saveCategory(data: SaveCategoryRequest): Promise<void> {
  return await request<void>({ url: `${base}/save`, method: 'post', data })
}

export async function updateCategory(data: UpdateCategoryRequest): Promise<void> {
  return await request<void>({ url: `${base}/update`, method: 'post', data })
}

export async function delCategory(data: DeleteCategoryRequest): Promise<void> {
  return await request<void>({ url: `${base}/delete`, method: 'post', data })
}

export async function changeSort(data: ChangeCategorySortRequest): Promise<void> {
  return await request<void>({ url: `${base}/changeSort`, method: 'post', data })
}

