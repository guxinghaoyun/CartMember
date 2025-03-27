import { request } from '../config'
import type {
  Member,
  MemberCard,
  PointRecord,
  BalanceRecord,
  UpdateProfileRequest,
  ChangePasswordRequest,
  MemberRecordQueryParams,
  CreateMemberRequest,
  UpdateMemberRequest,
  MemberQueryParams
} from '@/types/api/user/member'
import type { ApiResponse, PaginationResponse, PaginationParams } from '@/types/api/common'
import axios from 'axios'

// 前端使用的分页响应格式
interface FrontendPaginationResponse<T> {
  total: number
  items: T[]
  page: number
  pageSize: number
}

// 将后端会员响应转换为前端格式
function transformMemberResponse(response: any): FrontendPaginationResponse<Member> {
  // 确保响应对象存在
  if (!response) {
    console.warn('转换会员响应数据：接收到空响应')
    return {
      total: 0,
      items: [],
      page: 1,
      pageSize: 10
    }
  }

  // 打印实际收到的响应数据结构，帮助调试
  console.log('后端返回的会员数据:', JSON.stringify(response, null, 2))

  // 转换会员数据
  return {
    total: response.totalRecords || 0,
    items: (response.records || []).map((item: any) => ({
      id: item.id || 0,
      name: item.name || '',
      phone: item.phone || '',
      icCard: item.icNumber || '',
      registerDate: item.createTime ? new Date(item.createTime).toLocaleDateString() : '',
      icStatus: item.icStatus === true || item.icStatus === '1' || item.icStatus === 1,
      note: item.note || '',
      remainingPoints: 0, // 后端API中没有此字段，默认为0
      frontPicture: item.frontPicture || item.icFrontPictureUuid || '',
      backPicture: item.backPicture || item.icBackPictureUuid || ''
    })),
    page: response.currentPage || 1,
    pageSize: response.pageSize || 10
  }
}

// 会员管理相关接口
export const memberApi = {
  // 获取会员列表
  async getMembers(params: PaginationParams & MemberQueryParams) {
    try {
      // 从localStorage获取当前店铺ID
      let shopId = 0
      const shopInfoStr = localStorage.getItem('shopInfo')
      if (shopInfoStr) {
        const shopInfo = JSON.parse(shopInfoStr)
        shopId = shopInfo.id
      }

      // 如果没有店铺ID，尝试从用户信息中获取
      if (!shopId) {
        const userInfoStr = localStorage.getItem('user')
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr)
          shopId = userInfo.shopId || 0
        }
      }

      if (!shopId) {
        console.warn('获取会员列表：未找到店铺ID')
        return {
          code: 500,
          message: '未找到店铺ID',
          data: {
            total: 0,
            items: [],
            page: params.page || 1,
            pageSize: params.pageSize || 10
          } as FrontendPaginationResponse<Member>
        }
      }

      // 构建API请求参数
      const apiParams = {
        pageNumber: params.page || 1,
        pageSize: params.pageSize || 10
      }

      // 如果有关键字搜索，可以添加到请求参数中
      if (params.keyword) {
        Object.assign(apiParams, { keyword: params.keyword })
      }

      console.log(`获取店铺ID ${shopId} 的会员列表，参数:`, apiParams)

      // 调用后端API
      const response = await request.get(`/memberships/${shopId}`, { params: apiParams })

      // 转换响应数据格式
      const transformedData = transformMemberResponse(response)

      return {
        code: 200,
        message: '成功',
        data: transformedData
      } as ApiResponse<FrontendPaginationResponse<Member>>
    } catch (error) {
      console.error('获取会员列表失败', error)
      return {
        code: 500,
        message: error instanceof Error ? error.message : '获取会员列表失败',
        data: {
          total: 0,
          items: [],
          page: params.page || 1,
          pageSize: params.pageSize || 10
        } as FrontendPaginationResponse<Member>
      }
    }
  },

  // 获取会员详情
  async getMemberById(id: number) {
    try {
      // 从localStorage获取当前店铺ID
      let shopId = 0
      const shopInfoStr = localStorage.getItem('shopInfo')
      if (shopInfoStr) {
        const shopInfo = JSON.parse(shopInfoStr)
        shopId = shopInfo.id
      }

      // 如果没有店铺ID，尝试从用户信息中获取
      if (!shopId) {
        const userInfoStr = localStorage.getItem('user')
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr)
          shopId = userInfo.shopId || 0
        }
      }

      if (!shopId) {
        console.warn('获取会员详情：未找到店铺ID')
        return {
          code: 500,
          message: '未找到店铺ID',
          data: null
        }
      }

      console.log(`获取店铺ID ${shopId} 中的会员 ID ${id} 详情`)

      // 由于API不支持直接获取单个会员，我们将从会员列表中筛选指定ID的会员
      const response: any = await request.get(`/memberships/${shopId}`)

      if (!response || !response.records || !Array.isArray(response.records)) {
        console.warn('获取会员详情失败：无效的响应数据')
        return {
          code: 404,
          message: '未找到会员',
          data: null
        }
      }

      // 查找指定ID的会员
      const memberData = response.records.find((member: any) => member.id === id)

      if (!memberData) {
        console.warn(`未找到ID为 ${id} 的会员`)
        return {
          code: 404,
          message: '未找到会员',
          data: null
        }
      }

      // 转换会员数据为前端格式
      const memberInfo: Member = {
        id: memberData.id || 0,
        name: memberData.name || '',
        phone: memberData.phone || '',
        icNumber: memberData.icNumber || '',
        registerDate: memberData.createTime
          ? new Date(memberData.createTime).toLocaleDateString()
          : '',
        icStatus:
          memberData.icStatus === true || memberData.icStatus === '1' || memberData.icStatus === 1,
        note: memberData.note || '',
        remainingPoints: 0, // 后端API中没有此字段，默认为0
        frontPicture: memberData.icFrontPictureUuid || '',
        backPicture: memberData.icBackPictureUuid || ''
      }

      return {
        code: 200,
        message: '成功',
        data: memberInfo
      }
    } catch (error) {
      console.error('获取会员详情失败', error)
      return {
        code: 500,
        message: error instanceof Error ? error.message : '获取会员详情失败',
        data: null
      }
    }
  },

  // 新增会员
  createMember(data: CreateMemberRequest) {
    console.log('新增会员数据打印', data)
    try {
      // 从localStorage获取当前店铺ID
      let shopId = 0
      const shopInfoStr = localStorage.getItem('shopInfo')
      if (shopInfoStr) {
        const shopInfo = JSON.parse(shopInfoStr)
        shopId = shopInfo.id
      }

      // 如果没有店铺ID，尝试从用户信息中获取
      if (!shopId) {
        const userInfoStr = localStorage.getItem('user')
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr)
          shopId = userInfo.shopId || 0
        }
      }
      const formData = new FormData()

      // 添加会员基本信息
      formData.append('name', data.name)
      formData.append('phone', data.phone)
      formData.append('icNumber', data.icNumber)
      formData.append('shopId', shopId.toString())
      formData.append('note', data.note || '')
      formData.append('icStatus', '1')

      // 处理图片 - 优先使用直接字段，如果没有则尝试从cardImages中获取
      const frontPicture = data.frontPicture || ''
      const backPicture = data.backPicture || ''

      if (frontPicture) {
        this.processImageForUpload(formData, frontPicture, 'frontPicture', 'member_front_image.jpg')
      }

      if (backPicture) {
        this.processImageForUpload(formData, backPicture, 'backPicture', 'member_back_image.jpg')
      }
      // 打印FormData内容，便于调试
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`)
      }
      // 调用后端API
      return request
        .post<any>('/memberships', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response: any) => {
          // 返回符合前端期望的响应格式
          return {
            code: 200,
            message: '会员创建成功'
          }
        })
    } catch (error) {
      console.error('创建会员失败:', error)
      throw error
    }
  },

  // 更新会员
  updateMember(id: string, data: UpdateMemberRequest) {
    try {
      const formData = new FormData()

      // 添加会员基本信息
      if (data.name) formData.append('name', data.name)
      if (data.phone) formData.append('phone', data.phone)
      if (data.icStatus !== undefined) formData.append('icStatus', data.icStatus.toString())
      if (data.note !== undefined) formData.append('note', data.note)
      // 添加shopId，确保更新时包含店铺ID
      if (data.shopId) formData.append('shopId', data.shopId.toString())

      // 处理图片 - 优先使用直接字段，如果没有则尝试从cardImages中获取
      const frontPicture = data.frontPicture || ''
      const backPicture = data.backPicture || ''

      if (frontPicture) {
        this.processImageForUpload(formData, frontPicture, 'frontPicture', 'member_front_image.jpg')
      }

      if (backPicture) {
        this.processImageForUpload(formData, backPicture, 'backPicture', 'member_back_image.jpg')
      }

      // 打印FormData内容，便于调试
      console.log(`更新会员 ID: ${id}, 表单数据:`)
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${typeof pair[1] === 'string' ? pair[1] : '(文件或二进制数据)'}`)
      }

      // 调用后端API
      return request
        .put<any>(`/memberships/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response: any) => {
          // 返回符合前端期望的响应格式
          return {
            code: 200,
            message: '会员更新成功'
          }
        })
    } catch (error) {
      console.error('更新会员失败:', error)
      throw error
    }
  },

  // 删除会员
  async deleteMember(id: number) {
    try {
      // 获取当前店铺ID（可能在删除操作中需要）
      let shopId = 0
      const shopInfoStr = localStorage.getItem('shopInfo')
      if (shopInfoStr) {
        const shopInfo = JSON.parse(shopInfoStr)
        shopId = shopInfo.id
      }

      console.log(`删除会员 ID: ${id}${shopId ? `, 店铺ID: ${shopId}` : ''}`)

      // 调用后端API
      await request.delete(`/memberships/${id}`)

      return {
        code: 200,
        message: '会员删除成功',
        data: null
      }
    } catch (error) {
      console.error('删除会员失败', error)
      return {
        code: 500,
        message: error instanceof Error ? error.message : '删除会员失败',
        data: null
      }
    }
  },

  // 获取会员卡图片
  async getMemberCardImage(memberId: number, imageUuid: string): Promise<string> {
    try {
      const response = await fetch(`/api/memberships/${memberId}/images/${imageUuid}`, {
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
      console.error('获取会员卡图片失败:', error)
      return '' // 返回空字符串表示加载失败
    }
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

  // 获取会员卡图片URL
  getMemberCardImageUrl(memberId: number, imageUuid: string): string {
    return `/api/memberships/${memberId}/images/${imageUuid}`
  },

  // 处理图片上传的统一方法
  processImageForUpload(formData: FormData, image: any, fieldName: string, fileName: string): void {
    // 如果image是base64字符串，转换为Blob
    if (typeof image === 'string' && image.startsWith('data:image')) {
      const blob = this.dataURLtoBlob(image)
      formData.append(fieldName, blob, fileName)
    }
    // 如果已经是File对象，直接添加
    else if (image instanceof File) {
      formData.append(fieldName, image)
    }
    // 不再处理其他类型的图片数据（如UUID），而是直接使用base64字符串
    // 否则不添加图片字段，表示不修改图片
  }
}

// 会员个人中心相关接口
export const userMemberApi = {
  // 获取个人信息
  getProfile() {
    return request.get<ApiResponse<Member>>('/user/member/profile')
  },

  // 更新个人信息
  updateProfile(data: UpdateProfileRequest) {
    return request.put<ApiResponse<Member>>('/user/member/profile', data)
  },

  // 修改密码
  changePassword(data: ChangePasswordRequest) {
    return request.post<ApiResponse<void>>('/user/member/change-password', data)
  },

  // 获取会员卡信息
  getCards() {
    return request.get<ApiResponse<MemberCard[]>>('/user/member/cards')
  },

  // 获取积分记录
  getPointRecords(params: PaginationParams & MemberRecordQueryParams) {
    return request.get<ApiResponse<PaginationResponse<PointRecord>>>(
      '/user/member/points/records',
      { params }
    )
  },

  // 获取余额记录
  getBalanceRecords(params: PaginationParams & MemberRecordQueryParams) {
    return request.get<ApiResponse<PaginationResponse<BalanceRecord>>>(
      '/user/member/balance/records',
      { params }
    )
  },

  // 绑定手机号
  bindPhone(phone: string, code: string) {
    return request.post<ApiResponse<void>>('/user/member/bind-phone', { phone, code })
  },

  // 发送验证码
  sendVerificationCode(phone: string) {
    return request.post<ApiResponse<void>>('/user/member/send-code', { phone })
  }
}
