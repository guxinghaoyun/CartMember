import type { Member } from './member'


// 充值订单状态
export type RechargeOrderStatus = 'pending' | 'success' | 'failed' | 'cancelled'

// 充值商品
export interface RechargeProduct {
  id: number
  name: string
  price: number // 商品积分
  quantity: number
  category: string
  status: string
  stock: number
  image?: string
}

// 充值订单
export interface RechargeOrder {
  id: number
  orderNo: string
  memberId: number
  memberName: string
  memberPhone: string
  icCard: string
  currentPoints: number
  amount: number // 充值积分
  gift: number // 赠送积分
  points: number // 总积分
  status: RechargeOrderStatus
  operator: string
  operatorId: number
  createTime: string
  updateTime: string
  notes?: string
  products: RechargeProduct[]
}

// 操作员信息
export interface Operator {
  id: number
  name: string
  role: string
}

// 创建充值订单请求
export interface CreateRechargeOrderRequest {
  memberId: number
  amount: number // 充值积分
  gift?: number // 赠送积分
  notes?: string
  products?: {
    id: number
    quantity: number
  }[]
}

// 充值记录查询参数
export interface RechargeRecordQueryParams {
  page: number
  pageSize: number
  keyword?: string
  orderNo?: string
  memberId?: number
  memberName?: string
  memberPhone?: string
  status?: RechargeOrderStatus
  operatorId?: number
  minAmount?: number
  maxAmount?: number
  startDate?: string
  endDate?: string
}

// 充值记录响应
export interface RechargeRecordResponse {
  data: RechargeOrder[]
  total: number
}

// 充值统计
export interface RechargeStats {
  totalAmount: number
  totalOrders: number
  totalMembers: number
  averageAmount: number
  successRate: number
  periodStart: string
  periodEnd: string
}
