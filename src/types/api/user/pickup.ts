// 提货单状态
export type PickupStatus = 'pending' | 'delivering' | 'completed' | 'cancelled'

// 提货方式
export type PickupMethod = 'store' | 'delivery'

// 基础商品信息
export interface BaseProduct {
  id: number
  name: string
  sku: string
  image: string
}

// 会员可提商品
export interface MemberPickupProduct extends BaseProduct {
  availableQuantity: number
}

// 提货单商品
export interface PickupOrderItem extends BaseProduct {
  quantity: number
  maxQuantity: number
  originalQuantity: number
}

// 可提货商品
export interface PickupProduct extends BaseProduct {
  availableQuantity: number
  unit: string
  expireDate?: string
  price?: number
  description?: string
  category?: string
  tags?: string[]
  status?: 'available' | 'unavailable'
  createdAt?: string
  updatedAt?: string
}

// 提货单信息
export interface PickupOrder {
  id: number
  orderNo: string
  memberName: string
  memberPhone: string
  status: PickupStatus
  deliveryType: PickupMethod
  pickupTime: string
  deliveryAddress?: string
  operator: string
  notes?: string
  items: PickupOrderItem[]
  createTime: string
  updateTime: string
}

// 创建提货单请求
export interface CreatePickupOrderRequest {
  memberName: string
  memberPhone: string
  deliveryType: PickupMethod
  deliveryAddress?: string
  pickupTime: string
  operator: string
  items: {
    id: number
    quantity: number
  }[]
  notes?: string
}

// 更新提货单请求
export interface UpdatePickupOrderRequest {
  deliveryType?: PickupMethod
  deliveryAddress?: string
  pickupTime?: string
  operator?: string
  items?: {
    id: number
    quantity: number
  }[]
  notes?: string
}

// 提货单查询参数
export interface PickupOrderQueryParams {
  keyword?: string
  status?: PickupStatus
  deliveryType?: PickupMethod
  operator?: string
  dateRange?: [string, string]
}

// 提货时间段
export interface PickupTimeSlot {
  id: number
  date: string
  timeRange: string
  available: boolean
  remainingSlots: number
}

// 统计数据
export interface PickupStatistics {
  pending: number
  delivering: number
  completed: number
  total: number
  todayPending: number
  todayCompleted: number
  todayDelivering: number
  todayTotal: number
} 