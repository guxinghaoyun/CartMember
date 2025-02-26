import { request } from '../config'
import type { ApiResponse } from '@/types/api/common'
import type { Operator, OperatorQueryParams, OperatorResponse } from '@/types/api/user/operator'

export const operatorApi = {
  // 获取当前店铺的操作员列表
  getOperators(params: OperatorQueryParams) {
    return request.get<ApiResponse<OperatorResponse>>('/user/operators', { params })
  },

  // 获取操作员详情
  getOperatorById(id: number) {
    return request.get<ApiResponse<Operator>>(`/user/operators/${id}`)
  },

  // 获取当前店铺的所有操作员
  getCurrentStoreOperators() {
    return request.get<ApiResponse<Operator[]>>('/user/operators/current-store')
  }
} 