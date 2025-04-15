import { request } from '../config'
import type {
  Card,
  CardOperation,
  CreateCardRequest,
  CardQueryParams,
  CardResponse
} from '@/types/api/admin/card'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'
import type { AxiosRequestConfig } from 'axios'

// 扩展 AxiosRequestConfig 类型
interface CustomRequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean
}

export const cardApi = {
  // 获取卡片列表
  getList(params: PaginationParams & CardQueryParams) {
    // 修改为调用后端的IC卡管理API
    return request.get<PaginationResponse<Card>>('/ic-cards', {
      params: {
        pageNumber: params.page, // 后端页码从0开始
        pageSize: params.pageSize,
        keyword: params.keyword || undefined
      }
    })
  },

  // 获取卡片详情
  getDetail(id: number) {
    return request.get<Card>(`/ic-cards/${id}`)
  },

  // 创建卡片（初始化）
  createCard(data: CreateCardRequest) {
    return request.post<Card>('/ic-cards', {
      internalNumber: data.internalNumber,
      cardNumber: data.surfaceNumber,
      status: 'NORMAL'
    })
  },

  // 激活卡片
  activate(id: number, memberId: number) {
    // 从列表中获取卡片
    return this.getList({ page: 1, pageSize: 100 }).then(response => {
      // 将整个response对象断言为包含records的类型
      const responseData = response as unknown as {
        records: Card[]
        totalRecords: number
        currentPage: number
        pageSize: number
        totalPages: number
      }

      const cards = responseData.records || []
      const card = cards.find((c: Card) => c.id === id)

      if (!card) {
        throw new Error('卡片不存在')
      }

      // 使用URL参数传递，状态使用中文"正常"
      return request.put<void>(`/ic-cards/${id}`, null, {
        params: {
          id: id,
          internalNumber: card.internalNumber,
          cardNumber: card.cardNumber,
          status: '正常',
          createTime: card.createTime,
          updateTime: card.updateTime
        }
      })
    })
  },

  // 禁用卡片
  disable(id: number, reason: string) {
    // 从列表中获取卡片
    return this.getList({ page: 1, pageSize: 100 }).then(response => {
      // 将整个response对象断言为包含records的类型
      const responseData = response as unknown as {
        records: Card[]
        totalRecords: number
        currentPage: number
        pageSize: number
        totalPages: number
      }

      const cards = responseData.records || []
      const card = cards.find((c: Card) => c.id === id)

      if (!card) {
        throw new Error('卡片不存在')
      }

      // 使用URL参数传递，状态使用中文"停用"
      return request.put<void>(`/ic-cards/${id}`, null, {
        params: {
          id: id,
          internalNumber: card.internalNumber,
          cardNumber: card.cardNumber,
          status: '停用',
          createTime: card.createTime,
          updateTime: card.updateTime,
          notes: reason // 添加停用原因
        }
      })
    })
  },

  // 获取卡片操作记录
  getOperations(cardId: number, params: PaginationParams) {
    // 这个API可能不存在，暂时保留但不调用
    console.warn('API getOperations may not be available in the backend')
    return Promise.resolve({ data: { total: 0, items: [] } })
  },

  // 导出卡片列表
  exportCards(params: CardQueryParams) {
    // 这个API可能不存在，暂时保留但不调用
    console.warn('API exportCards may not be available in the backend')
    const config: CustomRequestConfig = {
      params,
      responseType: 'blob',
      skipErrorHandler: true
    }
    return Promise.resolve(new Blob())
  }
}
