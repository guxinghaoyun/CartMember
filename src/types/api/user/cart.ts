import { defineStore } from 'pinia'
import type { Product } from './shopping'
import { memberApi } from '@/api/user/member'
import { operatorApi } from '@/api/user/operator'
import type { ApiResponse } from '@/types/api/common'
import type { Member as MemberType } from '@/types/api/user/member'
import type { Operator } from '@/types/api/user/operator'

export interface CartStoreItem {
  id: number
  quantity: number
  product: Product
}

export interface Member {
  name: string
  points: number
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
        return sum + (item.product.price * item.quantity)
      }, 0)
      this.expectedPoints = Math.floor(this.totalAmount * 0.1)
    },

    clearCart() {
      this.items = []
      this.member = null
      this.totalAmount = 0
      this.expectedPoints = 0
    },

    // 新增的方法，用于获取会员信息
    async fetchMemberById(id: number): Promise<MemberType | null> {
      try {
        const response = await memberApi.getMemberById(id)
        const memberData = response.data.data
        
        // 更新购物车中的会员信息
        this.member = {
          name: memberData.name,
          points: memberData.remainingPoints
        }
        
        return memberData
      } catch (error) {
        console.error('Failed to fetch member:', error)
        return null
      }
    },

    // 新增的方法，用于获取操作员列表
    async fetchOperators(): Promise<Operator[]> {
      try {
        const response = await operatorApi.getCurrentStoreOperators()
        this.operators = response.data.data
        return this.operators
      } catch (error) {
        console.error('Failed to fetch operators:', error)
        return []
      }
    },

    // 新增的方法，用于处理结账流程
    async processCheckout(): Promise<boolean> {
      // 这里可以调用支付API或执行其他结账逻辑
      // 这只是一个示例实现
      try {
        // 模拟API调用
        // const response = await paymentApi.processPayment({
        //   memberId: this.member?.id,
        //   amount: this.totalAmount,
        //   items: this.items
        // })
        
        // 清空购物车
        this.clearCart()
        return true
      } catch (error) {
        console.error('Checkout failed:', error)
        return false
      }
    }
  },

  getters: {
    cartItemCount: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    }
  }
}) 