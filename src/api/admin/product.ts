import { request } from '../config'
import type {
  Product,
  ProductCategory,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams
} from '@/types/api/admin/product'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'

export const productApi = {
  // 获取商品列表
  getProducts(params: ProductQueryParams) {
    return request.get<ApiResponse<PaginationResponse<Product>>>('/admin/products', { params })
  },

  // 获取商品详情
  getProductById(id: number) {
    return request.get<ApiResponse<Product>>(`/admin/products/${id}`)
  },

  // 创建商品
  createProduct(data: CreateProductRequest) {
    return request.post<ApiResponse<Product>>('/admin/products', data)
  },

  // 更新商品
  updateProduct(id: number, data: UpdateProductRequest) {
    return request.put<ApiResponse<Product>>(`/admin/products/${id}`, data)
  },

  // 删除商品
  deleteProduct(id: number) {
    return request.delete<ApiResponse<void>>(`/admin/products/${id}`)
  },

  // 更新商品状态
  updateProductStatus(id: number, status: Product['status']) {
    return request.patch<ApiResponse<void>>(`/admin/products/${id}/status`, { status })
  },

  // 获取商品分类列表
  getCategories() {
    return request.get<ApiResponse<ProductCategory[]>>('/admin/product-categories')
  },

  // 创建商品分类
  createCategory(data: Omit<ProductCategory, 'id' | 'createTime'>) {
    return request.post<ApiResponse<ProductCategory>>('/admin/product-categories', data)
  },

  // 更新商品分类
  updateCategory(id: number, data: Partial<Omit<ProductCategory, 'id' | 'createTime'>>) {
    return request.put<ApiResponse<ProductCategory>>(`/admin/product-categories/${id}`, data)
  },

  // 删除商品分类
  deleteCategory(id: number) {
    return request.delete<ApiResponse<void>>(`/admin/product-categories/${id}`)
  }
} 