/**
 * 日志控制工具
 * 在生产环境中禁用控制台日志输出，开发环境保持正常
 */

// 保存原始的console方法
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug
}

// 判断当前环境
const isDevelopment = import.meta.env.DEV

// 创建空函数用于生产环境
const noop = () => {}

// 重写console方法
if (!isDevelopment) {
  // 生产环境：禁用所有日志输出
  console.log = noop
  console.info = noop
  console.debug = noop
  console.warn = noop
  console.error = noop // 禁用错误日志
} else {
  // 开发环境：增强日志输出（可选）

  // 示例：为日志添加时间戳和标签
  console.log = function (...args) {
    originalConsole.log(`[LOG][${new Date().toISOString()}]`, ...args)
  }

  console.info = function (...args) {
    originalConsole.info(`[INFO][${new Date().toISOString()}]`, ...args)
  }

  console.warn = function (...args) {
    originalConsole.warn(`[WARN][${new Date().toISOString()}]`, ...args)
  }

  console.error = function (...args) {
    originalConsole.error(`[ERROR][${new Date().toISOString()}]`, ...args)
  }

  console.debug = function (...args) {
    originalConsole.debug(`[DEBUG][${new Date().toISOString()}]`, ...args)
  }
}

// 导出原始console方法，以防有需要强制记录日志的场景
export const logger = {
  log: (...args: any[]) => originalConsole.log(...args),
  info: (...args: any[]) => originalConsole.info(...args),
  warn: (...args: any[]) => originalConsole.warn(...args),
  error: (...args: any[]) => originalConsole.error(...args),
  debug: (...args: any[]) => originalConsole.debug(...args)
}

// 导出一个默认对象表示已初始化
export default { initialized: true }
