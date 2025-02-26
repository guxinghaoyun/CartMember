import { request } from '../config'
import type {
  PickupOrder,
  PickupTimeSlot,
  PickupProduct,
  CreatePickupOrderRequest,
  UpdatePickupOrderRequest,
  PickupOrderQueryParams,
  PickupStatistics
} from '@/types/api/user/pickup'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'

export const pickupApi = {
  // 获取提货单列表
  getOrders(params: PaginationParams & PickupOrderQueryParams) {
    return request.get<ApiResponse<PaginationResponse<PickupOrder>>>('/user/pickup/orders', { params })
  },

  // 获取提货单详情
  getOrderById(id: number) {
    return request.get<ApiResponse<PickupOrder>>(`/user/pickup/orders/${id}`)
  },

  // 创建提货单
  createOrder(data: CreatePickupOrderRequest) {
    return request.post<ApiResponse<PickupOrder>>('/user/pickup/orders', data)
  },

  // 更新提货单
  updateOrder(id: number, data: UpdatePickupOrderRequest) {
    return request.put<ApiResponse<PickupOrder>>(`/user/pickup/orders/${id}`, data)
  },

  // 删除提货单
  deleteOrder(id: number) {
    return request.delete<ApiResponse<void>>(`/user/pickup/orders/${id}`)
  },

  // 完成提货单
  completeOrder(id: number) {
    return request.post<ApiResponse<void>>(`/user/pickup/orders/${id}/complete`)
  },

  // 获取会员可提商品
  getMemberProducts(memberId: number) {
    return request.get<ApiResponse<PickupProduct[]>>(`/user/pickup/member/${memberId}/products`)
  },

  // 读取会员卡信息
  readMemberCard() {
    return request.get<ApiResponse<{
      memberId: number
      memberName: string
      memberPhone: string
      products: PickupProduct[]
    }>>('/user/pickup/read-card')
  },

  // 获取提货单统计数据
  getStatistics() {
    return request.get<ApiResponse<PickupStatistics>>('/user/pickup/statistics')
  },

  // 获取可提货时间段
  getTimeSlots(date: string) {
    return request.get<ApiResponse<PickupTimeSlot[]>>('/user/pickup/time-slots', {
      params: { date }
    })
  },

  // 获取可提货商品列表
  getAvailableProducts() {
    return request.get<ApiResponse<PickupProduct[]>>('/user/pickup/available-products')
  },

  // 获取商品可提货数量
  getProductAvailableQuantity(productId: number) {
    return request.get<ApiResponse<{ quantity: number }>>(`/user/pickup/products/${productId}/available-quantity`)
  },

  // 获取可提货门店列表
  getAvailableStores(productIds: number[]) {
    return request.get<ApiResponse<{
      id: number
      name: string
      address: string
      distance?: number
    }[]>>('/user/pickup/available-stores', {
      params: { productIds: productIds.join(',') }
    })
  },

  // 确认提货
  confirmPickup(id: number, code: string) {
    return request.post<ApiResponse<void>>(`/user/pickup/orders/${id}/confirm`, { code })
  },

  // 获取提货验证码
  getPickupCode(id: number) {
    return request.get<ApiResponse<{ code: string }>>(`/user/pickup/orders/${id}/code`)
  },

  // 评价提货服务
  rateService(id: number, data: {
    rating: number
    comment?: string
    images?: string[]
  }) {
    return request.post<ApiResponse<void>>(`/user/pickup/orders/${id}/rate`, data)
  }
} 