import { request } from '../config'
import type {
  Product,
  ProductCategory,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams
} from '@/types/api/admin/product'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'

// 定义商品分类类型
type ProductCategoryType = 'digital' | 'office' | 'life' | 'gift'

export const productApi = {
  // 获取商品列表
  getProducts(params: ProductQueryParams) {
    // 构建查询参数
    const queryParams = {
      shopId: params.storeId !== undefined ? params.storeId : -1, // 使用-1表示所有店铺
      productTypeId: params.category ? getCategoryTypeId(params.category) : -1, // 使用-1表示所有分类
      pageNumber: params.dateRange?.[0] ? 1 : 1, // 默认第1页
      pageSize: params.dateRange?.[0] ? 20 : 20 // 默认每页20条
    }

    // 辅助函数：将前端分类类型转换为后端ID
    function getCategoryTypeId(category: string): number {
      switch (category) {
        case 'digital':
          return 1
        case 'office':
          return 2
        case 'life':
          return 3
        case 'gift':
          return 4
        default:
          return -1 // 全部分类
      }
    }

    // 调用后端API获取商品列表
    return request.get<any>('/products', { params: queryParams }).then((response: any) => {
      // 将后端数据转换为前端期望的格式
      const products: Product[] = (response.records || []).map((item: any) => {
        // 将后端productTypeId转换为前端category
        let category: ProductCategoryType = 'digital'
        if (item.productTypeId) {
          switch (parseInt(item.productTypeId)) {
            case 1:
              category = 'digital'
              break
            case 2:
              category = 'office'
              break
            case 3:
              category = 'life'
              break
            case 4:
              category = 'gift'
              break
          }
        }

        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.stockQuantity,
          category: category,
          image: item.productImageUuid
            ? this.getProductImageUrl(item.id, item.productImageUuid)
            : '',
          productImageUuid: item.productImageUuid || '',
          description: item.description || '',
          storeIds: item.shopIds ? item.shopIds.split(',').map(Number) : [],
          status: '在售', // 默认状态
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        }
      })

      // 返回符合前端期望的响应格式
      return {
        code: 200,
        message: 'success',
        data: {
          items: products,
          total: response.totalRecords || 0,
          page: response.currentPage || 0,
          pageSize: response.pageSize || 10
        }
      }
    })
  },

  // 获取商品详情
  getProductById(id: number) {
    // 调用后端API获取单个商品详情
    return request.get<any>(`/products/${id}`).then((response: any) => {
      // 将后端数据转换为前端期望的格式
      const product: Product = {
        id: response.id || 0,
        name: response.name || '',
        price: response.price || 0,
        quantity: response.stockQuantity || 0,
        category: 'digital', // 默认分类
        image: response.productImageUuid
          ? this.getProductImageUrl(response.id, response.productImageUuid)
          : '',
        productImageUuid: response.productImageUuid || '',
        description: response.description || '',
        storeIds: response.shopIds ? response.shopIds.split(',').map(Number) : [],
        status: '在售', // 默认状态
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }

      // 返回符合前端期望的响应格式
      return {
        code: 200,
        message: 'success',
        data: product
      }
    })
  },

  // 创建商品
  createProduct(data: CreateProductRequest) {
    try {
      // 构建FormData对象，包含商品信息和图片
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('shopIds', data.storeIds.join(','))
      formData.append('productTypeId', '1') // 默认使用1作为商品类型ID
      formData.append('price', data.price.toString())
      formData.append('stockQuantity', data.quantity.toString())

      if (data.description) {
        formData.append('description', data.description)
      }

      // 处理图片上传
      this.processImageForUpload(formData, data.image, 'productImage', 'product_image.jpg')

      // 打印FormData内容，便于调试
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`)
      }

      // 调用后端API创建商品
      return request
        .post<any>('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          // 返回符合前端期望的响应格式
          return {
            code: 200,
            message: '商品添加成功',
            data: {
              ...data,
              id: Date.now(), // 使用临时ID
              createTime: new Date().toISOString(),
              updateTime: new Date().toISOString()
            }
          }
        })
    } catch (error) {
      console.error('创建商品失败:', error)
      throw error
    }
  },

  // 更新商品
  updateProduct(id: number, data: UpdateProductRequest) {
    try {
      // 构建FormData对象，包含商品信息和图片
      const formData = new FormData()

      if (data.name) formData.append('name', data.name)
      if (data.storeIds) formData.append('shopIds', data.storeIds.join(','))
      if (data.price) formData.append('price', data.price.toString())
      if (data.quantity) formData.append('stockQuantity', data.quantity.toString())
      if (data.description) formData.append('description', data.description)

      // 处理图片上传
      this.processImageForUpload(formData, data.image, 'productImage', 'product_image.jpg')

      // 打印FormData内容，便于调试
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`)
      }

      // 调用后端API更新商品
      return request
        .put<any>(`/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          // 返回符合前端期望的响应格式
          return {
            code: 200,
            message: '商品更新成功',
            data: {
              ...data,
              id,
              updateTime: new Date().toISOString()
            }
          }
        })
    } catch (error) {
      console.error('更新商品失败:', error)
      throw error
    }
  },

  // 删除商品
  deleteProduct(id: number) {
    // 调用后端API删除商品
    return request.delete<any>(`/products/${id}`).then(() => {
      // 返回符合前端期望的响应格式
      return {
        code: 200,
        message: '商品删除成功',
        data: null
      }
    })
  },

  // 更新商品状态
  updateProductStatus(id: number, status: Product['status']) {
    // 在后端API中可能没有直接对应的端点，使用更新商品的接口代替
    return request
      .put<any>(`/products/${id}`, {
        status: status === '在售' ? '正常' : status === '下架' ? '停用' : '缺货'
      })
      .then(() => {
        // 返回符合前端期望的响应格式
        return {
          code: 200,
          message: '状态更新成功',
          data: null
        }
      })
  },

  // 获取商品分类列表
  getCategories() {
    // 调用后端API获取商品类型
    return request
      .get<any>('/products/types')
      .then((response: any) => {
        // 将后端数据转换为前端期望的格式
        const categories: ProductCategory[] = (response || []).map((item: any) => ({
          label: item.type,
          value: item.id.toString() as any // 将ID作为分类值
        }))

        // 如果后端返回为空，提供默认分类
        if (categories.length === 0) {
          return {
            code: 200,
            message: 'success',
            data: [
              { label: '数码产品', value: 'digital' },
              { label: '办公用品', value: 'office' },
              { label: '生活用品', value: 'life' },
              { label: '礼品卡券', value: 'gift' }
            ]
          }
        }

        // 返回符合前端期望的响应格式
        return {
          code: 200,
          message: 'success',
          data: categories
        }
      })
      .catch(() => {
        // 如果获取失败，返回默认分类
        return {
          code: 200,
          message: 'success',
          data: [
            { label: '数码产品', value: 'digital' },
            { label: '办公用品', value: 'office' },
            { label: '生活用品', value: 'life' },
            { label: '礼品卡券', value: 'gift' }
          ]
        }
      })
  },

  // 创建商品分类 (后端可能没有此API，提供模拟实现)
  createCategory(data: Omit<ProductCategory, 'id' | 'createTime'>) {
    // 返回模拟成功响应
    return Promise.resolve({
      code: 200,
      message: '分类创建成功',
      data: {
        ...data,
        id: Date.now()
      }
    })
  },

  // 更新商品分类 (后端可能没有此API，提供模拟实现)
  updateCategory(id: number, data: Partial<Omit<ProductCategory, 'id' | 'createTime'>>) {
    // 返回模拟成功响应
    return Promise.resolve({
      code: 200,
      message: '分类更新成功',
      data: {
        ...data,
        id
      }
    })
  },

  // 删除商品分类 (后端可能没有此API，提供模拟实现)
  deleteCategory(id: number) {
    // 返回模拟成功响应
    return Promise.resolve({
      code: 200,
      message: '分类删除成功',
      data: null
    })
  },

  // 处理图片上传的统一方法
  processImageForUpload(formData: FormData, image: any, fieldName: string, fileName: string): void {
    // 如果image是base64字符串，转换为Blob
    if (image && typeof image === 'string' && image.startsWith('data:image')) {
      const blob = this.dataURLtoBlob(image)
      formData.append(fieldName, blob, fileName)
    }
    // 如果已经是File对象，直接添加
    else if (image && image instanceof File) {
      formData.append(fieldName, image)
    }
    // 如果是其他类型，可能是图片UUID或URL，直接作为字符串添加
    else if (image) {
      formData.append(fieldName, String(image))
    }
    // 如果没有提供图片，将使用后端默认图片
  },

  // 处理图片上传
  dataURLtoBlob(dataURL: string): Blob {
    // 将base64转换为Blob对象
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  },

  // 获取图片URL (不含token)
  getProductImageUrl(productId: number, imageUuid: string): string {
    return `/api/products/${productId}/images/${imageUuid}`
  },

  // 获取产品图片并转换为base64
  async getProductImage(productId: number, imageUuid: string): Promise<string> {
    try {
      const response = await fetch(`/api/products/${productId}/images/${imageUuid}`, {
        headers: {
          Authorization: localStorage.getItem('token') || ''
        }
      })

      if (!response.ok) {
        throw new Error('图片获取失败')
      }

      const blob = await response.blob()
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('获取产品图片失败:', error)
      return '' // 返回空字符串表示加载失败
    }
  }
}
