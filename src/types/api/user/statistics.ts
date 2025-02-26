// 用户概览统计
export interface UserOverview {
  totalPoints: number
  totalBalance: number
  totalOrders: number
  totalSpent: number
  availableCoupons: number
  unfinishedOrders: number
}

// 消费统计
export interface ConsumptionStatistics {
  // 消费趋势
  trend: {
    dates: string[]
    amounts: number[]
    orders: number[]
  }
  // 消费类型分布
  categories: {
    category: string
    amount: number
    percentage: number
  }[]
  // 支付方式分布
  paymentMethods: {
    method: string
    amount: number
    percentage: number
  }[]
  // 常购商品
  frequentProducts: {
    id: number
    name: string
    count: number
    amount: number
    lastPurchaseTime: string
  }[]
}

// 积分统计
export interface PointsStatistics {
  // 积分趋势
  trend: {
    dates: string[]
    earned: number[]
    spent: number[]
    balance: number[]
  }
  // 积分来源分布
  sources: {
    source: string
    points: number
    percentage: number
  }[]
  // 积分使用分布
  usages: {
    usage: string
    points: number
    percentage: number
  }[]
  // 即将过期积分
  expiringPoints: {
    points: number
    expireDate: string
  }[]
}

// 会员等级进度
export interface MemberLevelProgress {
  currentLevel: string
  nextLevel: string
  currentPoints: number
  requiredPoints: number
  percentage: number
  benefits: {
    type: string
    current: string
    next: string
  }[]
}

// 统计查询参数
export interface UserStatisticsQueryParams {
  startDate: string
  endDate: string
  timeUnit?: 'day' | 'week' | 'month'
} 