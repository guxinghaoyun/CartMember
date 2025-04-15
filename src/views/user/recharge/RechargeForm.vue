<template>
  <div class="h-[calc(100vh-64px)] bg-gray-50 p-6">
    <div class="space-y-4">
      <!-- 顶部卡片区域 -->
      <div class="grid grid-cols-1 gap-4">
        <!-- 会员信息卡片 -->
        <div
          class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div
                class="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner"
              >
                <font-awesome-icon
                  :icon="currentMember ? 'user' : 'credit-card'"
                  class="text-2xl"
                />
              </div>
              <div>
                <div class="text-sm opacity-80">会员姓名</div>
                <div class="text-xl font-medium">
                  {{ currentMember ? currentMember.name : '未读卡' }}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="currentMember"
                @click="resetCard"
                class="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg backdrop-blur-sm transition-colors duration-300"
              >
                <font-awesome-icon icon="redo" class="mr-1" />
                重置
              </button>
              <button
                @click="handleReadCard"
                :disabled="isReading"
                class="bg-gradient-to-r text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-3 border-2 border-white/30"
                :class="[
                  isReading
                    ? 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                    : 'from-blue-400 to-blue-500 hover:from-blue-300 hover:to-blue-400'
                ]"
              >
                <font-awesome-icon
                  :icon="isReading ? 'spinner' : 'id-card'"
                  class="text-white text-lg"
                  :class="{ 'fa-pulse': isReading }"
                />
                <span class="text-base font-medium whitespace-nowrap">
                  {{ isReading ? '读取中...' : '读取会员卡' }}
                </span>
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-[2]">
              <div class="text-base opacity-80 font-medium">可用积分</div>
              <div class="text-3xl font-medium mt-1">
                {{ currentMember ? currentMember.remainingPoints.toLocaleString() : '0' }}
              </div>
            </div>
            <div class="w-px h-12 bg-white bg-opacity-20"></div>
            <div class="flex-[8]">
              <div class="text-base opacity-80 font-medium">可提商品</div>
              <div class="w-full h-12 relative mt-2">
                <div class="absolute inset-0 overflow-hidden">
                  <div class="absolute inset-0 overflow-x-auto">
                    <div class="flex items-center space-x-3 h-full min-w-full">
                      <template v-if="currentMember">
                        <div
                          v-for="product in availableProducts"
                          :key="product.id"
                          class="inline-flex items-center space-x-2 bg-white bg-opacity-20 px-4 h-9 rounded-lg shrink-0"
                        >
                          <span class="text-white text-base">{{ product.name }}</span>
                          <span class="text-white font-medium text-base">
                            ×{{ product.stockQuantity }}
                          </span>
                        </div>
                      </template>
                      <div v-else class="flex items-center text-white opacity-80 text-base">
                        暂无商品
                      </div>
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
            <!-- <button
              @click="$router.push('/user/history')"
              class="flex items-center px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
            >
              <font-awesome-icon icon="history" class="mr-2" />
              充值记录
            </button> -->
            <div class="relative">
              <el-select
                v-model="selectedOperator"
                filterable
                placeholder="选择操作员"
                class="!w-[160px] border-2 border-blue-100 rounded-lg"
                popper-class="operator-select-dropdown"
              >
                <template #prefix>
                  <div class="flex items-center text-blue-500 ml-1">
                    <font-awesome-icon icon="user-cog" class="mr-1" />
                  </div>
                </template>
                <el-option v-for="op in operators" :key="op.id" :value="op.id" :label="op.name">
                  <div class="flex items-center justify-start w-full space-x-2 px-2">
                    <div class="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                      <font-awesome-icon icon="user" class="text-blue-500" />
                    </div>
                    <span class="text-sm font-medium">{{ op.name }}</span>
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
                <button
                  v-for="amount in rechargeAmounts"
                  :key="amount"
                  class="p-4 border rounded-xl hover:border-blue-500 hover:shadow-sm transition-all duration-300 group bg-white"
                  :class="{ 'border-blue-500 shadow-md bg-blue-50': selectedAmount === amount }"
                  @click="
                    () => {
                      selectedAmount = amount
                      customAmount = ''
                    }
                  "
                >
                  <div
                    class="text-base text-gray-400 mb-1 group-hover:text-blue-500"
                    :class="{ 'text-blue-500': selectedAmount === amount }"
                  >
                    充值
                  </div>
                  <div
                    class="text-xl font-medium group-hover:text-blue-600"
                    :class="{ 'text-blue-600': selectedAmount === amount }"
                  >
                    {{ amount }} 积分
                  </div>
                </button>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <div class="text-base text-gray-700 font-medium mb-2">其他积分</div>
                  <div
                    class="relative bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <input
                      type="number"
                      v-model="customAmount"
                      @input="handleCustomAmountInput"
                      class="w-full pl-4 pr-20 py-4 border-0 focus:ring-0 outline-none text-xl font-medium text-gray-800"
                      placeholder="请输入充值积分"
                    />
                    <div
                      class="absolute right-4 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium"
                    >
                      积分
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 商品充值部分 (右侧 50%) -->
            <div class="w-1/2">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-medium text-gray-700">商品充值</h4>
                <button
                  @click="showProductSelector = true"
                  class="flex items-center px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                >
                  <font-awesome-icon icon="plus" class="mr-2" />
                  添加商品
                </button>
              </div>

              <!-- 已选商品列表 -->
              <div
                v-if="selectedProducts.length > 0"
                class="h-[600px] overflow-y-auto space-y-4 pr-2"
              >
                <div
                  v-for="product in selectedProducts"
                  :key="product.id"
                  class="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow duration-300 bg-white"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2"
                    >
                      <ProductImage
                        :productId="product.id"
                        :imageUuid="product.image"
                        :alt="product.name"
                        imageClass="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <div class="font-medium truncate">{{ product.name }}</div>
                      <div class="flex justify-between items-center text-sm text-gray-500 mt-1">
                        <div>{{ product.price }} 积分</div>
                        <div>库存 {{ product.stock }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-6">
                    <div class="flex items-center space-x-3">
                      <button
                        class="w-8 h-8 rounded-full border flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors duration-300"
                        @click="updateProductQuantity(product, -1)"
                      >
                        <font-awesome-icon icon="minus" class="text-xs" />
                      </button>
                      <span class="w-8 text-center text-lg">{{ product.quantity }}</span>
                      <button
                        class="w-8 h-8 rounded-full border flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors duration-300"
                        @click="updateProductQuantity(product, 1)"
                      >
                        <font-awesome-icon icon="plus" class="text-xs" />
                      </button>
                    </div>
                    <button
                      class="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors duration-300"
                      @click="removeProduct(product)"
                    >
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- 空状态 -->
              <div
                v-else
                class="h-[600px] flex flex-col items-center justify-center text-gray-400 border rounded-xl bg-gray-50"
              >
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
                      <div
                        v-for="product in selectedProducts"
                        :key="product.id"
                        class="inline-flex items-center space-x-1 bg-gray-50 px-3 h-7 rounded-lg shrink-0"
                      >
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
            <button
              class="w-full h-16 flex items-center justify-center gap-3 text-white text-xl font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed"
              :class="[
                currentMember
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg active:from-blue-700 active:to-blue-800 active:shadow-inner'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
              ]"
              @click="handleRecharge"
              :disabled="isLoading"
            >
              <font-awesome-icon v-if="isLoading" icon="spinner" class="animate-spin text-2xl" />
              <font-awesome-icon v-else icon="credit-card" class="text-2xl" />
              <span>确认充值</span>
            </button>
          </div>
        </div>

        <!-- 商品选择弹窗 -->
        <el-dialog v-model="showProductSelector" title="选择商品" width="800px">
          <div class="space-y-4">
            <!-- 搜索栏 -->
            <div class="flex items-center space-x-4">
              <div class="flex-1 relative">
                <input
                  type="text"
                  v-model="productSearch"
                  class="w-full pl-10 pr-4 py-2 border rounded-lg"
                  placeholder="搜索商品名称"
                />
                <font-awesome-icon
                  icon="search"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <div class="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  :class="{
                    'bg-blue-500 text-white': productCategory === cat.id,
                    'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-500':
                      productCategory !== cat.id
                  }"
                  class="px-3 py-1.5 rounded-lg transition-all duration-300 text-sm flex items-center space-x-1"
                  @click="productCategory = cat.id"
                >
                  <font-awesome-icon :icon="getCategoryIcon(cat.id)" class="text-xs" />
                  <span>{{ cat.name }}</span>
                </button>
              </div>
            </div>

            <!-- 商品列表 -->
            <div class="grid grid-cols-4 gap-4">
              <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="border rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:shadow-sm"
                @click="addProduct(product)"
              >
                <div
                  class="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden"
                >
                  <ProductImage
                    :productId="product.id"
                    :imageUuid="product.image"
                    :alt="product.name"
                    imageClass="w-full h-full object-contain"
                  />
                </div>
                <div class="font-medium truncate">{{ product.name }}</div>
                <div class="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <div>{{ product.price }} 积分</div>
                  <div>库存 {{ product.stock }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from 'vue'
import { ElMessage, ElDialog, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import type { RechargeProduct, CreateRechargeOrderRequest } from '@/types/api/user/recharge'
import type { Member } from '@/types/api/user/member'
import type { Operator } from '@/types/api/user/operator'
import { memberApi } from '@/api/user/member'
import { operatorApi } from '@/api/user/operator'
import { shoppingApi } from '@/api/user/shopping'
import { rechargeApi } from '@/api/user/recharge'
import ProductImage from '@/components/common/ProductImage.vue'

const router = useRouter()

// 充值选项
const rechargeAmounts = [100, 200, 500, 1000, 2000, 5000, 10000, 20000]
const selectedAmount = ref(0)
const customAmount = ref('')
const selectedOperator = ref<number>()

// 商品相关
const showProductSelector = ref(false)
const productSearch = ref('')
const productCategory = ref<string>('')
const selectedProducts = ref<(RechargeProduct & { quantity: number })[]>([])

// 会员相关
const currentMember = ref<{
  id?: number
  name: string
  phone: string
  icNumber?: string
  remainingPoints: number
  lastRechargeDate?: string
  products?: RechargeProduct[]
} | null>(null)
const isReading = ref(false)
const memberCardNo = ref('')
const cardInputRef = ref<HTMLInputElement | null>(null)

// 商品分类
const categories = [
  { id: '', name: '全部分类' },
  { id: 'digital', name: '数码产品' },
  { id: 'office', name: '办公用品' },
  { id: 'life', name: '生活用品' },
  { id: 'gift', name: '礼品卡券' }
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
      category: productCategory.value || undefined
    }
    const response = await shoppingApi.getProducts(params)
    // 根据API返回结构处理数据
    if (response && response.data) {
      const productsData = response.data
      // 假设API返回的是records
      if (productsData.records && Array.isArray(productsData.records)) {
        products.value = productsData.records.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          stockQuantity: item.stockQuantity,
          category: item.category || '',
          status: item.status || '在售',
          stock: item.stock || 0,
          image: item.image
        }))
      }
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  }
}

// 监听分类变化
watch(productCategory, () => {
  fetchProducts()
})

// 修改过滤商品的计算属性
const filteredProducts = computed(() => {
  let result = products.value

  // 根据分类过滤
  if (productCategory.value) {
    result = result.filter(p => p.category === productCategory.value)
  }

  // 再根据搜索关键词过滤
  if (productSearch.value) {
    const search = productSearch.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(search))
  }

  return result
})

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

// 计算总金额
const totalAmount = computed(() => {
  const productAmount = selectedProducts.value.reduce(
    (sum, p) => sum + p.price * p.stockQuantity,
    0
  )
  const pointsAmount = selectedAmount.value || Number(customAmount.value) || 0
  return productAmount + pointsAmount
})

// 计算总积分
const totalPoints = computed(() => {
  return totalAmount.value
})

// 重置会员卡
const resetCard = () => {
  // 如果有未完成的充值，提示用户
  if (selectedAmount.value > 0 || customAmount.value || selectedProducts.value.length > 0) {
    ElMessageBox.confirm('当前有未完成的充值，是否确认重置？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        resetCardAndForm()
      })
      .catch(() => {})
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

// 读卡方法
const handleReadCard = async () => {
  if (isReading.value) return

  isReading.value = true
  memberCardNo.value = ''

  try {
    ElMessage.info('请将IC卡放在读卡器上...')

    // 添加全局键盘事件监听
    document.addEventListener('keydown', handleKeyDown)

    // 设置超时，如果10秒内没有读到卡，则取消读卡状态
    setTimeout(() => {
      if (isReading.value && !memberCardNo.value) {
        isReading.value = false
        document.removeEventListener('keydown', handleKeyDown)
        ElMessage.warning('读卡超时，请重试')
      }
    }, 10000)
  } catch (error) {
    console.error('读卡失败:', error)
    ElMessage.error('会员卡读取失败，请重试')
    isReading.value = false
    document.removeEventListener('keydown', handleKeyDown)
  }
}

// 处理键盘输入事件
const handleKeyDown = (e: KeyboardEvent) => {
  // 如果正在读卡
  if (isReading.value) {
    // 接受字母E和数字输入
    if (/^\d$/.test(e.key) || e.key.toUpperCase() === 'E') {
      memberCardNo.value += e.key.toUpperCase()
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      // 当按下回车或Tab键时，认为卡号输入完成，结束读卡并触发查询
      if (memberCardNo.value) {
        processCardNumber(memberCardNo.value)
      }
    }
    e.preventDefault() // 阻止默认行为，避免在其他输入框中输入
  }
}

// 获取操作员列表
const fetchOperators = async () => {
  try {
    // 从localStorage中获取店铺信息
    const shopInfoStr = localStorage.getItem('shopInfo')
    if (!shopInfoStr) {
      console.error('没有找到店铺信息')
      return
    }

    const shopInfo = JSON.parse(shopInfoStr)

    // 从users数组中获取操作员列表
    if (!shopInfo.users || !Array.isArray(shopInfo.users)) {
      console.error('店铺信息中没有找到操作员列表')
      return
    }

    // 将用户数据转换为操作员数据格式
    operators.value = shopInfo.users.map((user: any) => ({
      id: user.id?.toString() || '',
      name: user.name || '',
      role: user.position || (user.manager ? '店长' : '店员')
    }))

    console.log('从本地存储获取的操作员列表:', operators.value)
  } catch (error) {
    console.error('获取操作员列表失败:', error)
    ElMessage.error('获取操作员列表失败')
  }
}

// 处理完整的卡号
const processCardNumber = async (cardNumber: string) => {
  console.log('读取到会员卡号:', cardNumber)

  try {
    // 关闭读卡状态，避免重复读取
    isReading.value = false
    document.removeEventListener('keydown', handleKeyDown)

    // 通过API获取会员信息
    const response = await memberApi.getMemberByInterICNumber(cardNumber)

    if (response.code === 200 && response.data) {
      const memberData = response.data

      // 如果会员卡被停用或未激活，提示用户
      if (memberData.icStatus === '停用' || memberData.icStatus === '未激活') {
        ElMessage.error('会员卡已停用或未激活')
        memberCardNo.value = ''
        return
      }

      // 更新会员信息
      currentMember.value = {
        id: memberData.id,
        name: memberData.name,
        phone: memberData.phone || '',
        icNumber: cardNumber, // 保存卡号
        remainingPoints: memberData.remainingPoints || 0,
        products: memberData.products || [],
        lastRechargeDate: new Date().toISOString().split('T')[0]
      }

      // 获取商品列表
      const productsResponse = await shoppingApi.getProducts({ page: 1, pageSize: 100 })

      // 检查响应结构并更新商品列表
      if (productsResponse && productsResponse.data) {
        const productsData = productsResponse.data
        // 假设API返回的是records
        if (productsData.records && Array.isArray(productsData.records)) {
          products.value = productsData.records.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            stockQuantity: item.stockQuantity,
            category: item.category || '',
            status: item.status || '在售',
            stock: item.stock || 0,
            image: item.image
          }))
        }
      }

      ElMessage.success('会员卡读取成功')
    } else {
      memberCardNo.value = ''
      ElMessage.error(response.message || '未找到会员信息')
    }
  } catch (error) {
    console.error('获取会员信息失败:', error)
    ElMessage.error('获取会员信息失败')
    memberCardNo.value = ''
  }
}

// 监听会员卡号变化
watch(memberCardNo, async newCardNo => {
  // 只在卡号长度达到特定值时处理
  if (newCardNo && newCardNo.length >= 24 && isReading.value) {
    processCardNumber(newCardNo)
  }
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
  console.log('===== 充值按钮被点击 =====')

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
    // 获取操作员名称
    const operatorName = operators.value.find(op => op.id === selectedOperator.value)?.name || ''

    // 处理商品数据
    const products = selectedProducts.value.map(p => {
      return {
        id: Number(p.id),
        price: Number(p.price),
        stockQuantity: Number(p.quantity || 1)
      }
    })

    // 构建符合后端API格式的请求数据
    const rechargeData: any = {
      membershipId: Number(currentMember.value.id) || 0,
      rechargeScore: Number(pointsToAdd) || 0,
      operationUser: operatorName,
      note: ``,
      rechargeProducts: products
    }

    console.log('准备提交充值数据:', JSON.stringify(rechargeData, null, 2))

    try {
      // 调用充值API
      const response = await rechargeApi.createRechargeOrder(rechargeData)
      console.log('充值API响应:', response)

      // 直接判断HTTP状态码，简化处理
      ElMessage.success('充值成功')

      // 更新会员积分
      if (currentMember.value) {
        // 更新积分
        currentMember.value.remainingPoints += pointsToAdd
        currentMember.value.lastRechargeDate = new Date().toISOString().split('T')[0]

        // 充值成功后获取最新的会员信息，包括可提商品
        try {
          // 使用getMemberByInterICNumber更新会员信息，因为它返回带products的会员信息
          if (currentMember.value.icNumber) {
            const memberResponse = await memberApi.getMemberByInterICNumber(
              currentMember.value.icNumber
            )
            if (memberResponse && memberResponse.code === 200 && memberResponse.data) {
              // 更新可提商品信息
              currentMember.value.products = memberResponse.data.products || []
            }
          }
        } catch (memberError) {
          console.error('获取会员最新信息失败:', memberError)
        }
      }

      // 构建充值详情消息
      let successMessage = '充值成功！'
      if (pointsToAdd) {
        successMessage += `\n积分充值：${pointsToAdd} 积分`
      }
      if (hasProducts) {
        successMessage += '\n商品充值：'
        selectedProducts.value.forEach(p => {
          successMessage += `\n- ${p.name} × ${p.quantity || 1}`
        })
      }
      successMessage += `\n总计：${totalPoints.value} 积分`

      ElMessage.success(successMessage)

      // 重置表单
      selectedAmount.value = 0
      customAmount.value = ''
      selectedProducts.value = []
      selectedOperator.value = undefined
    } catch (apiError) {
      console.error('API调用异常:', apiError)
      ElMessage.error(
        '充值API调用失败: ' + (apiError instanceof Error ? apiError.message : '未知错误')
      )
    }
  } catch (error) {
    console.error('充值过程发生错误:', error)
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
  return (
    currentMember.value &&
    (selectedAmount.value > 0 || customAmount.value || selectedProducts.value.length > 0) &&
    selectedOperator.value !== undefined
  )
})

const isLastProduct = (product: any) => {
  return selectedProducts.value.indexOf(product) === selectedProducts.value.length - 1
}

// 可提商品列表
const availableProducts = computed(() => {
  console.log('currentMember.value', currentMember.value)
  return currentMember.value?.products || []
})

// 在组件挂载时初始化
onMounted(() => {
  fetchOperators()
  fetchProducts()
  // 添加全局事件监听器
  document.addEventListener('keydown', handleKeyDown)
  console.log('充值组件已挂载，添加充值按钮点击监听')
})

// 在组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}

/* 自定义滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
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
    background-color: #ebf5ff;
    color: #3b82f6;

    .text-blue-500 {
      color: #3b82f6;
    }
  }
}

/* 横向滚动条样式 */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>
