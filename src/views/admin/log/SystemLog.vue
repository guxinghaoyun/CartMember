<template>
  <div class="space-y-6">
    <!-- 顶部筛选区域 -->
    <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div class="p-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-6">
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-gray-600 font-medium">日志类型:</span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in logTypes"
                :key="type.value"
                class="!rounded-xl px-4 py-2 transition-all duration-200"
                :class="
                  selectedType === type.value
                    ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100'
                    : 'hover:bg-gray-100 text-gray-600'
                "
                @click="selectedType = type.value"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
          <div class="hidden sm:block h-8 w-px bg-gray-200"></div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="relative group">
              <input
                v-model="dateRange.start"
                type="date"
                placeholder="yyyy/mm/dd"
                class="!rounded-xl pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                @change="handleSearch"
                :max="dateRange.end || undefined"
              />
              <font-awesome-icon
                icon="calendar-alt"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
              />
            </div>
            <span class="text-gray-400">至</span>
            <div class="relative group">
              <input
                v-model="dateRange.end"
                type="date"
                placeholder="yyyy/mm/dd"
                class="!rounded-xl pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                @change="handleSearch"
                :min="dateRange.start || undefined"
              />
              <font-awesome-icon
                icon="calendar-alt"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
              />
            </div>
            <div class="relative group flex-1 sm:flex-none">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索关键词"
                class="!rounded-xl pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 w-full sm:w-64"
                @input="handleSearch"
              />
              <font-awesome-icon
                icon="search"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
              />
            </div>
            <div class="flex items-center gap-3">
              <button
                class="!rounded-xl px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                @click="handleSearch"
              >
                <font-awesome-icon icon="search" class="mr-2" />
                查询
              </button>
              <button
                class="!rounded-xl px-6 py-2 border-2 border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                @click="resetFilters"
              >
                <font-awesome-icon icon="redo-alt" class="mr-2" />
                重置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 日志列表 -->
    <div
      class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div class="flex justify-between items-center p-6 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-3">
          <font-awesome-icon icon="history" class="text-blue-600" />
          系统日志
          <span v-if="!loading" class="text-sm font-normal text-gray-500">
            <template v-if="selectedType !== 'all'">
              (显示 {{ filteredLogs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }} -
              {{ Math.min(currentPage * pageSize, filteredTotalRecords) }} 条， 共
              {{ filteredTotalRecords }} 条{{
                logTypes.find(t => t.value === selectedType)?.label
              }}类型的日志)
            </template>
            <template v-else>
              (显示 {{ logs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }} -
              {{ Math.min(currentPage * pageSize, totalRecords) }} 条，共 {{ totalRecords }} 条)
            </template>
          </span>
        </h2>
        <button
          class="!rounded-xl px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2 border-2 border-blue-100"
          @click="handleExport"
          :disabled="loading"
        >
          <font-awesome-icon icon="download" />
          <span>导出日志</span>
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                操作时间
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                操作类型
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                操作人
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">操作内容</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                操作结果
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- 加载中状态 -->
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <font-awesome-icon
                    icon="spinner"
                    class="text-blue-500 text-2xl mb-3 animate-spin"
                  />
                  <span>加载中...</span>
                </div>
              </td>
            </tr>
            <!-- 无数据状态 -->
            <tr v-else-if="logs.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <font-awesome-icon icon="folder-open" class="text-gray-300 text-4xl mb-3" />
                  <span>暂无日志数据</span>
                  <p class="text-sm text-gray-400 mt-2">可以尝试调整筛选条件或清空搜索关键词</p>
                </div>
              </td>
            </tr>
            <!-- 日志数据 -->
            <tr
              v-else
              v-for="log in paginatedLogs"
              :key="log.id"
              class="hover:bg-blue-50/30 transition-colors group cursor-pointer"
            >
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDateTime(log.time) }}</td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getTypeClass(log.type)"
                >
                  {{ log.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                {{ log.operator }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-md">
                <div class="truncate hover:text-clip" :title="log.content">{{ log.content }}</div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="
                    log.result === '成功'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  <span
                    v-if="log.result === '成功'"
                    class="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"
                  ></span>
                  <span v-else class="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                  {{ log.result }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-6 py-4 bg-gray-50 border-t border-gray-100"
      >
        <div class="text-sm text-gray-600">
          <template v-if="selectedType !== 'all'">
            共 {{ filteredTotalRecords }} 条{{
              logTypes.find(t => t.value === selectedType)?.label
            }}类型数据，每页显示 {{ pageSize }} 条
            <span class="ml-2 text-blue-600">
              当前第 {{ currentPage }}/{{ filteredTotalPages }} 页
            </span>
          </template>
          <template v-else>
            共 {{ totalRecords }} 条数据，每页显示 {{ pageSize }} 条
            <span class="ml-2 text-blue-600">当前第 {{ currentPage }}/{{ totalPages }} 页</span>
          </template>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="!rounded-xl px-4 py-2 border-2 bg-white transition-all duration-200"
            :class="{
              'text-gray-400 cursor-not-allowed border-gray-200': currentPage === 1,
              'hover:border-blue-500 hover:text-blue-600 border-gray-200': currentPage > 1
            }"
            :disabled="currentPage === 1 || loading"
            @click="currentPage--"
          >
            <font-awesome-icon icon="chevron-left" class="mr-1" />
            上一页
          </button>
          <div
            class="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border-2 border-gray-200"
          >
            <span class="text-gray-600">第</span>
            <input
              type="text"
              v-model="currentPage"
              class="w-12 text-center border-2 rounded-lg focus:outline-none focus:border-blue-500 px-1 py-0.5 text-gray-600"
              @blur="handlePageChange"
              @keyup.enter="handlePageChange"
              :disabled="loading"
            />
            <span class="text-gray-600">
              页 / 共 {{ selectedType !== 'all' ? filteredTotalPages : totalPages }} 页
            </span>
          </div>
          <button
            class="!rounded-xl px-4 py-2 border-2 bg-white transition-all duration-200"
            :class="{
              'text-gray-400 cursor-not-allowed border-gray-200':
                selectedType !== 'all'
                  ? currentPage === filteredTotalPages || filteredTotalPages === 0
                  : currentPage === totalPages || totalPages === 0,
              'hover:border-blue-500 hover:text-blue-600 border-gray-200':
                selectedType !== 'all' ? currentPage < filteredTotalPages : currentPage < totalPages
            }"
            :disabled="
              (selectedType !== 'all'
                ? currentPage === filteredTotalPages || filteredTotalPages === 0
                : currentPage === totalPages || totalPages === 0) || loading
            "
            @click="currentPage++"
          >
            下一页
            <font-awesome-icon icon="chevron-right" class="ml-1" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { logApi } from '@/api/admin/log'
import { ElMessage } from 'element-plus'
import type { NewOperationLogRecord } from '@/types/api/admin/log'

// 状态
const selectedType = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = ref(1)
const totalRecords = ref(0)
const loading = ref(false)
const dateRange = ref({
  start: '',
  end: ''
})

// 日志类型选项
const logTypes = [
  { label: '全部', value: 'all' },
  { label: '充值', value: 'recharge' },
  { label: '购买', value: 'purchase' },
  { label: '会员', value: 'member' },
  { label: '登录', value: 'login' },
  { label: '系统', value: 'system' }
]

// 日志数据
const logs = ref<
  {
    id: number
    time: string
    type: string
    operator: string
    ip: string
    content: string
    result: string
  }[]
>([])

// 设置默认日期范围
const initDefaultDateRange = () => {
  // 设置默认时间范围为最近7天
  const today = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 7)

  // 格式化日期为YYYY-MM-DD格式
  dateRange.value.end = today.toISOString().split('T')[0]
  dateRange.value.start = sevenDaysAgo.toISOString().split('T')[0]
}

// 获取日志数据
const fetchLogs = async () => {
  try {
    loading.value = true
    // 修改参数名称，更好地匹配API需求
    const params = {
      // 服务端分页参数（根据具体接口调整）
      page: currentPage.value,
      size: pageSize.value,
      // 搜索筛选参数
      keyword: searchQuery.value || undefined,
      beginTime: dateRange.value.start || undefined,
      endTime: dateRange.value.end || undefined
      // 移除logType，改用前端过滤
    }

    // 打印请求参数，用于调试
    console.log('请求参数:', params)

    const response = await logApi.getNewOperationLogs(params)

    // 打印响应数据，用于调试
    console.log('API响应:', response)

    // 更新分页信息
    currentPage.value = response.currentPage || currentPage.value
    totalPages.value = response.totalPages || Math.ceil(response.totalRecords / pageSize.value) || 1
    totalRecords.value = response.totalRecords || 0

    // 确保当前页不超过总页数
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
      await fetchLogs() // 重新获取正确页码的数据
      return
    }

    // 转换数据格式
    if (Array.isArray(response.records)) {
      logs.value = response.records.map((record: NewOperationLogRecord) => ({
        id: record.id,
        time: record.createTime,
        type: record.operationType,
        operator: record.operationUser,
        ip: '', // 保留字段，但设为空
        content: record.operationContent,
        result: record.status
      }))
    } else {
      logs.value = []
    }
  } catch (error) {
    console.error('获取日志数据失败:', error)
    ElMessage.error('获取日志数据失败')
    logs.value = []
  } finally {
    loading.value = false
  }
}

// 初始加载
onMounted(() => {
  // 设置默认时间范围
  initDefaultDateRange()
  // 确保初始页码为1
  currentPage.value = 1
  fetchLogs()
})

// 监听搜索条件变化
watch(
  [dateRange, searchQuery],
  () => {
    currentPage.value = 1
    fetchLogs()
  },
  { deep: true }
)

// 监听日志类型变化 - 仅前端过滤
watch(selectedType, () => {
  // 类型变化时重置当前页码为1
  currentPage.value = 1
  console.log('日志类型变化:', selectedType.value)
})

// 处理页码变化
watch(currentPage, () => {
  fetchLogs()
})

// 筛选后的日志数据
const filteredLogs = computed(() => {
  let result = [...logs.value]

  // 按日志类型筛选
  if (selectedType.value !== 'all') {
    result = result.filter(log => {
      // 根据实际情况映射选项值到日志类型
      switch (selectedType.value) {
        case 'recharge':
          return log.type === '充值'
        case 'purchase':
          return log.type === '购买'
        case 'member':
          return log.type === '会员'
        case 'login':
          return log.type === '登录'
        case 'system':
          return log.type === '系统'
        default:
          return true
      }
    })
  }

  // 按日期范围筛选
  if (dateRange.value.start && dateRange.value.end) {
    const startDate = new Date(dateRange.value.start)
    const endDate = new Date(dateRange.value.end)
    endDate.setHours(23, 59, 59, 999) // 设置结束时间为当天的最后一刻

    result = result.filter(log => {
      const logDate = new Date(log.time)
      return logDate >= startDate && logDate <= endDate
    })
  }

  // 按关键词搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      log => log.operator.toLowerCase().includes(query) || log.content.toLowerCase().includes(query)
    )
  }

  return result
})

// 分页数据 - 使用前端过滤后的数据
const paginatedLogs = computed(() => {
  // 计算前端分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

// 前端过滤后的总页数
const filteredTotalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / pageSize.value) || 1
})

// 前端过滤后的总记录数
const filteredTotalRecords = computed(() => {
  return filteredLogs.value.length
})

const getTypeClass = (type: string) => {
  switch (type) {
    case '充值':
      return 'bg-blue-100 text-blue-800'
    case '购买':
      return 'bg-green-100 text-green-800'
    case '会员':
      return 'bg-purple-100 text-purple-800'
    case '登录':
      return 'bg-orange-100 text-orange-800'
    case '系统':
      return 'bg-yellow-100 text-yellow-800'
    case '商品':
      return 'bg-indigo-100 text-indigo-800'
    case '订单':
      return 'bg-pink-100 text-pink-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// 搜索方法
const handleSearch = () => {
  currentPage.value = 1
  fetchLogs()
}

// 导出日志方法
const handleExport = async () => {
  try {
    ElMessage.info('正在准备导出数据...')
    const params = {
      keyword: searchQuery.value || undefined,
      beginTime: dateRange.value.start || undefined,
      endTime: dateRange.value.end || undefined
    }

    // 如果后续需要导出功能，可以添加对应的API调用
    // const blob = await logApi.exportOperationLogs(params)
    // const url = window.URL.createObjectURL(blob)
    // const link = document.createElement('a')
    // link.href = url
    // link.download = `系统日志_${new Date().toISOString().split('T')[0]}.xlsx`
    // document.body.appendChild(link)
    // link.click()
    // window.URL.revokeObjectURL(url)
    // document.body.removeChild(link)

    ElMessage.success('导出功能开发中...')
  } catch (error) {
    console.error('导出日志失败:', error)
    ElMessage.error('导出日志失败')
  }
}

// 日期格式化函数
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '-'
  const date = new Date(dateTime)
  if (isNaN(date.getTime())) return dateTime

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // 返回格式化后的日期时间
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 日期范围验证
const validateDateRange = () => {
  if (dateRange.value.start && dateRange.value.end) {
    const startDate = new Date(dateRange.value.start)
    const endDate = new Date(dateRange.value.end)

    if (endDate < startDate) {
      // 如果结束日期早于开始日期，将结束日期设置为开始日期
      dateRange.value.end = dateRange.value.start
    }
  }
}

// 监听日期变化
watch(() => dateRange.value.start, validateDateRange)
watch(() => dateRange.value.end, validateDateRange)

// 页码验证和跳转方法
const handlePageChange = () => {
  let num = parseInt(currentPage.value as any)
  if (isNaN(num) || num < 1) {
    num = 1
  } else if (num > (selectedType.value !== 'all' ? filteredTotalPages.value : totalPages.value)) {
    num = selectedType.value !== 'all' ? filteredTotalPages.value : totalPages.value
  }
  if (num !== currentPage.value) {
    currentPage.value = num
    // 如果是全部类型，则需要请求API
    if (selectedType.value === 'all') {
      fetchLogs()
    }
  }
}

// 重置筛选条件
const resetFilters = () => {
  selectedType.value = 'all'
  searchQuery.value = ''
  initDefaultDateRange()
  currentPage.value = 1
  fetchLogs()
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* 表格样式优化 */
table {
  table-layout: fixed;
}

table th:nth-child(1) {
  width: 15%;
}

table th:nth-child(2) {
  width: 12%;
}

table th:nth-child(3) {
  width: 18%;
}

table th:nth-child(4) {
  width: 40%;
}

table th:nth-child(5) {
  width: 15%;
}
</style>
