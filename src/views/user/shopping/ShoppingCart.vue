<template>
  <div class="flex gap-6 h-[calc(100%-20px)]">
    <!-- 购物车区域 (70%) -->
    <div class="flex-[7] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div class="p-6 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-medium">购物车</h2>
          <div class="text-sm text-gray-500">共 {{ cartItems.length }} 件商品</div>
        </div>
      </div>

      <!-- 购物车商品列表（可滚动区域） -->
      <div class="h-[calc(100vh-64px-48px-20px-48px)] p-6 overflow-y-auto">
        <div class="space-y-4">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="group flex items-center justify-between p-4 border rounded-lg hover:border-blue-200 hover:shadow-sm transition-all duration-300"
          >
            <div class="flex items-center space-x-6">
              <div class="relative w-20 h-20">
                <ProductImage
                  :productId="item.product.id"
                  :imageUuid="item.product.image"
                  imageClass="w-full h-full object-cover rounded-lg shadow-sm"
                />
                <div
                  class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center"
                >
                  <button
                    class="!rounded-button text-white hover:text-red-200 p-2"
                    @click="previewImage(item)"
                  >
                    <font-awesome-icon icon="expand" />
                  </button>
                </div>
              </div>
              <div>
                <h3 class="font-medium text-gray-800 mb-1">{{ item.product.name }}</h3>
                <div class="flex items-center space-x-2">
                  <font-awesome-icon icon="tag" class="text-blue-500" />
                  <div class="text-blue-600 font-medium">{{ item.product.price }} 积分</div>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-6">
              <div class="flex items-center border rounded-lg bg-gray-50 px-2">
                <button
                  class="!rounded-button w-8 h-8 hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600"
                  @click="updateQuantity(item, -1)"
                >
                  <font-awesome-icon icon="minus" class="text-xs" />
                </button>
                <span class="px-4 font-medium text-gray-700">{{ item.quantity }}</span>
                <button
                  class="!rounded-button w-8 h-8 hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600"
                  @click="updateQuantity(item, 1)"
                >
                  <font-awesome-icon icon="plus" class="text-xs" />
                </button>
              </div>
              <div class="text-gray-400 mx-2">|</div>
              <button
                class="!rounded-button text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 flex items-center justify-center transition-colors duration-200"
                @click="removeItem(item)"
              >
                <font-awesome-icon icon="trash-alt" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结算信息区域 (30%) -->
    <div class="flex-[3] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div class="p-6 border-b">
        <h2 class="text-xl font-medium">结算信息</h2>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div class="space-y-6">
          <!-- 会员信息 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">会员卡号</label>
              <div class="flex space-x-3">
                <div class="flex-1 relative">
                  <font-awesome-icon
                    icon="id-card"
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    v-model="memberCardNo"
                    type="text"
                    class="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                    placeholder="请输入会员卡号"
                    ref="cardInputRef"
                    :readonly="!isReadingCard"
                    @keydown="handleKeyDown"
                  />
                </div>
                <button
                  @click="readMemberCard"
                  class="!rounded-button px-6 py-3 text-white flex items-center space-x-2 transition-all duration-300"
                  :class="[
                    isReadingCard
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  ]"
                  :disabled="isReadingCard"
                >
                  <font-awesome-icon
                    :icon="isReadingCard ? 'spinner' : 'credit-card'"
                    :class="{ 'fa-spin': isReadingCard }"
                  />
                  <span>{{ isReadingCard ? '读取中...' : '读取卡号' }}</span>
                </button>
              </div>
            </div>

            <!-- 会员信息卡片 -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
              <div class="flex items-center space-x-3 mb-4">
                <font-awesome-icon icon="user-circle" class="text-2xl" />
                <div>
                  <div class="text-sm opacity-80">会员信息</div>
                  <div class="font-medium text-lg">{{ memberInfo.name || '未读取' }}</div>
                </div>
              </div>
              <div
                class="flex items-center justify-between py-3 border-t border-white border-opacity-20"
              >
                <div class="opacity-80">可用积分</div>
                <div class="text-xl font-medium">{{ memberInfo.points || '0' }} 积分</div>
              </div>
            </div>
          </div>

          <!-- 金额信息 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div class="flex items-center space-x-2">
                <font-awesome-icon icon="calculator" class="text-blue-500" />
                <span class="text-gray-600">商品总额</span>
              </div>
              <div class="text-lg font-medium">{{ totalAmount }} 积分</div>
            </div>

            <div class="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div class="flex items-center space-x-2">
                <font-awesome-icon icon="tags" class="text-green-500" />
                <span class="text-gray-600">会员折扣</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-green-500">-</span>
                <input
                  type="number"
                  v-model.number="discountAmount"
                  class="w-24 px-3 py-2 border border-green-200 rounded-lg text-right text-green-500 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  @focus="handleDiscountFocus"
                  @input="handleDiscountInput"
                  @blur="handleDiscountBlur"
                />
                <span class="text-green-500">积分</span>
              </div>
            </div>

            <div
              class="flex justify-between items-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white"
            >
              <div class="flex items-center space-x-2">
                <font-awesome-icon icon="money-bill-wave" />
                <span>应付积分</span>
              </div>
              <div class="text-2xl font-medium">{{ finalAmount }} 积分</div>
            </div>

            <!-- 操作员选择 -->
            <div class="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div class="flex items-center space-x-2">
                <font-awesome-icon icon="user-tie" class="text-purple-500" />
                <span class="text-gray-600">操作员</span>
              </div>
              <div class="w-48">
                <el-select
                  v-model="selectedOperator"
                  filterable
                  placeholder="选择操作员"
                  class="!w-full"
                  popper-class="operator-select-dropdown"
                >
                  <el-option v-for="op in operators" :key="op.id" :value="op.id" :label="op.name">
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-5 h-5 bg-purple-50 rounded-full flex items-center justify-center"
                      >
                        <font-awesome-icon icon="user" class="text-purple-500 text-xs" />
                      </div>
                      <span class="text-sm">{{ op.name }}</span>
                      <span class="text-xs text-gray-400">({{ op.role }})</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </div>

            <!-- 备注信息移到这里 -->
            <div class="p-4 bg-yellow-50 rounded-xl">
              <div class="flex items-center space-x-2 mb-3">
                <font-awesome-icon icon="pencil-alt" class="text-yellow-500" />
                <span class="text-gray-600">备注信息</span>
              </div>
              <div class="relative">
                <textarea
                  v-model="notes"
                  class="w-full px-4 py-3 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white"
                  rows="3"
                  placeholder="请输入备注信息"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 固定在底部的结算按钮 -->
      <div class="p-6 border-t bg-white">
        <button
          class="!rounded-button w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium text-lg shadow-lg relative overflow-hidden group"
          :disabled="!canCheckout"
          :class="{ 'opacity-50 cursor-not-allowed from-gray-400 to-gray-500': !canCheckout }"
          @click="handleCheckout"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          ></div>
          <div class="relative flex items-center justify-center space-x-2">
            <font-awesome-icon icon="check-circle" />
            <span>{{ checkoutButtonText }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCartStore } from '@/types/api/user/cart'
import type { Operator } from '@/types/api/user/operator'
import type { CartStoreItem } from '@/types/api/user/cart'
import ProductImage from '@/components/common/ProductImage.vue'
import { storeInfoUtils } from '@/utils/storeInfo'

// 本地定义操作员类型以确保与实际使用保持一致
interface ShopOperator {
  id: string
  name: string
  role: string
}

const router = useRouter()
const cartStore = useCartStore()

// 购物车数据
const cartItems = computed(() => cartStore.items)

// 结算相关数据
const memberCardNo = ref('') // 显示在输入框中的卡号
const tempCardNo = ref('') // 临时存储读取到的内部卡号，不显示
const cardInputRef = ref<HTMLInputElement | null>(null)
const isReadingCard = ref(false)
const timeoutRef = ref<number | null>(null)
const memberInfo = ref<{
  name: string
  points: string
  id?: number
  icNumber?: string
  icStatus?: string
}>({
  name: '',
  points: ''
})
const notes = ref('')
const discountAmount = ref<number>(0)
const selectedOperator = ref<string>('')

// 操作员列表
const operators = ref<ShopOperator[]>([])

// 获取操作员列表
const fetchOperators = () => {
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

// 计算属性
const totalAmount = computed(() => {
  return cartStore.totalAmount
})

const finalAmount = computed(() => {
  return Math.max(0, totalAmount.value - (discountAmount.value || 0))
})

const canCheckout = computed(() => {
  if (!memberInfo.value.name) return false
  if (!selectedOperator.value) return false
  const availablePoints = parseInt(memberInfo.value.points.replace(',', ''))
  return availablePoints >= finalAmount.value
})

const checkoutButtonText = computed(() => {
  if (!memberInfo.value.name) return '请先读取会员卡'
  if (!selectedOperator.value) return '请选择操作员'
  if (!canCheckout.value) return '积分不足'
  return '确认支付'
})

// 初始化购物车和会员信息
const initCartAndMember = () => {
  if (cartStore.member) {
    memberInfo.value = {
      name: cartStore.member.name,
      points: cartStore.member.points.toString()
    }
  }
}

// 在组件挂载时初始化
onMounted(() => {
  initCartAndMember()
  fetchOperators() // 初始化时获取操作员列表
  // 添加全局键盘事件监听
  document.addEventListener('keydown', handleKeyDown)
})

// 在组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  // 清除超时计时器
  if (timeoutRef.value) {
    clearTimeout(timeoutRef.value)
    timeoutRef.value = null
  }
})

// 方法
const updateQuantity = (item: CartStoreItem, delta: number) => {
  const newQuantity = item.quantity + delta
  if (newQuantity > 0) {
    cartStore.updateItemQuantity(item.id, newQuantity)
  }
}

const removeItem = async (item: CartStoreItem) => {
  try {
    await ElMessageBox.confirm('确定要移除该商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    cartStore.removeItem(item.id)
    ElMessage.success('商品已移除')
  } catch {
    // 用户取消删除
  }
}

const previewImage = (item: CartStoreItem) => {
  // TODO: 实现图片预览功能
  console.log('Preview image:', item.product.image)
}

// 处理键盘输入事件
const handleKeyDown = (e: KeyboardEvent) => {
  // 如果正在读卡
  if (isReadingCard.value) {
    // 接受字母E和数字输入
    if (/^\d$/.test(e.key) || e.key.toUpperCase() === 'E') {
      tempCardNo.value += e.key.toUpperCase() // 存储到临时变量中，不显示
      // console.log('读取到卡号字符:', e.key, '当前卡号:', tempCardNo.value)
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      // 当按下回车或Tab键时，认为卡号输入完成，结束读卡并触发查询
      if (tempCardNo.value) {
        processCardNumber(tempCardNo.value)
      }
    }
    e.preventDefault() // 阻止默认行为，避免在其他输入框中输入
  }
}

// 处理完整的卡号
const processCardNumber = async (cardNumber: string) => {
  console.log('读取到完整会员卡号:', cardNumber)

  try {
    // 关闭读卡状态，避免重复读取
    isReadingCard.value = false
    document.removeEventListener('keydown', handleKeyDown)

    // 清除超时计时器
    if (timeoutRef.value) {
      clearTimeout(timeoutRef.value)
      timeoutRef.value = null
    }

    console.log('读取到的卡号-------:', cardNumber)
    // 通过store获取会员信息
    const success = await cartStore.fetchMemberByInterICNumber(cardNumber)

    if (success && cartStore.member) {
      // 会员信息已经在store中更新，从store中获取
      if (cartStore.member.icStatus === '停用' || cartStore.member.icStatus === '未激活') {
        ElMessage.error('会员卡已停用或未激活')
        memberCardNo.value = '' // 清空卡号显示
        tempCardNo.value = '' // 清空临时卡号
        return
      }
      memberInfo.value = {
        name: cartStore.member.name || '',
        points: cartStore.member.points?.toString() || '0',
        id: cartStore.member.id,
        icNumber: cartStore.member.icNumber || '',
        icStatus: cartStore.member.icStatus || ''
      }
      // 只有在成功获取会员信息后，才显示会员的卡号
      memberCardNo.value = memberInfo.value.icNumber || ''

      ElMessage.success('会员卡读取成功')
    } else {
      memberCardNo.value = '' // 清空卡号显示
      tempCardNo.value = '' // 清空临时卡号
      ElMessage.error('未找到会员信息')
    }
  } catch (error) {
    console.error('Failed to fetch member info:', error)
    ElMessage.error('获取会员信息失败')
    memberCardNo.value = '' // 清空卡号显示
    tempCardNo.value = '' // 清空临时卡号
  }
}

// 读取会员卡
const readMemberCard = async () => {
  try {
    // 清空卡号
    memberCardNo.value = ''
    tempCardNo.value = ''

    // 设置读卡状态
    isReadingCard.value = true

    ElMessage.info('请将IC卡放在读卡器上...')

    // 添加全局键盘事件监听
    document.addEventListener('keydown', handleKeyDown)

    // 清除之前可能存在的超时计时器
    if (timeoutRef.value) {
      clearTimeout(timeoutRef.value)
    }

    // 设置超时，如果10秒内没有读到卡，则取消读卡状态
    timeoutRef.value = window.setTimeout(() => {
      if (isReadingCard.value && !tempCardNo.value) {
        isReadingCard.value = false
        document.removeEventListener('keydown', handleKeyDown)
        ElMessage.warning('读卡超时，请重试')
      }
      timeoutRef.value = null
    }, 10000)
  } catch (error) {
    console.error('Failed to read member card:', error)
    ElMessage.error('会员卡读取失败，请重试')
    isReadingCard.value = false
    document.removeEventListener('keydown', handleKeyDown)
    // 清除超时计时器
    if (timeoutRef.value) {
      clearTimeout(timeoutRef.value)
      timeoutRef.value = null
    }
  }
}

// 修改监听会员卡号变化的逻辑
watch(tempCardNo, async newCardNo => {
  // 只在卡号长度达到特定值时处理
  if (newCardNo && newCardNo.length >= 24 && isReadingCard.value) {
    processCardNumber(newCardNo)
  }
})

const handleCheckout = async () => {
  console.log('点击确认支付按钮')
  if (!canCheckout.value) {
    console.log('不满足支付条件:', {
      hasMember: !!memberInfo.value.name,
      hasOperator: !!selectedOperator.value,
      memberPoints: memberInfo.value.points,
      finalAmount: finalAmount.value
    })
    return
  }

  try {
    await ElMessageBox.confirm('确认使用积分支付吗？', '确认支付', {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'info'
    })

    // 获取操作员名称用于显示
    const operatorName = operators.value.find(op => op.id === selectedOperator.value)?.name || ''

    console.log('开始调用结账API, 参数:', {
      operatorId: selectedOperator.value,
      operatorName: operatorName,
      discount: discountAmount.value ? Number(discountAmount.value) : 0,
      notes: notes.value
    })

    try {
      // 使用store处理结账流程，传递操作员ID、折扣和备注信息
      const result = await cartStore.processCheckout(
        selectedOperator.value,
        discountAmount.value ? Number(discountAmount.value) : 0,
        notes.value
      )

      console.log('结账API调用结果:', result)

      if (result) {
        // 无论API响应如何，前端看到积分已经扣除，直接视为成功
        ElMessage.success('支付成功')

        // 清空结算信息
        memberCardNo.value = ''
        memberInfo.value = { name: '', points: '' }
        notes.value = ''
        discountAmount.value = 0
        selectedOperator.value = ''
        operators.value = []
        cartStore.clearCart()
        // 重定向到购物车页面
        router.push('/user/shopping')
      } else {
        ElMessage.error('支付失败')
      }
    } catch (apiError) {
      console.error('支付API调用出错:', apiError)
      // 积分已经扣除，仍视为成功
      ElMessage.success('支付API调用出错')
      cartStore.clearCart()
    }
  } catch (error) {
    // 用户取消支付或发生错误
    console.error('支付过程中发生错误:', error)
  }
}

// 处理折扣输入框聚焦
const handleDiscountFocus = (e: FocusEvent) => {
  const input = e.target as HTMLInputElement
  // 聚焦时如果值为0，则清空
  if (discountAmount.value === 0) {
    input.value = ''
  }
}

// 处理折扣输入
const handleDiscountInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const value = input.value

  // 如果输入为空，允许空值以便清除
  if (!value) {
    return
  }

  const numValue = parseInt(value)
  // 如果是负数，重置为0
  if (numValue < 0) {
    input.value = '0'
    discountAmount.value = 0
  }
  // 如果超过总金额，限制为总金额
  else if (numValue > totalAmount.value) {
    input.value = totalAmount.value.toString()
    discountAmount.value = totalAmount.value
    ElMessage.warning('折扣不能超过总金额')
  }
}

// 处理折扣输入框失焦
const handleDiscountBlur = (e: FocusEvent) => {
  const input = e.target as HTMLInputElement
  // 如果为空，重置为0
  if (!input.value) {
    discountAmount.value = 0
  }
}

// 获取当前登录用户所在的店铺ID
const getCurrentShopId = (): number => {
  return storeInfoUtils.getShopId()
}
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

/* 设置选择框边框为透明或白色 */
:deep(.el-select .el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid transparent !important;
  background-color: #fff !important;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: none !important;
  border: 1px solid transparent !important;
  outline: none !important;
}

:deep(.el-select .el-input__wrapper:hover) {
  box-shadow: none !important;
  border: 1px solid transparent !important;
}

:deep(.operator-select-dropdown) {
  .el-select-dropdown__item {
    padding: 8px 12px;
  }

  .el-select-dropdown__item.selected {
    background-color: #f3e8ff;
    color: #9333ea;

    .text-purple-500 {
      color: #9333ea;
    }
  }
}
</style>
