import { request } from '../config'
import type {
  Card,
  CardOperation,
  CreateCardRequest,
  CardQueryParams,
  CardResponse
} from '@/types/api/admin/card'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'
import type { AxiosRequestConfig } from 'axios'

// 扩展 AxiosRequestConfig 类型
interface CustomRequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean
}

export const cardApi = {
  // 获取卡片列表
  getList(params: PaginationParams & CardQueryParams) {
    return request.get<ApiResponse<PaginationResponse<Card>>>('/admin/cards', { params })
  },

  // 获取卡片详情
  getDetail(id: number) {
    return request.get<ApiResponse<Card>>(`/admin/cards/${id}`)
  },

  // 创建卡片（初始化）
  createCard(data: CreateCardRequest) {
    return request.post<ApiResponse<Card>>('/admin/cards', data)
  },

  // 激活卡片
  activate(id: number, memberId: number) {
    return request.post<ApiResponse<Card>>(`/admin/cards/${id}/activate`, { memberId })
  },

  // 禁用卡片
  disable(id: number, reason: string) {
    return request.post<ApiResponse<void>>(`/admin/cards/${id}/disable`, { reason })
  },

  // 获取卡片操作记录
  getOperations(cardId: number, params: PaginationParams) {
    return request.get<ApiResponse<PaginationResponse<CardOperation>>>(`/admin/cards/${cardId}/operations`, { params })
  },

  // 导出卡片列表
  exportCards(params: CardQueryParams) {
    const config: CustomRequestConfig = {
      params,
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get('/admin/cards/export', config)
  }
} 