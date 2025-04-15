// 会员基础信息
export interface Member {
  id: number
  name: string
  phone: string
  surfaceNumber: string // 表面卡号
  internalNumber: string // 内部卡号
  points: number // 当前积分
  totalPoints: number // 累计积分
  registerDate: string
  icStatus: boolean
  frontPicture?: string
  backPicture?: string
  notes?: string
  remainingProducts?: {
    id: number
    name: string
    quantity: number
  }[]
  lastActive?: string
  registerStore?: string
  orderCount?: number
  orders?: {
    id: string
    points: number
    usedPoints: number
    date: string
    store: string
  }[]
  products?: {
    id: number
    name: string
    quantity: number
    points: number
    image: string
  }[]
  pickupRecords?: {
    productId: number
    quantity: number
    date: string
    store: string
  }[]
}

// 创建会员请求
export type CreateMemberRequest = Omit<Member, 'id' | 'registerDate' | 'totalPoints'>

// 更新会员请求
export type UpdateMemberRequest = Partial<CreateMemberRequest>

// 会员查询参数
export interface MemberQueryParams {
  shopId: number
  searchQuery?: string // 搜索关键字，可用于搜索姓名、手机号或卡号
  name?: string
  phone?: string
  surfaceNumber?: string
  internalNumber?: string
  status?: '正常' | '停用'
  dateRange?: [string, string]
}

// 积分调整请求
export interface AdjustPointsRequest {
  type: 'add' | 'subtract'
  points: number
  reason: string
}

// 添加商品请求
export interface AddProductsRequest {
  products: {
    id: number
    quantity: number
  }[]
}

// 商品操作响应
export interface ProductOperationResponse {
  success: boolean
  message: string
}
