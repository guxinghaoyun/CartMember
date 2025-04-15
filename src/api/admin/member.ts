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
import type { ApiResponse, PaginationParams } from '@/types/api/common'
import type { PaginationResponse } from '@/types/api/response'
import type { AxiosResponse } from 'axios'

// ===== 数据映射相关类型和函数 (从memberMapper.ts合并) =====

// 后端会员数据结构
export interface BackendMember {
  id: number
  name: string
  phone: string
  note: string
  icNumber: string
  innerIcNumber: string | null
  icStatus: string | null
  icCreateTime: string | null
  icFrontPictureUuid: string
  icBackPictureUuid: string
  shopId: number
  currentScore: number
  products:
    | {
        id: number
        name: string
        productTypeId: number
        productImageUuid: string
        price: number
        stockQuantity: number
        description: string
        createTime: string | null
        updateTime: string | null
      }[]
    | null
  createTime: string
  updateTime: string
}

// 后端分页响应结构
export interface BackendPaginationResponse {
  currentPage: number
  pageSize: number
  totalRecords: number
  totalPages: number
  records: BackendMember[]
}

// 处理Axios响应数据
export function unwrapResponse<T>(response: AxiosResponse<T> | T): T {
  // 如果是Axios响应对象，从data属性中提取数据
  // 否则，直接返回数据本身
  return 'data' in (response as any) ? (response as any).data : (response as T)
}

// 获取店铺信息
async function getShopInfo(shopId: number): Promise<string> {
  try {
    const response = await request.get(`/shops/${shopId}`)
    const shopData = unwrapResponse(response)
    // 假设店铺信息中有name字段，根据实际情况调整
    return shopData.name || `店铺ID: ${shopId}`
  } catch (error) {
    console.error(`获取店铺信息失败, ID: ${shopId}`, error)
    return `店铺ID: ${shopId}`
  }
}

// 后端数据转换为前端数据
export async function mapToFrontendMemberList(
  backendData: AxiosResponse<BackendMember> | BackendMember
): Promise<Member> {
  // 确保我们处理的是解包后的数据
  const backendMember = unwrapResponse(backendData)
  return {
    id: backendMember.id,
    name: backendMember.name,
    phone: backendMember.phone,
    surfaceNumber: backendMember.icNumber || '',
    internalNumber: backendMember.innerIcNumber || '',
    points: backendMember.currentScore,
    totalPoints: backendMember.currentScore, // 暂用当前积分代替累计积分
    registerDate: backendMember.createTime,
    icStatus: backendMember.icStatus === '正常',
    lastActive: backendMember.updateTime,
    orderCount: 0 // 默认值，后端未提供
    // 其他字段如需要可添加默认值
  }
}

// 后端数据详情数据转换为前端数据
export async function mapToFrontendMemberDetail(
  backendData: AxiosResponse<BackendMember> | BackendMember
): Promise<Member> {
  // 确保我们处理的是解包后的数据
  const backendMember = unwrapResponse(backendData)

  // 获取店铺名称
  const shopName = await getShopInfo(backendMember.shopId)

  return {
    id: backendMember.id,
    name: backendMember.name,
    phone: backendMember.phone,
    surfaceNumber: backendMember.icNumber || '',
    internalNumber: backendMember.innerIcNumber || '',
    points: backendMember.currentScore,
    totalPoints: backendMember.currentScore, // 暂用当前积分代替累计积分
    registerDate: backendMember.createTime,
    icStatus: backendMember.icStatus === '正常',
    frontPicture: backendMember.icFrontPictureUuid,
    backPicture: backendMember.icBackPictureUuid,
    notes: backendMember.note,
    products:
      backendMember.products?.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.stockQuantity,
        points: p.price, // 使用商品价格作为积分值
        image: p.productImageUuid // 将imageUuid保存到image字段
      })) || [],
    lastActive: backendMember.updateTime,
    registerStore: shopName,
    orderCount: 0 // 默认值，后端未提供
    // 其他字段如需要可添加默认值
  }
}

// 前端数据转换为后端数据（用于创建/更新会员）
export function mapToBackendCreateMember(
  frontendData: CreateMemberRequest
): Partial<BackendMember> {
  return {
    name: frontendData.name,
    phone: frontendData.phone,
    note: frontendData.notes,
    icNumber: frontendData.surfaceNumber,
    innerIcNumber: frontendData.internalNumber,
    icStatus: frontendData.icStatus ? '正常' : '停用',
    icFrontPictureUuid: frontendData.frontPicture,
    icBackPictureUuid: frontendData.backPicture,
    // shopId 会由后端自动处理
    currentScore: frontendData.points || 0
  }
}

// 前端更新数据转换为后端格式
export function mapToBackendUpdateMember(
  frontendData: UpdateMemberRequest
): Partial<BackendMember> {
  const result: Partial<BackendMember> = {}

  if (frontendData.name !== undefined) result.name = frontendData.name
  if (frontendData.phone !== undefined) result.phone = frontendData.phone
  if (frontendData.notes !== undefined) result.note = frontendData.notes
  if (frontendData.surfaceNumber !== undefined) result.icNumber = frontendData.surfaceNumber
  if (frontendData.internalNumber !== undefined) result.innerIcNumber = frontendData.internalNumber
  if (frontendData.icStatus !== undefined) result.icStatus = frontendData.icStatus ? '正常' : '停用'
  if (frontendData.frontPicture !== undefined) result.icFrontPictureUuid = frontendData.frontPicture
  if (frontendData.backPicture !== undefined) result.icBackPictureUuid = frontendData.backPicture
  if (frontendData.points !== undefined) result.currentScore = frontendData.points

  return result
}

// ===== API相关函数 =====

export const memberApi = {
  // 获取会员列表
  async getList(params: PaginationParams & MemberQueryParams) {
    // 构建查询参数
    const queryParams: Record<string, any> = {
      pageNumber: params.page || 1,
      pageSize: params.pageSize || 10
    }

    // 如果有搜索关键字，添加到查询参数
    if (params.searchQuery) {
      queryParams.keyword = params.searchQuery
    }

    // 调用真实API `/api/memberships/{shopId}`
    const response = await request.get<BackendPaginationResponse>(`/memberships/${params.shopId}`, {
      params: queryParams
    })

    // 解包响应数据
    const backendData = unwrapResponse(response)

    // 转换后端数据到前端格式（处理异步映射）
    const memberPromises = backendData.records.map(item => mapToFrontendMemberList(item))
    const members = await Promise.all(memberPromises)

    const paginatedResponse: PaginationResponse<Member> = {
      items: members,
      total: backendData.totalRecords,
      page: backendData.currentPage || 1,
      pageSize: backendData.pageSize || 10
    }

    // 返回API响应格式
    return {
      data: {
        code: 'success',
        message: '获取会员列表成功',
        data: paginatedResponse
      }
    }
  },

  // 获取会员详情
  async getDetail(id: number) {
    // 使用新的API端点获取会员详情
    const response = await request.get<BackendMember>(`/memberships/{shopId}/detail/${id}`)

    // 转换后端数据到前端格式
    const member = await mapToFrontendMemberDetail(response)

    // 返回API响应格式
    return {
      data: {
        code: 'success',
        message: '获取会员详情成功',
        data: member
      }
    }
  },

  // 创建会员
  async create(data: CreateMemberRequest) {
    // 转换前端数据到后端格式
    const backendData = mapToBackendCreateMember(data)

    // 调用真实API
    const response = await request.post<BackendMember>('/memberships', backendData)

    // 转换响应数据到前端格式
    const member = await mapToFrontendMemberDetail(response)

    // 返回API响应格式
    return {
      data: {
        code: 'success',
        message: '创建会员成功',
        data: member
      }
    }
  },

  // 更新会员信息
  async update(id: number, data: UpdateMemberRequest) {
    // 转换前端数据到后端格式
    const backendData = mapToBackendUpdateMember(data)

    // 调用真实API
    const response = await request.put<BackendMember>(`/memberships/${id}`, backendData)

    // 转换响应数据到前端格式
    const member = await mapToFrontendMemberDetail(response)

    // 返回API响应格式
    return {
      data: {
        code: 'success',
        message: '更新会员成功',
        data: member
      }
    }
  },

  // 删除会员
  async delete(id: number) {
    // 调用真实API
    await request.delete(`/memberships/${id}`)

    // 返回API响应格式
    return {
      data: {
        code: 'success',
        message: '删除会员成功',
        data: null
      }
    }
  },

  // 更新会员状态
  updateStatus(id: number, status: Member['icStatus']) {
    // 转换状态值
    const backendStatus = status ? '正常' : '停用'

    // 调用更新接口
    return this.update(id, { icStatus: status })
  },

  // 调整会员积分
  async adjustPoints(id: number, data: AdjustPointsRequest) {
    // 获取会员数据
    const memberResponse = await request.get<BackendMember>(`/memberships/${id}`)
    const memberData = unwrapResponse(memberResponse)

    // 根据类型计算新积分
    const currentPoints = memberData.currentScore
    const newPoints =
      data.type === 'add' ? currentPoints + data.points : Math.max(0, currentPoints - data.points)

    // 更新会员积分
    const updateResponse = await request.put<BackendMember>(`/memberships/${id}`, {
      currentScore: newPoints,
      // 积分调整原因可记录在备注中
      note: memberData.note ? `${memberData.note}; ${data.reason}` : data.reason
    })

    // 转换并返回
    return {
      data: {
        code: 'success',
        message: '积分调整成功',
        data: await mapToFrontendMemberDetail(updateResponse)
      }
    }
  },

  // 添加会员商品
  async addProducts(id: number, data: AddProductsRequest) {
    // 此API需要根据实际后端接口调整
    // 假设后端有添加会员商品的接口
    const response = await request.post<BackendMember>(`/memberships/${id}/products`, {
      productIds: data.products.map(p => ({ id: p.id, quantity: p.quantity }))
    })

    return {
      data: {
        code: 'success',
        message: '添加商品成功',
        data: await mapToFrontendMemberDetail(response)
      }
    }
  },

  // 删除会员商品
  async removeProduct(id: number, productId: number) {
    // 此API需要根据实际后端接口调整
    await request.delete(`/memberships/${id}/products/${productId}`)

    return {
      data: {
        code: 'success',
        message: '删除商品成功',
        data: {
          success: true,
          message: '商品删除成功'
        }
      }
    }
  },

  // 更新会员卡照片
  async updateCardImage(id: number, type: 'front' | 'back', file: File) {
    const formData = new FormData()
    formData.append('image', file)

    // 根据类型确定字段名
    const field = type === 'front' ? 'icFrontPictureUuid' : 'icBackPictureUuid'

    // 调用上传API
    const uploadResponse = await request.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    const uploadData = unwrapResponse(uploadResponse)

    // 更新会员资料
    const updateData: Record<string, string> = {}
    updateData[field] = uploadData.url

    await request.put(`/memberships/${id}`, updateData)

    return {
      data: {
        code: 'success',
        message: '更新卡片图片成功',
        data: { url: uploadData.url }
      }
    }
  },

  // 读取IC卡信息
  readCardInfo() {
    // 假设后端有读取IC卡信息的接口
    return request.get<
      ApiResponse<{
        cardNo: string
        physicalNo: string
      }>
    >('/memberships/read-card')
  }
}
