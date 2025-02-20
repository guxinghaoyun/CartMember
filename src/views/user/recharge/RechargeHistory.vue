<template>
  <div class="space-y-6">
    <!-- 充值记录列表 -->
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
              <font-awesome-icon icon="fa-solid fa-credit-card" class="text-white text-xl" />
            </div>
            <div>
              <h2 class="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">充值记录</h2>
              <p class="text-gray-500 text-sm mt-1">查看会员充值历史记录</p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- 导出按钮 -->
          <button @click="exportToExcel"
                  :disabled="isExporting"
                  class="flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <font-awesome-icon icon="fa-solid fa-download" class="mr-2" />
            <span class="font-medium">{{ isExporting ? '导出中...' : '导出表格' }}</span>
          </button>
          
          <!-- 重置按钮 -->
          <button @click="resetFilters"
                  class="flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
            <font-awesome-icon icon="fa-solid fa-rotate" class="mr-2" />
            <span class="font-medium">重置筛选</span>
          </button>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="mb-6 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <!-- 基础筛选 -->
        <div class="flex items-center space-x-4 mb-4">
          <!-- 搜索框 -->
          <div class="relative flex-1">
            <input type="text" 
                   v-model="searchQuery"
                   placeholder="搜索会员/操作员" 
                   class="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full bg-white shadow-sm transition-all duration-300">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
          
          <!-- 时间范围选择 -->
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            class="!w-[320px]"/>
        </div>

        <!-- 高级筛选 -->
        <div class="grid grid-cols-3 gap-6">
          <!-- 金额范围 -->
          <div class="flex items-center space-x-3">
            <input type="number"
                   v-model="advancedFilters.minAmount"
                   placeholder="最小积分"
                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm transition-all duration-300" />
            <span class="text-gray-500 font-medium">至</span>
            <input type="number"
                   v-model="advancedFilters.maxAmount"
                   placeholder="最大积分"
                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm transition-all duration-300" />
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
              <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <font-awesome-icon icon="fa-solid fa-user" class="text-blue-500" />
              </div>
              <div>
                <div class="font-medium text-gray-900">{{ item.memberName }}</div>
                <div class="text-sm text-gray-500">{{ item.memberPhone }}</div>
              </div>
            </div>
          </template>

          <!-- IC卡面号列 -->
          <template #icCard="{ item }">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <font-awesome-icon icon="fa-solid fa-credit-card" class="text-indigo-500" />
              </div>
              <span class="font-medium text-gray-900">{{ item.icCard }}</span>
            </div>
          </template>

          <!-- 充值金额列 -->
          <template #amount="{ item }">
            <div class="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
              {{ item.amount }} 积分
            </div>
          </template>

          <!-- 充值商品列 -->
          <template #products="{ item }">
            <el-select
              v-model="item.selectedProduct"
              placeholder="查看商品"
              class="!w-full"
              popper-class="!w-[240px]">
              <el-option
                v-for="product in item.products"
                :key="product.id"
                :label="product.name"
                :value="product.id">
                <div class="flex justify-between items-center p-1">
                  <div class="flex items-center space-x-2">
                    <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-box" class="text-emerald-500" />
                    </div>
                    <span class="font-medium">{{ product.name }}</span>
                  </div>
                  <span class="text-blue-600 font-medium">{{ product.number }}</span>
                </div>
              </el-option>
            </el-select>
          </template>

          <!-- 操作员列 -->
          <template #operator="{ item }">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <font-awesome-icon icon="fa-solid fa-id-card" class="text-purple-500" />
              </div>
              <span class="font-medium text-gray-900">{{ item.operator }}</span>
            </div>
          </template>

          <!-- 操作列 -->
          <template #actions="{ item }">
            <div class="flex justify-end space-x-3">
              <button class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-all duration-300"
                      @click="handleViewDetail(item)"
                      title="查看详情">
                <font-awesome-icon icon="fa-solid fa-circle-info" />
              </button>
              <button class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all duration-300"
                      @click="handlePrint(item)"
                      title="打印凭证">
                <font-awesome-icon icon="fa-solid fa-print" />
              </button>
            </div>
          </template>
        </DataTable>
      </div>
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
              <div class="text-sm text-gray-500">充值积分</div>
              <div class="font-medium mt-1">{{ selectedRecord.amount }} 积分</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">充值商品</div>
              <div class="font-medium mt-1">
                <ul class="list-disc list-inside">
                  <li v-for="product in selectedRecord.products" :key="product.id" class="text-sm">
                    {{ product.name }} ({{ product.price }}积分)
                  </li>
                </ul>
              </div>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { DateModelType } from 'element-plus'
import DataTable from '@/components/common/DataTable.vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()

// 表格列配置
const columns = [
  { key: 'member', label: '会员信息' },
  { key: 'icCard', label: 'IC卡面号' },
  { key: 'amount', label: '充值积分' },
  { key: 'products', label: '充值商品' },
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
    products: [
      { id: 1, name: '精品茶叶礼盒', number: 688 },
      { id: 2, name: '特级大米5kg', number: 99 }
    ],
    status: 'success',
    operator: '李海燕',
    createTime: '2024-01-15',
    notes: '首次充值赠送100积分'
  },
  {
    id: 2,
    memberName: '王小明',
    memberPhone: '139****1234',
    icCard: '8800 3344 5566',
    currentPoints: '1,200',
    amount: 500,
    products: [
      { id: 3, name: '有机蔬菜礼盒', number: 199 }
    ],
    status: 'pending',
    operator: '王建国',
    createTime: '2024-01-14',
    notes: '系统处理中'
  },
  {
    id: 3,
    memberName: '张三',
    memberPhone: '137****4321',
    icCard: '8800 4455 6677',
    currentPoints: '800',
    amount: 1000,
    products: [],
    status: 'failed',
    operator: '张晓芳',
    createTime: '2024-01-13',
    notes: '支付失败，请重新尝试'
  },
  {
    id: 4,
    memberName: '李四',
    memberPhone: '135****8765',
    icCard: '8800 5566 7788',
    currentPoints: '2,300',
    amount: 200,
    products: [],
    status: 'cancelled',
    operator: '李海燕',
    createTime: '2024-01-12',
    notes: '用户取消充值'
  },
  {
    id: 5,
    memberName: '赵丽',
    memberPhone: '136****2468',
    icCard: '8800 6677 8899',
    currentPoints: '5,800',
    amount: 5000,
    products: [],
    status: 'success',
    operator: '刘明亮',
    createTime: '2024-01-11',
    notes: '充值满500送50积分'
  },
  {
    id: 6,
    memberName: '周杰',
    memberPhone: '133****1357',
    icCard: '8800 7788 9900',
    currentPoints: '1,500',
    amount: 3000,
    products: [],
    status: 'success',
    operator: '赵雪梅',
    createTime: '2024-01-10',
    notes: '节日活动充值双倍积分'
  },
  {
    id: 7,
    memberName: '吴婷婷',
    memberPhone: '134****9876',
    icCard: '8800 8899 0011',
    currentPoints: '900',
    amount: 800,
    products: [],
    status: 'pending',
    operator: '王建国',
    createTime: '2024-01-09',
    notes: '等待银行处理'
  },
  {
    id: 8,
    memberName: '孙明',
    memberPhone: '132****3579',
    icCard: '8800 9900 1122',
    currentPoints: '4,200',
    amount: 1500,
    products: [],
    money: '150.00',
    status: 'failed',
    operator: '张晓芳',
    createTime: '2024-01-08',
    notes: '网络连接异常'
  },
  {
    id: 9,
    memberName: '林小华',
    memberPhone: '131****2468',
    icCard: '8800 0011 2233',
    currentPoints: '2,800',
    amount: 2500,
    money: '250.00',
    status: 'success',
    operator: '李海燕',
    createTime: '2024-01-07',
    notes: '生日特惠充值'
  },
  {
    id: 10,
    memberName: '郑海燕',
    memberPhone: '130****1357',
    icCard: '8800 1122 3344',
    currentPoints: '1,600',
    amount: 1200,
    money: '120.00',
    status: 'cancelled',
    operator: '刘明亮',
    createTime: '2024-01-06',
    notes: '客户要求取消'
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

// 导出相关
const isExporting = ref(false)

// 高级筛选
const advancedFilters = ref({
  minAmount: '',
  maxAmount: ''
})

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

  // 高级筛选
  if (advancedFilters.value.minAmount) {
    result = result.filter(record => record.amount >= Number(advancedFilters.value.minAmount))
  }
  if (advancedFilters.value.maxAmount) {
    result = result.filter(record => record.amount <= Number(advancedFilters.value.maxAmount))
  }

  return result
})

const totalRecords = computed(() => filteredRecords.value.length)

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
  // 保存当前的筛选条件到 localStorage
  const filterState = {
    searchQuery: searchQuery.value,
    dateRange: dateRange.value,
    advancedFilters: advancedFilters.value,
    currentPage: currentPage.value
  }
  localStorage.setItem('rechargeHistoryFilters', JSON.stringify(filterState))
}

// 初始化时恢复筛选条件
onMounted(() => {
  const savedFilters = localStorage.getItem('rechargeHistoryFilters')
  if (savedFilters) {
    const { searchQuery: savedQuery, dateRange: savedRange, advancedFilters: savedAdvanced, currentPage: savedPage } = JSON.parse(savedFilters)
    searchQuery.value = savedQuery
    dateRange.value = savedRange
    advancedFilters.value = savedAdvanced
    currentPage.value = savedPage
    
    // 清除保存的筛选条件
    localStorage.removeItem('rechargeHistoryFilters')
  }
})

// 导出Excel
const exportToExcel = async () => {
  try {
    isExporting.value = true
    // TODO: 实现导出逻辑
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟导出延迟
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    isExporting.value = false
  }
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  dateRange.value = []
  advancedFilters.value = {
    minAmount: '',
    maxAmount: ''
  }
  currentPage.value = 1
}
</script> 