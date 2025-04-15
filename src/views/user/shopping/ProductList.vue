<template>
  <div class="h-[calc(100vh-64px-32px)] pr-4 overflow-y-auto space-y-6">
    <!-- 顶部信息栏 -->
    <div class="bg-white rounded-2xl p-3 shadow-sm">
      <!-- 顶部统计卡片 -->
      <div
        class="flex items-center justify-between mb-6 bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white relative overflow-hidden"
      >
        <!-- 装饰背景 -->
        <div
          class="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"
        ></div>

        <div class="flex items-center space-x-12 relative">
          <div>
            <h2 class="text-3xl font-bold mb-4">商品列表</h2>
          </div>
          <div class="h-16 w-px bg-white/20"></div>
          <div class="flex items-center space-x-6">
            <div
              class="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl group hover:bg-white/15 transition-all duration-300 cursor-pointer"
            >
              <div class="text-xs text-white/60 mb-2">购物车商品</div>
              <div class="flex items-center">
                <font-awesome-icon
                  icon="shopping-cart"
                  class="text-white/90 mr-3 text-xl group-hover:scale-110 transition-transform duration-300"
                />
                <span class="text-2xl font-bold">{{ cartItemCount }}</span>
                <span class="text-sm ml-1 text-white/80">件</span>
              </div>
            </div>
            <div
              class="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl group hover:bg-white/15 transition-all duration-300 cursor-pointer"
            >
              <div class="text-xs text-white/60 mb-2">商品总额</div>
              <div class="flex items-center">
                <font-awesome-icon
                  icon="coins"
                  class="text-yellow-300 mr-3 text-xl group-hover:scale-110 transition-transform duration-300"
                />
                <span class="text-2xl font-bold">{{ totalAmount }}</span>
                <span class="text-sm ml-1 text-white/80">积分</span>
              </div>
            </div>
          </div>
        </div>
        <button
          class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 font-bold relative overflow-hidden group flex items-center space-x-3 shadow-lg shadow-yellow-500/20 scale-105"
          @click="handleCheckout"
          :disabled="cartItemCount === 0"
          :class="{
            'opacity-50 cursor-not-allowed from-gray-400 to-gray-500 shadow-none scale-100':
              cartItemCount === 0
          }"
        >
          <font-awesome-icon icon="shopping-cart" class="text-xl" />
          <span>去结算</span>
          <font-awesome-icon
            icon="arrow-right"
            class="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>

      <!-- 商品分类 -->
      <div class="flex items-center space-x-3 mb-8 bg-gray-50/50 p-4 rounded-xl">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="{
            'bg-blue-500 text-white shadow-lg scale-105': currentCategory === cat.id,
            'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-500':
              currentCategory !== cat.id
          }"
          class="px-6 py-3 rounded-xl transition-all duration-300 font-medium flex items-center space-x-2"
          @click="currentCategory = cat.id"
        >
          <font-awesome-icon :icon="getCategoryIcon(cat.id)" />
          <span>{{ cat.name }}</span>
        </button>
      </div>

      <!-- 商品列表 -->
      <div class="grid grid-cols-5 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
        >
          <div class="relative pb-[100%] overflow-hidden">
            <!-- 使用ProductImage组件显示商品图片 -->
            <div class="absolute inset-0 w-full h-full">
              <ProductImage
                :productId="product.id"
                :imageUuid="product.image"
                :alt="product.name"
                imageClass="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <div class="text-white font-medium mb-2">{{ product.name }}</div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-1">
                    <font-awesome-icon icon="coins" class="text-yellow-300" />
                    <span class="text-yellow-300 font-bold">{{ product.price }}</span>
                    <span class="text-white/80 text-sm">积分</span>
                  </div>
                  <button
                    class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm transition-colors duration-300"
                    @click="addToCart(product)"
                  >
                    {{ getAddToCartButtonText(product) }}
                  </button>
                </div>
                <div class="mt-2 text-sm text-white/80">
                  <span class="mr-2">库存: {{ product.stock }}{{ product.unit }}</span>
                  <span>销量: {{ product.sales }}{{ product.unit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/types/api/user/cart'
import { shoppingApi } from '@/api/user/shopping'
import type { Product } from '@/types/api/user/shopping'
import type { CartState, CartStoreItem } from '@/types/api/user/cart'
import ProductImage from '@/components/common/ProductImage.vue'

const router = useRouter()
const cartStore = useCartStore()

// 会员信息
const currentMember = ref<{ name: string; points: number } | null>(null)

// 商品分类
const categories = [
  { id: '', name: '全部分类' },
  { id: 'digital', name: '数码产品' },
  { id: 'office', name: '办公用品' },
  { id: 'life', name: '生活用品' },
  { id: 'gift', name: '礼品卡券' }
]

const currentCategory = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 商品数据
const products = ref<Product[]>([])

// 获取商品列表
const fetchProducts = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      category: currentCategory.value || undefined
    }
    console.log('发送商品查询参数:', params)
    const response = await shoppingApi.getProducts(params)
    console.log('获取商品响应:', response)

    // 确保返回的数据有效
    if (!response || !response.data || !response.data.records) {
      console.error('商品数据格式不符合预期:', response)
      products.value = []
      total.value = 0
      return
    }

    products.value = response.data.records
    total.value = response.data.totalRecords

    // 调试输出
    console.log('商品列表数据:', products.value)
    console.log('过滤后的商品:', filteredProducts.value)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    ElMessage.error('获取商品列表失败')
    products.value = []
  } finally {
    loading.value = false
  }
}

// 监听分类变化
watch(currentCategory, () => {
  currentPage.value = 1
  fetchProducts()
})

// 购物车数据
const cartItems = ref<CartStoreItem[]>([])

// 计算属性
const filteredProducts = computed(() => {
  if (!currentCategory.value) return products.value
  return products.value.filter(p => p.category === currentCategory.value)
})

const cartItemCount = computed(() => {
  return cartStore.cartItemCount
})

const totalAmount = computed(() => {
  return cartStore.totalAmount
})

// 方法
const addToCart = (product: Product) => {
  // 移除会员检查逻辑
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({
      id: product.id,
      quantity: 1,
      product: product
    })
  }

  // 计算新的总额
  const newTotalAmount = cartItems.value.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)

  // 同步到 store，包含 operators 字段
  cartStore.updateCart({
    items: cartItems.value,
    member: null, // 会员置为null
    totalAmount: newTotalAmount,
    expectedPoints: Math.floor(newTotalAmount * 0.1),
    operators: cartStore.operators
  })

  ElMessage.success('已添加到购物车')
}

// 初始化时从 store 加载购物车数据
const initCart = () => {
  if (cartStore.items.length > 0) {
    cartItems.value = cartStore.items
    // 移除会员信息的加载
  }
}

// 在组件挂载时初始化
onMounted(() => {
  initCart()
  fetchProducts()
})

const handleCheckout = () => {
  // 移除会员检查
  // 计算最新的总额
  const newTotalAmount = cartItems.value.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)

  // 确保更新购物车 store 时包含完整的商品信息和 operators 字段
  cartStore.updateCart({
    items: cartItems.value,
    member: null, // 会员置为null
    totalAmount: newTotalAmount,
    expectedPoints: Math.floor(newTotalAmount * 0.1),
    operators: cartStore.operators
  })

  // 跳转到购物车页面
  router.push('/user/cart')
}

// 获取分类图标
const getCategoryIcon = (categoryId: string) => {
  const icons: Record<string, string> = {
    '': 'list',
    digital: 'box',
    office: 'folder-open',
    life: 'shopping-bag',
    gift: 'tag'
  }
  return icons[categoryId] || 'list'
}

// 获取添加到购物车按钮文本
const getAddToCartButtonText = (product: Product) => {
  if (product.status === '下架') return '已下架'
  if (product.status === '缺货' || product.stock <= 0) return '缺货'
  return '加入购物车'
}
</script>
