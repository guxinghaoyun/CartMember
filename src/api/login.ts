import type { LoginParams, LoginResponse } from '@/types/api/login'
import { request } from './config'
import type { Message } from '@/types/api/response'
import axios from 'axios'

/**
 * 将Base64Url编码转换为标准Base64编码
 */
function base64UrlToBase64(base64Url: string): string {
  // 将Base64Url中的字符替换为标准Base64字符
  return base64Url.replace(/-/g, '+').replace(/_/g, '/')
}

/**
 * 安全解析JWT Payload
 */
function parseJwtPayload(jwt: string): any {
  try {
    const parts = jwt.split('.')
    if (parts.length !== 3) {
      throw new Error('无效的JWT格式')
    }

    // 获取payload部分并转换为标准Base64
    const base64 = base64UrlToBase64(parts[1])

    // 添加填充字符以确保长度是4的倍数
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

    // 解码为UTF-8字符串
    const jsonStr = decodeURIComponent(escape(window.atob(paddedBase64)))

    // 解析JSON
    return JSON.parse(jsonStr)
  } catch (e) {
    console.warn('JWT解析失败', e)
    return {}
  }
}

/**
 * 真实登录API
 * @param params 登录参数
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  try {
    // 使用axios发送请求，以便能够访问响应头
    // 注意：这里不使用request实例，因为我们需要完整的响应对象（包括headers）
    // 注意：baseURL已经是'/api'，不需要再添加额外的路径前缀
    const { data, headers } = await axios.post<Message>('/api/login', null, {
      params: {
        loginId: params.username,
        password: params.password
      }
    })

    // 从响应中提取消息和令牌
    const message = data
    const token = headers['authorization'] || ''

    // 验证登录成功
    if (message.code === 'ICM100I' && message.type === 'I') {
      // 解析JWT令牌获取用户信息（如果有）
      let username = params.username
      let userType: 'admin' | 'user' = 'user'

      if (token && token.startsWith('Bearer ')) {
        // 从JWT令牌中提取用户信息
        const jwt = token.replace('Bearer ', '')

        try {
          // 使用安全的方法解析JWT payload
          const payload = parseJwtPayload(jwt)
          const sub =
            typeof payload.sub === 'string' ? JSON.parse(payload.sub || '{}') : payload.sub || {}

          // 从payload中提取用户信息
          username = sub.name || params.username
          // 根据roleNames判断用户类型
          userType = (sub.roleNames || []).includes('SystemAdmin') ? 'admin' : 'user'
        } catch (e) {
          console.warn('JWT解析失败', e)
        }
      } else {
        // 如果没有令牌，使用用户名判断
        userType = params.username.includes('admin') ? 'admin' : 'user'
      }

      // 保存token到localStorage
      if (token) {
        localStorage.setItem('token', token)
      }

      return {
        token,
        userType,
        userInfo:
          userType === 'admin'
            ? {
                name: username,
                role: '系统管理员',
                store: '总部'
              }
            : {
                name: username,
                role: '会员',
                points: 0
              }
      }
    }

    // 登录失败
    throw new Error('用户名或密码错误')
  } catch (error) {
    // 这里可以根据不同的错误类型进行处理
    console.error('登录失败', error)
    throw new Error('登录失败，请检查网络连接或联系管理员')
  }
}
