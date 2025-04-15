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

// 新的操作日志记录
export interface NewOperationLogRecord {
  id: number
  operationType: string // 操作类型，例如"充值"
  operationUser: string // 操作用户，例如"购买充值: 梁森充值"
  operationContent: string // 操作内容
  status: string // 状态，例如"成功"
  createTime: string // 创建时间
  updateTime: string // 更新时间
}

// 新的操作日志响应类型
export interface OperationLogResponse {
  currentPage: number
  totalRecords: number
  totalPages: number
  records: NewOperationLogRecord[]
}
