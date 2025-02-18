<template>
  <div class="h-[calc(100vh-64px)] bg-gray-50 p-6 space-y-6">
    <!-- 状态统计卡片 -->
    <div class="grid grid-cols-4 gap-6">
      <!-- 待提货订单 -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="box" class="text-blue-500" />
            </div>
            <span class="text-gray-600">待提货订单</span>
          </div>
          <div class="text-2xl font-medium text-gray-800">24</div>
        </div>
        <div class="flex items-center text-sm text-blue-500">
          <font-awesome-icon icon="clock" class="mr-1" />
          <span>3 笔待处理</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">今日</div>
      </div>

      <!-- 已完成提货 -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="check-circle" class="text-green-500" />
            </div>
            <span class="text-gray-600">已完成提货</span>
          </div>
          <div class="text-2xl font-medium text-gray-800">186</div>
        </div>
        <div class="flex items-center text-sm text-green-500">
          <font-awesome-icon icon="arrow-up" class="mr-1" />
          <span>12 笔</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">今日</div>
      </div>

      <!-- 正在配送 -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="truck" class="text-yellow-500" />
            </div>
            <span class="text-gray-600">正在配送</span>
          </div>
          <div class="text-2xl font-medium text-gray-800">8</div>
        </div>
        <div class="flex items-center text-sm text-yellow-500">
          <font-awesome-icon icon="check" class="mr-1" />
          <span>2 笔已送达</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">今日</div>
      </div>

      <!-- 门店自提 -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="store" class="text-purple-500" />
            </div>
            <span class="text-gray-600">门店自提</span>
          </div>
          <div class="text-2xl font-medium text-gray-800">16</div>
        </div>
        <div class="flex items-center text-sm text-purple-500">
          <font-awesome-icon icon="check" class="mr-1" />
          <span>5 笔已完成</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">今日</div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="bg-white rounded-lg shadow-sm">
      <!-- 列表头部 -->
      <div class="p-6 border-b">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h2 class="text-lg font-medium">提货订单管理</h2>
            <div class="flex bg-gray-100 p-1 rounded-lg">
              <button v-for="tab in tabs"
                      :key="tab.value"
                      class="px-4 py-2 rounded-lg text-sm transition-all duration-300 relative group"
                      :class="[
                        currentTab === tab.value 
                          ? 'bg-white text-blue-600 shadow-sm font-medium' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      ]"
                      @click="currentTab = tab.value">
                <div class="flex items-center space-x-2">
                  <font-awesome-icon :icon="getTabIcon(tab.value)" 
                                    class="text-gray-400 group-hover:text-gray-600" />
                  <span>{{ tab.label }}</span>
                  <span v-if="getTabCount(tab.value)"
                        :class="[
                          currentTab === tab.value 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                        ]"
                        class="px-2 py-0.5 text-xs rounded-full transition-colors duration-300">
                    {{ getTabCount(tab.value) }}
                  </span>
                </div>
                <div v-if="currentTab === tab.value" 
                     class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full -mb-1"></div>
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- 高级筛选 -->
            <div class="relative">
              <button class="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all duration-300 flex items-center space-x-2"
                      :class="{ 'border-blue-500 !bg-blue-50 !text-blue-600': showFilter }"
                      @click="showFilter = !showFilter">
                <font-awesome-icon icon="filter" />
                <span>筛选</span>
                <span v-if="activeFilters > 0"
                      class="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                  {{ activeFilters }}
                </span>
              </button>
              <!-- 筛选面板 -->
              <div v-if="showFilter"
                   class="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg p-4 z-10 border animate-fade-in">
                <div class="space-y-4">
                  <!-- 提货方式筛选 -->
                  <div>
                    <div class="text-sm font-medium mb-2">提货方式</div>
                    <div class="flex flex-wrap gap-2">
                      <button v-for="type in deliveryTypes"
                              :key="type.value"
                              class="px-3 py-1.5 rounded-lg text-sm transition-colors duration-200"
                              :class="filters.deliveryType === type.value ? 'bg-blue-50 text-blue-500' : 'text-gray-500 hover:bg-gray-50'"
                              @click="filters.deliveryType = type.value">
                        <font-awesome-icon :icon="type.icon" class="mr-1" />
                        {{ type.label }}
                      </button>
                    </div>
                  </div>
                  <!-- 时间范围筛选 -->
                  <div>
                    <div class="text-sm font-medium mb-2">时间范围</div>
                    <el-date-picker
                      v-model="filters.dateRange"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :shortcuts="dateShortcuts"
                      class="!w-full"/>
                  </div>
                  <!-- 操作员筛选 -->
                  <div>
                    <div class="text-sm font-medium mb-2">操作员</div>
                    <select v-model="filters.operator"
                            class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">全部操作员</option>
                      <option v-for="op in operators" :key="op" :value="op">{{ op }}</option>
                    </select>
                  </div>
                  <!-- 筛选按钮 -->
                  <div class="flex justify-end space-x-2 pt-2 border-t">
                    <button class="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                            @click="resetFilters">
                      重置
                    </button>
                    <button class="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            @click="applyFilters">
                      应用筛选
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 搜索框 -->
            <div class="relative">
              <input type="text"
                     v-model="searchQuery"
                     placeholder="搜索订单号/会员"
                     @keyup.enter="handleSearch"
                     class="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 hover:border-gray-400"/>
              <font-awesome-icon icon="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <!-- 刷新按钮 -->
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    @click="refreshList">
              <font-awesome-icon icon="sync-alt" />
            </button>
            <!-- 新增按钮 -->
            <button class="!rounded-button bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 flex items-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow group"
                    @click="handleNewPickup">
              <div class="relative">
                <font-awesome-icon icon="plus" class="transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span>新增提货单</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 订单表格 -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="col in columns" 
                  :key="col.key"
                  class="px-6 py-4 text-left text-sm font-medium text-gray-500"
                  :class="{ 'cursor-pointer hover:text-gray-900': col.sortable }"
                  @click="col.sortable && handleSort(col.key)">
                <div class="flex items-center space-x-1">
                  <span>{{ col.label }}</span>
                  <font-awesome-icon v-if="col.sortable" 
                     icon="sort"
                     :class="{
                       'text-blue-500': sortConfig.key === col.key,
                       'rotate-180': sortConfig.key === col.key && sortConfig.order === 'desc'
                     }"
                     class="transition-transform duration-200" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="order in filteredOrders" 
                :key="order.id" 
                class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <font-awesome-icon icon="box" class="text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ order.orderNo }}</div>
                    <div class="text-sm text-gray-500">{{ order.itemCount }} 件商品</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ order.memberName }}</div>
                <div class="text-sm text-gray-500">{{ order.memberPhone }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <font-awesome-icon :icon="getDeliveryIcon(order.deliveryType)" 
                                 class="text-gray-400" />
                  <span class="text-sm">{{ getDeliveryText(order.deliveryType) }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ formatDate(order.pickupTime) }}</div>
                <div class="text-xs text-gray-500">{{ getTimeAgo(order.pickupTime) }}</div>
              </td>
              <td class="px-6 py-4">
                <div :class="getStatusClass(order.status)"
                     class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <font-awesome-icon :icon="getStatusIcon(order.status)" class="mr-1" />
                  {{ getStatusText(order.status) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <font-awesome-icon icon="user" class="text-gray-400" />
                  </div>
                  <span class="text-sm">{{ order.operator }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end space-x-3">
                  <button class="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          @click="handleEdit(order)"
                          title="编辑">
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button v-if="order.status !== 'completed'"
                          class="text-gray-400 hover:text-green-600 transition-colors duration-200"
                          @click="handleComplete(order)"
                          title="完成">
                    <font-awesome-icon icon="check" />
                  </button>
                  <button class="text-gray-400 hover:text-red-600 transition-colors duration-200"
                          @click="handleDelete(order)"
                          title="删除">
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </td>
            </tr>
            <!-- 空状态 -->
            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="px-6 py-12">
                <div class="text-center">
                  <div class="text-gray-400 mb-2">
                    <font-awesome-icon icon="inbox" class="text-4xl" />
                  </div>
                  <div class="text-gray-500">暂无相关订单</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between px-6 py-4 border-t">
        <div class="text-sm text-gray-500">
          共 {{ totalOrders }} 条记录
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalOrders"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"/>
      </div>
    </div>

    <!-- 添加提货单表单 -->
    <PickupForm
      v-model:visible="showPickupForm"
      :is-edit="isEditMode"
      :edit-data="editData"
      @submit="handleFormSubmit"/>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import PickupForm from './components/PickupForm.vue'
import type { DateModelType } from 'element-plus'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 表格列配置
const columns = [
  { key: 'orderNo', label: '订单信息', sortable: true },
  { key: 'member', label: '会员信息' },
  { key: 'deliveryType', label: '提货方式', sortable: true },
  { key: 'pickupTime', label: '提货时间', sortable: true },
  { key: 'status', label: '状态', sortable: true },
  { key: 'operator', label: '操作员' },
  { key: 'actions', label: '操作', class: 'text-right' }
]

// 标签页
const tabs = [
  { label: '全部', value: 'all' },
  { label: '待提货', value: 'pending' },
  { label: '配送中', value: 'delivering' },
  { label: '已完成', value: 'completed' }
]

// 提货方式
const deliveryTypes = [
  { label: '门店自提', value: 'store', icon: 'store' },
  { label: '快递配送', value: 'delivery', icon: 'truck' }
]

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
  }
]

// 排序配置类型
interface SortConfig {
  key: keyof Order | ''
  order: 'asc' | 'desc' | ''
}

// 状态
const currentTab = ref('all')
const searchQuery = ref('')
const showFilter = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const sortConfig = ref<SortConfig>({ key: '', order: '' })

// 筛选条件
const filters = ref({
  deliveryType: '',
  dateRange: null as DateModelType[] | null,
  operator: ''
})

// 获取所有操作员列表
const operators = computed(() => {
  return [...new Set(orders.value.map(order => order.operator))]
})

// 计算活跃筛选器数量
const activeFilters = computed(() => {
  let count = 0
  if (filters.value.deliveryType) count++
  if (filters.value.dateRange) count++
  if (filters.value.operator) count++
  return count
})

// 获取标签页图标
const getTabIcon = (value: string) => {
  const icons = {
    all: 'list',
    pending: 'clock',
    delivering: 'truck',
    completed: 'check-circle'
  }
  return icons[value as keyof typeof icons]
}

// 获取标签页数量样式
const getTabCountClass = (value: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    delivering: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    all: 'bg-gray-100 text-gray-800'
  }
  return classes[value as keyof typeof classes]
}

// 获取标签页数量
const getTabCount = (value: string) => {
  if (value === 'all') return orders.value.length
  return orders.value.filter(order => order.status === value).length
}

// 获取状态图标
const getStatusIcon = (status: string) => {
  const icons = {
    pending: 'clock',
    delivering: 'truck',
    completed: 'check-circle'
  }
  return icons[status as keyof typeof icons]
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 获取相对时间
const getTimeAgo = (date: string) => {
  return dayjs(date).fromNow()
}

// 订单数据类型定义
interface Order {
  id: number
  orderNo: string
  itemCount: number
  memberName: string
  memberPhone: string
  deliveryType: string
  pickupTime: string
  status: string
  operator: string
}

// 订单数据
const orders = ref<Order[]>([
  {
    id: 1,
    orderNo: 'PK20240115001',
    itemCount: 3,
    memberName: '张三',
    memberPhone: '13800138000',
    deliveryType: '自提',
    pickupTime: '2024-01-15',
    status: '待提货',
    operator: '王经理'
  },
  {
    id: 2,
    orderNo: 'PK24010515002',
    itemCount: 2,
    memberName: '张锦明',
    memberPhone: '139****4321',
    deliveryType: 'delivery',
    pickupTime: '2024-01-05 15:00',
    status: 'delivering',
    operator: '王建国'
  },
  {
    id: 3,
    orderNo: 'PK24010515003',
    itemCount: 5,
    memberName: '林美玲',
    memberPhone: '135****1234',
    deliveryType: 'store',
    pickupTime: '2024-01-05 16:30',
    status: 'completed',
    operator: '张晓芳'
  },
  {
    id: 4,
    orderNo: 'PK24010515004',
    itemCount: 1,
    memberName: '赵子涵',
    memberPhone: '137****2345',
    deliveryType: 'delivery',
    pickupTime: '2024-01-05 17:00',
    status: 'delivering',
    operator: '刘明亮'
  },
  {
    id: 5,
    orderNo: 'PK24010515005',
    itemCount: 4,
    memberName: '吴雨轩',
    memberPhone: '136****4567',
    deliveryType: 'store',
    pickupTime: '2024-01-05 17:30',
    status: 'pending',
    operator: '赵雪梅'
  }
])

// 过滤和排序后的订单列表
const filteredOrders = computed<Order[]>(() => {
  let result = [...orders.value]

  // 标签页筛选
  if (currentTab.value !== 'all') {
    result = result.filter(order => order.status === currentTab.value)
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => 
      order.orderNo.toLowerCase().includes(query) ||
      order.memberName.toLowerCase().includes(query) ||
      order.memberPhone.includes(query)
    )
  }

  // 高级筛选
  if (filters.value.deliveryType) {
    result = result.filter(order => order.deliveryType === filters.value.deliveryType)
  }
  if (filters.value.dateRange && filters.value.dateRange.length === 2) {
    const [start, end] = filters.value.dateRange
    result = result.filter(order => {
      const orderDate = dayjs(order.pickupTime)
      return orderDate.isAfter(start) && orderDate.isBefore(end)
    })
  }
  if (filters.value.operator) {
    result = result.filter(order => order.operator === filters.value.operator)
  }

  // 排序
  if (sortConfig.value.key && sortConfig.value.order) {
    result.sort((a, b) => {
      const aValue = a[sortConfig.value.key as keyof Order]
      const bValue = b[sortConfig.value.key as keyof Order]
      const factor = sortConfig.value.order === 'asc' ? 1 : -1
      return aValue > bValue ? factor : -factor
    })
  }

  return result
})

// 总记录数
const totalOrders = computed(() => filteredOrders.value.length)

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleSort = (key: string) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.order = sortConfig.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value.key = key as keyof Order
    sortConfig.value.order = 'asc'
  }
}

const resetFilters = () => {
  filters.value = {
    deliveryType: '',
    dateRange: null,
    operator: ''
  }
}

const applyFilters = () => {
  showFilter.value = false
  currentPage.value = 1
}

const refreshList = () => {
  // TODO: 实现刷新逻辑
  ElMessage.success('列表已刷新')
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 提货方式
const getDeliveryIcon = (type: string) => {
  return type === 'store' ? 'store' : 'truck'
}

const getDeliveryText = (type: string) => {
  return type === 'store' ? '门店自提' : '快递配送'
}

// 状态样式
const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    delivering: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }
  return classes[status as keyof typeof classes]
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '待提货',
    delivering: '配送中',
    completed: '已完成'
  }
  return texts[status as keyof typeof texts]
}

// 新增提货单对话框
const showPickupForm = ref(false)
const isEditMode = ref(false)
const editData = ref<Order | null>(null)

// 处理新增提货单
const handleNewPickup = () => {
  isEditMode.value = false
  editData.value = null
  showPickupForm.value = true
}

// 处理编辑提货单
const handleEdit = (order: Order) => {
  isEditMode.value = true
  editData.value = order
  showPickupForm.value = true
}

// 处理表单提交
const handleFormSubmit = (data: any) => {
  if (isEditMode.value) {
    // 更新现有订单
    const index = orders.value.findIndex(o => o.id === editData.value?.id)
    if (index !== -1) {
      orders.value[index] = {
        ...orders.value[index],
        ...data
      }
      ElMessage.success('提货单更新成功')
    }
  } else {
    // 添加新订单
    const newOrder: Order = {
      id: orders.value.length + 1,
      orderNo: 'PK' + dayjs().format('YYMMDDHHmmss'),
      ...data
    }
    orders.value.unshift(newOrder)
    ElMessage.success('提货单创建成功')
  }
  showPickupForm.value = false
}

// 操作方法
const handleComplete = async (order: any) => {
  try {
    await ElMessageBox.confirm(
      `确认将订单 ${order.orderNo} 标记为已完成吗？`,
      '完成确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        dangerouslyUseHTMLString: true,
        message: `
          <div class="space-y-2">
            <div class="text-gray-600 text-sm">
              <div>订单号：${order.orderNo}</div>
              <div>会员：${order.memberName}</div>
              <div>提货方式：${getDeliveryText(order.deliveryType)}</div>
            </div>
          </div>
        `
      }
    )
    
    // 更新订单状态
    const index = orders.value.findIndex(o => o.id === order.id)
    if (index !== -1) {
      orders.value[index] = {
        ...orders.value[index],
        status: 'completed'
      }
    }
    
    ElMessage({
      type: 'success',
      message: `订单 ${order.orderNo} 已完成`,
      duration: 2000
    })
  } catch {
    // 用户取消操作
  }
}

const handleDelete = async (order: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除订单 ${order.orderNo} 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true,
        message: `
          <div class="space-y-2">
            <div class="text-red-500">
              <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
              此操作将永久删除该订单
            </div>
            <div class="text-gray-600 text-sm">
              <div>订单号：${order.orderNo}</div>
              <div>会员：${order.memberName}</div>
              <div>提货方式：${getDeliveryText(order.deliveryType)}</div>
            </div>
          </div>
        `
      }
    )
    
    // 从数组中删除订单
    orders.value = orders.value.filter(o => o.id !== order.id)
    
    ElMessage({
      type: 'success',
      message: `订单 ${order.orderNo} 已成功删除`,
      duration: 2000
    })
  } catch {
    // 用户取消删除操作
  }
}
</script>

<style scoped>
.table-row-hover:hover {
  background-color: #f9fafb;
}

/* 自定义滚动条样式 */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #D1D5DB;
}
</style> 