import { request } from '../config'
import type {
  Product,
  CartItem,
  Order,
  CreateOrderRequest,
  ProductReview,
  ProductQueryParams,
  OrderQueryParams
} from '@/types/api/user/shopping'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'

export const shoppingApi = {
  // 商品相关
  getProducts(params: PaginationParams & ProductQueryParams) {
    return request.get<ApiResponse<PaginationResponse<Product>>>('/user/shopping/products', { params })
  },

  getProductDetail(id: number) {
    return request.get<ApiResponse<Product>>(`/user/shopping/products/${id}`)
  },

  getProductReviews(productId: number, params: PaginationParams) {
    return request.get<ApiResponse<PaginationResponse<ProductReview>>>(`/user/shopping/products/${productId}/reviews`, { params })
  },

  // 购物车相关
  getCartItems() {
    return request.get<ApiResponse<CartItem[]>>('/user/shopping/cart')
  },

  addToCart(productId: number, quantity: number) {
    return request.post<ApiResponse<CartItem>>('/user/shopping/cart', { productId, quantity })
  },

  updateCartItem(id: number, quantity: number) {
    return request.put<ApiResponse<CartItem>>(`/user/shopping/cart/${id}`, { quantity })
  },

  removeFromCart(ids: number[]) {
    return request.delete<ApiResponse<void>>('/user/shopping/cart', { data: { ids } })
  },

  selectCartItems(ids: number[], selected: boolean) {
    return request.put<ApiResponse<void>>('/user/shopping/cart/select', { ids, selected })
  },

  clearInvalidItems() {
    return request.delete<ApiResponse<void>>('/user/shopping/cart/invalid')
  },

  // 订单相关
  getOrders(params: PaginationParams & OrderQueryParams) {
    return request.get<ApiResponse<PaginationResponse<Order>>>('/user/shopping/orders', { params })
  },

  getOrderDetail(id: number) {
    return request.get<ApiResponse<Order>>(`/user/shopping/orders/${id}`)
  },

  createOrder(data: CreateOrderRequest) {
    return request.post<ApiResponse<Order>>('/user/shopping/orders', data)
  },

  cancelOrder(id: number, reason: string) {
    return request.post<ApiResponse<void>>(`/user/shopping/orders/${id}/cancel`, { reason })
  },

  // 支付订单
  payOrder(id: number, method: Order['paymentMethod']) {
    return request.post<ApiResponse<{
      paymentUrl?: string
      qrCode?: string
    }>>(`/user/shopping/orders/${id}/pay`, { method })
  },

  // 确认收货
  confirmReceipt(id: number) {
    return request.post<ApiResponse<void>>(`/user/shopping/orders/${id}/confirm`)
  },

  // 申请退款
  requestRefund(id: number, data: {
    reason: string
    description?: string
    images?: string[]
  }) {
    return request.post<ApiResponse<void>>(`/user/shopping/orders/${id}/refund`, data)
  },

  // 评价商品
  reviewProduct(orderId: number, productId: number, data: {
    rating: number
    content: string
    images?: string[]
    anonymous: boolean
  }) {
    return request.post<ApiResponse<ProductReview>>(`/user/shopping/orders/${orderId}/products/${productId}/review`, data)
  },

  // 删除订单
  deleteOrder(id: number) {
    return request.delete<ApiResponse<void>>(`/user/shopping/orders/${id}`)
  }
} 