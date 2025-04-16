// 定义认证相关的键名列表
const authItems = ['token', 'userType', 'lastActivityTime', 'user', 'shopInfo']

// 保存原始localStorage对象引用
const originalLocalStorage = window.localStorage

// 迁移现有用户的认证数据
function migrateExistingAuthData() {
  authItems.forEach(key => {
    const value = originalLocalStorage.getItem(key)
    if (value) {
      // 复制到sessionStorage
      sessionStorage.setItem(key, value)
      // 可选：从localStorage中移除，防止冗余存储
      // originalLocalStorage.removeItem(key);
    }
  })
}

// 创建代理拦截localStorage操作
Object.defineProperty(window, 'localStorage', {
  value: {
    // 设置项目 - 认证项使用sessionStorage，其他使用原始localStorage
    setItem(key: string, value: string) {
      if (authItems.includes(key)) {
        sessionStorage.setItem(key, value)
      } else {
        originalLocalStorage.setItem(key, value)
      }
    },

    // 获取项目 - 认证项从sessionStorage获取，其他从原始localStorage获取
    getItem(key: string) {
      if (authItems.includes(key)) {
        return sessionStorage.getItem(key)
      }
      return originalLocalStorage.getItem(key)
    },

    // 移除项目 - 同时从两个存储中移除
    removeItem(key: string) {
      sessionStorage.removeItem(key)
      originalLocalStorage.removeItem(key)
    },

    // 清除所有 - 同时清除两个存储
    clear() {
      sessionStorage.clear()
      originalLocalStorage.clear()
    },

    // 其他方法保持原样
    key(index: number) {
      return originalLocalStorage.key(index)
    },

    // 长度属性
    get length() {
      return originalLocalStorage.length
    }
  },
  writable: false,
  configurable: true
})

// 在初始化时执行迁移
migrateExistingAuthData()

export default window.localStorage
