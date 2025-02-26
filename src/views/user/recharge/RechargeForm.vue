image.png<template>
  <div class="h-[calc(100vh-64px)] bg-gray-50 p-6">
    <div class="space-y-4">
      <!-- 顶部卡片区域 -->
      <div class="grid grid-cols-1 gap-4">
        <!-- 会员信息卡片 -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div class="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner">
                <font-awesome-icon :icon="currentMember ? 'user' : 'credit-card'" class="text-2xl" />
              </div>
              <div>
                <div class="text-sm opacity-80">会员姓名</div>
                <div class="text-xl font-medium">{{ currentMember ? currentMember.name : '未读卡' }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button v-if="currentMember" 
                      @click="resetCard"
                      class="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg backdrop-blur-sm transition-colors duration-300">
                <font-awesome-icon icon="redo" class="mr-1" />
                重置
              </button>
              <button @click="handleReadCard"
                      :disabled="isReading"
                      class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg backdrop-blur-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                <font-awesome-icon v-if="isReading" icon="spinner" class="mr-2 animate-spin" />
                {{ isReading ? '读卡中...' : '读取会员卡' }}
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-[2]">
              <div class="text-sm opacity-80">可用积分</div>
              <div class="text-3xl font-medium mt-1">{{ currentMember ? currentMember.remainingPoints.toLocaleString() : '0' }}</div>
            </div>
            <div class="w-px h-12 bg-white bg-opacity-20"></div>
            <div class="flex-[8]">
              <div class="text-sm opacity-80">可提商品</div>
              <div class="w-full h-8 relative mt-1">
                <div class="absolute inset-0 overflow-hidden">
                  <div class="absolute inset-0 overflow-x-auto">
                    <div class="flex items-center space-x-2 h-full min-w-full">
                      <template v-if="currentMember">
                        <div v-for="product in availableProducts" 
                             :key="product.id" 
                             class="inline-flex items-center space-x-1 bg-white bg-opacity-20 px-3 h-7 rounded-lg shrink-0">
                          <span class="text-white">{{ product.name }}</span>
                          <span class="text-white font-medium">×{{ product.quantity }}</span>
                        </div>
                      </template>
                      <div v-else class="flex items-center text-white opacity-80">暂无商品</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 充值金额选项 -->
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <font-awesome-icon icon="credit-card" class="text-blue-500 text-lg" />
            </div>
            <h3 class="text-lg font-medium">充值金额</h3>
          </div>
          <div class="flex items-center space-x-4">
            <!-- 查看历史记录按钮 -->
            <button @click="$router.push('/user/history')"
                    class="flex items-center px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300">
              <font-awesome-icon icon="history" class="mr-2" />
              充值记录
            </button>
            <div class="relative">
              <el-select
                v-model="selectedOperator"
                filterable
                placeholder="选择操作员"
                class="!w-[120px]"
                popper-class="operator-select-dropdown">
                <el-option
                  v-for="op in operators"
                  :key="op.id"
                  :value="op.id"
                  :label="op.name">
                  <div class="flex items-center justify-center w-full space-x-2">
                    <div class="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center">
                      <font-awesome-icon icon="user" class="text-blue-500 text-xs" />
                    </div>
                    <span class="text-sm">{{ op.name }}</span>
                  </div>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <!-- 充值选项网格 -->
        <div class="space-y-6">
          <!-- 将原来的垂直布局改为水平布局 -->
          <div class="flex gap-6">
            <!-- 积分充值部分 (左侧 50%) -->
            <div class="w-1/2">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-medium text-gray-700">积分充值</h4>
              </div>
              <div class="grid grid-cols-2 gap-4 mb-8">
                <button v-for="amount in rechargeAmounts" 
                        :key="amount"
                        class="p-6 border rounded-xl hover:border-blue-500 hover:shadow-sm transition-all duration-300 group bg-white"
                        :class="{ 'border-blue-500 shadow-md bg-blue-50': selectedAmount === amount }"
                        @click="() => {
                          selectedAmount = amount;
                          customAmount = '';
                        }">
                  <div class="text-base text-gray-400 mb-2 group-hover:text-blue-500"
                       :class="{ 'text-blue-500': selectedAmount === amount }">充值</div>
                  <div class="text-2xl font-medium group-hover:text-blue-600"
                       :class="{ 'text-blue-600': selectedAmount === amount }">
                    {{ amount }} 积分
                  </div>
                </button>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <div class="text-base text-gray-400 mb-2">其他积分</div>
                  <div class="relative">
                    <input type="number" 
                           v-model="customAmount"
                           @input="handleCustomAmountInput"
                           class="w-full pl-6 pr-20 py-5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xl"
                           placeholder="请输入充值积分"/>
                    <span class="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">积分</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 商品充值部分 (右侧 50%) -->
            <div class="w-1/2">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-medium text-gray-700">商品充值</h4>
                <button @click="showProductSelector = true" 
                        class="flex items-center px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300">
                  <font-awesome-icon icon="plus" class="mr-2" />
                  添加商品
                </button>
              </div>
              
              <!-- 已选商品列表 -->
              <div v-if="selectedProducts.length > 0" class="h-[600px] overflow-y-auto space-y-4 pr-2">
                <div v-for="product in selectedProducts" 
                     :key="product.id" 
                     class="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow duration-300 bg-white">
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2">
                      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover rounded-lg"/>
                    </div>
                    <div>
                      <div class="font-medium text-gray-800">{{ product.name }}</div>
                      <div class="text-sm text-gray-500 mt-1">{{ product.price * 10 }} 积分 × {{ product.quantity }}</div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-6">
                    <div class="flex items-center space-x-3">
                      <button class="w-8 h-8 rounded-full border flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors duration-300"
                              @click="updateProductQuantity(product, -1)">
                        <font-awesome-icon icon="minus" class="text-xs" />
                      </button>
                      <span class="w-8 text-center text-lg">{{ product.quantity }}</span>
                      <button class="w-8 h-8 rounded-full border flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors duration-300"
                              @click="updateProductQuantity(product, 1)">
                        <font-awesome-icon icon="plus" class="text-xs" />
                      </button>
                    </div>
                    <button class="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors duration-300"
                            @click="removeProduct(product)">
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div v-else class="h-[600px] flex flex-col items-center justify-center text-gray-400 border rounded-xl bg-gray-50">
                <font-awesome-icon icon="shopping-cart" class="text-3xl mb-3" />
                <div class="text-sm">暂未选择商品</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 合计与确认 -->
        <div class="flex items-stretch pt-6 mt-8 border-t">
          <!-- 积分充值部分 -->
          <div class="flex-[1.5] px-6 border-r">
            <div class="text-lg text-gray-500 mb-2">积分充值</div>
            <div v-if="selectedAmount || customAmount" class="text-xl font-medium text-blue-600">
              {{ selectedAmount || Number(customAmount) || 0 }} 积分
            </div>
            <div v-else class="text-gray-400 text-sm">暂无积分充值</div>
          </div>
          
          <!-- 商品充值部分 -->
          <div class="flex-[7] px-6 border-r">
            <div class="text-lg text-gray-500 mb-2">商品充值</div>
            <div class="w-full h-8 relative">
              <div class="absolute inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-x-auto">
                  <div class="flex items-center space-x-2 h-full min-w-full">
                    <template v-if="selectedProducts.length > 0">
                      <div v-for="product in selectedProducts" 
                           :key="product.id" 
                           class="inline-flex items-center space-x-1 bg-gray-50 px-3 h-7 rounded-lg shrink-0">
                        <span class="text-gray-600">{{ product.name }}</span>
                        <span class="text-blue-600 font-medium">×{{ product.quantity }}</span>
                      </div>
                    </template>
                    <div v-else class="flex items-center text-gray-400">暂无商品</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 确认充值按钮 -->
          <div class="flex-[2] px-6 flex items-center justify-end">
            <button class="w-full h-16 flex items-center justify-center gap-3 text-white text-xl font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed"
                    :class="[
                      currentMember 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg active:from-blue-700 active:to-blue-800 active:shadow-inner' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    ]"
                    @click="handleRecharge"
                    :disabled="!canRecharge || isLoading">
              <font-awesome-icon v-if="isLoading" icon="spinner" class="animate-spin text-2xl" />
              <font-awesome-icon v-else icon="credit-card" class="text-2xl" />
              <span>确认充值</span>
            </button>
          </div>
        </div>

        <!-- 商品选择弹窗 -->
        <el-dialog
          v-model="showProductSelector"
          title="选择商品"
          width="800px">
          <div class="space-y-4">
            <!-- 搜索栏 -->
            <div class="flex items-center space-x-4">
              <div class="flex-1 relative">
                <input type="text"
                       v-model="productSearch"
                       class="w-full pl-10 pr-4 py-2 border rounded-lg"
                       placeholder="搜索商品名称"/>
                <font-awesome-icon icon="search" 
                                 class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <el-select v-model="productCategory" 
                        placeholder="商品分类"
                        class="!w-[160px]">
                <el-option label="全部分类" :value="0" />
                <el-option v-for="cat in categories"
                          :key="cat.id"
                          :label="cat.name"
                          :value="cat.id" />
              </el-select>
            </div>

            <!-- 商品列表 -->
            <div class="grid grid-cols-4 gap-4">
              <div v-for="product in filteredProducts"
                   :key="product.id"
                   class="border rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:shadow-sm"
                   @click="addProduct(product)">
                <div class="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <img :src="product.image" :alt="product.name" class="w-20 h-20 object-cover"/>
                </div>
                <div class="font-medium truncate">{{ product.name }}</div>
                <div class="text-sm text-gray-500 mt-1">{{ product.price * 10 }} 积分</div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElDialog, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import type { RechargeProduct, CreateRechargeOrderRequest } from '@/types/api/user/recharge'
import type { Member } from '@/types/api/user/member'
import type { Operator } from '@/types/api/user/operator'
import { memberApi } from '@/api/user/member'
import { operatorApi } from '@/api/user/operator'
import { shoppingApi } from '@/api/user/shopping'

const router = useRouter()

// 充值选项
const rechargeAmounts = [100, 200, 500, 1000, 2000, 5000, 10000, 20000]
const selectedAmount = ref(0)
const customAmount = ref('')
const selectedOperator = ref<number>()

// 商品相关
const showProductSelector = ref(false)
const productSearch = ref('')
const productCategory = ref<string>('0')
const selectedProducts = ref<RechargeProduct[]>([])

// 会员相关
const currentMember = ref<{
  id?: number;
  name: string;
  phone: string;
  remainingPoints: number;
  lastRechargeDate?: string;
} | null>(null)
const isReading = ref(false)

// 商品分类
const categories = [
  { id: '1', name: '饮品' },
  { id: '2', name: '零食' },
  { id: '3', name: '生活用品' },
  { id: '4', name: '其他' }
]

// 操作员数据
const operators = ref<Operator[]>([])

// 商品数据
const products = ref<RechargeProduct[]>([])

// 获取商品列表
const fetchProducts = async () => {
  try {
    const params = {
      page: 1,
      pageSize: 100,
      category: productCategory.value === '0' ? undefined : productCategory.value
    }
    const response = await shoppingApi.getProducts(params)
    products.value = response.data.data.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      category: item.category || '未分类',
      status: item.status || '在售',
      stock: item.stock || 0,
      image: item.image
    }))
  } catch (error) {
    console.error('Failed to fetch products:', error)
    ElMessage.error('获取商品列表失败')
  }
}

// 修改过滤商品的计算属性
const filteredProducts = computed(() => {
  let result = products.value
  
  if (productSearch.value) {
    const search = productSearch.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(search))
  }
  
  return result
})

// 计算总金额和积分
const totalAmount = computed(() => {
  const productAmount = selectedProducts.value.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const pointsAmount = (selectedAmount.value || Number(customAmount.value) || 0) / 10
  return productAmount + pointsAmount
})

const totalPoints = computed(() => {
  return Math.floor((Number(totalAmount.value) * 10))
})

// 重置会员卡
const resetCard = () => {
  // 如果有未完成的充值，提示用户
  if (selectedAmount.value > 0 || customAmount.value || selectedProducts.value.length > 0) {
    ElMessageBox.confirm('当前有未完成的充值，是否确认重置？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resetCardAndForm()
    }).catch(() => {})
  } else {
    resetCardAndForm()
  }
}

// 重置卡片和表单
const resetCardAndForm = () => {
  currentMember.value = null
  selectedAmount.value = 0
  customAmount.value = ''
  selectedProducts.value = []
  selectedOperator.value = undefined
  ElMessage.success('已重置会员卡')
}

// 模拟IC读卡器读取卡号
const simulateReadICCard = (): Promise<string> => {
  return new Promise((resolve) => {
    // 模拟读卡延迟
    setTimeout(() => {
      // 模拟生成会员卡号（实际应该从IC卡中读取）
      const cardNo = '100001'
      resolve(cardNo)
    }, 500)
  })
}

// 读卡方法
const handleReadCard = async () => {
  if (isReading.value) return
  
  isReading.value = true
  try {
    // 模拟从IC读卡器获取卡号
    const icCardNo = await simulateReadICCard()
    
    // 并行请求会员信息、操作员列表和商品列表
    const [memberResponse, operatorResponse, productsResponse] = await Promise.all([
      memberApi.getMemberById(parseInt(icCardNo)),
      operatorApi.getCurrentStoreOperators(),
      shoppingApi.getProducts({ page: 1, pageSize: 100 })
    ])

    const memberData = memberResponse.data.data
    operators.value = operatorResponse.data.data
    // 更新会员信息
    currentMember.value = {
      id: memberData.id,
      name: memberData.name,
      phone: memberData.phone,
      remainingPoints: memberData.remainingPoints,
      lastRechargeDate: new Date().toISOString().split('T')[0]
    }

    // 更新商品列表
    products.value = productsResponse.data.data.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      category: item.category || '未分类',
      status: item.status || '在售',
      stock: item.stock || 0,
      image: item.image
    }))

    ElMessage.success('会员卡读取成功')
  } catch (error) {
    console.error('Failed to read member card:', error)
    ElMessage.error('会员卡读取失败')
  }
}

// 监听分类变化，重新获取商品列表
watch(productCategory, () => {
  fetchProducts()
})

// 处理自定义金额输入
const handleCustomAmountInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  
  // 清除选择的固定金额
  selectedAmount.value = 0
  
  // 如果输入为空，设置为空字符串
  if (!value) {
    customAmount.value = ''
    return
  }
  
  // 确保输入为正整数
  const numValue = parseInt(value)
  if (numValue < 0) {
    customAmount.value = '0'
  } else {
    customAmount.value = numValue.toString()
  }
}

// 在 script setup 部分添加 isLoading
const isLoading = ref(false)

// 修改 handleRecharge 方法
const handleRecharge = async () => {
  if (!currentMember.value) {
    ElMessage.warning('请先读取会员卡')
    return
  }

  if (!selectedOperator.value) {
    ElMessage.warning('请选择操作员')
    return
  }

  const pointsToAdd = selectedAmount.value || Number(customAmount.value) || 0
  const hasProducts = selectedProducts.value.length > 0
  
  if (!pointsToAdd && !hasProducts) {
    ElMessage.warning('请选择充值金额或商品')
    return
  }

  isLoading.value = true
  try {
    // 模拟充值操作
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const totalPointsToAdd = Math.floor((Number(totalAmount.value) * 10))
    
    // 更新会员积分和可提商品
    if (currentMember.value) {
      // 更新积分
      currentMember.value.remainingPoints += totalPointsToAdd
      currentMember.value.lastRechargeDate = new Date().toISOString().split('T')[0]
      
      // 更新可提商品列表
      const updatedProducts = [...products.value]
      selectedProducts.value.forEach(selectedProduct => {
        const existingProductIndex = updatedProducts.findIndex(p => p.id === selectedProduct.id)
        if (existingProductIndex !== -1) {
          // 如果商品已存在，更新数量
          const currentQuantity = updatedProducts[existingProductIndex].quantity || 0
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            quantity: currentQuantity + selectedProduct.quantity
          }
        }
      })
      // 重新赋值以触发响应式更新
      products.value = updatedProducts
    }
    
    // 构建充值详情消息
    let successMessage = '充值成功：'
    if (pointsToAdd) {
      successMessage += `\n积分充值：${pointsToAdd} 积分`
    }
    if (hasProducts) {
      successMessage += '\n商品充值：'
      selectedProducts.value.forEach(p => {
        successMessage += `\n- ${p.name} × ${p.quantity}`
      })
    }
    successMessage += `\n总计：${totalPointsToAdd} 积分`
    
    ElMessage.success(successMessage)
    
    // 重置表单
    selectedAmount.value = 0
    customAmount.value = ''
    selectedProducts.value = []
    selectedOperator.value = undefined
    
  } catch (error) {
    ElMessage.error('充值失败，请重试')
  } finally {
    isLoading.value = false
  }
}

// 商品操作方法
const addProduct = (product: any) => {
  const existing = selectedProducts.value.find(p => p.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    selectedProducts.value.push({
      ...product,
      quantity: 1
    })
  }
  ElMessage.success('已添加商品')
}

const updateProductQuantity = (product: any, delta: number) => {
  const existing = selectedProducts.value.find(p => p.id === product.id)
  if (existing) {
    const newQuantity = existing.quantity + delta
    if (newQuantity > 0) {
      existing.quantity = newQuantity
    } else {
      removeProduct(product)
    }
  }
}

const removeProduct = (product: any) => {
  selectedProducts.value = selectedProducts.value.filter(p => p.id !== product.id)
}

// 是否可以充值
const canRecharge = computed(() => {
  return currentMember.value && (selectedAmount.value > 0 || customAmount.value || selectedProducts.value.length > 0) && selectedOperator.value !== undefined
})

const isLastProduct = (product: any) => {
  return selectedProducts.value.indexOf(product) === selectedProducts.value.length - 1
}

// 可提商品列表
const availableProducts = computed(() => {
  return products.value
    .filter((p: RechargeProduct) => (p.quantity || 0) > 0)
    .slice(0, 8)
})
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}

/* 自定义滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #D1D5DB;
}

:deep(.operator-select-dropdown) {
  .el-select-dropdown__item {
    padding: 0;
    height: 36px;
  }
  
  .el-select-dropdown__item > div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-select-dropdown__item.selected {
    background-color: #EBF5FF;
    color: #3B82F6;
    
    .text-blue-500 {
      color: #3B82F6;
    }
  }
}

/* 横向滚动条样式 */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #D1D5DB;
}
</style> 