<template>
  <div class="h-[calc(100vh-64px)] pr-4 overflow-y-auto space-y-6">
    <!-- 顶部信息栏 -->
    <div class="bg-white rounded-2xl p-3 shadow-sm">
      <!-- 顶部统计卡片 -->
      <div class="flex items-center justify-between mb-6 bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white relative overflow-hidden">
        <!-- 装饰背景 -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        
        <div class="flex items-center space-x-12 relative">
          <div>
            <h2 class="text-3xl font-bold mb-4">商品列表</h2>
            <div class="flex items-center space-x-4">
              <div class="flex items-center bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                <font-awesome-icon icon="user" class="text-white/80 mr-3 text-xl" />
                <div>
                  <div class="text-xs text-white/60 mb-1">当前会员</div>
                  <div class="font-medium">{{ currentMember?.name || '未选择' }}</div>
                </div>
              </div>
              <button class="bg-white/15 hover:bg-white/25 px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 flex items-center space-x-2"
                      @click="handleReadCard">
                <font-awesome-icon icon="id-card" class="text-xl" />
                <span>读取会员卡</span>
              </button>
            </div>
          </div>
          <div class="h-16 w-px bg-white/20"></div>
          <div class="flex items-center space-x-6">
            <div class="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl group hover:bg-white/15 transition-all duration-300 cursor-pointer">
              <div class="text-xs text-white/60 mb-2">购物车商品</div>
              <div class="flex items-center">
                <font-awesome-icon icon="shopping-cart" class="text-white/90 mr-3 text-xl group-hover:scale-110 transition-transform duration-300" />
                <span class="text-2xl font-bold">{{ cartItemCount }}</span>
                <span class="text-sm ml-1 text-white/80">件</span>
              </div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl group hover:bg-white/15 transition-all duration-300 cursor-pointer">
              <div class="text-xs text-white/60 mb-2">商品总额</div>
              <div class="flex items-center">
                <font-awesome-icon icon="coins" class="text-yellow-300 mr-3 text-xl group-hover:scale-110 transition-transform duration-300" />
                <span class="text-2xl font-bold">{{ totalAmount }}</span>
                <span class="text-sm ml-1 text-white/80">积分</span>
              </div>
            </div>
          </div>
        </div>
        <button class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 font-bold relative overflow-hidden group flex items-center space-x-3 shadow-lg shadow-yellow-500/20 scale-105"
                @click="handleCheckout"
                :disabled="cartItemCount === 0"
                :class="{'opacity-50 cursor-not-allowed from-gray-400 to-gray-500 shadow-none scale-100': cartItemCount === 0}">
          <font-awesome-icon icon="shopping-cart" class="text-xl" />
          <span>去结算</span>
          <font-awesome-icon icon="arrow-right" class="group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      <!-- 商品分类 -->
      <div class="flex items-center space-x-3 mb-8 bg-gray-50/50 p-4 rounded-xl">
        <button v-for="cat in categories" :key="cat.id"
                :class="{'bg-blue-500 text-white shadow-lg scale-105': currentCategory === cat.id,
                        'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-500': currentCategory !== cat.id}"
                class="px-6 py-3 rounded-xl transition-all duration-300 font-medium flex items-center space-x-2"
                @click="currentCategory = cat.id">
          <font-awesome-icon :icon="getCategoryIcon(cat.id)" />
          <span>{{ cat.name }}</span>
        </button>
      </div>

      <!-- 商品列表 -->
      <div class="grid grid-cols-5 gap-6">
        <div v-for="product in filteredProducts" :key="product.id"
             class="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
          <div class="relative pb-[100%] overflow-hidden">
            <img :src="product.image" 
                 :alt="product.name"
                 class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <div class="text-white font-medium mb-2">{{ product.name }}</div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-1">
                    <font-awesome-icon icon="coins" class="text-yellow-300" />
                    <span class="text-yellow-300 font-bold">{{ product.price }}</span>
                    <span class="text-white/80 text-sm">积分</span>
                  </div>
                  <button class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm transition-colors duration-300"
                          @click="addToCart(product)">
                    加入购物车
                  </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

// 会员信息
const currentMember = ref<{ name: string; points: number } | null>(null)

// 商品分类
const categories = [
  { id: 'all', name: '全部商品' },
  { id: 'food', name: '食品饮料' },
  { id: 'daily', name: '日用百货' },
  { id: 'fresh', name: '生鲜水果' },
  { id: 'snacks', name: '休闲零食' },
  { id: 'drinks', name: '酒水饮料' }
]

const currentCategory = ref('all')

// 商品数据
const products = ref([
  {
    id: 1,
    name: '有机草莓 500g',
    price: 399,
    category: 'fresh',
    image: 'https://ai-public.mastergo.com/ai/img_res/86f839615a018f782144b9ec9be235d4.jpg'
  },
  {
    id: 2,
    name: '进口纯牛奶 1L',
    price: 680,
    category: 'food',
    image: 'https://ai-public.mastergo.com/ai/img_res/e4283893b198106bcb77f4a097397da1.jpg'
  },
  {
    id: 3,
    name: '日式牛奶面包',
    price: 128,
    category: 'food',
    image: 'https://ai-public.mastergo.com/ai/img_res/e9a1e0da333cfaae1d427e157bad44d1.jpg'
  },
  {
    id: 4,
    name: '原味薯片 150g',
    price: 99,
    category: 'snacks',
    image: 'https://ai-public.mastergo.com/ai/img_res/41371490288d2e4baab373dd26090f53.jpg'
  },
  {
    id: 5,
    name: '柠檬气泡水 330ml',
    price: 69,
    category: 'drinks',
    image: 'https://ai-public.mastergo.com/ai/img_res/6727655713b31701481ece9fc2828521.jpg'
  },
  {
    id: 6,
    name: '蓝莓酸奶 250g',
    price: 158,
    category: 'food',
    image: 'https://ai-public.mastergo.com/ai/img_res/f31932d1bd3fe0a4e3fd760b55213f51.jpg'
  },
  {
    id: 7,
    name: '红茶饼干 200g',
    price: 225,
    category: 'snacks',
    image: 'https://ai-public.mastergo.com/ai/img_res/24d589eb6845ec569d1d4eea5a53deed.jpg'
  },
  {
    id: 8,
    name: '巧克力威化 160g',
    price: 168,
    category: 'snacks',
    image: 'https://ai-public.mastergo.com/ai/img_res/d500d8c6ee25cb453766d6bd9dfa7102.jpg'
  }
])

// 购物车数据
const cartItems = ref<Array<{ id: number; quantity: number; product: any }>>([])

// 计算属性
const filteredProducts = computed(() => {
  if (currentCategory.value === 'all') return products.value
  return products.value.filter(p => p.category === currentCategory.value)
})

const cartItemCount = computed(() => {
  return cartStore.cartItemCount
})

const totalAmount = computed(() => {
  return cartStore.totalAmount
})

// 方法
const handleReadCard = () => {
  // 模拟读取会员卡
  currentMember.value = {
    name: '陈思悦',
    points: 3560
  }
  cartStore.updateCart({
    ...cartStore.$state,
    member: currentMember.value
  })
  ElMessage.success('会员卡读取成功')
}

const addToCart = (product: any) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({
      id: product.id,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image
      }
    })
  }
  
  // 计算新的总额
  const newTotalAmount = cartItems.value.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity)
  }, 0)
  
  // 同步到 store，保持 expectedPoints 的计算
  cartStore.updateCart({
    items: cartItems.value,
    member: currentMember.value,
    totalAmount: newTotalAmount,
    expectedPoints: Math.floor(newTotalAmount * 0.1)
  })
  
  ElMessage.success('已添加到购物车')
}

// 初始化时从 store 加载购物车数据
const initCart = () => {
  if (cartStore.items.length > 0) {
    cartItems.value = cartStore.items
    currentMember.value = cartStore.member
  }
}

// 在组件挂载时初始化
onMounted(() => {
  initCart()
})

const handleCheckout = () => {
  if (!currentMember.value) {
    ElMessage.warning('请先读取会员卡')
    return
  }
  
  // 计算最新的总额
  const newTotalAmount = cartItems.value.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity)
  }, 0)
  
  // 确保更新购物车 store 时包含完整的商品信息
  cartStore.updateCart({
    items: cartItems.value,
    member: currentMember.value,
    totalAmount: newTotalAmount,
    expectedPoints: Math.floor(newTotalAmount * 0.1)
  })
  
  // 跳转到购物车页面
  router.push('/user/cart')
}

// 获取分类图标
const getCategoryIcon = (categoryId: string) => {
  const icons: Record<string, string> = {
    'all': 'th-large',
    'food': 'utensils',
    'daily': 'home',
    'fresh': 'apple-alt',
    'snacks': 'cookie',
    'drinks': 'glass-martini'
  }
  return icons[categoryId] || 'th-large'
}
</script> 