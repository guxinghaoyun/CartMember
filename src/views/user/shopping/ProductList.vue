<template>
  <div class="h-[calc(100vh-64px)] pr-4 overflow-y-auto space-y-6">
    <!-- 顶部信息栏 -->
    <div class="bg-white rounded-lg p-3 shadow-sm">
      <div class="flex items-center justify-between mb-6 bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white relative overflow-hidden">
        <!-- 装饰背景 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div class="flex items-center space-x-8 relative">
          <div>
            <h2 class="text-2xl font-medium mb-3">商品列表</h2>
            <div class="flex items-center space-x-4">
              <div class="flex items-center bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <font-awesome-icon icon="user" class="text-white mr-2" />
                <span class="text-sm">当前会员：{{ currentMember?.name || '未选择' }}</span>
              </div>
              <button class="!rounded-button bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 text-sm backdrop-blur-sm transition-all duration-300"
                      @click="handleReadCard">
                <font-awesome-icon icon="id-card" class="mr-2" />
                读取会员卡
              </button>
            </div>
          </div>
          <div class="h-12 w-px bg-white bg-opacity-20"></div>
          <div class="flex items-center space-x-6">
            <div class="bg-white bg-opacity-10 backdrop-blur-sm px-6 py-3 rounded-lg group hover:bg-opacity-20 transition-all duration-300">
              <div class="text-xs text-white text-opacity-80 mb-1">购物车商品</div>
              <div class="flex items-center">
                <font-awesome-icon icon="shopping-cart" class="text-white mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span class="text-xl font-medium">{{ cartItemCount }}</span>
                <span class="text-sm ml-1">件</span>
              </div>
            </div>
            <div class="bg-white bg-opacity-10 backdrop-blur-sm px-6 py-3 rounded-lg group hover:bg-opacity-20 transition-all duration-300">
              <div class="text-xs text-white text-opacity-80 mb-1">商品总额</div>
              <div class="flex items-center">
                <font-awesome-icon icon="coins" class="text-yellow-300 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span class="text-xl font-medium">{{ totalAmount }}</span>
                <span class="text-sm ml-1">积分</span>
              </div>
            </div>
            <div class="bg-white bg-opacity-10 backdrop-blur-sm px-6 py-3 rounded-lg group hover:bg-opacity-20 transition-all duration-300">
              <div class="text-xs text-white text-opacity-80 mb-1">预计积分</div>
              <div class="flex items-center">
                <font-awesome-icon icon="star" class="text-yellow-300 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span class="text-xl font-medium">{{ expectedPoints }}</span>
                <span class="text-sm ml-1">积分</span>
              </div>
            </div>
          </div>
        </div>
        <button class="!rounded-button bg-white text-blue-600 px-8 py-3 hover:bg-opacity-90 font-medium relative overflow-hidden group"
                @click="handleCheckout"
                :disabled="cartItemCount === 0"
                :class="{'opacity-50 cursor-not-allowed': cartItemCount === 0}">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-100 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div class="relative flex items-center">
            去结算
            <font-awesome-icon icon="arrow-right" class="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </button>
      </div>

      <!-- 商品分类 -->
      <div class="flex items-center space-x-3 mb-6 bg-gray-50 p-4 rounded-xl">
        <button v-for="cat in categories" :key="cat.id"
                :class="{'bg-blue-500 text-white shadow-lg scale-105': currentCategory === cat.id,
                        'bg-white text-gray-600 hover:bg-blue-50': currentCategory !== cat.id}"
                class="!rounded-button px-5 py-2.5 transition-all duration-300 text-sm font-medium"
                @click="currentCategory = cat.id">
          {{ cat.name }}
        </button>
      </div>

      <!-- 商品列表 -->
      <div class="grid grid-cols-5 gap-3">
        <div v-for="product in filteredProducts" :key="product.id"
             class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="relative pb-[80%]">
            <img :src="product.image" 
                 :alt="product.name"
                 class="absolute inset-0 w-full h-full object-cover"/>
          </div>
          <div class="p-2">
            <h3 class="font-medium text-xs mb-1 truncate">{{ product.name }}</h3>
            <div class="text-red-500 text-xs mb-1">{{ product.price }} 积分</div>
            <button class="!rounded-button w-full bg-blue-500 text-white py-1 text-xs hover:bg-blue-600"
                    @click="addToCart(product)">
              加入购物车
            </button>
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

const expectedPoints = computed(() => {
  return cartStore.expectedPoints
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
  
  // 计算新的总额和预期积分
  const newTotalAmount = cartItems.value.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity)
  }, 0)
  
  const newExpectedPoints = Math.floor(newTotalAmount * 0.1)
  
  // 同步到 store
  cartStore.updateCart({
    items: cartItems.value,
    member: currentMember.value,
    totalAmount: newTotalAmount,
    expectedPoints: newExpectedPoints
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
  
  // 计算最新的总额和预期积分
  const newTotalAmount = cartItems.value.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity)
  }, 0)
  
  const newExpectedPoints = Math.floor(newTotalAmount * 0.1)
  
  // 确保更新购物车 store 时包含完整的商品信息
  cartStore.updateCart({
    items: cartItems.value,
    member: currentMember.value,
    totalAmount: newTotalAmount,
    expectedPoints: newExpectedPoints
  })
  
  // 跳转到购物车页面
  router.push('/user/cart')
}
</script> 