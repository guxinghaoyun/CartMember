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
