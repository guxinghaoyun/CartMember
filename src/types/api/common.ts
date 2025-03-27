// 通用API响应格式
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
  searchQuery?: string
  status?: string
  dateRange?: [string, string]
}

// 分页响应数据
export interface PaginationResponse<T> {
  currentPage: number
  pageSize: number
  totalRecords: number
  totalPages: number
  records: T[]
}
