import { request } from '../config'
import type {
  RechargeOrder,
  CreateRechargeOrderRequest,
  RechargeRecordQueryParams,
  RechargeRecordResponse,
  RechargeStats
} from '@/types/api/user/recharge'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'

export const rechargeApi = {

  // 获取充值记录列表
  getRechargeRecords(params: RechargeRecordQueryParams) {
    return request.get<ApiResponse<RechargeRecordResponse>>('/user/recharge/records', { params })
  },

  // 获取充值记录详情
  getRechargeDetail(id: number) {
    return request.get<ApiResponse<RechargeOrder>>(`/user/recharge/records/${id}`)
  },

  // 创建充值订单
  createRechargeOrder(data: CreateRechargeOrderRequest) {
    return request.post<ApiResponse<RechargeOrder>>('/user/recharge/orders', data)
  },

  // 获取充值订单列表
  getOrders(params: PaginationParams & RechargeRecordQueryParams) {
    return request.get<ApiResponse<PaginationResponse<RechargeOrder>>>('/user/recharge/orders', { params })
  },

  // 获取充值订单详情
  getOrderDetail(id: number) {
    return request.get<ApiResponse<RechargeOrder>>(`/user/recharge/orders/${id}`)
  },

  // 取消充值订单
  cancelRechargeOrder(id: number) {
    return request.post<ApiResponse<void>>(`/user/recharge/orders/${id}/cancel`)
  },

  // 获取充值统计数据
  getRechargeStats(startDate: string, endDate: string) {
    return request.get<ApiResponse<RechargeStats>>('/user/recharge/stats', {
      params: { startDate, endDate }
    })
  },

  // 获取充值记录统计
  getRechargeStatistics() {
    return request.get<ApiResponse<{
      totalAmount: number // 累计充值金额
      totalGift: number // 累计赠送金额
      totalPoints: number // 累计赠送积分
      monthlyAmount: number // 本月充值金额
      monthlyGift: number // 本月赠送金额
      monthlyPoints: number // 本月赠送积分
    }>>('/user/recharge/statistics')
  },

  // 检查充值金额是否满足活动条件
  checkActivityEligibility(amount: number) {
    return request.get<ApiResponse<{
      eligible: boolean
      activities: {
        id: number
        name: string
        gift: number
        points: number
      }[]
    }>>('/user/recharge/check-activity', {
      params: { amount }
    })
  },

  // 导出充值记录
  exportRechargeRecords(params: RechargeRecordQueryParams) {
    return request.get('/user/recharge/records/export', {
      params,
      responseType: 'blob'
    })
  }
} 