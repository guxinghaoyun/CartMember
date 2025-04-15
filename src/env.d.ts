/// <reference types="vite/client" />
import type { ElMessage } from 'element-plus'

// 扩展Window接口
declare global {
  interface Window {
    ElMessage: typeof ElMessage
  }
}
