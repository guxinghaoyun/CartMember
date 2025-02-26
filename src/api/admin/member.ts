import { request } from '../config'
import type { 
  Member, 
  CreateMemberRequest, 
  UpdateMemberRequest,
  MemberQueryParams,
  AdjustPointsRequest,
  AddProductsRequest,
  ProductOperationResponse
} from '@/types/api/admin/member'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'

export const memberApi = {
  // 获取会员列表
  getList(params: PaginationParams & MemberQueryParams) {
    return request.get<ApiResponse<PaginationResponse<Member>>>('/admin/members', { params })
  },

  // 获取会员详情
  getDetail(id: number) {
    return request.get<ApiResponse<Member>>(`/admin/members/${id}`)
  },

  // 创建会员
  create(data: CreateMemberRequest) {
    return request.post<ApiResponse<Member>>('/admin/members', data)
  },

  // 更新会员信息
  update(id: number, data: UpdateMemberRequest) {
    return request.put<ApiResponse<Member>>(`/admin/members/${id}`, data)
  },

  // 删除会员
  delete(id: number) {
    return request.delete<ApiResponse<void>>(`/admin/members/${id}`)
  },

  // 更新会员状态
  updateStatus(id: number, status: Member['status']) {
    return request.patch<ApiResponse<void>>(`/admin/members/${id}/status`, { status })
  },

  // 调整会员积分
  adjustPoints(id: number, data: AdjustPointsRequest) {
    return request.post<ApiResponse<Member>>(`/admin/members/${id}/points/adjust`, data)
  },

  // 添加会员商品
  addProducts(id: number, data: AddProductsRequest) {
    return request.post<ApiResponse<Member>>(`/admin/members/${id}/products`, data)
  },

  // 删除会员商品
  removeProduct(id: number, productId: number) {
    return request.delete<ApiResponse<ProductOperationResponse>>(`/admin/members/${id}/products/${productId}`)
  },

  // 更新会员卡照片
  updateCardImage(id: number, type: 'front' | 'back', file: File) {
    const formData = new FormData()
    formData.append('image', file)
    return request.post<ApiResponse<{url: string}>>(`/admin/members/${id}/card-image/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 读取IC卡信息
  readCardInfo() {
    return request.get<ApiResponse<{
      cardNo: string
      physicalNo: string
    }>>('/admin/members/read-card')
  }
} 