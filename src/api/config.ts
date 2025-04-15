import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { RequestConfig } from './types'
import type { ApiErrorResponse } from '@/types/api/response'

export const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加token等认证信息
    const token = localStorage.getItem('token')
    if (token && !(config as RequestConfig).skipAuth) {
      config.headers = config.headers || {}
      // 检查token是否已经包含Bearer前缀
      if (token.startsWith('Bearer ')) {
        config.headers['Authorization'] = token
      } else {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    console.log(
      `🚀 发送请求: ${config.method?.toUpperCase()} ${config.url}`,
      config.data ? JSON.stringify(config.data, null, 2) : '无数据'
    )
    return config
  },
  error => {
    console.error('❌ 请求出错:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `✅ 响应成功: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      JSON.stringify(response.data, null, 2)
    )
    return response.data
  },
  error => {
    // 处理Token过期情况
    if (error.response && error.response.status === 401) {
      // 清除过期的认证信息
      localStorage.removeItem('token')
      localStorage.removeItem('userType')
      localStorage.removeItem('lastActivityTime')

      // 显示提示消息
      const errorMessage = '登录已过期，请重新登录'
      console.error(errorMessage)

      // 如果有Element Plus的消息组件，可以显示提示
      if (window.ElMessage) {
        window.ElMessage.error(errorMessage)
      } else {
        // 使用原生alert作为备选
        setTimeout(() => {
          alert(errorMessage)
        }, 0)
      }

      // 重定向到登录页面
      window.location.href = '/?timeout=true'
      return Promise.reject(new Error(errorMessage))
    }

    if (!(error.config as RequestConfig)?.skipErrorHandler) {
      // 统一错误处理
      const errorResponse = error.response?.data as ApiErrorResponse
      console.error(errorResponse?.message || '请求失败')
    }
    console.error(
      `❌ 响应错误: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    )
    return Promise.reject(error)
  }
)
