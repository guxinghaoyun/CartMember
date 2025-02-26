import { defineStore } from 'pinia'

interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
}

interface CartItem {
  id: number
  quantity: number
  product: Product
}

interface Member {
  name: string
  points: number
}

interface CartState {
  items: CartItem[]
  member: Member | null
  totalAmount: number
  expectedPoints: number
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    member: null,
    totalAmount: 0,
    expectedPoints: 0
  }),

  actions: {
    updateCart(cart: CartState) {
      this.items = [...cart.items]
      this.member = cart.member ? { ...cart.member } : null
      this.totalAmount = cart.totalAmount
      this.expectedPoints = cart.expectedPoints
    },

    addItem(item: CartItem) {
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
    }
  },

  getters: {
    cartItemCount: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    }
  }
}) 