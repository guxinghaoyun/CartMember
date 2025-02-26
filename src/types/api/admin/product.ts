// 商品分类类型
export type ProductCategoryType = 'digital' | 'office' | 'life' | 'gift' | ''

// 商品基础信息
export interface Product {
  id: number
  name: string
  price: number
  quantity: number // 库存数量
  category: ProductCategoryType
  image: string
  description: string
  storeIds: number[] // 所属店铺ID数组
  status: '在售' | '下架' | '缺货'
  createTime: string
  updateTime: string
}

// 商品分类
export interface ProductCategory {
  label: string
  value: ProductCategoryType
}

// 创建商品请求
export type CreateProductRequest = Omit<Product, 'id' | 'createTime' | 'updateTime'>

// 更新商品请求
export type UpdateProductRequest = Partial<CreateProductRequest>

// 商品查询参数
export interface ProductQueryParams {
  name?: string
  category?: ProductCategoryType
  storeId?: number
  status?: Product['status']
  priceRange?: [number, number]
  dateRange?: [string, string]
} 