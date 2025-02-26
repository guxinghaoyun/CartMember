import type { AxiosRequestConfig } from 'axios'

export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean
  skipAuth?: boolean
}

export interface ApiErrorResponse {
  code: number
  message: string
  details?: string
} 