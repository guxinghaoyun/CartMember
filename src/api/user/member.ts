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

// 会员管理相关接口
export const memberApi = {
  // 获取会员列表
  getMembers(params: PaginationParams & MemberQueryParams) {
    return request.get<ApiResponse<PaginationResponse<Member>>>('/user/member/list', { params })
  },

  // 获取会员详情
  getMemberById(id: number) {
    return request.get<ApiResponse<Member>>(`/user/member/${id}`)
  },

  // 新增会员
  createMember(data: CreateMemberRequest) {
    return request.post<ApiResponse<Member>>('/user/member', data)
  },

  // 更新会员
  updateMember(id: number, data: UpdateMemberRequest) {
    return request.put<ApiResponse<Member>>(`/user/member/${id}`, data)
  },

  // 删除会员
  deleteMember(id: number) {
    return request.delete<ApiResponse<void>>(`/user/member/${id}`)
  },

  // 上传会员卡图片
  uploadCardImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)
    return request.post<ApiResponse<{ url: string }>>('/user/member/upload-card-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
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
    return request.get<ApiResponse<PaginationResponse<PointRecord>>>('/user/member/points/records', { params })
  },

  // 获取余额记录
  getBalanceRecords(params: PaginationParams & MemberRecordQueryParams) {
    return request.get<ApiResponse<PaginationResponse<BalanceRecord>>>('/user/member/balance/records', { params })
  },

  // 上传头像
  uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('avatar', file)
    return request.post<ApiResponse<{ url: string }>>('/user/member/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
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