// 操作日志类型
export interface OperationLog {
  id: number
  module: string
  action: string
  operator: {
    id: number
    name: string
    role: string
  }
  ip: string
  status: 'success' | 'failed'
  requestMethod: string
  requestUrl: string
  requestParams?: string
  responseData?: string
  errorMessage?: string
  duration: number // 请求耗时（毫秒）
  createTime: string
}

// 系统日志类型
export interface SystemLog {
  id: number
  level: 'info' | 'warning' | 'error'
  type: 'system' | 'business' | 'security'
  message: string
  details?: string
  stackTrace?: string
  source: string
  createTime: string
}

// 登录日志类型
export interface LoginLog {
  id: number
  userId: number
  username: string
  ip: string
  device: string
  browser: string
  status: 'success' | 'failed'
  failReason?: string
  createTime: string
}

// 日志查询参数
export interface LogQueryParams {
  module?: string
  action?: string
  operatorId?: number
  status?: 'success' | 'failed'
  level?: SystemLog['level']
  type?: SystemLog['type']
  dateRange?: [string, string]
  keyword?: string
} 