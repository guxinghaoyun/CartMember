// 店铺和用户信息工具函数

// 店铺信息接口
export interface ShopInfo {
  id: number
  name?: string
  address?: string
  phone?: string
  users?: StaffInfo[]
  [key: string]: any
}

// 操作员/用户信息接口
export interface StaffInfo {
  id: string | number
  name: string
  position?: string
  phone?: string
  manager?: boolean
  [key: string]: any
}

export const storeInfoUtils = {
  // 获取当前店铺ID
  getShopId(): number {
    try {
      // 1. 首先尝试从shopInfo中获取店铺ID
      const shopInfoStr = localStorage.getItem('shopInfo')
      if (shopInfoStr) {
        const shopInfo = JSON.parse(shopInfoStr)
        if (shopInfo && shopInfo.id) {
          return shopInfo.id
        }
      }

      // 2. 如果没有店铺ID，尝试从用户信息中获取
      const userInfoStr = localStorage.getItem('user')
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        if (userInfo && (userInfo.shopId || userInfo.id)) {
          return userInfo.shopId || userInfo.id || 0
        }
      }

      return 0
    } catch (error) {
      console.error('获取店铺ID失败:', error)
      return 0
    }
  },

  // 获取当前店铺完整信息
  getShopInfo(): ShopInfo | null {
    try {
      const shopInfoStr = localStorage.getItem('shopInfo')
      if (shopInfoStr) {
        return JSON.parse(shopInfoStr)
      }
      return null
    } catch (error) {
      console.error('获取店铺信息失败:', error)
      return null
    }
  },

  // 获取当前店铺操作员列表
  getStaffList(): StaffInfo[] {
    try {
      const shopInfo = this.getShopInfo()
      if (shopInfo && shopInfo.users && Array.isArray(shopInfo.users)) {
        return shopInfo.users.map(user => ({
          id: user.id?.toString() || '',
          name: user.name || '',
          position: user.position || (user.manager ? '店长' : '店员'),
          phone: user.phone || '',
          manager: !!user.manager
        }))
      }
      return []
    } catch (error) {
      console.error('获取操作员列表失败:', error)
      return []
    }
  },

  // 获取当前操作员信息
  getCurrentOperator(): StaffInfo | null {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return {
          id: user.id,
          name: user.name || user.username || '',
          position: user.position || '',
          phone: user.phone || '',
          manager: !!user.manager
        }
      }
      return null
    } catch (error) {
      console.error('获取操作员信息失败:', error)
      return null
    }
  },

  // 获取操作员名称
  getOperatorName(): string {
    const operator = this.getCurrentOperator()
    return operator?.name || ''
  },

  // 获取操作员ID
  getOperatorId(): string | number {
    const operator = this.getCurrentOperator()
    return operator?.id || 0
  }
}
