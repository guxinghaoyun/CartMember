import { defineStore } from 'pinia'
import type { Product } from './shopping'
import { memberApi } from '@/api/user/member'
import { shoppingApi } from '@/api/user/shopping'
import type { ApiResponse } from '@/types/api/common'
import type { Member as MemberType } from '@/types/api/user/member'
import type { Operator } from '@/types/api/user/operator'
import { ElMessage } from 'element-plus'
import { ref, computed } from 'vue'
import { storeInfoUtils } from '@/utils/storeInfo'

// 从shopping.ts导入结账接口类型
import type { PurchaseProductsRequest, PurchaseProductItem } from '@/api/user/shopping'

export interface CartStoreItem {
  id: number
  quantity: number
  product: Product
}

export interface Member {
  name: string
  points: number
  id?: number
  icNumber?: string
  icStatus?: string
}

export interface CartState {
  items: CartStoreItem[]
  member: Member | null
  totalAmount: number
  expectedPoints: number
  operators: Operator[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    member: null,
    totalAmount: 0,
    expectedPoints: 0,
    operators: []
  }),

  actions: {
    updateCart(cart: CartState) {
      this.items = [...cart.items]
      this.member = cart.member ? { ...cart.member } : null
      this.totalAmount = cart.totalAmount
      this.expectedPoints = cart.expectedPoints
    },

    addItem(item: CartStoreItem) {
      const existingItem = this.items.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        this.items.push({ ...item })
      }
      this.recalculateAmounts()
    },

    removeItem(itemId: number) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.recalculateAmounts()
    },

    updateItemQuantity(itemId: number, quantity: number) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        item.quantity = quantity
        this.recalculateAmounts()
      }
    },

    recalculateAmounts() {
      this.totalAmount = this.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
      }, 0)
      this.expectedPoints = Math.floor(this.totalAmount * 0.1)
    },

    clearCart() {
      this.items = []
      this.member = null
      this.totalAmount = 0
      this.expectedPoints = 0
    },

    // 更新 fetchMemberByInterICNumber 方法
    async fetchMemberByInterICNumber(interICNumber: string) {
      console.log('fetchMemberByInterICNumber', interICNumber)
      try {
        const result = await memberApi.getMemberByInterICNumber(interICNumber)
        console.log('获取会员信息结果:', result)
        if (result.code === 200 && result.data) {
          // 将返回的数据转换为符合Member接口的数据
          this.member = {
            id: result.data.id,
            name: result.data.name,
            points: result.data.remainingPoints,
            icNumber: result.data.icNumber,
            icStatus: result.data.icStatus
          }
          this.calculateMemberDiscount()
          return true
        } else {
          ElMessage.error(result.message || '未找到会员信息')
          return false
        }
      } catch (error) {
        console.error('获取会员信息失败:', error)
        ElMessage.error('获取会员信息失败')
        return false
      }
    },

    // 为了兼容旧代码，添加fetchMemberById方法
    async fetchMemberById(cardNumber: string) {
      try {
        // 此方法与fetchMemberByInterICNumber相同，只是为了兼容旧代码
        const result = await memberApi.getMemberByInterICNumber(cardNumber)
        if (result.code === 200 && result.data) {
          // 将返回的数据转换为符合Member接口的数据
          this.member = {
            id: result.data.id,
            name: result.data.name,
            points: result.data.remainingPoints,
            icNumber: result.data.icNumber,
            icStatus: result.data.icStatus
          }
          this.calculateMemberDiscount()

          // 返回原始数据以兼容旧代码
          const memberData = { ...result.data }
          // 确保返回的对象与旧代码期望的格式相同
          return memberData
        } else {
          ElMessage.error(result.message || '未找到会员信息')
          return null
        }
      } catch (error) {
        console.error('获取会员信息失败:', error)
        ElMessage.error('获取会员信息失败')
        return null
      }
    },

    // 计算会员折扣
    calculateMemberDiscount() {
      // 此处可以根据会员信息计算折扣
      // 暂无具体实现
    },

    // 新增的方法，用于获取操作员列表
    async fetchOperators(): Promise<Operator[]> {
      try {
        // 使用storeInfoUtils获取操作员列表
        const staffList = storeInfoUtils.getStaffList()

        if (!staffList || staffList.length === 0) {
          console.error('No operators found')
          return []
        }

        // 将用户数据转换为操作员数据格式
        this.operators = staffList.map(staff => ({
          id: Number(staff.id) || 0,
          name: staff.name || '',
          role: staff.position || (staff.manager ? '店长' : '店员')
        }))

        return this.operators
      } catch (error) {
        console.error('Failed to fetch operators:', error)
        return []
      }
    },

    // 修改结账流程方法，对接API
    async processCheckout(operatorId: string, discount: number, notes: string): Promise<boolean> {
      if (!this.member || !this.member.id) {
        console.error('Checkout failed: No member selected')
        return false
      }

      try {
        console.log('会员信息:', JSON.stringify(this.member, null, 2))
        console.log('购物车商品:', this.items.length, '件')

        // 构造请求参数，严格按照API文档要求的格式
        const requestData = {
          membershipId: this.member.id,
          note: notes || '',
          discount: discount || 0,
          operationUser: operatorId,
          products: this.items.map(item => ({
            productId: item.product.id,
            currentQuantity: item.quantity
          }))
        }

        console.log('提交的结账数据:', JSON.stringify(requestData, null, 2))

        try {
          // 调用购买商品API
          const response = await shoppingApi.purchaseProducts(requestData as any)
          // 简化逻辑：只根据HTTP状态码判断成功
          // HTTP状态码200表示请求成功，无论响应内容如何
          this.clearCart()
          return true
        } catch (apiError) {
          console.error('API调用异常:', apiError)
          ElMessage.error(apiError instanceof Error ? apiError.message : '支付API调用失败')
          return false
        }
      } catch (error) {
        console.error('Checkout failed:', error)
        ElMessage.error(error instanceof Error ? error.message : '支付失败，请重试')
        return false
      }
    },

    // 当客户更换时重置状态
    async changeMember(cardNumber: string) {
      try {
        // 通过API获取会员信息
        const response = await memberApi.getMemberByInterICNumber(cardNumber)

        if (response.code === 200 && response.data) {
          const memberData = response.data

          // 将会员信息保存到state中
          this.member = {
            id: memberData.id,
            name: memberData.name,
            points: memberData.remainingPoints,
            icNumber: memberData.icNumber,
            icStatus: memberData.icStatus
          }

          // 计算会员折扣
          this.calculateMemberDiscount()

          // 返回会员数据以便调用者使用
          return memberData
        } else {
          ElMessage.error(response.message || '未找到会员信息')
          return null
        }
      } catch (error) {
        console.error('获取会员信息失败:', error)
        ElMessage.error('获取会员信息失败')
        return null
      }
    },

    // 结账前准备数据
    async prepareCheckoutData() {
      // 使用storeInfoUtils获取店铺信息
      const shopInfo = storeInfoUtils.getShopInfo()
      const shopId = storeInfoUtils.getShopId()

      if (!shopId) {
        console.error('未找到店铺信息')
        ElMessage.error('未找到店铺信息，无法结账')
        return null
      }
    }
  },

  getters: {
    cartItemCount: state => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    }
  }
})
