// 会员基础信息
export interface Member {
  id: number
  name: string
  phone: string
  icCard: string
  registerDate: string
  status: '正常' | '停用'
  cardImages?: {
    front?: string
    back?: string
  }
  notes?: string
  remainingPoints: number
  remainingProducts?: {
    id: number
    name: string
    quantity: number
  }[]
}

// 新增会员请求
export interface CreateMemberRequest {
  name: string
  phone: string
  icCard: string
  status: '正常' | '停用'
  cardImages?: {
    front?: string
    back?: string
  }
  notes?: string
}

// 更新会员请求
export interface UpdateMemberRequest {
  name?: string
  phone?: string
  status?: '正常' | '停用'
  cardImages?: {
    front?: string
    back?: string
  }
  notes?: string
}

// 会员查询参数
export interface MemberQueryParams {
  keyword?: string
  status?: '正常' | '停用'
  startDate?: string
  endDate?: string
}

// 会员卡信息
export interface MemberCard {
  id: number
  cardNumber: string
  type: '会员卡' | '储值卡' | '礼品卡'
  balance: number
  points: number
  status: '正常' | '已禁用' | '已过期'
  activateDate: string
  expireDate: string
}

// 积分记录
export interface PointRecord {
  id: number
  type: '获得' | '使用' | '过期' | '调整'
  points: number
  balance: number
  source: string
  description: string
  createTime: string
  expireTime?: string
}

// 余额记录
export interface BalanceRecord {
  id: number
  type: '充值' | '消费' | '退款' | '调整'
  amount: number
  balance: number
  paymentMethod?: string
  orderNo?: string
  description: string
  createTime: string
}

// 修改个人信息请求
export interface UpdateProfileRequest {
  name?: string
  phone?: string
  avatar?: string
}

// 修改密码请求
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// 会员记录查询参数
export interface MemberRecordQueryParams {
  type?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
} 