import { request } from '../config'
import type {
  Store,
  StoreStaff,
  StoreInventory,
  CreateStoreRequest,
  UpdateStoreRequest,
  CreateStaffRequest,
  UpdateStaffRequest,
  StoreQueryParams,
  StoreStaffQueryParams,
  StoreInventoryQueryParams
} from '@/types/api/admin/store'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'

export const storeApi = {
  // 店铺基础信息管理
  getList(params: PaginationParams & StoreQueryParams) {
    return request.get<ApiResponse<PaginationResponse<Store>>>('/admin/stores', { params })
  },

  getDetail(id: number) {
    return request.get<ApiResponse<Store>>(`/admin/stores/${id}`)
  },

  create(data: CreateStoreRequest) {
    return request.post<ApiResponse<Store>>('/admin/stores', data)
  },

  update(id: number, data: UpdateStoreRequest) {
    return request.put<ApiResponse<Store>>(`/admin/stores/${id}`, data)
  },

  delete(id: number) {
    return request.delete<ApiResponse<void>>(`/admin/stores/${id}`)
  },

  updateStatus(id: number, status: Store['status']) {
    return request.patch<ApiResponse<void>>(`/admin/stores/${id}/status`, { status })
  },

  // 店铺员工管理
  getStaffList(params: PaginationParams & StoreStaffQueryParams) {
    return request.get<ApiResponse<PaginationResponse<StoreStaff>>>('/admin/store-staff', { params })
  },

  getStaffDetail(id: number) {
    return request.get<ApiResponse<StoreStaff>>(`/admin/store-staff/${id}`)
  },

  createStaff(data: CreateStaffRequest) {
    return request.post<ApiResponse<StoreStaff>>('/admin/store-staff', data)
  },

  updateStaff(id: number, data: UpdateStaffRequest) {
    return request.put<ApiResponse<StoreStaff>>(`/admin/store-staff/${id}`, data)
  },

  deleteStaff(id: number) {
    return request.delete<ApiResponse<void>>(`/admin/store-staff/${id}`)
  },

  // 员工离职
  staffLeave(id: number, leaveTime: string, reason: string) {
    return request.post<ApiResponse<void>>(`/admin/store-staff/${id}/leave`, { leaveTime, reason })
  },

  // 店铺库存管理
  getInventoryList(params: PaginationParams & StoreInventoryQueryParams) {
    return request.get<ApiResponse<PaginationResponse<StoreInventory>>>('/admin/store-inventory', { params })
  },

  getInventoryDetail(storeId: number, productId: number) {
    return request.get<ApiResponse<StoreInventory>>(`/admin/store-inventory/${storeId}/${productId}`)
  },

  // 调整库存
  adjustInventory(storeId: number, productId: number, adjustment: number, reason: string) {
    return request.post<ApiResponse<StoreInventory>>(`/admin/store-inventory/${storeId}/${productId}/adjust`, {
      adjustment,
      reason
    })
  },

  // 设置库存预警阈值
  setWarningThreshold(storeId: number, productId: number, threshold: number) {
    return request.post<ApiResponse<void>>(`/admin/store-inventory/${storeId}/${productId}/warning-threshold`, {
      threshold
    })
  },

  // 库存盘点
  checkInventory(storeId: number, productId: number, actualQuantity: number, notes?: string) {
    return request.post<ApiResponse<StoreInventory>>(`/admin/store-inventory/${storeId}/${productId}/check`, {
      actualQuantity,
      notes
    })
  }
} 