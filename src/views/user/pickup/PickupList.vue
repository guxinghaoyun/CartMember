<template>
  <div class="h-[calc(100vh-64px)] bg-gray-50 p-6 space-y-6">
    <!-- 状态统计卡片 -->
    <div class="grid grid-cols-4 gap-6">
      <!-- 待提货订单 -->
      <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="flex items-center justify-between mb-4 relative">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <font-awesome-icon icon="clipboard-list" class="text-blue-500 text-xl" />
            </div>
            <div>
              <span class="text-gray-500 text-sm font-medium block">待提货订单</span>
              <div class="text-2xl font-semibold text-gray-800 mt-1">24</div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="flex items-center text-xs text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100/50 px-3 py-1 rounded-full font-medium">
              <font-awesome-icon icon="clock" class="mr-1.5" />
              <span>3 笔待处理</span>
            </div>
            <div class="text-xs text-gray-400 mt-2">今日</div>
          </div>
        </div>
        <div class="h-1.5 w-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full overflow-hidden">
          <div class="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transform transition-transform duration-500 group-hover:translate-x-2"></div>
        </div>
      </div>

      <!-- 已完成提货 -->
      <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <font-awesome-icon icon="calendar-check" class="text-green-500 text-lg" />
            </div>
            <div>
              <span class="text-gray-600 text-sm block">已完成提货</span>
              <div class="text-xl font-semibold text-gray-800 mt-0.5">186</div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="flex items-center text-xs text-green-500 bg-green-50 px-2 py-0.5 rounded-lg">
              <font-awesome-icon icon="arrow-up" class="mr-1" />
              <span>12 笔</span>
            </div>
            <div class="text-xs text-gray-500 mt-1.5">今日</div>
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
      </div>

      <!-- 正在配送 -->
      <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
              <font-awesome-icon icon="location-dot" class="text-yellow-500 text-lg" />
            </div>
            <div>
              <span class="text-gray-600 text-sm block">正在配送</span>
              <div class="text-xl font-semibold text-gray-800 mt-0.5">8</div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="flex items-center text-xs text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-lg">
              <font-awesome-icon icon="check" class="mr-1" />
              <span>2 笔已送达</span>
            </div>
            <div class="text-xs text-gray-500 mt-1.5">今日</div>
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"></div>
      </div>

      <!-- 门店自提 -->
      <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <font-awesome-icon icon="hand-holding" class="text-purple-500 text-lg" />
            </div>
            <div>
              <span class="text-gray-600 text-sm block">门店自提</span>
              <div class="text-xl font-semibold text-gray-800 mt-0.5">16</div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="flex items-center text-xs text-purple-500 bg-purple-50 px-2 py-0.5 rounded-lg">
              <font-awesome-icon icon="check" class="mr-1" />
              <span>5 笔已完成</span>
            </div>
            <div class="text-xs text-gray-500 mt-1.5">今日</div>
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="bg-white rounded-2xl shadow-sm">
      <!-- 列表头部 -->
      <div class="p-6 border-b">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <h2 class="text-lg font-medium flex items-center text-gray-800">
              <div class="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <font-awesome-icon icon="file-invoice" class="text-gray-500" />
              </div>
              提货订单管理
            </h2>
            <div class="flex bg-gray-50/80 p-1.5 rounded-xl shadow-sm">
              <button v-for="tab in tabs"
                      :key="tab.value"
                      class="px-4 py-2 rounded-lg text-sm transition-all duration-300 relative group min-w-[100px]"
                      :class="[
                        currentTab === tab.value 
                          ? 'bg-white text-blue-600 shadow-sm font-medium' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      ]"
                      @click="currentTab = tab.value">
                <div class="flex items-center justify-center space-x-2">
                  <font-awesome-icon :icon="getTabIcon(tab.value)" 
                                   :class="[
                                     currentTab === tab.value 
                                       ? 'text-blue-500' 
                                       : 'text-gray-400 group-hover:text-gray-600'
                                   ]" />
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
                     class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full -mb-1"></div>
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- 高级筛选 -->
            <div class="relative">
              <button class="px-4 py-2.5 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all duration-300 flex items-center space-x-2 min-w-[100px] justify-center shadow-sm"
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
                   class="absolute right-0 top-14 w-96 bg-white rounded-2xl shadow-xl p-6 z-10 border animate-fade-in">
                <div class="space-y-4">
                  <!-- 提货方式筛选 -->
                  <div>
                    <div class="text-sm font-medium mb-2 flex items-center">
                      <font-awesome-icon icon="cube" class="text-gray-400 mr-2" />
                      提货方式
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <button v-for="type in deliveryTypes"
                              :key="type.value"
                              class="px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 flex items-center"
                              :class="filters.deliveryType === type.value ? 'bg-blue-50 text-blue-500 border border-blue-200' : 'text-gray-500 hover:bg-gray-50 border border-gray-200'"
                              @click="filters.deliveryType = type.value">
                        <font-awesome-icon :icon="type.icon" class="mr-2" />
                        {{ type.label }}
                      </button>
                    </div>
                  </div>
                  <!-- 时间范围筛选 -->
                  <div>
                    <div class="text-sm font-medium mb-2 flex items-center">
                      <font-awesome-icon icon="calendar-alt" class="text-gray-400 mr-2" />
                      时间范围
                    </div>
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
                    <div class="text-sm font-medium mb-2 flex items-center">
                      <font-awesome-icon icon="user-cog" class="text-gray-400 mr-2" />
                      操作员
                    </div>
                    <select v-model="filters.operator"
                            class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">全部操作员</option>
                      <option v-for="op in operators" :key="op" :value="op">{{ op }}</option>
                    </select>
                  </div>
                  <!-- 筛选按钮 -->
                  <div class="flex justify-end space-x-2 pt-4 border-t">
                    <button class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center"
                            @click="resetFilters">
                      <font-awesome-icon icon="rotate" class="mr-2" />
                      重置
                    </button>
                    <button class="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center"
                            @click="applyFilters">
                      <font-awesome-icon icon="check" class="mr-2" />
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
                     class="pl-12 pr-4 py-2.5 border rounded-xl w-72 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 hover:border-gray-400 shadow-sm"/>
              <font-awesome-icon icon="magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <!-- 刷新按钮 -->
            <button class="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-300 w-11 h-11 flex items-center justify-center"
                    @click="refreshList">
              <font-awesome-icon icon="rotate" class="text-lg" />
            </button>
            <!-- 新增按钮 -->
            <button class="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 flex items-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow group min-w-[120px] justify-center"
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
          <thead>
            <tr class="bg-gradient-to-r from-gray-50 to-white border-b">
              <th v-for="col in columns" 
                  :key="col.key"
                  class="px-6 py-4 text-left text-xs font-medium text-gray-600 first:pl-8 last:pr-8"
                  :class="[
                    { 'cursor-pointer hover:text-gray-900': col.sortable },
                    col.key === 'actions' ? 'text-right' : ''
                  ]"
                  @click="col.sortable && handleSort(col.key)">
                <div class="flex items-center space-x-2" :class="{ 'justify-end': col.key === 'actions' }">
                  <div class="w-8 h-8 rounded-lg bg-gray-50/80 flex items-center justify-center">
                    <font-awesome-icon v-if="col.icon" :icon="col.icon" class="text-gray-400" />
                  </div>
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
                class="hover:bg-blue-50/5 transition-all duration-200 group">
              <!-- 订单信息 -->
              <td class="px-6 py-4 first:pl-8">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-200">
                      <font-awesome-icon icon="file-invoice" class="text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{{ order.orderNo }}</div>
                    <div class="text-xs text-gray-500 flex items-center mt-1.5">
                      <div class="flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                        <font-awesome-icon icon="box" class="text-blue-400 mr-1.5 text-xs" />
                        <span>{{ order.itemCount }} 件商品</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <!-- 会员信息 -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-200">
                    <font-awesome-icon icon="user" class="text-purple-500 text-lg" />
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-200">{{ order.memberName }}</div>
                    <div class="text-xs text-gray-500 flex items-center mt-1">
                      <div class="flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
                        <font-awesome-icon icon="phone" class="text-purple-400 mr-1 text-xs" />
                        <span class="text-xs">{{ order.memberPhone }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <!-- 提货方式 -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200"
                     :class="{
                       'bg-gradient-to-r from-green-50 to-green-100 text-green-600': order.deliveryType === 'store',
                       'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600': order.deliveryType === 'delivery'
                     }">
                  <div class="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
                    <font-awesome-icon :icon="getDeliveryIcon(order.deliveryType)" />
                  </div>
                  <span class="text-xs font-medium">{{ getDeliveryText(order.deliveryType) }}</span>
                </div>
              </td>
              <!-- 提货时间 -->
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <div class="text-xs text-gray-900 flex items-center bg-gray-50 px-3 py-1.5 rounded-lg group-hover:bg-gray-100 transition-all duration-200">
                    <font-awesome-icon icon="calendar-alt" class="text-gray-400 mr-2" />
                    {{ formatDate(order.pickupTime) }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1.5 ml-1">{{ getTimeAgo(order.pickupTime) }}</div>
                </div>
              </td>
              <!-- 状态 -->
              <td class="px-6 py-4">
                <div :class="[
                  getStatusClass(order.status),
                  'inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all duration-200'
                ]">
                  <div class="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center mr-2">
                    <font-awesome-icon :icon="getStatusIcon(order.status)" />
                  </div>
                  {{ getStatusText(order.status) }}
                </div>
              </td>
              <!-- 操作员 -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-200">
                    <font-awesome-icon icon="user-cog" class="text-gray-500" />
                  </div>
                  <span class="text-xs text-gray-700 font-medium">{{ order.operator }}</span>
                </div>
              </td>
              <!-- 操作 -->
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end space-x-2 transition-all duration-200">
                  <button class="action-button text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-105"
                          @click="handleEdit(order)"
                          title="编辑">
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button v-if="order.status !== 'completed'"
                          class="action-button text-gray-400 hover:text-green-600 hover:bg-green-50 hover:scale-105"
                          @click="handleComplete(order)"
                          title="完成">
                    <font-awesome-icon icon="check" />
                  </button>
                  <button class="action-button text-gray-400 hover:text-red-600 hover:bg-red-50 hover:scale-105"
                          @click="handleDelete(order)"
                          title="删除">
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </td>
            </tr>
            <!-- 空状态 -->
            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="px-6 py-16">
                <div class="text-center">
                  <div class="w-24 h-24 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <font-awesome-icon icon="inbox" class="text-4xl text-gray-300" />
                  </div>
                  <div class="text-gray-500 font-medium">暂无相关订单</div>
                  <div class="text-gray-400 text-sm mt-1">可以点击右上角的"新增提货单"按钮创建新订单</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between px-8 py-4 border-t">
        <div class="text-sm text-gray-500">
          共 <span class="font-medium text-gray-900">{{ totalOrders }}</span> 条记录
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalOrders"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          class="!text-sm"/>
      </div>
    </div>

    <!-- 添加提货单表单 -->
    <AddPickupForm
      v-model:visible="addVisible"
      @submit="handleAddSubmit"
    />

    <EditPickupForm
      v-model:visible="editVisible"
      :edit-data="editData"
      @submit="handleEditSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import AddPickupForm from './components/AddPickupForm.vue'
import EditPickupForm from './components/EditPickupForm.vue'
import type { DateModelType } from 'element-plus'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 表格列配置
const columns = [
  { key: 'orderInfo', label: '订单信息', sortable: true, icon: 'file-invoice' },
  { key: 'memberInfo', label: '会员信息', icon: 'user' },
  { key: 'deliveryType', label: '提货方式', sortable: true, icon: 'truck' },
  { key: 'pickupTime', label: '提货时间', sortable: true, icon: 'calendar-alt' },
  { key: 'status', label: '状态', sortable: true, icon: 'circle-info' },
  { key: 'operator', label: '操作员', sortable: true, icon: 'user-cog' },
  { key: 'actions', label: '操作', icon: 'ellipsis-h' }
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
interface MemberProduct {
  id: number
  name: string
  sku: string
  image: string
  availableQuantity: number
}

interface OrderItem {
  id: number
  name: string
  sku: string
  image: string
  quantity: number
  maxQuantity: number
  originalQuantity: number
}

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
  memberProducts?: MemberProduct[]
  items?: OrderItem[]
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
      const aValue = a[sortConfig.value.key as keyof Order] || ''
      const bValue = b[sortConfig.value.key as keyof Order] || ''
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
    pending: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-600',
    delivering: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600',
    completed: 'bg-gradient-to-r from-green-50 to-green-100 text-green-600'
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
const addVisible = ref(false)
const editVisible = ref(false)
const editData = ref<Order | null>(null)

// 处理新增提货单
const handleNewPickup = () => {
  addVisible.value = true
}

// 处理编辑提货单
const handleEdit = (row: Order) => {
  // 构造编辑数据，包含必要的会员商品信息
  editData.value = {
    ...row,
    memberProducts: [
      {
        id: 1,
        name: '高级面部护理套装',
        sku: 'SKU001',
        image: 'https://placeholder.com/150',
        availableQuantity: 2
      },
      {
        id: 2,
        name: '美白精华液',
        sku: 'SKU002',
        image: 'https://placeholder.com/150',
        availableQuantity: 1
      }
    ],
    items: [
      {
        id: 1,
        name: '高级面部护理套装',
        sku: 'SKU001',
        image: 'https://placeholder.com/150',
        quantity: 1,
        maxQuantity: 2,
        originalQuantity: 2
      }
    ]
  }
  editVisible.value = true
}

// 添加提交处理函数
const handleAddSubmit = (data: any) => {
  // 添加新订单
  const newOrder: Order = {
    id: orders.value.length + 1,
    orderNo: 'PK' + dayjs().format('YYMMDDHHmmss'),
    ...data
  }
  orders.value.unshift(newOrder)
  ElMessage.success('提货单创建成功')
}

const handleEditSubmit = (data: any) => {
  // 更新现有订单
  const index = orders.value.findIndex(o => o.id === editData.value?.id)
  if (index !== -1) {
    orders.value[index] = {
      ...orders.value[index],
      ...data
    }
    ElMessage.success('提货单更新成功')
  }
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

/* 表格样式优化 */
:deep(.el-table) {
  --el-table-border-color: #f3f4f6;
  --el-table-header-bg-color: #f9fafb;
  --el-table-row-hover-bg-color: #f3f4f6;
}

:deep(.el-pagination) {
  --el-pagination-button-bg-color: #fff;
  --el-pagination-hover-color: #3b82f6;
}

/* 渐变动画 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

/* 渐变背景动画 */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gradient-animate {
  background-size: 200% 200%;
  animation: gradient 6s ease infinite;
}

/* 阴影过渡效果 */
.shadow-transition {
  @apply transition-shadow duration-300;
}

/* 悬停缩放效果 */
.hover-scale {
  @apply hover:scale-105 transition-transform duration-300;
}

/* 按钮悬停效果 */
.btn-hover {
  @apply transition-all duration-300 hover:shadow-md;
}

/* 表格行动画 */
.table-row-enter-active,
.table-row-leave-active {
  transition: all 0.3s ease-in-out;
}

.table-row-enter-from,
.table-row-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 卡片悬停效果 */
.card-hover {
  @apply transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px];
}
</style> 