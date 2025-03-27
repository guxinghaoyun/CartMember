// 登录请求参数类型
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

// 管理员用户信息类型
export interface AdminUserInfo {
  name: string
  role: string
  store: string
}

// 普通用户信息类型
export interface UserInfo {
  name: string
  role: string
  points: number
}

// 登录响应类型
export interface LoginResponse {
  token: string
  userType: 'admin' | 'user'
  userInfo: AdminUserInfo | UserInfo
}
