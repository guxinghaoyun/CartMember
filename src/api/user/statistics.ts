import { request } from '../config'
import type {
  UserOverview,
  ConsumptionStatistics,
  PointsStatistics,
  MemberLevelProgress,
  UserStatisticsQueryParams
} from '@/types/api/user/statistics'
import type { ApiResponse } from '@/types/api/common'
import type { RequestConfig } from '../types'

export const userStatisticsApi = {
  // 获取用户概览统计
  getOverview() {
    return request.get<ApiResponse<UserOverview>>('/user/statistics/overview')
  },

  // 获取消费统计
  getConsumptionStatistics(params: UserStatisticsQueryParams) {
    return request.get<ApiResponse<ConsumptionStatistics>>('/user/statistics/consumption', { params })
  },

  // 获取积分统计
  getPointsStatistics(params: UserStatisticsQueryParams) {
    return request.get<ApiResponse<PointsStatistics>>('/user/statistics/points', { params })
  },

  // 获取会员等级进度
  getMemberLevelProgress() {
    return request.get<ApiResponse<MemberLevelProgress>>('/user/statistics/level-progress')
  },

  // 导出消费记录
  exportConsumptionRecords(params: UserStatisticsQueryParams) {
    const config: RequestConfig = {
      params,
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get<Blob>('/user/statistics/consumption/export', config)
  },

  // 导出积分记录
  exportPointsRecords(params: UserStatisticsQueryParams) {
    const config: RequestConfig = {
      params,
      responseType: 'blob',
      skipErrorHandler: true
    }
    return request.get<Blob>('/user/statistics/points/export', config)
  },

  // 获取消费建议
  getConsumptionSuggestions() {
    return request.get<ApiResponse<{
      suggestions: string[]
      recommendedProducts: {
        id: number
        name: string
        reason: string
      }[]
    }>>('/user/statistics/consumption/suggestions')
  },

  // 获取积分优化建议
  getPointsOptimizationTips() {
    return request.get<ApiResponse<{
      tips: string[]
      upcomingActivities: {
        id: number
        name: string
        points: number
        startTime: string
      }[]
    }>>('/user/statistics/points/optimization-tips')
  }
} 