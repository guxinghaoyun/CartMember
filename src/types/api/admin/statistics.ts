// 基础统计数据
export interface OverviewStatistics {
  totalSales: number
  totalOrders: number
  totalMembers: number
  totalProducts: number
  activeStores: number
  totalPoints: number
}

// 销售统计数据
export interface SalesStatistics {
  // 销售趋势
  trend: {
    dates: string[]
    sales: number[]
    orders: number[]
  }
  // 支付方式分布
  paymentMethods: {
    method: string
    amount: number
    percentage: number
  }[]
  // 商品分类销售
  categories: {
    category: string
    sales: number
    percentage: number
  }[]
  // 热销商品
  topProducts: {
    id: number
    name: string
    sales: number
    amount: number
  }[]
}

// 会员统计数据
export interface MemberStatistics {
  // 会员增长趋势
  trend: {
    dates: string[]
    newMembers: number[]
    totalMembers: number[]
  }
  // 会员等级分布
  levelDistribution: {
    level: string
    count: number
    percentage: number
  }[]
  // 会员消费排行
  topMembers: {
    id: number
    name: string
    consumption: number
    orders: number
  }[]
  // 会员活跃度分析
  activityAnalysis: {
    active: number // 活跃会员数
    inactive: number // 不活跃会员数
    risk: number // 流失风险会员数
    lost: number // 已流失会员数
  }
}

// 库存统计数据
export interface InventoryStatistics {
  // 库存总览
  overview: {
    totalProducts: number
    totalValue: number
    lowStock: number
    outOfStock: number
  }
  // 库存预警
  warnings: {
    storeId: number
    storeName: string
    productId: number
    productName: string
    currentStock: number
    warningThreshold: number
  }[]
  // 库存周转率
  turnover: {
    dates: string[]
    rates: number[]
  }
  // 滞销商品
  slowMoving: {
    productId: number
    productName: string
    stock: number
    lastSaleDate: string
    daysNoSale: number
  }[]
}

// 店铺统计数据
export interface StoreStatistics {
  // 店铺销售排行
  salesRanking: {
    storeId: number
    storeName: string
    sales: number
    orders: number
    ranking: number
  }[]
  // 店铺会员分布
  memberDistribution: {
    storeId: number
    storeName: string
    totalMembers: number
    newMembers: number
    percentage: number
  }[]
  // 店铺员工业绩
  staffPerformance: {
    storeId: number
    storeName: string
    staffId: number
    staffName: string
    sales: number
    orders: number
  }[]
}

// 统计查询参数
export interface StatisticsQueryParams {
  startDate: string
  endDate: string
  storeId?: number
  timeUnit?: 'day' | 'week' | 'month'
  includeSubordinates?: boolean // 是否包含下级店铺数据
} 