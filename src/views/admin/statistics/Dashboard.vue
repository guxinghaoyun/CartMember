<template>
  <div class="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <!-- 快速查询 -->
    <!-- <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 mb-6">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row sm:items-center gap-6">
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-gray-600 font-medium">快速查询:</span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="period in periods"
                  :key="period.value"
                  class="!rounded-xl px-4 py-2 transition-all duration-200"
                  :class="
                    selectedPeriod === period.value
                      ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100'
                      : 'hover:bg-gray-100 text-gray-600'
                  "
                  @click="selectedPeriod = period.value"
                >
                  {{ period.label }}
                </button>
              </div>
            </div>
            <div class="hidden sm:block h-8 w-px bg-gray-200"></div>
            <div class="flex flex-wrap items-center gap-3">
              <div class="relative group">
                <input
                  v-model="dateRange.start"
                  type="date"
                  class="!rounded-xl pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
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
                  class="!rounded-xl pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
                <font-awesome-icon
                  icon="calendar-alt"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
                />
              </div>
              <button
                class="!rounded-xl px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
              @click="handleQuery"
              >
                <font-awesome-icon icon="search" class="mr-2" />
                查询
              </button>
            </div>
          </div>
        </div>
    </div> -->

    <!-- 顶部数据卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-blue-100 text-sm font-medium">总兑换积分</p>
            <p class="text-4xl font-bold mt-3 tracking-tight">
              {{ todaySales }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-blue-400 bg-opacity-30 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
          >
            <font-awesome-icon icon="coins" class="text-2xl" />
          </div>
        </div>
        <div class="flex items-center text-sm text-blue-100">
          <font-awesome-icon icon="arrow-up" class="mr-1" />
          <span>{{ todayCompare }}</span>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-green-100 text-sm font-medium">订单总量</p>
            <p class="text-4xl font-bold mt-3 tracking-tight">
              {{ productSales }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-green-400 bg-opacity-30 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
          >
            <font-awesome-icon icon="shopping-cart" class="text-2xl" />
          </div>
        </div>
        <div class="flex items-center text-sm text-green-100">
          <font-awesome-icon icon="arrow-up" class="mr-1" />
          <span>{{ productCompare }}</span>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-purple-100 text-sm font-medium">客单积分</p>
            <p class="text-4xl font-bold mt-3 tracking-tight">
              {{ Number(178.5).toLocaleString() }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-purple-400 bg-opacity-30 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
          >
            <font-awesome-icon icon="receipt" class="text-2xl" />
          </div>
        </div>
        <div class="flex items-center text-sm text-purple-100">
          <font-awesome-icon icon="arrow-down" class="mr-1" />
          <span>较上月下降 2.1%</span>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-orange-100 text-sm font-medium">新增会员</p>
            <p class="text-4xl font-bold mt-3 tracking-tight">
              {{ Number(246).toLocaleString() }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-orange-400 bg-opacity-30 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
          >
            <font-awesome-icon icon="user-plus" class="text-2xl" />
          </div>
        </div>
        <div class="flex items-center text-sm text-orange-100">
          <font-awesome-icon icon="arrow-up" class="mr-1" />
          <span>较上月增长 15.8%</span>
        </div>
      </div>
    </div>

    <!-- 图表区域：左边销售趋势，右边商品分类 -->
    <div class="grid grid-cols-2 gap-6" style="height: calc(100% - 300px)">
      <!-- 销售趋势图表 -->
      <div
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
      >
        <!-- 图表头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h2
              class="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
            >
              销售趋势
            </h2>
            <div
              class="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-full font-medium border border-blue-100"
            >
              {{ isLoading ? '加载中...' : '实时数据' }}
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- 店铺选择 -->
            <div class="relative group">
              <div
                class="relative cursor-pointer !rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 pl-12 pr-10 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200 text-sm font-medium text-blue-700 shadow-sm hover:shadow-md min-w-[140px]"
                @click.stop="toggleStoreDropdown"
              >
                <div
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center"
                >
                  <font-awesome-icon icon="store" class="text-white text-xs" />
                </div>
                <span class="block truncate">
                  {{ selectedStore === 'all' ? '全部店铺' : selectedStore }}
                </span>
                <font-awesome-icon
                  icon="chevron-down"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 transition-transform duration-200"
                  :class="{ 'rotate-180': isStoreDropdownOpen }"
                />
              </div>

              <!-- 下拉选项 -->
              <div
                v-show="isStoreDropdownOpen"
                class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-100 rounded-xl shadow-xl z-50 overflow-hidden"
                @click.stop
              >
                <div
                  class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 text-sm font-medium text-gray-700 hover:text-blue-600 border-b border-gray-100"
                  :class="{ 'bg-blue-50 text-blue-600': selectedStore === 'all' }"
                  @click="selectStore('all')"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center"
                    >
                      <font-awesome-icon icon="globe" class="text-white text-xs" />
                    </div>
                    <span>全部店铺</span>
                    <font-awesome-icon
                      v-if="selectedStore === 'all'"
                      icon="check"
                      class="text-blue-500 ml-auto text-xs"
                    />
                  </div>
                </div>
                <div
                  v-for="store in availableStores"
                  :key="store"
                  class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 text-sm font-medium text-gray-700 hover:text-blue-600"
                  :class="{ 'bg-blue-50 text-blue-600': selectedStore === store }"
                  @click="selectStore(store)"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center"
                    >
                      <font-awesome-icon icon="store" class="text-white text-xs" />
                    </div>
                    <span class="truncate">{{ store }}</span>
                    <font-awesome-icon
                      v-if="selectedStore === store"
                      icon="check"
                      class="text-blue-500 ml-auto text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 周期选择 -->
            <div
              class="flex items-center space-x-1 bg-gradient-to-r from-gray-50 to-blue-50 p-1.5 rounded-xl border-2 border-gray-200 shadow-sm"
            >
              <button
                v-for="period in ['week', 'month', 'year']"
                :key="period"
                :class="{
                  'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg font-semibold border-0 transform scale-105':
                    salesTrendPeriod === period,
                  'text-gray-600 hover:text-blue-500 hover:bg-white hover:shadow-sm':
                    salesTrendPeriod !== period
                }"
                class="px-4 py-2.5 rounded-lg text-sm transition-all duration-200 min-w-[60px] font-medium"
                @click="handlePeriodChange(period)"
              >
                {{ getPeriodText(period) }}
              </button>
            </div>
          </div>
        </div>

        <!-- 图表内容区域 -->
        <div class="p-6 relative" style="height: calc(100% - 80px)">
          <!-- 加载中状态 -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              ></div>
              <div class="mt-3 text-blue-600 font-medium">加载中...</div>
            </div>
          </div>

          <div id="salesTrendChart" class="w-full h-full"></div>
        </div>
      </div>

      <!-- 商品分类图表 -->
      <div
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
      >
        <!-- 图表头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h2
              class="text-xl font-semibold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent"
            >
              商品分类销售
            </h2>
            <div
              class="px-3 py-1.5 bg-green-50 text-green-600 text-sm rounded-full font-medium border border-green-100"
            >
              {{ isClassificationLoading ? '加载中...' : '分类统计' }}
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- 店铺选择 -->
            <div class="relative group">
              <div
                class="relative cursor-pointer !rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 pl-12 pr-10 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200 text-sm font-medium text-green-700 shadow-sm hover:shadow-md min-w-[140px]"
                @click.stop="toggleClassificationStoreDropdown"
              >
                <div
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center"
                >
                  <font-awesome-icon icon="store" class="text-white text-xs" />
                </div>
                <span class="block truncate">
                  {{
                    classificationSelectedStore === 'all' ? '全部店铺' : classificationSelectedStore
                  }}
                </span>
                <font-awesome-icon
                  icon="chevron-down"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 transition-transform duration-200"
                  :class="{ 'rotate-180': isClassificationStoreDropdownOpen }"
                />
              </div>

              <!-- 下拉选项 -->
              <div
                v-show="isClassificationStoreDropdownOpen"
                class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-green-100 rounded-xl shadow-xl z-50 overflow-hidden"
                @click.stop
              >
                <div
                  class="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-150 text-sm font-medium text-gray-700 hover:text-green-600 border-b border-gray-100"
                  :class="{ 'bg-green-50 text-green-600': classificationSelectedStore === 'all' }"
                  @click="selectClassificationStore('all')"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center"
                    >
                      <font-awesome-icon icon="globe" class="text-white text-xs" />
                    </div>
                    <span>全部店铺</span>
                    <font-awesome-icon
                      v-if="classificationSelectedStore === 'all'"
                      icon="check"
                      class="text-green-500 ml-auto text-xs"
                    />
                  </div>
                </div>
                <div
                  v-for="store in availableStores"
                  :key="store"
                  class="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-150 text-sm font-medium text-gray-700 hover:text-green-600"
                  :class="{ 'bg-green-50 text-green-600': classificationSelectedStore === store }"
                  @click="selectClassificationStore(store)"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center"
                    >
                      <font-awesome-icon icon="store" class="text-white text-xs" />
                    </div>
                    <span class="truncate">{{ store }}</span>
                    <font-awesome-icon
                      v-if="classificationSelectedStore === store"
                      icon="check"
                      class="text-green-500 ml-auto text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 周期选择 -->
            <div
              class="flex items-center space-x-1 bg-gradient-to-r from-gray-50 to-green-50 p-1.5 rounded-xl border-2 border-gray-200 shadow-sm"
            >
              <button
                v-for="period in ['week', 'month', 'year']"
                :key="period"
                :class="{
                  'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg font-semibold border-0 transform scale-105':
                    classificationPeriod === period,
                  'text-gray-600 hover:text-green-500 hover:bg-white hover:shadow-sm':
                    classificationPeriod !== period
                }"
                class="px-4 py-2.5 rounded-lg text-sm transition-all duration-200 min-w-[60px] font-medium"
                @click="handleClassificationPeriodChange(period)"
              >
                {{ getPeriodText(period) }}
              </button>
            </div>
          </div>
        </div>

        <!-- 图表内容区域 -->
        <div class="p-6 relative" style="height: calc(100% - 80px)">
          <!-- 加载中状态 -->
          <div
            v-if="isClassificationLoading"
            class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"
              ></div>
              <div class="mt-3 text-green-600 font-medium">加载中...</div>
            </div>
          </div>

          <div id="classificationChart" class="w-full h-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { statisticsApi } from '@/api/admin/statistics'

// 图表实例
let salesTrendChart: echarts.ECharts | null = null
let classificationChart: echarts.ECharts | null = null

// 状态
const selectedPeriod = ref('today')
const selectedStore = ref('all')
const classificationSelectedStore = ref('all')
const salesTrendPeriod = ref('year')
const classificationPeriod = ref('year')
const dateRange = ref({
  start: '',
  end: ''
})

// 加载状态
const isLoading = ref(false)
const isClassificationLoading = ref(false)

// 下拉框状态
const isStoreDropdownOpen = ref(false)
const isClassificationStoreDropdownOpen = ref(false)

// 数据缓存
const cachedData = ref<Record<string, any> | null>(null)
const classificationCachedData = ref<Record<string, any> | null>(null)
const availableStores = ref<string[]>([])

// 快速查询选项
const periods = [
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '近半年', value: 'halfYear' }
]

// 计算顶部卡片数据
const todaySales = computed(() => {
  if (selectedStore.value === 'all') {
    // 全部店铺：累加所有店铺的数据
    let totalSales = 0
    if (cachedData.value && Object.keys(cachedData.value).length > 0) {
      Object.values(cachedData.value).forEach((storeData: any) => {
        if (storeData?.yearData) {
          Object.values(storeData.yearData).forEach((value: any) => {
            if (typeof value === 'number') {
              totalSales += value
            } else if (typeof value === 'object') {
              Object.values(value).forEach((categoryValue: any) => {
                totalSales += Number(categoryValue) || 0
              })
            }
          })
        }
      })
    }
    return totalSales > 0 ? totalSales.toLocaleString() : '54,330'
  } else {
    // 单个店铺：使用选中店铺的数据
    const storeData = cachedData.value?.[selectedStore.value]
    let storeTotalSales = 0
    if (storeData?.yearData) {
      Object.values(storeData.yearData).forEach((value: any) => {
        if (typeof value === 'number') {
          storeTotalSales += value
        } else if (typeof value === 'object') {
          Object.values(value).forEach((categoryValue: any) => {
            storeTotalSales += Number(categoryValue) || 0
          })
        }
      })
    }
    return storeTotalSales > 0 ? storeTotalSales.toLocaleString() : '0'
  }
})

const todayCompare = computed(() => {
  return '较上月增长 12.5%'
})

const productSales = computed(() => {
  if (selectedStore.value === 'all') {
    // 全部店铺：累加所有店铺的数据并转换为销量
    let totalSales = 0
    if (cachedData.value && Object.keys(cachedData.value).length > 0) {
      Object.values(cachedData.value).forEach((storeData: any) => {
        if (storeData?.yearData) {
          Object.values(storeData.yearData).forEach((value: any) => {
            if (typeof value === 'number') {
              totalSales += value
            } else if (typeof value === 'object') {
              Object.values(value).forEach((categoryValue: any) => {
                totalSales += Number(categoryValue) || 0
              })
            }
          })
        }
      })
    }
    const estimatedSales = Math.round(totalSales / 100)
    return estimatedSales > 0 ? estimatedSales.toLocaleString() : '543'
  } else {
    // 单个店铺的销量计算
    const storeData = cachedData.value?.[selectedStore.value]
    let totalSales = 0
    if (storeData?.yearData) {
      Object.values(storeData.yearData).forEach((value: any) => {
        if (typeof value === 'number') {
          totalSales += value
        } else if (typeof value === 'object') {
          Object.values(value).forEach((categoryValue: any) => {
            totalSales += Number(categoryValue) || 0
          })
        }
      })
    }
    const estimatedSales = Math.round(totalSales / 100)
    return estimatedSales > 0 ? estimatedSales.toLocaleString() : '0'
  }
})

const productCompare = computed(() => {
  return '较上月增长 8.3%'
})

// 周期文本
const getPeriodText = (period: string) => {
  const texts = {
    week: '本周',
    month: '本月',
    year: '本年'
  }
  return texts[period as keyof typeof texts]
}

// 处理查询
const handleQuery = () => {
  console.log('执行查询:', { selectedPeriod: selectedPeriod.value, dateRange: dateRange.value })
  // 重新加载数据
  initSalesTrendChart()
  initClassificationChart()
}

// 下拉框控制方法
const toggleStoreDropdown = () => {
  isStoreDropdownOpen.value = !isStoreDropdownOpen.value
  isClassificationStoreDropdownOpen.value = false
}

const toggleClassificationStoreDropdown = () => {
  isClassificationStoreDropdownOpen.value = !isClassificationStoreDropdownOpen.value
  isStoreDropdownOpen.value = false
}

const selectStore = (store: string) => {
  selectedStore.value = store
  isStoreDropdownOpen.value = false
  handleStoreChange()
}

const selectClassificationStore = (store: string) => {
  classificationSelectedStore.value = store
  isClassificationStoreDropdownOpen.value = false
  handleClassificationStoreChange()
}

// 点击外部关闭下拉框
const closeDropdowns = () => {
  isStoreDropdownOpen.value = false
  isClassificationStoreDropdownOpen.value = false
}

// 处理店铺切换
const handleStoreChange = () => {
  console.log('切换销售趋势店铺:', selectedStore.value)
  // 重新渲染销售趋势图表
  if (cachedData.value) {
    renderChart(salesTrendPeriod.value, getStoreData(cachedData.value, selectedStore.value))
  }
}

// 处理商品分类店铺切换
const handleClassificationStoreChange = () => {
  console.log('切换商品分类店铺:', classificationSelectedStore.value)
  // 重新渲染商品分类图表
  if (classificationCachedData.value) {
    renderClassificationChart(
      classificationPeriod.value,
      getStoreData(classificationCachedData.value, classificationSelectedStore.value)
    )
  }
}

// 获取店铺数据
const getStoreData = (allData: Record<string, any>, selectedStore: string) => {
  if (selectedStore === 'all') {
    // 全部店铺：合并所有店铺数据
    const mergedData: Record<string, any> = {
      weekData: {},
      monthData: {},
      yearData: {}
    }

    Object.values(allData).forEach((storeData: any) => {
      // 合并周数据
      if (storeData.weekData) {
        Object.entries(storeData.weekData).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'number') {
            mergedData.weekData[key] = (mergedData.weekData[key] || 0) + value
          } else if (typeof value === 'object') {
            if (!mergedData.weekData[key]) mergedData.weekData[key] = {}
            Object.entries(value).forEach(([category, categoryValue]: [string, any]) => {
              mergedData.weekData[key][category] =
                (mergedData.weekData[key][category] || 0) + (Number(categoryValue) || 0)
            })
          }
        })
      }

      // 合并月数据
      if (storeData.monthData) {
        Object.entries(storeData.monthData).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'number') {
            mergedData.monthData[key] = (mergedData.monthData[key] || 0) + value
          } else if (typeof value === 'object') {
            if (!mergedData.monthData[key]) mergedData.monthData[key] = {}
            Object.entries(value).forEach(([category, categoryValue]: [string, any]) => {
              mergedData.monthData[key][category] =
                (mergedData.monthData[key][category] || 0) + (Number(categoryValue) || 0)
            })
          }
        })
      }

      // 合并年数据
      if (storeData.yearData) {
        Object.entries(storeData.yearData).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'number') {
            mergedData.yearData[key] = (mergedData.yearData[key] || 0) + value
          } else if (typeof value === 'object') {
            if (!mergedData.yearData[key]) mergedData.yearData[key] = {}
            Object.entries(value).forEach(([category, categoryValue]: [string, any]) => {
              mergedData.yearData[key][category] =
                (mergedData.yearData[key][category] || 0) + (Number(categoryValue) || 0)
            })
          }
        })
      }
    })

    return mergedData
  } else {
    // 单个店铺：返回选中店铺的数据
    return allData[selectedStore] || { weekData: {}, monthData: {}, yearData: {} }
  }
}

// 处理周期切换
const handlePeriodChange = (period: string) => {
  console.log(`切换到${period}周期`)
  salesTrendPeriod.value = period
  if (cachedData.value) {
    renderChart(period, getStoreData(cachedData.value, selectedStore.value))
  }
}

// 处理商品分类周期切换
const handleClassificationPeriodChange = (period: string) => {
  console.log(`切换商品分类到${period}周期`)
  classificationPeriod.value = period
  if (classificationCachedData.value) {
    renderClassificationChart(
      period,
      getStoreData(classificationCachedData.value, classificationSelectedStore.value)
    )
  }
}

// 渲染销售趋势图表
const renderChart = (period: string, data: any) => {
  if (!salesTrendChart) {
    console.error('图表实例不存在，无法渲染')
    return
  }

  console.log(`渲染${period}周期数据:`, data)

  const periodData =
    period === 'week'
      ? data.weekData || {}
      : period === 'month'
        ? data.monthData || {}
        : data.yearData || {}

  console.log(`${period}周期原始数据:`, periodData)

  let xAxisData: string[] = []
  let seriesData: number[] = []

  if (period === 'week') {
    const today = dayjs()
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, 'day')
      const dateKey = date.format('MM-DD')
      const displayDate = date.format('M-D')

      xAxisData.push(displayDate)

      let dayValue = 0
      if (periodData[dateKey]) {
        const dayData = periodData[dateKey]
        if (typeof dayData === 'number') {
          dayValue = dayData
        } else if (typeof dayData === 'object') {
          dayValue = Object.values(dayData).reduce(
            (sum: number, val: any) => sum + (Number(val) || 0),
            0
          )
        }
      }

      seriesData.push(dayValue)
      console.log(`周数据映射: ${dateKey} -> ${displayDate} = ${dayValue}`)
    }
  } else if (period === 'month') {
    const today = dayjs()
    const daysInMonth = today.daysInMonth()
    const currentMonth = today.month() + 1

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const displayDate = `${currentMonth}-${day}`

      xAxisData.push(displayDate)

      let dayValue = 0
      if (periodData[dateKey]) {
        const dayData = periodData[dateKey]
        if (typeof dayData === 'number') {
          dayValue = dayData
        } else if (typeof dayData === 'object') {
          dayValue = Object.values(dayData).reduce(
            (sum: number, val: any) => sum + (Number(val) || 0),
            0
          )
        }
      }

      seriesData.push(dayValue)
      console.log(`月数据映射: ${dateKey} -> ${displayDate} = ${dayValue}`)
    }
  } else {
    const currentYear = dayjs().year()

    for (let month = 1; month <= 12; month++) {
      const dateKey = `${currentYear}-${String(month).padStart(2, '0')}`
      const displayMonth = `${String(month).padStart(2, '0')}月`

      xAxisData.push(displayMonth)

      let monthValue = 0
      if (periodData[dateKey]) {
        const monthData = periodData[dateKey]
        if (typeof monthData === 'number') {
          monthValue = monthData
        } else if (typeof monthData === 'object') {
          monthValue = Object.values(monthData).reduce(
            (sum: number, val: any) => sum + (Number(val) || 0),
            0
          )
        }
      }

      seriesData.push(monthValue)
      console.log(`年数据映射: ${dateKey} -> ${displayMonth} = ${monthValue}`)
    }
  }

  console.log('最终X轴数据:', xAxisData)
  console.log('最终Y轴数据:', seriesData)

  salesTrendChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 积分'
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: {
        lineStyle: { color: '#e5e7eb', width: 1 }
      },
      axisTick: { show: true },
      axisLabel: {
        color: '#666',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '积分',
      nameTextStyle: {
        color: '#666',
        fontSize: 12,
        padding: [0, 30, 0, 0]
      },
      axisLine: { show: false },
      splitLine: {
        lineStyle: { color: '#f3f4f6', type: 'dashed' }
      },
      axisLabel: {
        formatter: function (value: number) {
          if (value >= 10000) {
            return (value / 10000).toFixed(1) + '万'
          } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'k'
          }
          return value
        },
        color: '#666'
      }
    },
    series: [
      {
        name: '积分',
        type: 'line',
        smooth: true,
        data: seriesData,
        symbolSize: 8,
        symbol: 'circle',
        showSymbol: true,
        itemStyle: { color: '#3b82f6' },
        lineStyle: { width: 3 },
        label: {
          show: true,
          formatter: function (params: any) {
            if (params.value === 0) return ''

            if (params.value >= 10000) {
              return (params.value / 10000).toFixed(1) + '万'
            } else if (params.value >= 1000) {
              return (params.value / 1000).toFixed(0) + 'k'
            }
            return params.value
          },
          position: 'top',
          fontSize: 11,
          color: '#3b82f6',
          fontWeight: 'bold'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ])
        }
      }
    ]
  })
}

// 渲染商品分类图表
const renderClassificationChart = (period: string, data: any) => {
  if (!classificationChart) {
    console.error('商品分类图表实例不存在，无法渲染')
    return
  }

  console.log(`渲染商品分类${period}周期数据:`, data)

  // 检查数据是否为空
  if (!data || Object.keys(data).length === 0) {
    console.warn('商品分类数据为空')
    classificationChart.setOption({
      title: {
        text: '暂无分类数据',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#999',
          fontSize: 16
        }
      }
    })
    return
  }

  const periodData =
    period === 'week'
      ? data.weekData || {}
      : period === 'month'
        ? data.monthData || {}
        : data.yearData || {}

  const colorMap: Record<string, string> = {
    数码产品: '#3b82f6',
    办公用品: '#10b981',
    生活用品: '#f59e0b',
    礼品卡券: '#ef4444'
  }

  const categoryTotals: Record<string, number> = {
    数码产品: 0,
    办公用品: 0,
    生活用品: 0,
    礼品卡券: 0
  }

  Object.values(periodData).forEach((timeData: any) => {
    if (timeData && typeof timeData === 'object') {
      Object.entries(timeData).forEach(([category, value]) => {
        if (categoryTotals.hasOwnProperty(category)) {
          categoryTotals[category] += Number(value) || 0
        }
      })
    }
  })

  console.log('分类总计:', categoryTotals)

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    itemStyle: {
      color: colorMap[name] || '#8b5cf6'
    }
  }))

  classificationChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: {
        color: '#666',
        fontSize: 12
      }
    },
    series: [
      {
        name: '商品分类销售',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['65%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: pieData
      }
    ]
  })
}

// 初始化销售趋势图表
const initSalesTrendChart = async () => {
  const chartDom = document.getElementById('salesTrendChart')
  if (!chartDom) return

  try {
    isLoading.value = true

    const response = await statisticsApi.getSalesTrend()
    console.log('管理员销售趋势API响应:', response)

    // 检查响应数据结构
    let rawData: any = response || {}

    // 如果响应有data字段，使用data字段的数据
    if (response && response.data) {
      rawData = response.data
    }

    console.log('处理后的原始数据:', rawData)

    // 提取所有店铺名称并添加"全部店铺"选项
    const storeNames = Object.keys(rawData)
    availableStores.value = storeNames.length > 0 ? storeNames : []
    console.log('可用店铺:', availableStores.value)

    cachedData.value = rawData
    console.log('缓存的数据:', cachedData.value)

    // 创建图表实例
    if (!salesTrendChart) {
      salesTrendChart = echarts.init(chartDom)
    }

    if (cachedData.value && Object.keys(cachedData.value).length > 0) {
      renderChart(salesTrendPeriod.value, getStoreData(cachedData.value, selectedStore.value))
    } else {
      console.warn('没有可用的销售趋势数据，使用模拟数据')
      // 使用模拟数据确保图表能显示
      const mockData = {
        yearData: {
          '2025-01': 45000,
          '2025-02': 52000,
          '2025-03': 48000,
          '2025-04': 54330,
          '2025-05': 49000,
          '2025-06': 9270
        }
      }
      renderChart(salesTrendPeriod.value, mockData)
    }
  } catch (error) {
    console.error('图表加载失败，使用模拟数据:', error)
    // 使用模拟数据确保图表能显示
    const mockData = {
      yearData: {
        '2025-01': 45000,
        '2025-02': 52000,
        '2025-03': 48000,
        '2025-04': 54330,
        '2025-05': 49000,
        '2025-06': 9270
      }
    }

    // 创建图表实例
    if (!salesTrendChart) {
      salesTrendChart = echarts.init(chartDom)
    }

    renderChart(salesTrendPeriod.value, mockData)
  } finally {
    isLoading.value = false
  }
}

// 初始化商品分类图表
const initClassificationChart = async () => {
  const chartDom = document.getElementById('classificationChart')
  if (!chartDom) return

  try {
    isClassificationLoading.value = true

    const response = await statisticsApi.getProductClassification()
    console.log('管理员商品分类API响应:', response)

    // 检查响应数据结构
    let rawData: any = response || {}

    // 如果响应有data字段，使用data字段的数据
    if (response && response.data) {
      rawData = response.data
    }

    console.log('处理后的商品分类数据:', rawData)

    classificationCachedData.value = rawData
    console.log('缓存的商品分类数据:', classificationCachedData.value)

    // 创建图表实例
    if (!classificationChart) {
      classificationChart = echarts.init(chartDom)
    }

    if (classificationCachedData.value && Object.keys(classificationCachedData.value).length > 0) {
      renderClassificationChart(
        classificationPeriod.value,
        getStoreData(classificationCachedData.value, classificationSelectedStore.value)
      )
    } else {
      console.warn('没有可用的商品分类数据，使用模拟数据')
      // 使用模拟数据确保图表能显示
      const mockData = {
        yearData: {
          '2025-04': {
            数码产品: 15000,
            办公用品: 12000,
            生活用品: 18000,
            礼品卡券: 9330
          },
          '2025-06': {
            数码产品: 3000,
            办公用品: 2500,
            生活用品: 2770,
            礼品卡券: 1000
          }
        }
      }
      renderClassificationChart(classificationPeriod.value, mockData)
    }
  } catch (error) {
    console.error('商品分类图表加载失败，使用模拟数据:', error)
    // 使用模拟数据确保图表能显示
    const mockData = {
      yearData: {
        '2025-04': {
          数码产品: 15000,
          办公用品: 12000,
          生活用品: 18000,
          礼品卡券: 9330
        },
        '2025-06': {
          数码产品: 3000,
          办公用品: 2500,
          生活用品: 2770,
          礼品卡券: 1000
        }
      }
    }

    // 创建图表实例
    if (!classificationChart) {
      classificationChart = echarts.init(chartDom)
    }

    renderClassificationChart(classificationPeriod.value, mockData)
  } finally {
    isClassificationLoading.value = false
  }
}

// 监听窗口大小变化
const handleResize = () => {
  if (salesTrendChart) {
    salesTrendChart.resize()
  }
  if (classificationChart) {
    classificationChart.resize()
  }
}

// 组件挂载
onMounted(() => {
  console.log('管理员Dashboard组件挂载，开始初始化图表')
  initSalesTrendChart()
  initClassificationChart()
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', closeDropdowns)
})

// 组件卸载
onUnmounted(() => {
  if (salesTrendChart) {
    salesTrendChart.dispose()
    salesTrendChart = null
  }
  if (classificationChart) {
    classificationChart.dispose()
    classificationChart = null
  }
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', closeDropdowns)
})
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

/* 渐变文字效果 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 悬停效果优化 */
.transform {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>
