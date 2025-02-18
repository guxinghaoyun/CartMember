<template>
  <div class="space-y-6">
    <!-- 充值记录列表 -->
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-medium">充值记录</h2>
          <p class="text-gray-500 text-sm mt-1">查看会员充值历史记录</p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- 搜索框 -->
          <div class="relative">
            <input type="text" 
                   v-model="searchQuery"
                   placeholder="搜索会员/操作员" 
                   class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64">
            <font-awesome-icon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <!-- 时间范围选择 -->
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            class="!w-[300px]"/>
          <!-- 刷新按钮 -->
          <button @click="refreshList" 
                  class="!rounded-button bg-blue-50 text-blue-500 px-4 py-2 hover:bg-blue-100">
            <font-awesome-icon icon="sync-alt" />
          </button>
        </div>
      </div>

      <!-- 数据表格 -->
      <DataTable
        :columns="columns"
        :data="filteredRecords"
        :current-page="currentPage"
        :total="totalRecords"
        :page-size="pageSize"
        @page-change="handlePageChange">
        <!-- 会员信息列 -->
        <template #member="{ item }">
          <div class="flex items-center space-x-3">
            <font-awesome-icon icon="user-circle" class="text-gray-400" />
            <div>
              <div class="font-medium">{{ item.memberName }}</div>
              <div class="text-sm text-gray-500">{{ item.memberPhone }}</div>
            </div>
          </div>
        </template>

        <!-- 充值金额列 -->
        <template #amount="{ item }">
          <div class="space-y-1">
            <div class="font-medium text-blue-600">{{ item.amount }} 积分</div>
            <div class="text-sm text-gray-500">¥{{ item.money }}</div>
          </div>
        </template>

        <!-- 支付方式列 -->
        <template #paymentMethod="{ item }">
          <div class="flex items-center space-x-2">
            <i :class="getPaymentIcon(item.paymentMethod)" class="text-gray-400"></i>
            <span>{{ getPaymentText(item.paymentMethod) }}</span>
          </div>
        </template>

        <!-- 状态列 -->
        <template #status="{ item }">
          <div :class="getStatusClass(item.status)"
               class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            <i :class="getStatusIcon(item.status)" class="mr-1"></i>
            {{ getStatusText(item.status) }}
          </div>
        </template>

        <!-- 操作员列 -->
        <template #operator="{ item }">
          <div class="flex items-center space-x-2">
            <font-awesome-icon icon="user-tie" class="text-gray-400" />
            <span>{{ item.operator }}</span>
          </div>
        </template>

        <!-- 操作列 -->
        <template #actions="{ item }">
          <div class="flex justify-end space-x-2">
            <button class="!rounded-button text-blue-600 hover:text-blue-800 px-2 py-1"
                    @click="handleViewDetail(item)">
              <font-awesome-icon icon="eye" />
            </button>
            <button class="!rounded-button text-green-600 hover:text-green-800 px-2 py-1"
                    @click="handlePrint(item)">
              <font-awesome-icon icon="print" />
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      title="充值详情"
      width="600px">
      <div v-if="selectedRecord" class="space-y-6">
        <!-- 会员信息 -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-3">会员信息</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">会员姓名</div>
              <div class="font-medium mt-1">{{ selectedRecord.memberName }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">手机号码</div>
              <div class="font-medium mt-1">{{ selectedRecord.memberPhone }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">IC卡号</div>
              <div class="font-medium mt-1">{{ selectedRecord.icCard }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">当前积分</div>
              <div class="font-medium mt-1">{{ selectedRecord.currentPoints }}</div>
            </div>
          </div>
        </div>

        <!-- 充值信息 -->
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-3">充值信息</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">充值金额</div>
              <div class="font-medium mt-1">¥{{ selectedRecord.money }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">获得积分</div>
              <div class="font-medium mt-1">{{ selectedRecord.amount }} 积分</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">支付方式</div>
              <div class="font-medium mt-1">{{ getPaymentText(selectedRecord.paymentMethod) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">充值状态</div>
              <div class="font-medium mt-1">{{ getStatusText(selectedRecord.status) }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">操作员</div>
              <div class="font-medium mt-1">{{ selectedRecord.operator }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">充值时间</div>
              <div class="font-medium mt-1">{{ selectedRecord.createTime }}</div>
            </div>
          </div>
        </div>

        <!-- 备注信息 -->
        <div v-if="selectedRecord.notes" class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-3">备注信息</h3>
          <div class="text-gray-600">{{ selectedRecord.notes }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { DateModelType } from 'element-plus'
import DataTable from '@/components/common/DataTable.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表格列配置
const columns = [
  { key: 'member', label: '会员信息' },
  { key: 'amount', label: '充值金额' },
  { key: 'paymentMethod', label: '支付方式' },
  { key: 'status', label: '状态' },
  { key: 'operator', label: '操作员' },
  { key: 'createTime', label: '充值时间' },
  { key: 'actions', label: '操作', class: 'text-right' }
]

// 充值记录数据
const rechargeRecords = ref([
  {
    id: 1,
    memberName: '陈思悦',
    memberPhone: '138****5678',
    icCard: '8800 2233 4455',
    currentPoints: '3,560',
    amount: 2000,
    money: '200.00',
    paymentMethod: 'wechat',
    status: 'success',
    operator: '李海燕',
    createTime: '2024-01-15',
    notes: '首次充值赠送100积分'
  },
  {
    id: 2,
    memberName: '陈思悦',
    memberPhone: '138****5678',
    icCard: '8800 2233 4455',
    currentPoints: '3,560',
    amount: 500,
    money: '50.00',
    paymentMethod: 'alipay',
    status: 'success',
    operator: '王建国',
    createTime: '2024-01-10'
  },
  {
    id: 3,
    memberName: '陈思悦',
    memberPhone: '138****5678',
    icCard: '8800 2233 4455',
    currentPoints: '3,560',
    amount: 1000,
    money: '100.00',
    paymentMethod: 'cash',
    status: 'success',
    operator: '张晓芳',
    createTime: '2024-01-05'
  },
  {
    id: 4,
    memberName: '陈思悦',
    memberPhone: '138****5678',
    icCard: '8800 2233 4455',
    currentPoints: '3,560',
    amount: 200,
    money: '20.00',
    paymentMethod: 'wechat',
    status: 'success',
    operator: '李海燕',
    createTime: '2024-01-01'
  }
])

// 搜索和筛选
const searchQuery = ref('')
const dateRange = ref<DateModelType[]>([])
const currentPage = ref(1)
const pageSize = ref(10)

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 计算属性
const filteredRecords = computed(() => {
  let result = rechargeRecords.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(record => 
      record.memberName.toLowerCase().includes(query) ||
      record.memberPhone.includes(query) ||
      record.operator.toLowerCase().includes(query)
    )
  }

  // 日期范围过滤
  if (dateRange.value && dateRange.value.length === 2) {
    const start = dateRange.value[0]
    const end = dateRange.value[1]
    if (start && end) {
      result = result.filter(record => {
        const recordDate = new Date(record.createTime)
        return recordDate >= start && recordDate <= end
      })
    }
  }

  return result
})

const totalRecords = computed(() => filteredRecords.value.length)

// 支付方式相关
const getPaymentIcon = (method: string) => {
  const icons = {
    wechat: 'fab fa-weixin',
    alipay: 'fab fa-alipay',
    cash: 'fas fa-money-bill-wave'
  }
  return icons[method as keyof typeof icons]
}

const getPaymentText = (method: string) => {
  const texts = {
    wechat: '微信支付',
    alipay: '支付宝',
    cash: '现金'
  }
  return texts[method as keyof typeof texts]
}

// 状态相关
const getStatusClass = (status: string) => {
  const classes = {
    success: 'bg-green-50 text-green-600',
    pending: 'bg-yellow-50 text-yellow-600',
    failed: 'bg-red-50 text-red-600'
  }
  return classes[status as keyof typeof classes]
}

const getStatusIcon = (status: string) => {
  const icons = {
    success: 'check-circle',
    pending: 'clock',
    failed: 'times-circle'
  }
  return icons[status as keyof typeof icons]
}

const getStatusText = (status: string) => {
  const texts = {
    success: '充值成功',
    pending: '处理中',
    failed: '充值失败'
  }
  return texts[status as keyof typeof texts]
}

// 详情弹窗
const showDetailDialog = ref(false)
const selectedRecord = ref<any>(null)

// 方法
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const refreshList = () => {
  // TODO: 实现刷新逻辑
  ElMessage.success('列表已刷新')
}

const handleViewDetail = (record: any) => {
  selectedRecord.value = record
  showDetailDialog.value = true
}

const handlePrint = (record: any) => {
  // TODO: 实现打印逻辑
  ElMessage.success('正在打印充值凭证')
}

// 查看更多记录
const viewMore = () => {
  router.push('/recharge/history')
}
</script> 