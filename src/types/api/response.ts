import type { AxiosResponse } from 'axios'

/**
 * 通用API响应格式
 * 用于所有API请求的标准响应格式
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 后端API返回的消息格式
 * 根据后端Swagger文档定义
 */
export interface Message {
  code: string
  type: string
  content?: string
  data?: any
}

/**
 * 后端API中的ShopView类型
 */
export interface ShopView {
  id?: number
  name: string
  location?: string
  loginId: string
  password?: string
  status?: string
  users?: User[]
}

/**
 * 后端API中的User类型
 */
export interface User {
  id?: number
  name?: string
  position?: string
  phone?: string
  manager?: boolean
  shopId?: number
  createTime?: string
  updateTime?: string
}

/**
 * 后端API中的分页Shop响应格式
 */
export interface PageInfoShopView {
  currentPage?: number
  pageSize?: number
  totalRecords?: number
  totalPages?: number
  records?: ShopView[]
}

/**
 * 分页请求参数
 * 用于所有需要分页的API请求
 */
export interface PaginationParams {
  page: number
  pageSize: number
  searchQuery?: string
  status?: string
  dateRange?: [string, string]
}

/**
 * 分页响应数据
 * 包含分页信息和数据项列表
 */
export interface PaginationResponse<T> {
  total: number
  items: T[]
  page: number
  pageSize: number
}

/**
 * 完整的API响应类型（包含Axios响应）
 * 主要用于需要访问完整Axios响应对象的场景
 */
export type FullApiResponse<T> = AxiosResponse<ApiResponse<T>>

/**
 * API分页响应类型
 * 用于返回分页数据的API
 */
export type ApiPaginatedResponse<T> = ApiResponse<PaginationResponse<T>>

/**
 * API错误响应类型
 * 用于处理API错误
 */
export interface ApiErrorResponse {
  code: number
  message: string
  details?: string
}
