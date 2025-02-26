import type { AxiosResponse } from 'axios'

// API响应类型
export type ApiResponseData<T> = AxiosResponse<{
  code: number
  message: string
  data: T
}>

// 分页响应类型
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// API分页响应类型
export type ApiPaginatedResponse<T> = ApiResponseData<PaginatedData<T>> 