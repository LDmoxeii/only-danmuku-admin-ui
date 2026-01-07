import request from '@/utils/request'
import type { CheckCodeResponse, LoginRequest, LoginResponse } from './types'

const base = '/account'

export async function checkCode(): Promise<CheckCodeResponse> {
  return await request<CheckCodeResponse>({ url: `${base}/checkCode`, method: 'post' })
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return await request<LoginResponse>({ url: `${base}/login`, method: 'post', data })
}

export async function logout(): Promise<void> {
  return await request<void>({ url: `${base}/logout`, method: 'post' })
}

