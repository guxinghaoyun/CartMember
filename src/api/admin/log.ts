import { request } from '../config'
import type {
  OperationLog,
  SystemLog,
  LoginLog,
  LogQueryParams,
  OperationLogResponse
} from '@/types/api/admin/log'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'
import type { RequestConfig } from '../types'

export const logApi = {
  // 操作日志
  getOperationLogs(params: PaginationParams & LogQueryParams) {
    return request.get<ApiResponse<PaginationResponse<OperationLog>>>('/operation-log', {
      params
    })
  },

  getOperationLogDetail(id: number) {
    return request.get<ApiResponse<OperationLog>>(`/admin/logs/operation/${id}`)
  },

  // 系统日志
  getSystemLogs(params: PaginationParams & LogQueryParams) {
    return request.get<ApiResponse<PaginationResponse<SystemLog>>>('/admin/logs/system', { params })
  },

  getSystemLogDetail(id: number) {
    return request.get<ApiResponse<SystemLog>>(`/admin/logs/system/${id}`)
  },

  // 登录日志
  getLoginLogs(params: PaginationParams & LogQueryParams) {
    return request.get<ApiResponse<PaginationResponse<LoginLog>>>('/admin/logs/login', { params })
  },

  getLoginLogDetail(id: number) {
    return request.get<ApiResponse<LoginLog>>(`/admin/logs/login/${id}`)
  },

  // 导出日志
  exportOperationLogs(params: LogQueryParams) {
    const config: RequestConfig = {
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get<Blob>('/admin/logs/operation/export', { ...config, params })
  },

  exportSystemLogs(params: LogQueryParams) {
    const config: RequestConfig = {
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get<Blob>('/admin/logs/system/export', { ...config, params })
  },

  exportLoginLogs(params: LogQueryParams) {
    const config: RequestConfig = {
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get<Blob>('/admin/logs/login/export', { ...config, params })
  },

  // 清理日志
  cleanOperationLogs(beforeDate: string) {
    return request.delete<ApiResponse<void>>('/admin/logs/operation/clean', {
      params: { beforeDate }
    })
  },

  cleanSystemLogs(beforeDate: string) {
    return request.delete<ApiResponse<void>>('/admin/logs/system/clean', { params: { beforeDate } })
  },

  cleanLoginLogs(beforeDate: string) {
    return request.delete<ApiResponse<void>>('/admin/logs/login/clean', { params: { beforeDate } })
  },

  // 获取新的操作日志（对接新接口）
  getNewOperationLogs(params: {
    pageNumber?: number
    pageSize?: number
    content?: string
    status?: string
    startTime?: string
    endTime?: string
  }) {
    return request.post<any, OperationLogResponse>('/operation-log', params)
  }
}
