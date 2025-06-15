<template>
  <div class="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <!-- 顶部统计卡片区域 -->
    <div class="grid grid-cols-2 gap-6 mb-6">
      <StatCard
        icon="shopping-cart"
        title="今日销售额"
        :value="todaySales"
        color="blue"
        :sub-value="todayCompare"
        :trend="todayTrend"
        class="transform hover:scale-105 hover:shadow-xl transition-all duration-300"
      />

      <StatCard
        icon="box"
        title="商品销量"
        :value="productSales"
        color="yellow"
        :sub-value="productCompare"
        :trend="productTrend"
        class="transform hover:scale-105 hover:shadow-xl transition-all duration-300"
      />
    </div>

    <!-- 图表区域：左边销售趋势，右边商品分类 -->
    <div class="grid grid-cols-2 gap-6" style="height: calc(100% - 200px)">
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

          <div
            class="flex items-center space-x-1 bg-gray-50 p-1.5 rounded-xl border border-gray-200"
          >
            <button
              v-for="period in ['week', 'month', 'year']"
              :key="period"
              :class="{
                'bg-white text-blue-600 shadow-md font-semibold border border-blue-100':
                  salesTrendPeriod === period,
                'text-gray-600 hover:text-blue-500 hover:bg-white': salesTrendPeriod !== period
              }"
              class="px-4 py-2.5 rounded-lg text-sm transition-all duration-200 min-w-[60px]"
              @click="handlePeriodChange(period)"
            >
              {{ getPeriodText(period) }}
            </button>
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

          <div
            class="flex items-center space-x-1 bg-gray-50 p-1.5 rounded-xl border border-gray-200"
          >
            <button
              v-for="period in ['week', 'month', 'year']"
              :key="period"
              :class="{
                'bg-white text-green-600 shadow-md font-semibold border border-green-100':
                  classificationPeriod === period,
                'text-gray-600 hover:text-green-500 hover:bg-white': classificationPeriod !== period
              }"
              class="px-4 py-2.5 rounded-lg text-sm transition-all duration-200 min-w-[60px]"
              @click="handleClassificationPeriodChange(period)"
            >
              {{ getPeriodText(period) }}
            </button>
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

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import StatCard from '@/components/common/StatCard.vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import type { SalesTrendData, ProductClassificationData } from '@/types/api/user/statistics'
import { userStatisticsApi } from '@/api/user/statistics'

// 图表实例
let salesTrendChart: echarts.ECharts | null = null
let classificationChart: echarts.ECharts | null = null

// 销售趋势周期 - 默认设为年度，因为API只返回了年度数据
const salesTrendPeriod = ref('year')
// 商品分类周期
const classificationPeriod = ref('year')

// 统计数据 - 缓存所有周期的数据
const cachedData = ref<{
  weekData: Record<string, number>
  monthData: Record<string, number>
  yearData: Record<string, number>
} | null>(null)

// 商品分类数据缓存
const classificationCachedData = ref<ProductClassificationData | null>(null)

const isLoading = ref(false)
const isClassificationLoading = ref(false)

// 计算顶部卡片数据 - 使用最新的数据
const todaySales = computed(() => {
  // 优先使用年度数据的最新月份
  if (cachedData.value?.yearData) {
    const yearDataEntries = Object.entries(cachedData.value.yearData || {})
    if (yearDataEntries.length > 0) {
      // 按月份排序，获取最新月份的数据
      const sortedEntries = yearDataEntries.sort((a, b) => {
        const monthA = parseInt(a[0].split('-')[1])
        const monthB = parseInt(b[0].split('-')[1])
        return monthB - monthA // 降序排列，最新的在前
      })
      return sortedEntries[0][1].toLocaleString()
    }
  }

  // 如果有月度数据，使用最新一天的数据
  if (cachedData.value?.monthData) {
    const monthDataEntries = Object.entries(cachedData.value.monthData || {})
    if (monthDataEntries.length > 0) {
      // 按日期排序，获取最新日期的数据
      const sortedEntries = monthDataEntries.sort((a, b) => {
        const dateA = new Date(`2025-${a[0]}`)
        const dateB = new Date(`2025-${b[0]}`)
        return dateB.getTime() - dateA.getTime() // 降序排列，最新的在前
      })
      return sortedEntries[0][1].toLocaleString()
    }
  }

  // 如果有周数据，使用最新一天的数据
  if (cachedData.value?.weekData) {
    const weekDataEntries = Object.entries(cachedData.value.weekData || {})
    if (weekDataEntries.length > 0) {
      const sortedEntries = weekDataEntries.sort((a, b) => {
        const dateA = new Date(`2025-${a[0]}`)
        const dateB = new Date(`2025-${b[0]}`)
        return dateB.getTime() - dateA.getTime()
      })
      return sortedEntries[0][1].toLocaleString()
    }
  }

  return '0'
})

const todayCompare = computed(() => {
  return '较上月 +15.8%' // 可以基于API数据计算
})

const todayTrend = computed((): 'up' | 'down' | 'none' => {
  return 'up' // 可以基于API数据计算
})

const productSales = computed(() => {
  // 计算总销量 - 将所有数据累加并除以估算值
  let totalSales = 0

  // 累加年度数据
  if (cachedData.value?.yearData) {
    Object.values(cachedData.value.yearData).forEach(value => {
      totalSales += Number(value) || 0
    })
  }

  // 累加月度数据
  if (cachedData.value?.monthData) {
    Object.values(cachedData.value.monthData).forEach(value => {
      totalSales += Number(value) || 0
    })
  }

  // 累加周数据
  if (cachedData.value?.weekData) {
    Object.values(cachedData.value.weekData).forEach(value => {
      totalSales += Number(value) || 0
    })
  }

  // 将积分转换为销量（假设100积分等于1件商品）
  const estimatedSales = Math.round(totalSales / 100)
  return estimatedSales > 0 ? estimatedSales.toLocaleString() : '0'
})

const productCompare = computed(() => {
  return '较昨日 +45' // 可以基于API数据计算
})

const productTrend = computed((): 'up' | 'down' | 'none' => {
  return 'up' // 可以基于API数据计算
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

// 处理周期切换
const handlePeriodChange = (period: string) => {
  console.log(`切换到${period}周期`)
  salesTrendPeriod.value = period

  // 使用缓存数据重新渲染图表
  if (cachedData.value) {
    renderChart(period, cachedData.value)
  }
}

// 处理商品分类周期切换
const handleClassificationPeriodChange = (period: string) => {
  console.log(`切换商品分类到${period}周期`)
  classificationPeriod.value = period

  // 使用缓存数据重新渲染图表
  if (classificationCachedData.value) {
    renderClassificationChart(period, classificationCachedData.value)
  }
}

// 渲染图表函数，复用渲染逻辑
const renderChart = (period: string, data: any) => {
  if (!salesTrendChart) {
    console.error('图表实例不存在，无法渲染')
    return
  }

  console.log(`渲染${period}周期数据:`, data)

  // 获取周期对应的数据
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
    // 本周显示完整7天，格式：MM-DD
    const today = dayjs()
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, 'day')
      const dateKey = date.format('MM-DD') // 与API返回格式匹配
      const displayDate = date.format('M-D') // 显示格式

      xAxisData.push(displayDate)

      // 处理周数据 - 可能是简单数值或者包含分类的对象
      let dayValue = 0
      if (periodData[dateKey]) {
        const dayData = periodData[dateKey]
        if (typeof dayData === 'number') {
          // 简单数值格式
          dayValue = dayData
        } else if (typeof dayData === 'object') {
          // 包含分类的对象格式，累加所有分类的值
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
    // 显示完整月份的所有天数，没有数据的天用0填充
    const today = dayjs()
    const daysInMonth = today.daysInMonth()
    const currentYear = today.year()
    const currentMonth = today.month() + 1 // dayjs月份从0开始

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}` // API格式：MM-DD
      const displayDate = `${currentMonth}-${day}` // 显示格式：M-D

      xAxisData.push(displayDate)

      // 处理月度数据 - 可能是简单数值或者包含分类的对象
      let dayValue = 0
      if (periodData[dateKey]) {
        const dayData = periodData[dateKey]
        if (typeof dayData === 'number') {
          // 简单数值格式
          dayValue = dayData
        } else if (typeof dayData === 'object') {
          // 包含分类的对象格式，累加所有分类的值
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
    // year - 显示完整12个月，没有数据的月份用0填充
    const currentYear = dayjs().year()

    for (let month = 1; month <= 12; month++) {
      const dateKey = `${currentYear}-${String(month).padStart(2, '0')}` // API格式：YYYY-MM
      const displayMonth = `${String(month).padStart(2, '0')}月` // 显示格式：MM月

      xAxisData.push(displayMonth)

      // 处理年度数据 - 可能是简单数值或者包含分类的对象
      let monthValue = 0
      if (periodData[dateKey]) {
        const monthData = periodData[dateKey]
        if (typeof monthData === 'number') {
          // 简单数值格式
          monthValue = monthData
        } else if (typeof monthData === 'object') {
          // 包含分类的对象格式，累加所有分类的值
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

  // 设置图表选项
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
            // 只为非零值显示标签
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
const renderClassificationChart = (period: string, data: ProductClassificationData) => {
  if (!classificationChart) {
    console.error('商品分类图表实例不存在，无法渲染')
    return
  }

  console.log(`渲染商品分类${period}周期数据:`, data)

  // 获取周期对应的数据
  const periodData =
    period === 'week'
      ? data.weekData || {}
      : period === 'month'
        ? data.monthData || {}
        : data.yearData || {}

  // 商品分类映射
  const categoryMap: Record<string, string> = {
    数码产品: 'digital',
    办公用品: 'office',
    生活用品: 'life',
    礼品卡券: 'gift'
  }

  // 颜色映射
  const colorMap: Record<string, string> = {
    数码产品: '#3b82f6', // 蓝色
    办公用品: '#10b981', // 绿色
    生活用品: '#f59e0b', // 橙色
    礼品卡券: '#ef4444' // 红色
  }

  // 聚合所有时间段的数据
  const categoryTotals: Record<string, number> = {
    数码产品: 0,
    办公用品: 0,
    生活用品: 0,
    礼品卡券: 0
  }

  // 遍历所有时间段并累加各分类的销售数量
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

  // 转换为饼图数据格式
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    itemStyle: {
      color: colorMap[name] || '#8b5cf6'
    }
  }))

  // 设置饼图选项
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
    // 显示加载状态
    isLoading.value = true

    // 获取API数据
    const response = await userStatisticsApi.getSalesTrend()

    // 记录完整响应
    console.log('完整API响应:', response)

    // 新的数据结构：增加了一层店铺信息，需要取第一个店铺的数据
    const rawData: any = response || {}

    // 获取第一个店铺的数据（取第一个键的值）
    const shopKeys = Object.keys(rawData)
    const shopData = shopKeys.length > 0 ? rawData[shopKeys[0]] : {}

    console.log('店铺数据:', shopData)

    // 缓存所有周期数据
    cachedData.value = {
      weekData: shopData.weekData || {},
      monthData: shopData.monthData || {},
      yearData: shopData.yearData || {}
    }

    console.log('缓存的数据:', cachedData.value)

    // 创建图表实例
    salesTrendChart = echarts.init(chartDom)

    // 渲染当前选择的周期
    renderChart(salesTrendPeriod.value, cachedData.value)
  } catch (error) {
    console.error('图表加载失败:', error)
    ElMessage.error('加载销售趋势图表时出错')
  } finally {
    isLoading.value = false
  }
}

// 初始化商品分类图表
const initClassificationChart = async () => {
  const chartDom = document.getElementById('classificationChart')
  if (!chartDom) return

  try {
    // 显示加载状态
    isClassificationLoading.value = true

    // 获取API数据
    const response = await userStatisticsApi.getProductClassification()

    // 记录完整响应
    console.log('商品分类API响应:', response)

    // 新的数据结构：增加了一层店铺信息，需要取第一个店铺的数据
    const rawData: any = response || {}

    // 获取第一个店铺的数据（取第一个键的值）
    const shopKeys = Object.keys(rawData)
    const shopData = shopKeys.length > 0 ? rawData[shopKeys[0]] : {}

    console.log('店铺商品分类数据:', shopData)

    // 缓存数据
    classificationCachedData.value = {
      weekData: shopData.weekData || null,
      monthData: shopData.monthData || null,
      yearData: shopData.yearData || {}
    }

    console.log('缓存的商品分类数据:', classificationCachedData.value)

    // 创建图表实例
    classificationChart = echarts.init(chartDom)

    // 渲染当前选择的周期
    if (classificationCachedData.value) {
      renderClassificationChart(classificationPeriod.value, classificationCachedData.value)
    }
  } catch (error) {
    console.error('商品分类图表加载失败:', error)
    ElMessage.error('加载商品分类图表时出错')
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
  initSalesTrendChart()
  initClassificationChart()
  window.addEventListener('resize', handleResize)

  // 设置年份按钮高亮样式
  setTimeout(() => {
    const yearButton = document.querySelector('button[key="year"]')
    if (yearButton) {
      yearButton.classList.add(
        'bg-white',
        'text-blue-600',
        'shadow-md',
        'font-semibold',
        'border',
        'border-blue-100'
      )
      yearButton.classList.remove('text-gray-600')
    }
  }, 300)
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
})
</script>

<style scoped>
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
