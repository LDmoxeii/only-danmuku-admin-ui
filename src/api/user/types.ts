import type { PageData } from '@/api/_types'

export interface UserItem {
  userId: string | number
  avatar?: string
  nickName: string
  sex?: number
  email?: string
  birthday?: string
  joinTime?: string
  lastLoginTime?: string
  lastLoginIp?: string
  personIntroduction?: string
  currentCoinCount?: number
  totalCoinCount?: number
  status?: number
}

export type LoadUserParams = {
  pageNum: number
  pageSize: number
  nickNameFuzzy?: string
  status?: number
}

export type LoadUserResult = PageData<UserItem>

