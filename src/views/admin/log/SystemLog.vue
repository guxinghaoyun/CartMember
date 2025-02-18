<template>
  <div class="h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
    <div class="space-y-6 p-6 bg-gray-50">
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
                  :class="selectedType === type.value ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100' : 'hover:bg-gray-100 text-gray-600'"
                  @click="selectedType = type.value"
                >{{ type.label }}</button>
              </div>
            </div>
            <div class="hidden sm:block h-8 w-px bg-gray-200"></div>
            <div class="flex flex-wrap items-center gap-3">
              <div class="relative group">
                <input
                  v-model="dateRange.start"
                  type="date"
                  class="!rounded-xl pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  @change="handleSearch"
                >
                <font-awesome-icon icon="calendar-alt" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span class="text-gray-400">至</span>
              <div class="relative group">
                <input
                  v-model="dateRange.end"
                  type="date"
                  class="!rounded-xl pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  @change="handleSearch"
                >
                <font-awesome-icon icon="calendar-alt" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div class="relative group flex-1 sm:flex-none">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索关键词"
                  class="!rounded-xl pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 w-full sm:w-64"
                  @input="handleSearch"
                >
                <font-awesome-icon icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <button 
                class="!rounded-xl px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                @click="handleSearch"
              >
                <font-awesome-icon icon="search" class="mr-2" />
                查询
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 日志列表 -->
      <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-3">
            <font-awesome-icon icon="history" class="text-blue-600" />
            系统日志
          </h2>
          <button
            class="!rounded-xl px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2 border-2 border-blue-100"
            @click="handleExport"
          >
            <font-awesome-icon icon="download"/>
            <span>导出日志</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">操作时间</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">操作类型</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">操作人</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">IP地址</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">操作内容</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">操作结果</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-gray-50 transition-colors group">
                <td class="px-6 py-4 text-sm text-gray-600">{{ log.time }}</td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="getTypeClass(log.type)"
                  >
                    {{ log.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ log.operator }}</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-500">{{ log.ip }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{{ log.content }}</td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="log.result === '成功' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ log.result }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div class="text-sm text-gray-600">
            共 {{ logs.length }} 条数据，每页显示 {{ pageSize }} 条
          </div>
          <div class="flex items-center gap-3">
            <button
              class="!rounded-xl px-4 py-2 border-2 bg-white transition-all duration-200"
              :class="{ 'text-gray-400 cursor-not-allowed border-gray-200': currentPage === 1, 'hover:border-blue-500 hover:text-blue-600 border-gray-200': currentPage > 1 }"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <font-awesome-icon icon="chevron-left" class="mr-1" />
              上一页
            </button>
            <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border-2 border-gray-200">
              <span class="text-gray-600">第</span>
              <input
                type="text"
                v-model="currentPage"
                class="w-12 text-center border-2 rounded-lg focus:outline-none focus:border-blue-500 px-1 py-0.5 text-gray-600"
                @blur="validatePageNumber"
              >
              <span class="text-gray-600">页 / 共 {{ totalPages }} 页</span>
            </div>
            <button
              class="!rounded-xl px-4 py-2 border-2 bg-white transition-all duration-200"
              :class="{ 'text-gray-400 cursor-not-allowed border-gray-200': currentPage === totalPages, 'hover:border-blue-500 hover:text-blue-600 border-gray-200': currentPage < totalPages }"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              下一页
              <font-awesome-icon icon="chevron-right" class="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 状态
const selectedType = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dateRange = ref({
  start: '',
  end: ''
})

// 日志类型选项
const logTypes = [
  { label: '全部', value: 'all' },
  { label: '登录', value: 'login' },
  { label: '商品', value: 'product' },
  { label: '会员', value: 'member' },
  { label: '订单', value: 'order' },
  { label: '系统', value: 'system' }
]

// 日志数据
const logs = ref([
  {
    id: 1,
    time: '2024-03-20 10:30:25',
    type: '登录',
    operator: '管理员',
    ip: '192.168.1.100',
    content: '登录系统',
    result: '成功'
  },
  {
    id: 2,
    time: '2024-03-20 11:15:36',
    type: '商品',
    operator: '店长-张明',
    ip: '192.168.1.101',
    content: '添加新商品：智能手表 Pro',
    result: '成功'
  },
  {
    id: 3,
    time: '2024-03-20 14:22:18',
    type: '会员',
    operator: '店员-李华',
    ip: '192.168.1.102',
    content: '新增会员：陈思远',
    result: '成功'
  },
  {
    id: 4,
    time: '2024-03-20 16:45:52',
    type: '订单',
    operator: '店员-王芳',
    ip: '192.168.1.103',
    content: '处理订单：ORDER20240320001',
    result: '失败'
  }
])

// 筛选后的日志数据
const filteredLogs = computed(() => {
  let result = [...logs.value]

  // 按日志类型筛选
  if (selectedType.value !== 'all') {
    const typeMap: Record<string, string> = {
      'login': '登录',
      'product': '商品',
      'member': '会员',
      'order': '订单',
      'system': '系统'
    }
    result = result.filter(log => log.type === typeMap[selectedType.value])
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
    result = result.filter(log => 
      log.operator.toLowerCase().includes(query) ||
      log.content.toLowerCase().includes(query) ||
      log.ip.includes(query)
    )
  }

  return result
})

// 分页数据
const totalPages = computed(() => Math.ceil(filteredLogs.value.length / pageSize.value))
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

// 方法
const validatePageNumber = () => {
  let page = parseInt(currentPage.value as unknown as string)
  if (isNaN(page)) page = 1
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
}

const getTypeClass = (type: string) => {
  const classes = {
    '登录': 'bg-blue-100 text-blue-800',
    '商品': 'bg-green-100 text-green-800',
    '会员': 'bg-purple-100 text-purple-800',
    '订单': 'bg-yellow-100 text-yellow-800',
    '系统': 'bg-gray-100 text-gray-800'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// 搜索方法
const handleSearch = () => {
  currentPage.value = 1 // 重置页码
}

// 导出日志方法
const handleExport = () => {
  // 构建CSV内容
  const headers = ['操作时间', '操作类型', '操作人', 'IP地址', '操作内容', '操作结果']
  const rows = filteredLogs.value.map(log => [
    log.time,
    log.type,
    log.operator,
    log.ip,
    log.content,
    log.result
  ])

  // 将数据转换为CSV格式，确保正确处理中文和特殊字符
  const processCell = (cell: string) => {
    // 如果单元格包含逗号、引号或换行符，需要用引号包裹并处理内部的引号
    if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
      return `"${cell.replace(/"/g, '""')}"`
    }
    return cell
  }

  const csvRows = [
    headers.map(processCell).join(','),
    ...rows.map(row => row.map(processCell).join(','))
  ]

  // 添加 BOM 头和换行符
  const BOM = '\uFEFF'
  const csvContent = BOM + csvRows.join('\r\n')

  // 创建 Blob 对象，指定编码为 UTF-8
  const blob = new Blob([csvContent], { 
    type: 'text/csv;charset=utf-8'
  })
  
  // 创建下载链接
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  // 设置文件名（使用当前时间）
  const now = new Date()
  const fileName = `系统日志_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.csv`
  
  // 触发下载
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  
  // 清理
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
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
</style> 