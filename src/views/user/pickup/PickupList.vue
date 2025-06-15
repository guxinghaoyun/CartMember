<template>
  <!-- 状态统计卡片 -->
  <div class="overflow-x-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-w-[800px]">
      <!-- 待提货订单 -->
      <div
        class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
        <div class="flex items-center justify-between mb-4 relative">
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300"
            >
              <font-awesome-icon icon="clipboard-list" class="text-blue-500 text-xl" />
            </div>
            <div>
              <span class="text-gray-500 text-sm font-medium block">待提货订单</span>
              <div class="text-2xl font-semibold text-gray-800 mt-1">{{ statistics.pending }}</div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div
              class="flex items-center text-xs text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100/50 px-3 py-1 rounded-full font-medium"
            >
              <font-awesome-icon icon="clock" class="mr-1.5" />
              <span>{{ statistics.todayPending }} 笔待处理</span>
            </div>
            <div class="text-xs text-gray-400 mt-2">今日</div>
          </div>
        </div>
        <div
          class="h-1.5 w-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transform transition-transform duration-500 group-hover:translate-x-2"
            :style="{ width: `${(statistics.todayPending / statistics.todayTotal) * 100 || 0}%` }"
          ></div>
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
              <div class="text-xl font-semibold text-gray-800 mt-0.5">
                {{ statistics.completed }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div
              class="flex items-center text-xs text-green-500 bg-green-50 px-2 py-0.5 rounded-lg"
            >
              <font-awesome-icon icon="arrow-up" class="mr-1" />
              <span>{{ statistics.todayCompleted }} 笔</span>
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
              <div class="text-xl font-semibold text-gray-800 mt-0.5">
                {{ statistics.delivering }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div
              class="flex items-center text-xs text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-lg"
            >
              <font-awesome-icon icon="check" class="mr-1" />
              <span>{{ statistics.todayDelivering }} 笔配送中</span>
            </div>
            <div class="text-xs text-gray-500 mt-1.5">今日</div>
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"></div>
      </div>

      <!-- 总订单量 -->
      <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <font-awesome-icon icon="chart-line" class="text-purple-500 text-lg" />
            </div>
            <div>
              <span class="text-gray-600 text-sm block">总订单量</span>
              <div class="text-xl font-semibold text-gray-800 mt-0.5">{{ statistics.total }}</div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div
              class="flex items-center text-xs text-purple-500 bg-purple-50 px-2 py-0.5 rounded-lg"
            >
              <font-awesome-icon icon="check" class="mr-1" />
              <span>{{ statistics.todayTotal }} 笔</span>
            </div>
            <div class="text-xs text-gray-500 mt-1.5">今日</div>
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
      </div>
    </div>
  </div>

  <!-- 订单列表 -->
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <!-- 列表头部 -->
    <div class="p-4 border-b overflow-x-auto">
      <div class="flex items-center justify-between min-w-[800px]">
        <div class="flex items-center space-x-2 sm:space-x-4">
          <div class="flex items-center gap-2 mr-2">
            <font-awesome-icon icon="file-invoice" class="text-gray-500" />
            <h2 class="text-base sm:text-lg font-medium text-gray-800">提货订单管理</h2>
          </div>
          <div class="flex bg-gray-50/80 p-1 rounded-xl shadow-sm">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              class="px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-300 relative group"
              :class="[
                currentTab === tab.value
                  ? 'bg-white text-blue-600 shadow-sm font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              ]"
              @click="currentTab = tab.value"
            >
              <div class="flex items-center justify-center space-x-1">
                <font-awesome-icon
                  :icon="getTabIcon(tab.value)"
                  :class="[
                    currentTab === tab.value
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-600'
                  ]"
                />
                <span>{{ tab.label }}</span>
                <span
                  v-if="getTabCount(tab.value)"
                  :class="[
                    currentTab === tab.value
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  ]"
                  class="px-1.5 py-0.5 text-xs rounded-full transition-colors duration-300"
                >
                  {{ getTabCount(tab.value) }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button
            class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-300"
            @click="refreshList"
          >
            <font-awesome-icon icon="rotate" />
          </button>

          <div class="relative hidden sm:block w-64 lg:w-80">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索订单号/会员"
              @keyup.enter="handleSearch"
              class="pl-10 pr-10 py-2 border rounded-full w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
            />
            <font-awesome-icon
              icon="magnifying-glass"
              class="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <button
              class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-500 transition-colors duration-200 rounded-full hover:bg-blue-50"
              @click="handleSearch"
              title="搜索"
            >
              <font-awesome-icon icon="search" />
            </button>
          </div>

          <div class="relative" ref="filterRef">
            <button
              class="h-10 px-3 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center space-x-1"
              :class="{ 'border-blue-500 !bg-blue-50 !text-blue-600': showFilter }"
              @click="showFilter = !showFilter"
            >
              <font-awesome-icon icon="filter" />
              <span class="hidden sm:inline">筛选</span>
              <span
                v-if="activeFilters > 0"
                class="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full"
              >
                {{ activeFilters }}
              </span>
            </button>
          </div>

          <el-button type="primary" class="h-10 flex items-center" @click="handleNewPickup">
            <font-awesome-icon icon="plus" class="mr-1" />
            新增提货单
          </el-button>
        </div>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="overflow-x-auto overflow-y-auto flex-1 max-h-[calc(92vh-300px)]">
      <table class="w-full min-w-[1000px]">
        <thead class="sticky top-0 bg-gray-50 z-10">
          <tr class="bg-gradient-to-r from-gray-50 to-white border-b">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-4 text-left text-xs font-medium text-gray-600 first:pl-8 last:pr-8 whitespace-nowrap"
              :class="[
                { 'cursor-pointer hover:text-gray-900': col.sortable },
                col.key === 'actions' ? 'text-right' : ''
              ]"
              @click="col.sortable && handleSort(col.key)"
            >
              <div
                class="flex items-center space-x-2"
                :class="{ 'justify-end': col.key === 'actions' }"
              >
                <div class="w-8 h-8 rounded-lg bg-gray-50/80 flex items-center justify-center">
                  <font-awesome-icon v-if="col.icon" :icon="col.icon" class="text-gray-400" />
                </div>
                <span>{{ col.label }}</span>
                <font-awesome-icon
                  v-if="col.sortable"
                  icon="sort"
                  :class="{
                    'text-blue-500': sortConfig.key === col.key,
                    'rotate-180': sortConfig.key === col.key && sortConfig.order === 'desc'
                  }"
                  class="transition-transform duration-200"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="hover:bg-blue-50/5 transition-all duration-200 group"
          >
            <!-- 订单信息 -->
            <td class="px-6 py-4 first:pl-8">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-200"
                  >
                    <font-awesome-icon icon="file-invoice" class="text-blue-500" />
                  </div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200"
                  >
                    {{ order.orderNo }}
                  </div>
                  <div class="text-xs text-gray-500 flex items-center mt-1.5">
                    <div class="flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                      <font-awesome-icon icon="box" class="text-blue-400 mr-1.5 text-xs" />
                      <span>{{ getItemCount(order) }} 件商品</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <!-- 会员信息 -->
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-200"
                >
                  <font-awesome-icon icon="user" class="text-purple-500 text-lg" />
                </div>
                <div>
                  <div
                    class="text-xs font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-200"
                  >
                    {{ order.memberName }}
                  </div>
                  <div class="text-xs text-gray-500 flex items-center mt-1">
                    <div
                      class="flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-purple-600"
                    >
                      <font-awesome-icon icon="phone" class="text-purple-400 mr-1 text-xs" />
                      <span class="text-xs">{{ order.memberPhone }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <!-- 提货方式 -->
            <td class="px-6 py-4">
              <div
                class="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200"
                :class="{
                  'bg-gradient-to-r from-green-50 to-green-100 text-green-600':
                    order.deliveryType === 'store',
                  'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600':
                    order.deliveryType === 'delivery'
                }"
              >
                <div class="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
                  <font-awesome-icon :icon="getDeliveryIcon(order.deliveryType)" />
                </div>
                <span class="text-xs font-medium">{{ getDeliveryText(order.deliveryType) }}</span>
              </div>
            </td>
            <!-- 提货时间 -->
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <div
                  class="text-xs text-gray-900 flex items-center bg-gray-50 px-3 py-1.5 rounded-lg group-hover:bg-gray-100 transition-all duration-200"
                >
                  <font-awesome-icon icon="calendar-alt" class="text-gray-400 mr-2" />
                  {{ formatDate(order.pickupTime) }}
                </div>
                <div class="text-xs text-gray-500 mt-1.5 ml-1">
                  {{ getTimeAgo(order.pickupTime) }}
                </div>
              </div>
            </td>
            <!-- 状态 -->
            <td class="px-6 py-4">
              <div
                :class="[
                  getStatusClass(order.status),
                  'inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all duration-200'
                ]"
              >
                <div class="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center mr-2">
                  <font-awesome-icon :icon="getStatusIcon(order.status)" />
                </div>
                {{ getStatusText(order.status) }}
              </div>
            </td>
            <!-- 操作员 -->
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-200"
                >
                  <font-awesome-icon icon="user-cog" class="text-gray-500" />
                </div>
                <span class="text-xs text-gray-700 font-medium">{{ order.operator }}</span>
              </div>
            </td>
            <!-- 操作 -->
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end space-x-2 transition-all duration-200">
                <button
                  class="action-button text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-105"
                  @click="handleEdit(order)"
                  title="编辑"
                >
                  <font-awesome-icon icon="edit" />
                </button>
                <button
                  v-if="order.status !== 'completed'"
                  class="action-button text-gray-400 hover:text-green-600 hover:bg-green-50 hover:scale-105"
                  @click="handleComplete(order)"
                  title="完成"
                >
                  <font-awesome-icon icon="check" />
                </button>
                <button
                  class="action-button text-gray-400 hover:text-red-600 hover:bg-red-50 hover:scale-105"
                  @click="handleDelete(order)"
                  title="删除"
                >
                  <font-awesome-icon icon="trash" />
                </button>
              </div>
            </td>
          </tr>
          <!-- 空状态 -->
          <tr v-if="filteredOrders.length === 0">
            <td colspan="7" class="px-6 py-16">
              <div class="text-center">
                <div
                  class="w-24 h-24 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm"
                >
                  <font-awesome-icon icon="inbox" class="text-4xl text-gray-300" />
                </div>
                <div class="text-gray-500 font-medium">暂无相关订单</div>
                <div class="text-gray-400 text-sm mt-1">
                  可以点击右上角的"新增提货单"按钮创建新订单
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t gap-3 overflow-x-auto"
    >
      <div class="text-sm text-gray-500 flex-shrink-0">
        共
        <span class="font-medium text-gray-900">{{ totalOrders }}</span>
        条
        <span class="hidden sm:inline">记录，每页 {{ pageSize }} 条</span>
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalOrders"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        class="!text-sm !flex !justify-center sm:!justify-end"
        :pager-count="pagerCount"
        background
      />
    </div>
  </div>

  <!-- 添加提货单表单 -->
  <AddPickupForm v-model:visible="addVisible" @submit="handleAddSubmit" />

  <EditPickupForm v-model:visible="editVisible" :edit-data="editData" @submit="handleEditSubmit" />

  <!-- 筛选面板 - 相对于筛选按钮定位 -->
  <teleport to="body">
    <div v-if="showFilter" class="fixed inset-0 z-40" @click.self="showFilter = false">
      <div
        class="absolute bg-white rounded-2xl shadow-xl p-6 z-50 border animate-fade-in"
        style="max-height: 80vh; overflow-y: auto; width: 320px; right: 180px; top: 270px"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-800">筛选条件</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="showFilter = false">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
        <div class="space-y-4">
          <!-- 提货方式筛选 -->
          <div>
            <div class="text-sm font-medium mb-2 flex items-center">
              <font-awesome-icon icon="cube" class="text-gray-400 mr-2" />
              提货方式
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in deliveryTypes"
                :key="type.value"
                class="px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 flex items-center"
                :class="
                  filters.deliveryType === type.value
                    ? 'bg-blue-50 text-blue-500 border border-blue-200'
                    : 'text-gray-500 hover:bg-gray-50 border border-gray-200'
                "
                @click="filters.deliveryType = type.value"
              >
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
              class="!w-full"
              :popper-options="{ strategy: 'fixed' }"
            />
          </div>
          <!-- 操作员筛选 -->
          <div>
            <div class="text-sm font-medium mb-2 flex items-center">
              <font-awesome-icon icon="user-cog" class="text-gray-400 mr-2" />
              操作员
            </div>
            <el-select
              v-model="filters.operator"
              placeholder="选择操作员"
              class="!w-full"
              popper-class="operator-select-dropdown"
              :popper-options="{ strategy: 'fixed' }"
              size="large"
            >
              <el-option value="" label="全部操作员">
                <div class="flex items-center space-x-2">
                  <div class="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                    <font-awesome-icon icon="users" class="text-gray-400" />
                  </div>
                  <span>全部操作员</span>
                </div>
              </el-option>
              <el-option v-for="op in operators" :key="op" :value="op" :label="op">
                <div class="flex items-center space-x-2">
                  <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <font-awesome-icon icon="user" class="text-blue-400" />
                  </div>
                  <span>{{ op }}</span>
                </div>
              </el-option>
            </el-select>
          </div>
          <!-- 筛选按钮 -->
          <div class="flex justify-end space-x-2 pt-4 border-t">
            <button
              class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center"
              @click="resetFilters"
            >
              <font-awesome-icon icon="rotate" class="mr-2" />
              重置
            </button>
            <button
              class="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center"
              @click="applyFilters"
            >
              <font-awesome-icon icon="check" class="mr-2" />
              应用筛选
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { DateModelType } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/zh-cn'
import AddPickupForm from './components/AddPickupForm.vue'
import EditPickupForm from './components/EditPickupForm.vue'
import { pickupApi } from '@/api/user/pickup'
import type {
  PickupOrder,
  PickupStatus,
  PickupMethod,
  PickupOrderQueryParams,
  PickupStatistics,
  CreatePickupOrderRequest,
  UpdatePickupOrderRequest
} from '@/types/api/user/pickup'
import type { PaginationParams } from '@/types/api/common'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('zh-cn')

// 屏幕宽度判断
const screenWidth = ref(window.innerWidth)
const isSmallScreen = computed(() => screenWidth.value < 640)
const pagerCount = computed(() => (isSmallScreen.value ? 3 : 5))

// 监听窗口大小变化
const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

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

// 排序配置
interface SortConfig {
  key: keyof PickupOrder | ''
  order: 'asc' | 'desc'
}

const sortConfig = ref<SortConfig>({
  key: '',
  order: 'asc'
})

// 状态
const currentTab = ref('all')
const searchQuery = ref('')
const showFilter = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

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
  if (value === 'all') return total.value
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
const loading = ref(false)
const total = ref(0)
const statistics = ref<PickupStatistics>({
  total: 0,
  pending: 0,
  delivering: 0,
  completed: 0,
  todayPending: 0,
  todayCompleted: 0,
  todayDelivering: 0,
  todayTotal: 0
})

const orders = ref<PickupOrder[]>([]) // 当前页显示的订单
const allOrders = ref<PickupOrder[]>([]) // 存储所有订单数据
const editData = ref<PickupOrder | null>(null)

// 是否处于搜索模式
const isSearchMode = ref(false)
const searchResults = ref<PickupOrder[]>([])
const searchResultsTotal = ref(0)

// 排序和过滤后的订单列表
const filteredOrders = computed<PickupOrder[]>(() => {
  // 在搜索模式下，直接返回当前分页的搜索结果
  if (isSearchMode.value) {
    return orders.value
  }

  let result = [...orders.value]

  // 状态过滤
  if (currentTab.value !== 'all') {
    result = result.filter(order => order.status === currentTab.value)
  }

  // 配送方式过滤
  if (filters.value.deliveryType) {
    result = result.filter(order => order.deliveryType === filters.value.deliveryType)
  }

  // 操作员过滤
  if (filters.value.operator) {
    result = result.filter(order => order.operator === filters.value.operator)
  }

  // 日期范围过滤
  if (filters.value.dateRange && filters.value.dateRange.length === 2) {
    const startDate = dayjs(filters.value.dateRange[0]).startOf('day')
    const endDate = dayjs(filters.value.dateRange[1]).endOf('day')
    result = result.filter(order => {
      const orderDate = dayjs(order.pickupTime)
      return orderDate.isBetween(startDate, endDate, null, '[]')
    })
  }

  // 排序
  if (sortConfig.value.key && sortConfig.value.order) {
    result.sort((a, b) => {
      if (sortConfig.value.key === '') return 0
      const aValue = String(a[sortConfig.value.key])
      const bValue = String(b[sortConfig.value.key])
      const factor = sortConfig.value.order === 'asc' ? 1 : -1
      return aValue > bValue ? factor : -factor
    })
  }

  return result
})

// 总记录数
const totalOrders = computed(() => {
  return isSearchMode.value ? searchResultsTotal.value : total.value
})

// 搜索所有订单数据中的会员
const searchAllOrders = () => {
  if (!searchQuery.value.trim()) {
    ElMessage({
      message: '请输入搜索关键词',
      type: 'warning'
    })
    return
  }

  // 加载所有订单
  if (allOrders.value.length === 0) {
    loadAllOrders()
    return // loadAllOrders 中会在加载完成后调用 searchAllOrders
  }

  const keyword = searchQuery.value.toLowerCase()
  searchResults.value = allOrders.value.filter(
    order =>
      order.orderNo.toLowerCase().includes(keyword) ||
      order.memberName.toLowerCase().includes(keyword) ||
      order.memberPhone.toLowerCase().includes(keyword)
  )

  searchResultsTotal.value = searchResults.value.length
  isSearchMode.value = true
  currentPage.value = 1
  applySearchPagination()

  ElMessage({
    message: `找到 ${searchResultsTotal.value} 条相关记录`,
    type: 'success',
    duration: 1500
  })
}

// 应用搜索结果分页
const applySearchPagination = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  orders.value = searchResults.value.slice(start, end)
}

// 加载所有订单数据
const loadAllOrders = async () => {
  try {
    loading.value = true
    ElMessage({
      message: '正在加载所有订单数据，请稍候...',
      type: 'info',
      duration: 0
    })

    // 构建请求参数，请求大量数据
    const requestBody = {
      status: 0, // 所有状态
      slipType: 0, // 所有类型
      startTime: '',
      endTime: '',
      numberOfMembership: '',
      operationUser: ''
    }

    const pagination = {
      pageNumber: 1,
      pageSize: 1000 // 尝试一次性获取足够多的数据
    }

    const response = await pickupApi.getOrders(pagination, requestBody)

    if (response) {
      try {
        const apiData = response as unknown as {
          records: any[]
          totalRecords: number
        }

        if (apiData.totalRecords > 1000) {
          // 如果总数超过1000，需要分批获取
          const totalPages = Math.ceil(apiData.totalRecords / 1000)
          let allRecords = [...convertApiRecords(apiData.records)]

          for (let page = 2; page <= totalPages; page++) {
            const nextPagination = { ...pagination, pageNumber: page }
            const nextResponse = await pickupApi.getOrders(nextPagination, requestBody)
            const nextData = nextResponse as unknown as { records: any[] }
            const convertedRecords = convertApiRecords(nextData.records)
            allRecords = [...allRecords, ...convertedRecords]
          }

          allOrders.value = allRecords
        } else {
          allOrders.value = convertApiRecords(apiData.records)
        }

        // 数据加载完成后执行搜索
        ElMessage.closeAll()
        searchAllOrders()
      } catch (err) {
        console.error('解析API响应数据失败:', err)
        ElMessage.error('解析数据失败')
      }
    }
  } catch (error) {
    console.error('获取所有订单数据失败:', error)
    ElMessage.error('获取所有订单数据失败')
  } finally {
    loading.value = false
  }
}

// 将API返回的记录转换为前端数据结构
const convertApiRecords = (records: any[]): PickupOrder[] => {
  return Array.isArray(records)
    ? records.map(record => {
        const statusMap: Record<number, PickupStatus> = {
          1: 'pending',
          2: 'delivering',
          3: 'completed'
        }

        return {
          id: record.id,
          orderNo: record.number || '',
          memberName: record.membershipName || '',
          memberPhone: record.membershipPhone || '',
          status: statusMap[record.status] || 'pending',
          deliveryType: record.pickUpType === 1 ? 'store' : 'delivery',
          pickupTime: record.pickUpTime || '',
          deliveryAddress: record.pickUpAddress || '',
          operator: record.operationUser || '',
          notes: record.note || '',
          items: record.items || [],
          createTime: record.createTime || '',
          updateTime: record.updateTime || ''
        } as PickupOrder
      })
    : []
}

// 方法
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage({
      message: '请输入搜索关键词',
      type: 'warning'
    })
    return
  }

  console.log('执行全局搜索:', searchQuery.value)
  searchAllOrders()
}

// 清除搜索，回到正常模式
const clearSearch = () => {
  if (isSearchMode.value) {
    isSearchMode.value = false
    searchQuery.value = ''
    searchResults.value = []
    currentPage.value = 1
    fetchOrders()
  }
}

// 页面和每页数量变更处理
const handleSizeChange = (size: number) => {
  console.log('每页条数变化:', size)
  pageSize.value = size
  currentPage.value = 1

  if (isSearchMode.value) {
    applySearchPagination()
  } else {
    fetchOrders()
  }
}

const handlePageChange = (page: number) => {
  console.log('页码变化:', page)
  currentPage.value = page

  if (isSearchMode.value) {
    applySearchPagination()
  } else {
    fetchOrders()
  }
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

// 处理新增提货单
const handleNewPickup = () => {
  addVisible.value = true
}

// 处理编辑提货单
const handleEdit = (order: PickupOrder) => {
  console.log('编辑订单:', order.orderNo, '订单数据:', order)
  // 直接使用当前订单数据，不再发送API请求
  editData.value = JSON.parse(JSON.stringify(order)) // 深拷贝避免引用问题
  console.log('设置编辑数据:', editData.value)
  editVisible.value = true
  console.log('设置弹窗可见:', editVisible.value)
}

// 添加提交处理函数
const handleAddSubmit = (data: any) => {
  // 添加新订单
  const newOrder: PickupOrder = {
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
    await ElMessageBox.confirm(`确认将订单 ${order.orderNo} 标记为已完成吗？`, '完成确认', {
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
    })

    // 显示加载提示
    const loadingInstance = ElMessage({
      type: 'info',
      message: '正在更新订单状态...',
      duration: 0
    })

    try {
      // 调用API完成订单
      const response = await pickupApi.completeOrder(order.id)
      console.log('完成订单响应:', response)

      // 关闭加载提示
      loadingInstance.close()

      // 更新本地订单状态
      if (isSearchMode.value && allOrders.value.length > 0) {
        // 在全局数据中更新
        const globalOrderIndex = allOrders.value.findIndex(o => o.id === order.id)
        if (globalOrderIndex !== -1) {
          allOrders.value[globalOrderIndex].status = 'completed'
        }

        // 在搜索结果中更新
        const searchOrderIndex = searchResults.value.findIndex(o => o.id === order.id)
        if (searchOrderIndex !== -1) {
          searchResults.value[searchOrderIndex].status = 'completed'
        }
      }

      // 更新当前显示的订单
      const index = orders.value.findIndex(o => o.id === order.id)
      if (index !== -1) {
        orders.value[index].status = 'completed'
      }

      // 更新统计数据
      fetchStatistics()

      ElMessage({
        type: 'success',
        message: `订单 ${order.orderNo} 已完成`,
        duration: 2000
      })
    } catch (error) {
      // 关闭加载提示
      loadingInstance.close()

      console.error('完成订单失败:', error)
      ElMessage({
        type: 'error',
        message: '完成订单失败，请重试',
        duration: 3000
      })
    }
  } catch {
    // 用户取消操作
  }
}

const handleDelete = async (order: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除订单 ${order.orderNo} 吗？`, '删除确认', {
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
    })

    // 显示加载提示
    const loadingInstance = ElMessage({
      type: 'info',
      message: '正在删除订单...',
      duration: 0
    })

    try {
      // 调用API删除订单
      const response = await pickupApi.deleteOrder(order.id)
      console.log('删除订单响应:', response)

      // 关闭加载提示
      loadingInstance.close()

      // 从数组中删除订单
      if (isSearchMode.value) {
        // 从搜索结果中移除
        searchResults.value = searchResults.value.filter(o => o.id !== order.id)
        searchResultsTotal.value = searchResults.value.length
        applySearchPagination()

        // 同时从所有订单数据中移除
        if (allOrders.value.length > 0) {
          allOrders.value = allOrders.value.filter(o => o.id !== order.id)
        }
      }

      // 从当前显示的订单列表中移除
      orders.value = orders.value.filter(o => o.id !== order.id)

      // 手动更新总记录数
      total.value = Math.max(0, total.value - 1)

      // 如果当前页已经没有数据且不是第一页，则跳转到上一页
      if (orders.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
        if (!isSearchMode.value) {
          fetchOrders()
        } else {
          applySearchPagination()
        }
      }

      // 更新统计数据
      fetchStatistics()

      ElMessage({
        type: 'success',
        message: `订单 ${order.orderNo} 已成功删除`,
        duration: 2000
      })
    } catch (error) {
      // 关闭加载提示
      loadingInstance.close()

      console.error('删除订单失败:', error)
      ElMessage({
        type: 'error',
        message: '删除订单失败，请重试',
        duration: 3000
      })
    }
  } catch {
    // 用户取消删除操作
  }
}

// 获取提货单列表
const fetchOrders = async () => {
  try {
    loading.value = true

    // 构建请求参数，符合后端API要求
    const requestBody = {
      status: currentTab.value === 'all' ? 0 : getStatusNumber(currentTab.value),
      slipType: filters.value.deliveryType ? getDeliveryTypeNumber(filters.value.deliveryType) : 0,
      startTime: filters.value.dateRange
        ? dayjs(filters.value.dateRange[0]).format('YYYY-MM-DD')
        : '',
      endTime: filters.value.dateRange
        ? dayjs(filters.value.dateRange[1]).format('YYYY-MM-DD')
        : '',
      // 移除搜索参数，改为前端过滤
      // numberOfMembership: searchQuery.value || '',
      numberOfMembership: '',
      operationUser: filters.value.operator || ''
    }

    const pagination = {
      pageNumber: currentPage.value,
      pageSize: pageSize.value
    }

    console.log('发送订单列表请求:', pagination, requestBody)
    const response = await pickupApi.getOrders(pagination, requestBody)
    console.log('接收到订单列表响应response:', response)

    // 处理响应数据
    if (response) {
      try {
        // 使用类型断言处理可能的类型不匹配
        const apiData = response as unknown as {
          currentPage: number
          pageSize: number
          totalRecords: number
          totalPages: number
          records: any[]
        }
        console.log('apiData:', apiData)

        // 转换后端数据到前端格式
        orders.value = Array.isArray(apiData.records)
          ? apiData.records.map(record => {
              // 状态数字转换为字符串
              const statusMap: Record<number, PickupStatus> = {
                1: 'pending',
                2: 'delivering',
                3: 'completed'
              }

              return {
                id: record.id,
                orderNo: record.number || '',
                memberName: record.membershipName || '',
                memberPhone: record.membershipPhone || '',
                // 数字状态转为字符串状态
                status: statusMap[record.status] || 'pending',
                // 数字类型转为字符串类型
                deliveryType: record.pickUpType === 1 ? 'store' : 'delivery',
                // 字段名称调整
                pickupTime: record.pickUpTime || '',
                deliveryAddress: record.pickUpAddress || '',
                operator: record.operationUser || '',
                notes: record.note || '',
                // 缺失的字段设置默认值
                items: record.items || [],
                createTime: record.createTime || '',
                updateTime: record.updateTime || ''
              } as PickupOrder
            })
          : []
        console.log('转换后的订单数据:', orders.value)
        // 使用totalRecords作为总记录数
        total.value = apiData.totalRecords || 0
        console.log('total.value:', total.value)
        console.log(
          '订单数据已更新:',
          orders.value.length,
          '条记录',
          '总记录数:',
          apiData.totalRecords
        )
      } catch (err) {
        console.error('解析API响应数据失败:', err)
        ElMessage.error('解析数据失败')
      }
    } else {
      console.error('API响应格式不正确:', response)
      ElMessage.error('获取数据失败')
    }
  } catch (error) {
    console.error('获取提货单列表失败:', error)
    ElMessage.error('获取提货单列表失败')
  } finally {
    loading.value = false
  }
}

// 将状态转换为后端API要求的数字格式
const getStatusNumber = (status: string): number => {
  const statusMap: Record<string, number> = {
    pending: 1, // 待提货
    delivering: 2, // 配送中
    completed: 3 // 已完成
  }
  return statusMap[status] || 0
}

// 将提货方式转换为后端API要求的数字格式
const getDeliveryTypeNumber = (type: string): number => {
  return type === 'store' ? 1 : 2 // 1=门店自提，2=快递配送
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    // 获取订单摘要数据
    const summaryResponse = (await pickupApi.getOrdersSummary()) as any
    if (summaryResponse) {
      const summaryData = summaryResponse
      console.log('获取订单摘要数据成功:', summaryData)

      // 更新统计数据
      if (summaryData) {
        // 总订单量
        statistics.value.total = summaryData.pickUpInShopOrders || statistics.value.total
        // 已完成订单
        statistics.value.completed = summaryData.completeOrders || statistics.value.completed
        // 配送中订单（快递配送）
        statistics.value.delivering = summaryData.deliveryOrders || statistics.value.delivering
        // 待提货订单（总订单 - 完成订单 - 配送中订单）
        statistics.value.pending = summaryData.pickUpOrders || statistics.value.pending
      }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 设置默认数据，确保界面不会因为API错误而无法显示
    if (!statistics.value.total) {
      statistics.value = {
        pending: 12,
        delivering: 5,
        completed: 28,
        total: 45,
        todayPending: 4,
        todayCompleted: 7,
        todayDelivering: 2,
        todayTotal: 13
      }
    }
  }
}

// 获取商品总数的计算属性
const getItemCount = (order: PickupOrder) => {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}

// 监听筛选条件变化和页码变化，自动刷新数据
watch([currentTab, () => filters.value.deliveryType, () => filters.value.operator], () => {
  console.log('筛选条件变化，重新获取数据')
  currentPage.value = 1 // 重置为第一页
  fetchOrders()
})

// 初始化时获取数据
onMounted(() => {
  console.log('组件已挂载，开始获取订单数据和统计数据')
  fetchOrders()
  fetchStatistics()

  // 添加全局点击事件监听器
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 处理点击外部关闭筛选面板
const filterRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (showFilter.value && filterRef.value && !filterRef.value.contains(event.target as Node)) {
    showFilter.value = false
  }
}

// 恢复丢失的函数
const handleSort = (key: string) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.order = sortConfig.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value.key = key as keyof PickupOrder
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
  console.log('应用筛选条件')

  if (isSearchMode.value) {
    clearSearch()
  } else {
    fetchOrders()
  }
}

const refreshList = () => {
  console.log('手动刷新列表')

  if (isSearchMode.value) {
    clearSearch()
  } else {
    fetchOrders()
    fetchStatistics()
  }

  ElMessage.success('列表已刷新')
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f9f9f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
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
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

/* 渐变背景动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
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

/* 操作员下拉列表样式 */
:deep(.operator-select-dropdown) {
  border-radius: 12px;
  border: 1px solid #eaecf0;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 6px;
}

:deep(.operator-select-dropdown .el-select-dropdown__item) {
  border-radius: 8px;
  margin: 2px 0;
  height: auto;
  padding: 8px 12px;
}

:deep(.operator-select-dropdown .el-select-dropdown__item.hover) {
  background-color: #f4f9ff;
}

:deep(.operator-select-dropdown .el-select-dropdown__item.selected) {
  background-color: #edf5ff;
  color: #3b82f6;
  font-weight: 500;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 10px;
  padding: 0px 12px;
  border: 1px solid #e5e7eb;
  box-shadow: none;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
}
</style>
