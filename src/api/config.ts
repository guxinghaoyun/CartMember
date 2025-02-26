import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { RequestConfig, ApiErrorResponse } from './types'

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
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (!(error.config as RequestConfig)?.skipErrorHandler) {
      // 统一错误处理
      const errorResponse = error.response?.data as ApiErrorResponse
      console.error(errorResponse?.message || '请求失败')
    }
    return Promise.reject(error)
  }
) 