<template>
  <div class="h-[calc(100vh-64px)] bg-gray-50 p-6">
    <div class="flex gap-6 h-full">
      <!-- 左侧充值区域 (70%) -->
      <div class="flex-[7] space-y-6">
        <!-- 会员信息卡片 -->
        <div class="bg-blue-500 rounded-lg p-6 text-white">
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <font-awesome-icon icon="user" class="text-xl" />
            </div>
            <div>
              <div class="text-sm opacity-80">会员姓名</div>
              <div class="text-xl font-medium">陈思悦</div>
            </div>
            <button class="!rounded-button bg-white bg-opacity-20 px-4 py-1.5 text-sm ml-4 hover:bg-opacity-30"
                    @click="handleReadCard">
              <font-awesome-icon icon="id-card" class="mr-2" />
              读取会员卡
            </button>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <div class="text-sm opacity-80">可用积分</div>
              <div class="text-2xl font-medium mt-1">3,560</div>
            </div>
          </div>
        </div>

        <!-- 充值进度 -->
        <div class="grid grid-cols-2 gap-6">
          <!-- 本月充值 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div>
                <font-awesome-icon icon="wallet" class="text-blue-500 mr-2" />
                <span>本月充值</span>
              </div>
              <div class="text-xl font-medium text-blue-500">2,680 积分</div>
            </div>
            <div class="relative">
              <div class="text-sm text-gray-500 mb-2">完成进度</div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full" style="width: 75%"></div>
              </div>
              <div class="text-sm text-blue-500 mt-2">75%</div>
            </div>
          </div>
          <!-- 年度目标 -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div>
                <font-awesome-icon icon="chart-line" class="text-green-500 mr-2" />
                <span>累计充值</span>
              </div>
              <div class="text-xl font-medium text-green-500">12,800 积分</div>
            </div>
            <div class="relative">
              <div class="text-sm text-gray-500 mb-2">年度目标</div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-green-500 rounded-full" style="width: 50%"></div>
              </div>
              <div class="text-sm text-green-500 mt-2">50%</div>
            </div>
          </div>
        </div>

        <!-- 充值金额选项 -->
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium">充值金额</h3>
            <div class="relative">
              <select v-model="selectedOperator" 
                      class="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">选择操作员</option>
                <option value="1">张三</option>
                <option value="2">李四</option>
              </select>
              <font-awesome-icon icon="user" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <!-- 充值选项网格 -->
          <div class="grid grid-cols-4 gap-4 mb-6">
            <button v-for="amount in rechargeAmounts" 
                    :key="amount"
                    class="p-4 border rounded-lg hover:border-blue-500 hover:shadow-sm transition-all duration-300 group"
                    :class="{ 'border-blue-500 shadow-sm': selectedAmount === amount }"
                    @click="selectedAmount = amount">
              <div class="text-sm text-gray-500 mb-2 group-hover:text-blue-500"
                   :class="{ 'text-blue-500': selectedAmount === amount }">充值</div>
              <div class="text-lg font-medium group-hover:text-blue-600"
                   :class="{ 'text-blue-600': selectedAmount === amount }">
                {{ amount }} 积分
              </div>
            </button>
          </div>

          <!-- 其他金额输入 -->
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <div class="text-sm text-gray-500 mb-2">其他积分</div>
              <div class="relative">
                <input type="number" 
                       v-model="customAmount"
                       class="w-full pl-4 pr-16 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="请输入充值积分"/>
                <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">积分</span>
              </div>
            </div>
            <button class="!rounded-button bg-blue-500 text-white px-8 py-3 hover:bg-blue-600 mt-7"
                    @click="handleRecharge"
                    :disabled="!canRecharge">
              确认充值
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧充值记录 (30%) -->
      <div class="flex-[3] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-medium">充值记录</h2>
            <button @click="viewMore" 
                    class="text-blue-500 hover:text-blue-600 text-sm">
              查看更多
              <font-awesome-icon icon="chevron-right" class="ml-1" />
            </button>
          </div>
        </div>
        
        <!-- 充值记录列表 -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-4">
            <div v-for="record in rechargeRecords" 
                 :key="record.id"
                 class="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div class="text-lg font-medium">充值 {{ record.amount }} 积分</div>
                <div class="text-sm text-gray-500 mt-1">{{ record.date }}</div>
              </div>
              <div class="text-green-500">
                <font-awesome-icon icon="check-circle" class="mr-1" />
                成功
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 充值选项
const rechargeAmounts = [100, 200, 500, 1000, 2000, 5000, 10000, 20000]
const selectedAmount = ref(0)
const customAmount = ref('')
const selectedOperator = ref('')

// 充值记录
const rechargeRecords = ref([
  { id: 1, amount: 2000, date: '2024-01-15', status: 'success' },
  { id: 2, amount: 500, date: '2024-01-10', status: 'success' },
  { id: 3, amount: 1000, date: '2024-01-05', status: 'success' },
  { id: 4, amount: 200, date: '2024-01-01', status: 'success' }
])

// 计算属性
const canRecharge = computed(() => {
  return (selectedAmount.value > 0 || customAmount.value) && selectedOperator.value
})

// 方法
const handleReadCard = () => {
  ElMessage.success('会员卡读取成功')
}

const handleRecharge = () => {
  const amount = selectedAmount.value || parseInt(customAmount.value)
  if (!amount) {
    ElMessage.warning('请选择或输入充值金额')
    return
  }
  
  if (!selectedOperator.value) {
    ElMessage.warning('请选择操作员')
    return
  }

  ElMessage.success(`充值 ${amount} 积分成功`)
  // 重置表单
  selectedAmount.value = 0
  customAmount.value = ''
}

const viewMore = () => {
  router.push('/recharge/history')
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
</style> 