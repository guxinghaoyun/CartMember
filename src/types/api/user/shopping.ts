// 商品信息
export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  description?: string
  unit: string
  stock: number
  sales: number
  rating: number
  status: '在售' | '下架' | '缺货'
  tags?: string[]
}

// 购物车商品
export interface CartItem {
  id: number
  productId: number
  name: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  unit: string
  selected: boolean
  stock: number
  invalid?: boolean
  invalidReason?: string
}

// 配送地址
export interface DeliveryAddress {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
}

// 订单商品
export interface OrderProduct {
  id: number
  name: string
  image: string
  price: number
  quantity: number
  unit: string
}

// 支付方式类型
export type PaymentMethodType = '微信支付' | '支付宝' | '余额支付'

// 配送方式类型
export type DeliveryMethodType = '快递配送' | '门店自提'

// 订单状态类型
export type OrderStatusType = '待支付' | '待发货' | '待收货' | '已完成' | '已取消' | '已退款'

// 订单信息
export interface Order {
  id: number
  orderNo: string
  status: OrderStatusType
  totalAmount: number
  actualAmount: number
  discountAmount: number
  paymentMethod?: PaymentMethodType
  paymentTime?: string
  deliveryMethod: DeliveryMethodType
  deliveryFee: number
  address?: DeliveryAddress
  storeId?: number
  storeName?: string
  products: OrderProduct[]
  couponId?: number
  couponAmount?: number
  notes?: string
  createTime: string
  updateTime: string
}

// 创建订单请求商品
export interface CreateOrderProductRequest {
  productId: number
  stockQuantity: number
}

// 创建订单请求
export interface CreateOrderRequest {
  products: CreateOrderProductRequest[]
  deliveryMethod: DeliveryMethodType
  address?: DeliveryAddress
  storeId?: number
  couponId?: number
  notes?: string
}

// 商品查询参数
export interface ProductQueryParams {
  category?: string
  keyword?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'price' | 'sales' | 'rating'
  order?: 'asc' | 'desc'
  tags?: string[]
}

// 订单查询参数
export interface OrderQueryParams {
  orderNo?: string
  status?: Order['status']
  dateRange?: [string, string]
  minAmount?: number
  maxAmount?: number
}
