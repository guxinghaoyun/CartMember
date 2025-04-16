<template>
  <div class="space-y-6">
    <!-- 充值记录列表 -->
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <font-awesome-icon icon="fa-solid fa-credit-card" class="text-white text-xl" />
            </div>
            <div>
              <h2
                class="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
              >
                充值记录
              </h2>
              <p class="text-gray-500 text-sm mt-1">查看会员充值历史记录</p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- 导出按钮 -->
          <button
            @click="handleExport"
            :disabled="loading"
            class="flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon icon="fa-solid fa-download" class="mr-2" />
            <span class="font-medium">{{ loading ? '导出中...' : '导出表格' }}</span>
          </button>

          <!-- 重置按钮 -->
          <!-- <button
            @click="handleReset"
            class="flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <font-awesome-icon icon="fa-solid fa-rotate" class="mr-2" />
            <span class="font-medium">重置筛选</span>
          </button> -->
        </div>
      </div>

      <!-- 筛选区域 -->
      <div
        class="mb-6 bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm"
      >
        <!-- 所有筛选按比例放在一行 -->
        <div class="flex items-center gap-3">
          <!-- 搜索框 - 增加占比 -->
          <div class="flex-[6]" style="min-width: 160px; max-width: 25%">
            <div class="relative w-full">
              <input
                type="text"
                v-model="queryParams.keyword"
                placeholder="搜索会员"
                class="pl-10 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full bg-white shadow-sm transition-all duration-300"
              />
              <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
              />
            </div>
          </div>

          <!-- 时间范围选择 -->
          <div class="flex-[2.5]" style="min-width: 180px; max-width: 40%">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="dateShortcuts"
              class="!w-full"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              :clearable="true"
              size="default"
            />
          </div>

          <!-- 积分范围 -->
          <div class="flex-1" style="min-width: 150px">
            <div class="flex items-center space-x-1">
              <input
                type="number"
                v-model="queryParams.minAmount"
                placeholder="最小积分"
                class="flex-1 px-2 py-2 text-sm text-center border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm transition-all duration-300"
              />
              <span class="text-gray-500 font-medium">至</span>
              <input
                type="number"
                v-model="queryParams.maxAmount"
                placeholder="最大积分"
                class="flex-1 px-2 py-2 text-sm text-center border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm transition-all duration-300"
              />
            </div>
          </div>

          <!-- 搜索按钮 -->
          <button
            @click="handleSearch"
            class="flex items-center px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <font-awesome-icon icon="fa-solid fa-search" class="mr-1" />
            <span class="font-medium">搜索</span>
          </button>
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
          @size-change="handleSizeChange"
        >
          <!-- 会员信息列 -->
          <template #member="{ item }">
            <div class="flex items-center justify-center w-full">
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <font-awesome-icon icon="fa-solid fa-user" class="text-blue-500" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ item.membershipName }}</div>
                  <div class="text-sm text-gray-500">{{ item.membershipPhone }}</div>
                </div>
              </div>
            </div>
          </template>

          <!-- IC卡面号列 -->
          <template #icCard="{ item }">
            <div class="flex items-center justify-center w-full">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <font-awesome-icon icon="fa-solid fa-credit-card" class="text-indigo-500" />
                </div>
                <span class="font-medium text-gray-900">{{ item.icNumber }}</span>
              </div>
            </div>
          </template>

          <!-- 充值金额列 -->
          <template #score="{ item }">
            <div class="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
              {{ item.rechargeScore }} 积分
            </div>
          </template>

          <!-- 充值商品列 -->
          <template #products="{ item }">
            <el-select
              v-model="item.selectedProduct"
              placeholder="查看商品"
              class="!w-full"
              popper-class="!w-[240px]"
            >
              <el-option
                v-for="product in item.rechargeProducts"
                :key="product.id"
                :label="product.name"
                :value="product.id"
              >
                <div class="flex justify-between items-center p-1">
                  <div class="flex items-center space-x-2">
                    <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-box" class="text-emerald-500" />
                    </div>
                    <span class="font-medium">{{ product.name }}</span>
                  </div>
                  <span class="text-blue-600 font-medium">{{ product.stockQuantity || 1 }}</span>
                </div>
              </el-option>
              <template v-if="!item.rechargeProducts || item.rechargeProducts.length === 0">
                <el-option :value="0" label="无商品" disabled>
                  <div class="text-gray-400">无充值商品</div>
                </el-option>
              </template>
            </el-select>
          </template>

          <!-- 操作员列 -->
          <template #operator="{ item }">
            <div class="flex items-center justify-center space-x-2">
              <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <font-awesome-icon icon="fa-solid fa-id-card" class="text-purple-500" />
              </div>
              <span class="font-medium text-gray-900">{{ item.operationUser }}</span>
            </div>
          </template>

          <!-- 充值时间列 -->
          <template #time="{ item }">
            <div class="text-gray-600">{{ formatDateTime(item.rechargeTime) }}</div>
          </template>

          <!-- 操作列 -->
          <template #actions="{ item }">
            <div class="flex justify-center space-x-3">
              <button
                class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-all duration-300"
                @click="handleViewDetail(item.id)"
                title="查看详情"
              >
                <font-awesome-icon icon="fa-solid fa-circle-info" />
              </button>
              <button
                class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all duration-300"
                @click="handlePrint(item)"
                title="打印凭证"
              >
                <font-awesome-icon icon="fa-solid fa-print" />
              </button>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="showDetailDialog" title="充值详情" width="600px">
      <div v-if="selectedRecord" class="space-y-6">
        <!-- 会员信息 -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-3">会员信息</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">会员姓名</div>
              <div class="font-medium mt-1">{{ selectedRecord.membershipName }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">手机号码</div>
              <div class="font-medium mt-1">{{ selectedRecord.membershipPhone || '暂无' }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">IC卡号</div>
              <div class="font-medium mt-1">{{ selectedRecord.icNumber }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">当前积分</div>
              <div class="font-medium mt-1">{{ selectedRecord.currentScore }}</div>
            </div>
          </div>
        </div>

        <!-- 充值信息 -->
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-3">充值信息</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">充值积分</div>
              <div class="font-medium mt-1">{{ selectedRecord.rechargeScore }} 积分</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">充值商品</div>
              <div class="font-medium mt-1">
                <ul class="list-disc list-inside">
                  <li
                    v-for="product in selectedRecord.rechargeProducts"
                    :key="product.id"
                    class="text-sm"
                  >
                    {{ product.name }} ({{ product.price }}积分)
                  </li>
                  <li
                    v-if="
                      !selectedRecord.rechargeProducts ||
                      selectedRecord.rechargeProducts.length === 0
                    "
                    class="text-gray-400 text-sm"
                  >
                    无充值商品
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500">操作员</div>
              <div class="font-medium mt-1">{{ selectedRecord.operationUser }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">充值时间</div>
              <div class="font-medium mt-1">{{ selectedRecord.rechargeTime }}</div>
            </div>
          </div>
        </div>

        <!-- 备注信息 -->
        <div v-if="selectedRecord.note" class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-3">备注信息</h3>
          <div class="text-gray-600">{{ selectedRecord.note }}</div>
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
import type {
  RechargeOrder,
  RechargeRecordQueryParams,
  RechargeRecordResponse,
  RechargeHistory
} from '@/types/api/user/recharge'
import type { ApiResponse } from '@/types/api/common'
import type { AxiosResponse } from 'axios'
import { storeInfoUtils } from '@/utils/storeInfo'

const router = useRouter()

// 表格列配置
const columns = [
  { key: 'member', label: '会员信息', class: 'text-center' },
  { key: 'icCard', label: 'IC卡号', class: 'text-center' },
  { key: 'score', label: '充值积分', class: 'text-center' },
  { key: 'products', label: '充值商品', class: 'text-center' },
  { key: 'operator', label: '操作员', class: 'text-center' },
  { key: 'time', label: '充值时间', class: 'text-center' },
  { key: 'actions', label: '操作', class: 'text-center' }
]

const loading = ref(false)
const records = ref<RechargeHistory[]>([])
const total = ref(0)
const dateRange = ref<DateModelType[]>([])
const selectedRecord = ref<RechargeHistory | null>(null)
const showDetailDialog = ref(false)
const shopId = ref(0)

// 从localStorage获取shopId
const getShopIdFromLocalStorage = () => {
  try {
    const shopInfoStr = localStorage.getItem('shopInfo')
    if (shopInfoStr) {
      const shopInfo = JSON.parse(shopInfoStr)
      shopId.value = shopInfo.id || 0
      console.log('从localStorage获取的shopId:', shopId.value)
    } else {
      console.warn('localStorage中未找到shopInfo')
    }
  } catch (error) {
    console.error('获取shopId失败:', error)
  }
}

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
    result = result.filter(
      record =>
        record.membershipName.toLowerCase().includes(query) ||
        (record.membershipPhone && record.membershipPhone.includes(query)) ||
        record.operationUser.toLowerCase().includes(query)
    )
  }

  // 日期范围过滤
  if (dateRange.value && dateRange.value.length === 2) {
    const start = dateRange.value[0]
    const end = dateRange.value[1]
    if (start && end) {
      result = result.filter(record => {
        const recordDate = new Date(record.rechargeTime)
        return recordDate >= start && recordDate <= end
      })
    }
  }

  // 高级筛选
  if (queryParams.value.minAmount) {
    result = result.filter(record => record.rechargeScore >= Number(queryParams.value.minAmount))
  }
  if (queryParams.value.maxAmount) {
    result = result.filter(record => record.rechargeScore <= Number(queryParams.value.maxAmount))
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
  shopId.value = 0
  dateRange.value = []
  fetchRecords()
}

const handleViewDetail = async (id: number) => {
  try {
    // 为了简化，直接从当前记录中查找详情
    const record = records.value.find(item => item.id === id)
    if (record) {
      selectedRecord.value = record
      console.log('selectedRecord.value', selectedRecord.value)
      showDetailDialog.value = true
    } else {
      ElMessage.error('未找到充值详情')
    }
  } catch (error) {
    console.error('Failed to fetch recharge detail:', error)
    ElMessage.error('获取充值详情失败')
  }
}

const handlePrint = (record: RechargeHistory) => {
  // TODO: 实现打印逻辑
  ElMessage.success('正在打印充值凭证')
}

// 获取充值记录列表
const fetchRecords = async () => {
  loading.value = true
  try {
    // 更新日期范围
    let startTime = ''
    let endTime = ''
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0]
      const endDate = dateRange.value[1]
      // 确保日期格式为 YYYY-MM-DD
      startTime = startDate ? new Date(startDate).toISOString().split('T')[0] : ''
      endTime = endDate ? new Date(endDate).toISOString().split('T')[0] : ''
      queryParams.value.startDate = startTime
      queryParams.value.endDate = endTime
    } else {
      queryParams.value.startDate = ''
      queryParams.value.endDate = ''
    }

    console.log('请求参数:', {
      pageNumber: queryParams.value.page,
      pageSize: queryParams.value.pageSize,
      shopId: shopId.value,
      keyword: queryParams.value.keyword,
      startTime,
      endTime,
      minScore: queryParams.value.minAmount || 0,
      maxScore: queryParams.value.maxAmount
    })

    // 使用新API接口获取充值历史
    const response = await rechargeApi.getRechargeHistories({
      pageNumber: queryParams.value.page,
      pageSize: queryParams.value.pageSize,
      shopId: shopId.value,
      keyword: queryParams.value.keyword,
      startTime: startTime,
      endTime: endTime,
      minScore: queryParams.value.minAmount || 0,
      maxScore: queryParams.value.maxAmount // 最大积分不设置默认值
    })

    console.log('response', response)

    // 根据实际后端返回结构调整数据获取方式
    records.value = response.records || []
    total.value = response.totalRecords || 0

    console.log('records.value', records.value)
    console.log('total.value', total.value)
  } catch (error) {
    console.error('Failed to fetch recharge records:', error)
    ElMessage.error('获取充值记录失败')
  } finally {
    loading.value = false
  }
}

// 导出充值记录
const handleExport = async () => {
  loading.value = true
  try {
    // 更新日期范围
    let startTime = ''
    let endTime = ''
    if (dateRange.value && dateRange.value.length === 2) {
      const startDate = dateRange.value[0]
      const endDate = dateRange.value[1]
      // 确保日期格式为 YYYY-MM-DD
      startTime = startDate ? new Date(startDate).toISOString().split('T')[0] : ''
      endTime = endDate ? new Date(endDate).toISOString().split('T')[0] : ''
    }

    console.log('导出参数:', {
      keyword: queryParams.value.keyword,
      startTime,
      endTime,
      minScore: queryParams.value.minAmount || 0,
      maxScore: queryParams.value.maxAmount,
      shopId: shopId.value
    })

    const response = await rechargeApi.exportRechargeHistories({
      keyword: queryParams.value.keyword,
      startTime,
      endTime,
      minScore: queryParams.value.minAmount || 0,
      maxScore: queryParams.value.maxAmount,
      shopId: shopId.value
    })

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
  } finally {
    loading.value = false
  }
}

// 日期格式化函数
const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return ''

  // 处理包含T的ISO格式日期时间
  if (dateTimeStr.includes('T')) {
    const [datePart, timePart] = dateTimeStr.split('T')
    const timeFormatted = timePart.substring(0, 8).replace(/:/g, ':')
    return `${datePart} ${timeFormatted}`
  }

  return dateTimeStr
}

// 获取查询参数
const getQueryParams = () => {
  const shopId = storeInfoUtils.getShopId()

  if (!shopId) {
    ElMessage.warning('未找到店铺信息，将显示所有数据')
  }

  return {
    pageNumber: queryParams.value.page,
    pageSize: queryParams.value.pageSize,
    shopId: shopId || undefined,
    beginTime: dateRange.value && dateRange.value.length === 2 ? dateRange.value[0] : undefined,
    endTime: dateRange.value && dateRange.value.length === 2 ? dateRange.value[1] : undefined,
    keyword: queryParams.value.keyword || undefined
  }
}

onMounted(() => {
  getShopIdFromLocalStorage()
  fetchRecords()
})
</script>
