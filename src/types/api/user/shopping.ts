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

// 订单信息
export interface Order {
  id: number
  orderNo: string
  status: '待支付' | '待发货' | '待收货' | '已完成' | '已取消' | '已退款'
  totalAmount: number
  actualAmount: number
  discountAmount: number
  paymentMethod?: '微信支付' | '支付宝' | '余额支付'
  paymentTime?: string
  deliveryMethod: '快递配送' | '门店自提'
  deliveryFee: number
  address?: {
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
  }
  storeId?: number
  storeName?: string
  products: {
    id: number
    name: string
    image: string
    price: number
    quantity: number
    unit: string
  }[]
  couponId?: number
  couponAmount?: number
  notes?: string
  createTime: string
  updateTime: string
}

// 创建订单请求
export interface CreateOrderRequest {
  products: {
    productId: number
    quantity: number
  }[]
  deliveryMethod: Order['deliveryMethod']
  address?: {
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
  }
  storeId?: number
  couponId?: number
  notes?: string
}

// 商品评价
export interface ProductReview {
  id: number
  orderId: number
  productId: number
  productName: string
  rating: number
  content: string
  images?: string[]
  anonymous: boolean
  reply?: string
  createTime: string
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