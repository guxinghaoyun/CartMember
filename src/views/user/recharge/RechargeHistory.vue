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
          <button @click="handleExport"
                  :disabled="loading"
                  class="flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <font-awesome-icon icon="fa-solid fa-download" class="mr-2" />
            <span class="font-medium">{{ loading ? '导出中...' : '导出表格' }}</span>
          </button>
          
          <!-- 重置按钮 -->
          <button @click="handleReset"
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
                   v-model="queryParams.keyword"
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
                   v-model="queryParams.minAmount"
                   placeholder="最小积分"
                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm transition-all duration-300" />
            <span class="text-gray-500 font-medium">至</span>
            <input type="number"
                   v-model="queryParams.maxAmount"
                   placeholder="最大积分"
                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm transition-all duration-300" />
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <DataTable
          :columns="columns"
          :data="records"
          :current-page="queryParams.page"
          :total="total"
          :page-size="queryParams.pageSize"
          @page-change="handlePageChange"
          @size-change="handleSizeChange">
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
                  <span class="text-blue-600 font-medium">{{ product.quantity }}</span>
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
                      @click="handleViewDetail(item.id)"
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
import { rechargeApi } from '@/api/user/recharge'
import type { RechargeOrder, RechargeRecordQueryParams, RechargeRecordResponse } from '@/types/api/user/recharge'
import type { ApiResponse } from '@/types/api/common'
import type { AxiosResponse } from 'axios'

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

const loading = ref(false)
const records = ref<RechargeOrder[]>([])
const total = ref(0)
const dateRange = ref<DateModelType[]>([])
const selectedRecord = ref<RechargeOrder | null>(null)
const showDetailDialog = ref(false)

const queryParams = ref<RechargeRecordQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  orderNo: '',
  status: undefined,
  operatorId: undefined,
  minAmount: undefined,
  maxAmount: undefined,
  startDate: '',
  endDate: ''
})

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
  let result = records.value

  // 搜索过滤
  if (queryParams.value.keyword) {
    const query = queryParams.value.keyword.toLowerCase()
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
  if (queryParams.value.minAmount) {
    result = result.filter(record => record.amount >= Number(queryParams.value.minAmount))
  }
  if (queryParams.value.maxAmount) {
    result = result.filter(record => record.amount <= Number(queryParams.value.maxAmount))
  }

  return result
})

const totalRecords = computed(() => filteredRecords.value.length)

// 方法
const handlePageChange = (page: number) => {
  queryParams.value.page = page
  fetchRecords()
}

const handleSizeChange = (size: number) => {
  queryParams.value.pageSize = size
  queryParams.value.page = 1
  fetchRecords()
}

const handleSearch = () => {
  queryParams.value.page = 1
  fetchRecords()
}

const handleReset = () => {
  queryParams.value = {
    page: 1,
    pageSize: 10,
    keyword: '',
    orderNo: '',
    status: undefined,
    operatorId: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    startDate: '',
    endDate: ''
  }
  dateRange.value = []
  fetchRecords()
}

const handleViewDetail = async (id: number) => {
  try {
    const response = await rechargeApi.getRechargeDetail(id)
    if (response.data.data) {
      selectedRecord.value = response.data.data
      showDetailDialog.value = true
    }
  } catch (error) {
    console.error('Failed to fetch recharge detail:', error)
    ElMessage.error('获取充值详情失败')
  }
}

const handlePrint = (record: RechargeOrder) => {
  // TODO: 实现打印逻辑
  ElMessage.success('正在打印充值凭证')
}

// 获取充值记录列表
const fetchRecords = async () => {
  loading.value = true
  try {
    // 更新日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0]
      const endDate = dateRange.value[1]
      queryParams.value.startDate = startDate ? startDate.toString().split('T')[0] : ''
      queryParams.value.endDate = endDate ? endDate.toString().split('T')[0] : ''
    } else {
      queryParams.value.startDate = ''
      queryParams.value.endDate = ''
    }

    const response = await rechargeApi.getRechargeRecords(queryParams.value)
    records.value = response.data.data.data
    total.value = response.data.data.total
  } catch (error) {
    console.error('Failed to fetch recharge records:', error)
    ElMessage.error('获取充值记录失败')
  } finally {
    loading.value = false
  }
}

// 导出充值记录
const handleExport = async () => {
  try {
    const response = await rechargeApi.exportRechargeRecords(queryParams.value)
    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `充值记录_${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export recharge records:', error)
    ElMessage.error('导出充值记录失败')
  }
}

onMounted(() => {
  fetchRecords()
})
</script> 