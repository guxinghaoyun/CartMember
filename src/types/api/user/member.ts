// 会员基础信息
export interface Member {
  id: number
  name: string
  phone: string
  icNumber: string
  registerDate: string
  icStatus: string
  frontPicture?: string
  backPicture?: string
  note?: string
  remainingPoints: number
  shopId?: number
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
  icNumber: string
  icStatus: string
  shopId?: number
  frontPicture?: string
  backPicture?: string
  note?: string
}

// 更新会员请求
export interface UpdateMemberRequest {
  name?: string
  phone?: string
  icStatus?: string
  frontPicture?: string
  backPicture?: string
  note?: string
  shopId?: number
}

// 会员查询参数
export interface MemberQueryParams {
  keyword?: string
  icStatus?: string
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
  icStatus: string
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
