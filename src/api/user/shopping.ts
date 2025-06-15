import { request } from '../config'
import type {
  Product,
  CartItem,
  Order,
  CreateOrderRequest,
  ProductQueryParams,
  OrderQueryParams
} from '@/types/api/user/shopping'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'
import { storeInfoUtils } from '@/utils/storeInfo'

// 后端API返回的商品格式
interface BackendProduct {
  id: number
  name: string
  shopIds: string
  productTypeId: number
  productImage: null | string
  price: number
  stockQuantity: number
  description: string
  productImageUuid: string
}

// 将后端商品转换为前端商品格式
const mapProductFromBackend = (product: BackendProduct): Product => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.price, // 假设原价与当前价格相同
    category: getCategoryFromTypeId(product.productTypeId),
    image: product.productImageUuid, // 使用UUID，前端组件会处理实际的图片URL
    description: product.description,
    unit: '件', // 假设默认单位
    stock: product.stockQuantity,
    sales: 0, // 后端未提供该数据，默认为0
    rating: 5, // 后端未提供该数据，默认为5
    status: product.stockQuantity > 0 ? '在售' : '缺货',
    tags: []
  }
}

// 根据商品类型ID获取分类名称
const getCategoryFromTypeId = (typeId: number): string => {
  const categories: Record<number, string> = {
    1: 'digital', // 数码产品
    2: 'office', // 办公用品
    3: 'life', // 生活用品
    4: 'gift' // 礼品卡券
  }
  return categories[typeId] || ''
}

// 获取当前登录用户的shopId - 使用工具方法
const getCurrentUserShopId = (): number => {
  return storeInfoUtils.getShopId()
}

// 购买商品请求参数接口
export interface PurchaseProductItem {
  productId: number
  stockQuantity: number
  price: number
  currentQuantity: number
}

export interface PurchaseProductsRequest {
  membershipId: number
  note: string
  discount: number
  operationUser: string
  products: PurchaseProductItem[]
}

export const shoppingApi = {
  // 商品相关
  getProducts(params: PaginationParams & ProductQueryParams) {
    // 转换参数格式以匹配后端API
    const backendParams = {
      shopId: getCurrentUserShopId(), // 使用当前登录用户的shopId
      productTypeId: params.category ? getCategoryIdFromName(params.category) : -1 // -1表示所有类型
    }

    console.log('发送请求参数:', backendParams)

    // 注意: 这里我们不指定泛型类型，因为axios响应拦截器会直接返回response.data
    return request
      .get('/products', {
        params: backendParams
      })
      .then((backendData: any) => {
        console.log('获取商品响应数据:', backendData)

        // 确保响应数据包含必要的属性
        if (!backendData || !backendData.records) {
          console.error('API返回数据格式不符:', backendData)
          return {
            data: {
              records: [],
              totalRecords: 0,
              currentPage: 1,
              pageSize: 10,
              totalPages: 0
            }
          }
        }

        // 创建转换后的产品数据
        const products = backendData.records.map(mapProductFromBackend)

        // 返回符合前端组件期望的数据结构
        return {
          data: {
            records: products,
            totalRecords: backendData.totalRecords || 0,
            currentPage: backendData.currentPage || 1,
            pageSize: backendData.pageSize || 10,
            totalPages: backendData.totalPages || 1
          }
        }
      })
  },

  getProductDetail(id: number) {
    return request.get<ApiResponse<Product>>(`/user/shopping/products/${id}`)
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
    return request.post<
      ApiResponse<{
        paymentUrl?: string
        qrCode?: string
      }>
    >(`/user/shopping/orders/${id}/pay`, { method })
  },

  // 确认收货
  confirmReceipt(id: number) {
    return request.post<ApiResponse<void>>(`/user/shopping/orders/${id}/confirm`)
  },

  // 申请退款
  requestRefund(
    id: number,
    data: {
      reason: string
      description?: string
      images?: string[]
    }
  ) {
    return request.post<ApiResponse<void>>(`/user/shopping/orders/${id}/refund`, data)
  },

  // 删除订单
  deleteOrder(id: number) {
    return request.delete<ApiResponse<void>>(`/user/shopping/orders/${id}`)
  },

  // 购买商品(结账)API
  purchaseProducts(requestData: PurchaseProductsRequest) {
    return request.post<ApiResponse<any>>(
      `/shops/${getCurrentUserShopId()}/products/purchase`,
      requestData
    )
  }
}

// 后端分页响应格式
interface BackendPaginationResponse<T> {
  currentPage: number
  pageSize: number
  totalRecords: number
  totalPages: number
  records: T[]
}

// 根据分类名称获取商品类型ID
function getCategoryIdFromName(categoryName: string): number {
  const categoryIds: Record<string, number> = {
    digital: 1, // 数码产品
    office: 2, // 办公用品
    life: 3, // 生活用品
    gift: 4 // 礼品卡券
  }
  return categoryIds[categoryName] || -1
}
