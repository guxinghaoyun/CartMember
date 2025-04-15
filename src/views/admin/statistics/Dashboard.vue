<template>
  <div class="h-[calc(100vh-64px-32px)] overflow-y-auto custom-scrollbar">
    <div class="space-y-6 p-6 bg-gray-50">
      <!-- 快速查询 -->
      <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
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
              >
                <font-awesome-icon icon="search" class="mr-2" />
                查询
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 顶部数据卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-blue-100 text-sm font-medium">总兑换积分</p>
              <p class="text-4xl font-bold mt-3 tracking-tight">
                {{ Number(256789).toLocaleString() }}
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
            <span>较上月增长 12.5%</span>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-green-100 text-sm font-medium">订单总量</p>
              <p class="text-4xl font-bold mt-3 tracking-tight">
                {{ Number(1438).toLocaleString() }}
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
            <span>较上月增长 8.3%</span>
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

      <!-- 图表控制栏 -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <font-awesome-icon icon="chart-line" class="text-blue-600" />
            销售趋势分析
          </h2>
          <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">近6个月数据</div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative group">
            <select
              v-model="statsType"
              class="appearance-none !rounded-xl bg-white border-2 border-gray-200 pl-10 pr-8 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            >
              <option value="year">年度统计</option>
              <option value="month">月度统计</option>
              <option value="day">日统计</option>
            </select>
            <font-awesome-icon
              icon="calendar-alt"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
            />
            <font-awesome-icon
              icon="chevron-down"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          <div class="relative group">
            <select
              v-model="selectedStore"
              class="appearance-none !rounded-xl bg-white border-2 border-gray-200 pl-10 pr-8 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            >
              <option value="all">全部店铺</option>
              <option v-for="store in stores" :key="store.id" :value="store.id">
                {{ store.name }}
              </option>
            </select>
            <font-awesome-icon
              icon="store"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
            />
            <font-awesome-icon
              icon="chevron-down"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <!-- 排行榜 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ranking-list
          title="商品兑换排行"
          icon="crown"
          icon-color="yellow"
          :items="productRanking"
          class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
        />
        <ranking-list
          title="店铺兑换排行"
          icon="store"
          icon-color="blue"
          :items="storeRanking"
          class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
        />
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-gray-800 flex items-center gap-2">
              <font-awesome-icon icon="yen-sign" class="text-blue-600" />
              销售额统计
            </h3>
            <div class="flex items-center gap-4 text-sm">
              <span class="flex items-center gap-1.5">
                <font-awesome-icon icon="circle" class="text-blue-500 text-[8px]" />
                <span class="text-gray-600">积分兑换</span>
              </span>
              <span class="text-gray-300">|</span>
              <span class="text-gray-600">总计: {{ Number(256789).toLocaleString() }} 积分</span>
            </div>
          </div>
          <div class="h-[calc(100%-2rem)] min-h-[320px]">
            <sales-chart ref="salesChart" class="h-full" :data="salesData" />
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-gray-800 flex items-center gap-2">
              <font-awesome-icon icon="shopping-cart" class="text-green-600" />
              提货数量统计
            </h3>
            <div class="flex items-center gap-4 text-sm">
              <span class="flex items-center gap-1.5">
                <font-awesome-icon icon="circle" class="text-green-500 text-[8px]" />
                <span class="text-gray-600">提货量</span>
              </span>
              <span class="text-gray-300">|</span>
              <span class="text-gray-600">总计: {{ Number(1438).toLocaleString() }}</span>
            </div>
          </div>
          <div class="h-[calc(100%-2rem)] min-h-[320px]">
            <pickup-chart ref="pickupChart" class="h-full" :data="pickupData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent } from 'vue'
import type { PropType } from 'vue'
import RankingList from '@/views/admin/statistics/components/RankingList.vue'
import SalesChart from '@/views/admin/statistics/components/SalesChart.vue'
import PickupChart from '@/views/admin/statistics/components/PickupChart.vue'

// 统计卡片组件
const DashboardStatCard = defineComponent({
  name: 'DashboardStatCard',
  props: {
    title: { type: String, required: true },
    value: { type: [String, Number], required: true },
    icon: { type: String, required: true },
    color: { type: String as PropType<'blue' | 'green' | 'purple' | 'orange'>, required: true },
    trend: { type: Number, default: undefined }
  },
  template: `
    <div :class="[\`bg-gradient-to-br from-\${color}-500 to-\${color}-600\`]" class="rounded-xl p-6 text-white">
      <div class="flex justify-between items-start mb-4">
        <div>
          <p :class="[\`text-\${color}-100 text-sm\`]">{{ title }}</p>
          <p class="text-3xl font-semibold mt-2">{{ value }}</p>
        </div>
        <div :class="[\`w-10 h-10 rounded-lg bg-\${color}-400 bg-opacity-30 flex items-center justify-center\`]">
          <font-awesome-icon :icon="icon" class="text-2xl" />
        </div>
      </div>
      <div v-if="trend" class="flex items-center text-sm" :class="[\`text-\${color}-100\`]">
        <font-awesome-icon :icon="trend > 0 ? 'arrow-up' : 'arrow-down'" class="mr-1" />
        <span>较上月{{ trend > 0 ? '增长' : '下降' }} {{ Math.abs(trend) }}%</span>
      </div>
    </div>
  `
})

// 状态
const selectedPeriod = ref('today')
const statsType = ref('month')
const selectedStore = ref('all')
const dateRange = ref({
  start: '',
  end: ''
})

// 快速查询选项
const periods = [
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '近半年', value: 'halfYear' }
]

// 店铺数据
const stores = ref([
  { id: 1, name: '北京朝阳店' },
  { id: 2, name: '上海浦东店' },
  { id: 3, name: '广州天河店' }
])

// 排行榜数据
const productRanking = [
  { name: '智能手表 Pro', count: 268, percent: 85 },
  { name: '无线耳机 MAX', count: 195, percent: 65 },
  { name: '便携式音箱', count: 142, percent: 45 },
  { name: '智能手环', count: 98, percent: 32 },
  { name: '移动电源', count: 76, percent: 25 }
]

const storeRanking = [
  { name: '北京朝阳店', count: 1268, percent: 92 },
  { name: '上海浦东店', count: 956, percent: 78 },
  { name: '广州天河店', count: 845, percent: 65 },
  { name: '深圳南山店', count: 756, percent: 58 },
  { name: '杭州西湖店', count: 634, percent: 45 }
]

// 图表数据
const salesData = ref({
  dates: ['1月', '2月', '3月', '4月', '5月', '6月'],
  values: [2300, 3200, 2800, 4100, 3800, 4500]
})

const pickupData = ref({
  dates: ['1月', '2月', '3月', '4月', '5月', '6月'],
  values: {
    completed: [120, 150, 180, 210, 190, 230],
    pending: [20, 30, 25, 35, 28, 40]
  }
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
</style>
