export type CategoryItem = {
  categoryId: string | number
  categoryCode: string
  categoryName: string
  parentId: string | number | null
  icon: string | null
  background: string | null
  sort: number
  children: CategoryItem[]
}

export type SaveCategoryRequest = {
  pCategoryId: string | number
  categoryId: string | number | null
  categoryCode: string
  categoryName: string
  icon: string | null
  background: string | null
}

export type DeleteCategoryRequest = {
  categoryId: string | number
}

export type ChangeCategorySortRequest = {
  parentId: string | number
  categoryIds: string
}
