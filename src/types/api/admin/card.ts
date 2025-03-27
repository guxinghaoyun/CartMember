// 卡片状态类型
export type CardStatus = '正常' | '停用' | '未激活'

// 后端返回的IC卡状态映射
export const cardStatusMap = {
  未激活: '未激活' as CardStatus,
  NORMAL: '正常' as CardStatus,
  DISABLED: '停用' as CardStatus
}

// 卡片基础信息
export interface Card {
  id: number
  surfaceNumber?: string // 前端使用的卡面号码
  internalNumber: string // 内部号码
  cardNumber: string // 后端返回的卡号
  store?: string // 所属店铺
  memberName?: string // 会员姓名
  memberPhone?: string // 会员手机号
  initTime?: string // 初始化时间
  createTime?: string // 后端返回的创建时间
  updateTime?: string // 后端返回的更新时间
  status: CardStatus | string // 卡片状态，可能是后端状态或前端状态
}

// 卡片表单数据
export interface CardForm {
  surfaceNumber: string
  internalNumber: string
}

// 创建卡片请求
export type CreateCardRequest = CardForm

// 更新卡片请求
export interface UpdateCardRequest {
  status?: string
  store?: string
  memberName?: string
  memberPhone?: string
}

// 卡片查询参数
export interface CardQueryParams {
  keyword?: string // 搜索关键字（卡号/会员姓名/手机号）
  status?: CardStatus
  store?: string
  page?: number
  pageSize?: number
}

// 卡片响应数据
export interface CardResponse {
  currentPage: number
  pageSize: number
  totalRecords: number
  totalPages: number
  records: Card[]
}

// 卡片统计数据
export interface CardStats {
  totalCards: number
  newCardsThisMonth: number
  activeRate: number
}

// 卡片操作记录
export interface CardOperation {
  id: number
  cardId: number
  surfaceNumber: string
  operationType: '初始化' | '激活' | '停用' | '启用'
  operatorId: number
  operatorName: string
  createTime: string
  notes?: string
}
