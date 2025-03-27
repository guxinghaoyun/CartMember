<template>
  <div class="h-[calc(100vh-64px)] space-y-6 p-6 bg-gray-50">
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
            <div v-for="item in cartItems" :key="item.id"
                 class="group flex items-center justify-between p-4 border rounded-lg hover:border-blue-200 hover:shadow-sm transition-all duration-300">
              <div class="flex items-center space-x-6">
                <div class="relative w-20 h-20">
                  <img :src="item.product.image" 
                       :alt="item.product.name"
                       class="w-full h-full object-cover rounded-lg shadow-sm"/>
                  <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <button class="!rounded-button text-white hover:text-red-200 p-2"
                            @click="previewImage(item)">
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
                  <button class="!rounded-button w-8 h-8 hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600"
                          @click="updateQuantity(item, -1)">
                    <font-awesome-icon icon="minus" class="text-xs" />
                  </button>
                  <span class="px-4 font-medium text-gray-700">{{ item.quantity }}</span>
                  <button class="!rounded-button w-8 h-8 hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600"
                          @click="updateQuantity(item, 1)">
                    <font-awesome-icon icon="plus" class="text-xs" />
                  </button>
                </div>
                <div class="text-gray-400 mx-2">|</div>
                <button class="!rounded-button text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 flex items-center justify-center transition-colors duration-200"
                        @click="removeItem(item)">
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
                    <font-awesome-icon icon="id-card" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input v-model="memberCardNo" 
                           type="text" 
                           class="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" 
                           placeholder="请输入会员卡号"/>
                  </div>
                  <button @click="readMemberCard" 
                          class="!rounded-button bg-blue-500 text-white px-6 hover:bg-blue-600 flex items-center space-x-2">
                    <font-awesome-icon icon="credit-card" />
                    <span>读取卡号</span>
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
                <div class="flex items-center justify-between py-3 border-t border-white border-opacity-20">
                  <div class="opacity-80">可用积分</div>
                  <div class="text-xl font-medium">{{ memberInfo.points || '0' }} 积分</div>
                </div>
              </div>

              <!-- 备注信息 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">备注信息</label>
                <div class="relative">
                  <font-awesome-icon icon="pencil-alt" class="absolute left-4 top-4 text-gray-400" />
                  <textarea v-model="notes"
                            class="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                            rows="3"
                            placeholder="请输入备注信息"></textarea>
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
                  <input type="number"
                         v-model="discountAmount"
                         class="w-24 px-3 py-2 border border-green-200 rounded-lg text-right text-green-500 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white"/>
                  <span class="text-green-500">积分</span>
                </div>
              </div>

              <div class="flex justify-between items-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
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
                    popper-class="operator-select-dropdown">
                    <el-option
                      v-for="op in operators"
                      :key="op.id"
                      :value="op.id"
                      :label="op.name">
                      <div class="flex items-center space-x-2">
                        <div class="w-5 h-5 bg-purple-50 rounded-full flex items-center justify-center">
                          <font-awesome-icon icon="user" class="text-purple-500 text-xs" />
                        </div>
                        <span class="text-sm">{{ op.name }}</span>
                        <span class="text-xs text-gray-400">({{ op.role }})</span>
                      </div>
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 固定在底部的结算按钮 -->
        <div class="p-6 border-t bg-white">
          <button class="!rounded-button w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium text-lg shadow-lg relative overflow-hidden group"
                  :disabled="!canCheckout"
                  :class="{'opacity-50 cursor-not-allowed from-gray-400 to-gray-500': !canCheckout}"
                  @click="handleCheckout">
            <div class="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div class="relative flex items-center justify-center space-x-2">
              <font-awesome-icon icon="check-circle" />
              <span>{{ checkoutButtonText }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCartStore } from '@/types/api/user/cart'
import type { Operator } from '@/types/api/user/operator'
import type { CartStoreItem } from '@/types/api/user/cart'

const router = useRouter()
const cartStore = useCartStore()

// 购物车数据
const cartItems = computed(() => cartStore.items)

// 结算相关数据
const memberCardNo = ref('')
const memberInfo = ref<{
  name: string;
  points: string;
  id?: number;
}>({
  name: '',
  points: ''
})
const notes = ref('')
const discountAmount = ref<number>(0)
const selectedOperator = ref('')

// 操作员列表
const operators = ref<Operator[]>([])

// 获取操作员列表
const fetchOperators = async () => {
  try {
    operators.value = await cartStore.fetchOperators()
  } catch (error) {
    console.error('Failed to fetch operators:', error)
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

const readMemberCard = async () => {
  try {
    // 模拟从IC读卡器获取卡号
    // TODO: 替换为实际的IC读卡器接口调用
    const icCardNo = await simulateReadICCard()
    memberCardNo.value = icCardNo

    // 通过store获取会员信息
    const memberData = await cartStore.fetchMemberById(parseInt(icCardNo))
    
    if (memberData) {
      // 更新会员信息显示
      memberInfo.value = {
        name: memberData.name,
        points: memberData.remainingPoints.toString(),
        id: memberData.id
      }
      
      ElMessage.success('会员卡读取成功')
    } else {
      ElMessage.error('未找到会员信息')
    }
  } catch (error) {
    console.error('Failed to read member card:', error)
    ElMessage.error('会员卡读取失败，请重试')
  }
}

// 模拟IC读卡器读取卡号
// TODO: 替换为实际的IC读卡器接口实现
const simulateReadICCard = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 模拟读卡延迟
    setTimeout(() => {
      // 模拟生成会员卡号（实际应该从IC卡中读取）
      const cardNo = '100001'
      resolve(cardNo)
    }, 500)
  })
}

const handleCheckout = async () => {
  if (!canCheckout.value) return
  
  try {
    await ElMessageBox.confirm('确认使用积分支付吗？', '确认支付', {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    // 使用store处理结账流程
    const success = await cartStore.processCheckout()
    
    if (success) {
      ElMessage.success('支付成功')
      router.push('/member') // 支付完成后跳转到会员页面
    } else {
      ElMessage.error('支付失败，请重试')
    }
  } catch {
    // 用户取消支付
  }
}
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
    background-color: #F3E8FF;
    color: #9333EA;
    
    .text-purple-500 {
      color: #9333EA;
    }
  }
}
</style> 