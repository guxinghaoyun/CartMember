import { request } from '../config'
import type {
  OverviewStatistics,
  SalesStatistics,
  MemberStatistics,
  InventoryStatistics,
  StoreStatistics,
  StatisticsQueryParams
} from '@/types/api/admin/statistics'
import type { ApiResponse } from '@/types/api/common'
import type { RequestConfig } from '../types'

export const statisticsApi = {
  // 获取概览统计数据
  getOverview(params: StatisticsQueryParams) {
    return request.get<ApiResponse<OverviewStatistics>>('/admin/statistics/overview', { params })
  },

  // 销售统计
  getSalesStatistics(params: StatisticsQueryParams) {
    return request.get<ApiResponse<SalesStatistics>>('/admin/statistics/sales', { params })
  },

  // 获取销售趋势数据（管理员版本，包含所有店铺数据）
  getSalesTrend() {
    return request.get('/dashboard/sales-trend')
  },

  // 获取商品分类销售数据（管理员版本，包含所有店铺数据）
  getProductClassification() {
    return request.get('/dashboard/product-classification')
  },

  // 会员统计
  getMemberStatistics(params: StatisticsQueryParams) {
    return request.get<ApiResponse<MemberStatistics>>('/admin/statistics/members', { params })
  },

  // 库存统计
  getInventoryStatistics(params: StatisticsQueryParams) {
    return request.get<ApiResponse<InventoryStatistics>>('/admin/statistics/inventory', { params })
  },

  // 店铺统计
  getStoreStatistics(params: StatisticsQueryParams) {
    return request.get<ApiResponse<StoreStatistics>>('/admin/statistics/stores', { params })
  },

  // 导出统计报表
  exportSalesReport(params: StatisticsQueryParams) {
    const config: RequestConfig = {
      params,
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get<Blob>('/admin/statistics/sales/export', config)
  },

  exportMemberReport(params: StatisticsQueryParams) {
    const config: RequestConfig = {
      params,
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get<Blob>('/admin/statistics/members/export', config)
  },

  exportInventoryReport(params: StatisticsQueryParams) {
    const config: RequestConfig = {
      params,
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get<Blob>('/admin/statistics/inventory/export', config)
  },

  exportStoreReport(params: StatisticsQueryParams) {
    const config: RequestConfig = {
      params,
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get<Blob>('/admin/statistics/stores/export', config)
  }
}
