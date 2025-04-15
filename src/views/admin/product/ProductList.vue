<template>
  <div class="space-y-6">
    <!-- 商品统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-blue-100 text-sm font-medium">商品总数</p>
            <p class="text-4xl font-bold mt-3">{{ allProducts.length }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-blue-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm"
          >
            <font-awesome-icon icon="boxes" class="text-2xl" />
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-green-100 text-sm font-medium">累计兑换</p>
            <p class="text-4xl font-bold mt-3">{{ totalExchanges.toLocaleString() }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-green-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm"
          >
            <font-awesome-icon icon="exchange-alt" class="text-2xl" />
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-purple-100 text-sm font-medium">库存告警</p>
            <p class="text-4xl font-bold mt-3">{{ lowStockCount }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-purple-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm"
          >
            <font-awesome-icon icon="exclamation-triangle" class="text-2xl" />
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-orange-100 text-sm font-medium">本月新增</p>
            <p class="text-4xl font-bold mt-3">{{ newProductsThisMonth }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-orange-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm"
          >
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
          <div class="relative" ref="storeDropdownRef">
            <button
              type="button"
              class="w-48 rounded-xl border-2 border-gray-200 px-4 py-2.5 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 flex items-center justify-between"
              @click.stop="toggleStoreDropdown"
            >
              <div class="flex items-center gap-2 overflow-hidden">
                <font-awesome-icon
                  :icon="getStoreIcon(selectedStore)"
                  class="text-blue-500 flex-shrink-0"
                />
                <span class="text-gray-700 truncate">
                  {{
                    selectedStore
                      ? stores.find(s => s.id === parseInt(selectedStore))?.name
                      : '全部店铺'
                  }}
                </span>
              </div>
              <font-awesome-icon icon="chevron-down" class="text-gray-400 flex-shrink-0" />
            </button>

            <div
              v-if="showStoreDropdown"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <div class="max-h-[240px] overflow-y-auto p-2 space-y-1">
                <div
                  class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  :class="{ 'bg-gray-50': selectedStore === '' }"
                  @click="handleStoreSelect('')"
                >
                  <font-awesome-icon icon="list" class="text-blue-500 flex-shrink-0" />
                  <span class="text-sm text-gray-700">全部店铺</span>
                </div>
                <div
                  v-for="store in stores"
                  :key="store.id"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  :class="{ 'bg-gray-50': selectedStore === store.id.toString() }"
                  @click="handleStoreSelect(store.id.toString())"
                >
                  <font-awesome-icon icon="store" class="text-sm text-blue-500 flex-shrink-0" />
                  <span class="text-sm text-gray-700">{{ store.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="relative" ref="categoryDropdownRef">
            <button
              type="button"
              class="w-48 rounded-xl border-2 border-gray-200 px-4 py-2.5 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 flex items-center justify-between"
              @click.stop="toggleCategoryDropdown"
            >
              <div class="flex items-center gap-2 overflow-hidden">
                <font-awesome-icon
                  :icon="getCategoryIcon(selectedCategory)"
                  :class="getCategoryIconClass(selectedCategory)"
                  class="flex-shrink-0"
                />
                <span class="text-gray-700 truncate">
                  {{
                    categoryOptions.find(option => option.value === selectedCategory)?.label ||
                    '全部分类'
                  }}
                </span>
              </div>
              <font-awesome-icon icon="chevron-down" class="text-gray-400 flex-shrink-0" />
            </button>

            <div
              v-if="showCategoryDropdown"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <div class="max-h-[240px] overflow-y-auto p-2 space-y-1">
                <div
                  v-for="option in categoryOptions"
                  :key="option.value"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  :class="{ 'bg-gray-50': selectedCategory === option.value }"
                  @click="handleCategorySelect(option.value)"
                >
                  <font-awesome-icon
                    :icon="getCategoryIcon(option.value)"
                    :class="getCategoryIconClass(option.value)"
                    class="text-sm flex-shrink-0"
                  />
                  <span class="text-sm text-gray-700">{{ option.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            class="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 flex items-center gap-2 transition-colors duration-200 shadow-sm hover:shadow-md"
            @click="handleAddProduct"
          >
            <font-awesome-icon icon="plus" />
            <span>添加商品</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
      >
        <div class="relative h-40">
          <product-image
            :product-id="product.id"
            :image-uuid="product.productImageUuid"
            class="w-full h-40"
            alt="商品图片"
          />
          <div
            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"
          ></div>
        </div>
        <div class="p-3 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-bold text-gray-800 text-base line-clamp-1 flex-1">
              {{ product.name }}
            </h3>
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
            <p class="text-red-600 font-bold text-base">
              {{ product.price.toLocaleString() }} 积分
            </p>
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
import { ref, computed, onMounted, watch, defineComponent, onUnmounted } from 'vue'
import type { PropType } from 'vue'
import ProductForm, { type ProductForm as IProductForm } from './components/ProductForm.vue'
import ProductImage from '@/components/common/ProductImage.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { productApi } from '@/api/admin/product'
import { storeApi } from '@/api/admin/store'
import type { Product, ProductCategoryType } from '@/types/api/admin/product'
import type { Store } from '@/types/api/admin/store'

// 商品分类选项
const categoryOptions: Array<{
  label: string
  value: ProductCategoryType
}> = [
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
const loading = ref(false)
const selectedStore = ref('')
const selectedCategory = ref<ProductCategoryType>('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(8)
const showAddProduct = ref(false)
const editingProduct = ref<Product | null>(null)
const allProducts = ref<Product[]>([])
const total = ref(0)
const isSubmitting = ref(false) // 防止重复提交

// 视图模式
const viewMode = ref<'card' | 'list'>('card')

// 店铺数据
const stores = ref<{ id: number; name: string }[]>([])

// 获取店铺列表
const fetchStores = async () => {
  try {
    const response = await storeApi.getList({
      page: 1,
      pageSize: 100 // 尝试获取所有店铺
    })

    if (response.code === 200 && response.data) {
      // 检查response.data的结构
      const storeData = response.data as any
      if (storeData.items && Array.isArray(storeData.items)) {
        stores.value = storeData.items.map((store: Store) => ({
          id: store.id,
          name: store.name
        }))
      }
    } else {
      ElMessage.warning('获取店铺列表失败，使用默认数据')
      stores.value = [
        { id: 1, name: '北京朝阳店' },
        { id: 2, name: '上海浦东店' },
        { id: 3, name: '广州天河店' }
      ]
    }
  } catch (error) {
    console.error('Failed to fetch stores:', error)
    ElMessage.warning('获取店铺列表失败，使用默认数据')
    stores.value = [
      { id: 1, name: '北京朝阳店' },
      { id: 2, name: '上海浦东店' },
      { id: 3, name: '广州天河店' }
    ]
  }
}

// 获取商品列表
const fetchProducts = async () => {
  try {
    loading.value = true
    const params = {
      category: selectedCategory.value,
      storeId: selectedStore.value ? parseInt(selectedStore.value) : -1
    }
    console.log('发送商品查询参数:', params)
    const response = await productApi.getProducts(params)
    allProducts.value = response.data.items
    total.value = response.data.total
  } catch (error) {
    console.error('Failed to fetch products:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 计算属性
const filteredProducts = computed(() => {
  return allProducts.value
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
  if (!storeIds || storeIds.length === 0) return '未知店铺'
  const storeId = storeIds[0] // 获取第一个店铺ID
  const store = stores.value.find(s => s.id === storeId)
  return store?.name || '未知店铺'
}

// 方法
const handleAddProduct = () => {
  editingProduct.value = null
  showAddProduct.value = true
}

const handleEdit = (product: Product) => {
  editingProduct.value = product
  showAddProduct.value = true
}

// 删除商品
const handleDelete = async (product: Product) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？此操作不可恢复。', '删除确认', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })

    await productApi.deleteProduct(product.id)
    ElMessage.success('商品已删除')
    fetchProducts() // 重新加载商品列表
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete product:', error)
      ElMessage.error('删除商品失败')
    }
  }
}

// 提交商品表单
const handleProductSubmit = async (formData: IProductForm) => {
  // 防止重复提交
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    const productData = {
      ...formData,
      storeIds: [formData.storeIds], // 将单个storeId转换为数组
      status: '在售' as const, // 设置默认状态
      category: formData.category as ProductCategoryType
    }

    if (editingProduct.value) {
      // 更新现有商品
      await productApi.updateProduct(editingProduct.value.id, productData)
      ElMessage.success('商品更新成功')
    } else {
      // 添加新商品
      await productApi.createProduct(productData)
      ElMessage.success('商品添加成功')
    }
    showAddProduct.value = false
    editingProduct.value = null
    fetchProducts() // 重新加载商品列表
  } catch (error) {
    console.error('Failed to save product:', error)
    ElMessage.error(editingProduct.value ? '更新商品失败' : '添加商品失败')
  } finally {
    isSubmitting.value = false
  }
}

// 监听筛选条件变化
watch([selectedStore, selectedCategory], () => {
  console.log('筛选条件变化:', { 店铺: selectedStore.value, 分类: selectedCategory.value })
  currentPage.value = 1
  fetchProducts()
})

// 在组件挂载时获取商品列表
onMounted(() => {
  fetchStores()
  fetchProducts()
})

// 在 script 标签内添加以下代码
const showCategoryDropdown = ref(false)
const categoryDropdownRef = ref<HTMLDivElement | null>(null)
const showStoreDropdown = ref(false)
const storeDropdownRef = ref<HTMLDivElement | null>(null)

// 处理分类下拉框的点击事件
const toggleCategoryDropdown = () => {
  showCategoryDropdown.value = !showCategoryDropdown.value
}

// 处理分类选择
const handleCategorySelect = (category: ProductCategoryType) => {
  selectedCategory.value = category
  showCategoryDropdown.value = false
}

// 根据分类获取对应的图标
const getCategoryIcon = (category: ProductCategoryType) => {
  switch (category) {
    case 'digital':
      return 'shopping-cart'
    case 'office':
      return 'pencil-alt'
    case 'life':
      return 'tags'
    case 'gift':
      return 'credit-card'
    default:
      return 'list'
  }
}

// 根据分类获取图标的颜色类
const getCategoryIconClass = (category: ProductCategoryType) => {
  switch (category) {
    case 'digital':
      return 'text-blue-500'
    case 'office':
      return 'text-green-500'
    case 'life':
      return 'text-orange-500'
    case 'gift':
      return 'text-purple-500'
    default:
      return 'text-blue-500'
  }
}

// 处理店铺下拉框的点击事件
const toggleStoreDropdown = () => {
  showStoreDropdown.value = !showStoreDropdown.value
}

// 处理店铺选择
const handleStoreSelect = (storeId: string) => {
  selectedStore.value = storeId
  showStoreDropdown.value = false
}

// 修改点击外部关闭下拉框函数，增加对店铺下拉框的处理
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(target)) {
    showCategoryDropdown.value = false
  }
  if (storeDropdownRef.value && !storeDropdownRef.value.contains(target)) {
    showStoreDropdown.value = false
  }
}

// 添加生命周期钩子，处理点击外部关闭下拉框
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 获取店铺图标
const getStoreIcon = (storeId: string) => {
  return storeId ? 'store' : 'list'
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
