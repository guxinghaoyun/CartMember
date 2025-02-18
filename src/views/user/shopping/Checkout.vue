<template>
  <div class="space-y-6">
    <!-- 结算信息 -->
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <h2 class="text-xl font-medium mb-6">结算信息</h2>
      <div class="grid grid-cols-2 gap-8">
        <!-- 左侧：会员信息 -->
        <div class="space-y-6">
          <!-- 会员卡输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">会员卡号</label>
            <div class="flex space-x-3">
              <div class="flex-1 relative">
                <i class="fas fa-id-card absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="memberCardNo" 
                       type="text" 
                       class="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" 
                       placeholder="请输入会员卡号"/>
              </div>
              <button @click="readMemberCard" 
                      class="!rounded-button bg-blue-500 text-white px-6 hover:bg-blue-600 flex items-center space-x-2">
                <i class="fas fa-credit-card"></i>
                <span>读取卡号</span>
              </button>
            </div>
          </div>

          <!-- 会员信息卡片 -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div class="flex items-center space-x-3 mb-4">
              <i class="fas fa-user-circle text-2xl"></i>
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

          <!-- 订单商品 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-700 mb-3">订单商品</h3>
            <div class="space-y-3">
              <div v-for="item in cartItems" :key="item.id"
                   class="flex items-center justify-between p-3 bg-white rounded-lg">
                <div class="flex items-center space-x-3">
                  <img :src="item.image" 
                       :alt="item.name"
                       class="w-12 h-12 rounded-lg object-cover"/>
                  <div>
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-sm text-gray-500">{{ item.price }} 积分 × {{ item.quantity }}</div>
                  </div>
                </div>
                <div class="font-medium text-blue-600">
                  {{ item.price * item.quantity }} 积分
                </div>
              </div>
            </div>
          </div>

          <!-- 备注信息 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">备注信息</label>
            <div class="relative">
              <i class="fas fa-pencil-alt absolute left-4 top-4 text-gray-400"></i>
              <textarea v-model="notes"
                        class="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                        rows="3"
                        placeholder="请输入备注信息"></textarea>
            </div>
          </div>
        </div>

        <!-- 右侧：结算金额 -->
        <div class="bg-white p-8 rounded-2xl relative overflow-hidden shadow-lg">
          <!-- 装饰背景 -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-full opacity-50"></div>

          <!-- 结算内容 -->
          <div class="relative space-y-6">
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div class="flex items-center space-x-2">
                <i class="fas fa-calculator text-blue-500"></i>
                <span class="text-gray-600">商品总额</span>
              </div>
              <div class="text-lg font-medium">{{ totalAmount }} 积分</div>
            </div>

            <div class="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div class="flex items-center space-x-2">
                <i class="fas fa-tags text-green-500"></i>
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
                <i class="fas fa-money-bill-wave"></i>
                <span>应付积分</span>
              </div>
              <div class="text-2xl font-medium">{{ finalAmount }} 积分</div>
            </div>

            <!-- 支付方式 -->
            <div class="space-y-3">
              <div class="text-sm font-medium text-gray-700">选择支付方式</div>
              <div class="grid grid-cols-2 gap-3">
                <button v-for="method in paymentMethods" :key="method.value"
                        class="flex items-center justify-center space-x-2 p-3 border rounded-lg transition-all duration-300"
                        :class="{'border-blue-500 bg-blue-50 text-blue-600': selectedPayment === method.value,
                                'hover:border-blue-200': selectedPayment !== method.value}"
                        @click="selectedPayment = method.value">
                  <i :class="method.icon"></i>
                  <span>{{ method.label }}</span>
                </button>
              </div>
            </div>

            <button class="!rounded-button w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium text-lg shadow-lg relative overflow-hidden group"
                    :disabled="!canCheckout"
                    :class="{'opacity-50 cursor-not-allowed from-gray-400 to-gray-500': !canCheckout}"
                    @click="handleCheckout">
              <div class="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div class="relative flex items-center justify-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span>{{ checkoutButtonText }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 会员信息
const memberCardNo = ref('')
const memberInfo = ref({
  name: '',
  points: ''
})

// 订单商品数据
const cartItems = ref([
  {
    id: 1,
    name: '有机草莓',
    price: 399,
    quantity: 1,
    image: 'https://ai-public.mastergo.com/ai/img_res/86f839615a018f782144b9ec9be235d4.jpg'
  },
  {
    id: 2,
    name: '进口牛奶',
    price: 680,
    quantity: 2,
    image: 'https://ai-public.mastergo.com/ai/img_res/e4283893b198106bcb77f4a097397da1.jpg'
  }
])

// 支付方式
const paymentMethods = [
  { value: 'points', label: '积分支付', icon: 'fas fa-coins' },
  { value: 'mixed', label: '混合支付', icon: 'fas fa-credit-card' }
]

// 结算相关数据
const notes = ref('')
const discountAmount = ref<number>(0)
const selectedPayment = ref('')

// 计算属性
const totalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const finalAmount = computed(() => {
  return Math.max(0, totalAmount.value - (discountAmount.value || 0))
})

const canCheckout = computed(() => {
  if (!memberInfo.value.name) return false
  if (!selectedPayment.value) return false
  const availablePoints = parseInt(memberInfo.value.points.replace(',', ''))
  return availablePoints >= finalAmount.value
})

const checkoutButtonText = computed(() => {
  if (!memberInfo.value.name) return '请先读取会员卡'
  if (!selectedPayment.value) return '请选择支付方式'
  if (!canCheckout.value) return '积分不足'
  return '确认支付'
})

// 方法
const readMemberCard = () => {
  // 模拟读取会员卡
  memberInfo.value = {
    name: '陈思悦',
    points: '3,560'
  }
  ElMessage.success('会员卡读取成功')
}

const handleCheckout = async () => {
  if (!canCheckout.value) return
  
  try {
    await ElMessageBox.confirm(
      `确认使用${selectedPayment.value === 'points' ? '积分' : '混合'}方式支付 ${finalAmount.value} 积分？`,
      '确认支付',
      {
        confirmButtonText: '确认支付',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    // TODO: 实现支付逻辑
    await new Promise(resolve => setTimeout(resolve, 800)) // 模拟支付过程
    
    ElMessage.success('支付成功')
    router.push('/member') // 支付完成后跳转到会员页面
    
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
</style> 