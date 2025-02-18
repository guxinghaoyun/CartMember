// 会员相关类型
export interface Member {
  id: number
  name: string
  phone: string
  icCard: string
  registerDate: string
  points: string
  notes?: string
}

// 商品相关类型
export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
}

// 购物车商品类型
export interface CartItem extends Product {
  quantity: number
}

// 充值记录类型
export interface RechargeRecord {
  id: number
  memberName: string
  memberPhone: string
  icCard: string
  currentPoints: string
  amount: number
  money: string
  paymentMethod: 'wechat' | 'alipay' | 'cash'
  status: 'success' | 'pending' | 'failed'
  operator: string
  createTime: string
  notes?: string
}

// 提货单类型
export interface PickupOrder {
  id: number
  orderNo: string
  memberName: string
  memberPhone: string
  isUrgent: boolean
  products: {
    id: number
    name: string
    quantity: number
    image: string
  }[]
  totalQuantity: number
  createTime: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  method: '门店自提' | '快递配送'
  operator: string
  notes?: string
}

// 统计数据类型
export interface SalesData {
  xAxis: string[]
  sales: number[]
  orders: number[]
}

export interface CategoryData {
  name: string
  value: number
  color: string
}

// 操作员类型
export interface Operator {
  id: number
  name: string
  role: string
}

// 支付方式类型
export interface PaymentMethod {
  value: string
  label: string
  icon: string
}

// 商品分类类型
export interface Category {
  id: string
  name: string
}

// 通用响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页请求参数类型
export interface PaginationParams {
  page: number
  pageSize: number
  searchQuery?: string
  status?: string
  dateRange?: [Date, Date]
}

// 分页响应类型
export interface PaginationResponse<T> {
  total: number
  items: T[]
}

// 表格列配置类型
export interface TableColumn {
  key: string
  label: string
  class?: string
}

// 统计卡片类型
export interface StatCardProps {
  icon: string
  title: string
  value: string | number
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
  trend?: 'up' | 'down' | 'none'
  subValue?: string
  subLabel?: string
}

// 日期快捷选项类型
export interface DateShortcut {
  text: string
  value: () => [Date, Date]
}

// 表单验证规则类型
export interface FormRules {
  [key: string]: {
    required?: boolean
    message?: string
    trigger?: string | string[]
    min?: number
    max?: number
    pattern?: RegExp
  }[]
} 