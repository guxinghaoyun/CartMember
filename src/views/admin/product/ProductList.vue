<template>
  <div class="space-y-8 p-6 bg-gray-50 min-h-screen">
    <!-- 商品统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-blue-100 text-sm font-medium">商品总数</p>
            <p class="text-4xl font-bold mt-3">{{ allProducts.length }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
            <font-awesome-icon icon="boxes" class="text-2xl" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-green-100 text-sm font-medium">累计兑换</p>
            <p class="text-4xl font-bold mt-3">{{ totalExchanges.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-green-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
            <font-awesome-icon icon="exchange-alt" class="text-2xl" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-purple-100 text-sm font-medium">库存告警</p>
            <p class="text-4xl font-bold mt-3">{{ lowStockCount }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
            <font-awesome-icon icon="exclamation-triangle" class="text-2xl" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-orange-100 text-sm font-medium">本月新增</p>
            <p class="text-4xl font-bold mt-3">{{ newProductsThisMonth }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-orange-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
            <font-awesome-icon icon="chart-line" class="text-2xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- 商品管理工具栏 -->
    <div class="bg-white rounded-2xl shadow-sm p-4">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-3">
          <font-awesome-icon icon="box-open" class="text-blue-600" />
          商品管理
        </h2>
        <div class="flex flex-wrap items-center gap-4">
          <div class="relative">
            <select
              v-model="selectedStore"
              class="appearance-none w-48 rounded-xl border-2 border-gray-200 px-4 py-2.5 pr-10 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">全部店铺</option>
              <option v-for="store in stores" :key="store.id" :value="store.id">
                {{ store.name }}
              </option>
            </select>
            <font-awesome-icon icon="chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          
          <div class="relative">
            <select
              v-model="selectedCategory"
              class="appearance-none w-48 rounded-xl border-2 border-gray-200 px-4 py-2.5 pr-10 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
              <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <font-awesome-icon icon="chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          
          <button
            class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 flex items-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md"
            @click="showAddProduct = true"
          >
            <font-awesome-icon icon="plus" />
            <span>添加商品</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
      >
        <div class="relative">
          <img :src="product.image" class="w-full h-40 object-cover" alt="商品图片">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        </div>
        <div class="p-3 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-bold text-gray-800 text-base line-clamp-1 flex-1">{{ product.name }}</h3>
            <div class="flex gap-1">
              <button
                class="rounded-lg p-1 text-blue-600 hover:bg-blue-50 transition-colors"
                @click="handleEdit(product)"
                title="编辑商品"
              >
                <font-awesome-icon icon="edit" class="text-sm" />
              </button>
              <button
                class="rounded-lg p-1 text-red-600 hover:bg-red-50 transition-colors"
                @click="handleDelete(product)"
                title="删除商品"
              >
                <font-awesome-icon icon="trash" class="text-sm" />
              </button>
            </div>
          </div>
          <p class="text-gray-600 text-xs line-clamp-2">{{ product.description }}</p>
          <div class="flex items-center justify-between">
            <p class="text-red-600 font-bold text-base">{{ product.price.toLocaleString() }} 积分</p>
            <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              库存: {{ product.quantity }}
            </span>
          </div>
          <div class="flex items-center gap-1 flex-wrap">
            <span class="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
              {{ categoryOptions.find(c => c.value === product.category)?.label }}
            </span>
            <span class="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full font-medium">
              {{ getStoreName(product.storeIds) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑商品弹窗 -->
    <product-form
      v-if="showAddProduct"
      v-model:show="showAddProduct"
      :edit-mode="!!editingProduct"
      :product-data="editingProduct"
      :stores="stores"
      :category-options="categoryOptions"
      @submit="handleProductSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import ProductForm, { type ProductForm as IProductForm } from './components/ProductForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义类型
interface Product extends IProductForm {
  id: number
  image: string
  storeIds: number[]
  category: string
  quantity: number
  description: string
}

// 商品分类选项
const categoryOptions = [
  { label: '全部分类', value: '' },
  { label: '数码产品', value: 'digital' },
  { label: '办公用品', value: 'office' },
  { label: '生活用品', value: 'life' },
  { label: '礼品卡券', value: 'gift' }
]

// 商品统计卡片组件
const ProductStatCard = defineComponent({
  name: 'ProductStatCard',
  props: {
    title: { type: String, required: true },
    value: { type: [String, Number], required: true },
    icon: { type: String, required: true },
    color: { type: String as PropType<'blue' | 'green' | 'purple' | 'orange'>, required: true },
    trend: { type: Number, default: undefined }
  },
  template: `
    <div :class="[\`bg-gradient-to-br from-\${color}-500 to-\${color}-600\`]" class="rounded-xl p-6 text-white">
      <div class="flex justify-between items-start mb-4">
        <div>
          <p :class="[\`text-\${color}-100 text-sm\`]">{{ title }}</p>
          <p class="text-3xl font-semibold mt-2">{{ value }}</p>
        </div>
        <div :class="[\`w-10 h-10 rounded-lg bg-\${color}-400 bg-opacity-30 flex items-center justify-center\`]">
          <i :class="[icon, 'text-2xl']"></i>
        </div>
      </div>
      <div v-if="trend" class="flex items-center text-sm" :class="[\`text-\${color}-100\`]">
        <i :class="[trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down', 'fas mr-1']"></i>
        <span>较上月{{ trend > 0 ? '增长' : '下降' }} {{ Math.abs(trend) }}%</span>
      </div>
    </div>
  `
})

// 状态
const selectedStore = ref('')
const selectedCategory = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(8)
const showAddProduct = ref(false)
const editingProduct = ref<Product | null>(null)

// 视图模式
const viewMode = ref<'card' | 'list'>('card')

// 店铺数据
const stores = ref([
  { id: 1, name: '北京朝阳店' },
  { id: 2, name: '上海浦东店' },
  { id: 3, name: '广州天河店' }
])

// 商品数据
const allProducts = ref<Product[]>([
  {
    id: 1,
    name: '高级商务笔记本',
    storeIds: [1],
    price: 2990,
    quantity: 50,
    category: 'office',
    description: '高品质真皮材质，经典商务设计',
    image: 'https://ai-public.mastergo.com/ai/img_res/1992822aad5de0f09cd910a5041a3574.jpg'
  },
  {
    id: 2,
    name: '智能手表',
    storeIds: [1],
    price: 12990,
    quantity: 30,
    category: 'digital',
    description: '多功能智能手表，支持心率监测',
    image: 'https://ai-public.mastergo.com/ai/img_res/924e612b79d7463c48a3556240acc354.jpg'
  },
  {
    id: 3,
    name: '无线耳机',
    storeIds: [2],
    price: 8990,
    quantity: 100,
    category: 'digital',
    description: '高音质无线耳机，支持降噪',
    image: 'https://ai-public.mastergo.com/ai/img_res/7ea52ed06dffd0b8b472842d2448764e.jpg'
  }
])

// 计算属性
const filteredProducts = computed(() => {
  let result = [...allProducts.value]
  
  // 按店铺筛选
  if (selectedStore.value) {
    result = result.filter(product => product.storeIds.includes(parseInt(selectedStore.value)))
  }
  
  // 按分类筛选
  if (selectedCategory.value) {
    result = result.filter(product => product.category === selectedCategory.value)
  }
  
  return result
})

// 统计数据
const totalQuantity = computed(() => {
  return allProducts.value.reduce((sum, product) => sum + product.quantity, 0)
})

const categoryCount = computed(() => {
  const categories = new Set(allProducts.value.map(p => p.category))
  return categories.size
})

const totalExchanges = computed(() => {
  // 这里应该从实际数据中获取，暂时使用模拟数据
  return 2346
})

const lowStockCount = computed(() => {
  // 假设库存低于10的商品被认为是库存告警
  return allProducts.value.filter(p => p.quantity < 10).length
})

const newProductsThisMonth = computed(() => {
  // 这里应该从实际数据中获取，暂时使用模拟数据
  return 12
})

const getStoreName = (storeIds: number[]) => {
  const store = stores.value.find(s => storeIds.includes(s.id))
  return store?.name || '未知店铺'
}

// 方法
const handleEdit = (product: Product) => {
  editingProduct.value = product
  showAddProduct.value = true
}

const handleDelete = (product: Product) => {
  ElMessageBox.confirm(
    '确定要删除该商品吗？此操作不可恢复。',
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    }
  ).then(() => {
    const index = allProducts.value.findIndex(p => p.id === product.id)
    if (index > -1) {
      allProducts.value.splice(index, 1)
      ElMessage.success('商品已删除')
    }
  }).catch(() => {
    // 用户取消删除，不做任何操作
  })
}

const handleProductSubmit = (formData: IProductForm) => {
  if (editingProduct.value) {
    // 更新现有商品
    const index = allProducts.value.findIndex(p => p.id === editingProduct.value!.id)
    if (index > -1) {
      allProducts.value[index] = {
        ...allProducts.value[index],
        ...formData,
        storeIds: Array.isArray(formData.storeIds) ? formData.storeIds : [formData.storeIds]
      }
      ElMessage.success('更新成功')
    }
  } else {
    // 添加新商品
    const newProduct: Product = {
      ...formData,
      id: Math.max(0, ...allProducts.value.map(p => p.id)) + 1,
      storeIds: Array.isArray(formData.storeIds) ? formData.storeIds : [formData.storeIds],
      image: 'https://ai-public.mastergo.com/ai/img_res/1992822aad5de0f09cd910a5041a3574.jpg' // 默认图片
    }
    allProducts.value.push(newProduct)
    ElMessage.success('添加成功')
  }
  showAddProduct.value = false
  editingProduct.value = null
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 