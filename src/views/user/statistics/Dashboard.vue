<template>
  <div class="h-[calc(100vh-64px)] overflow-y-auto">
    <div class="space-y-6 p-4 md:p-5 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <!-- 顶部统计卡片 -->
      <div class="grid grid-cols-4 gap-4">
        <StatCard
          icon="shopping-cart"
          title="今日销售额"
          value="12,580"
          color="blue"
          sub-value="较昨日 +15.8%"
          trend="up"
          class="transform hover:scale-102 hover:shadow-lg transition-all duration-300"/>
        
        <StatCard
          icon="users"
          title="活跃会员"
          value="256"
          color="green"
          sub-value="较昨日 +12"
          trend="up"
          class="transform hover:scale-102 hover:shadow-lg transition-all duration-300"/>
        
        <StatCard
          icon="box"
          title="商品销量"
          value="389"
          color="yellow"
          sub-value="较昨日 +45"
          trend="up"
          class="transform hover:scale-102 hover:shadow-lg transition-all duration-300"/>
        
        <StatCard
          icon="yen-sign"
          title="会员充值"
          value="8,650"
          color="purple"
          sub-value="较昨日 -5.2%"
          trend="down"
          class="transform hover:scale-102 hover:shadow-lg transition-all duration-300"/>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-2 gap-4">
        <!-- 销售趋势 -->
        <div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <h2 class="text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">销售趋势</h2>
              <div class="px-2.5 py-1 bg-blue-50 text-blue-500 text-xs rounded-full font-medium">实时</div>
            </div>
            <div class="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg">
              <button v-for="period in ['week', 'month', 'year']"
                      :key="period"
                      :class="{'bg-white text-blue-500 shadow-sm font-medium': salesTrendPeriod === period}"
                      class="px-4 py-2 rounded-lg text-sm hover:bg-white transition-all duration-200"
                      @click="salesTrendPeriod = period">
                {{ getPeriodText(period) }}
              </button>
            </div>
          </div>
          <div id="salesTrendChart" class="w-full h-[280px]"></div>
        </div>

        <!-- 商品分类占比 -->
        <div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <h2 class="text-lg font-medium bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">商品分类占比</h2>
              <div class="px-2.5 py-1 bg-green-50 text-green-500 text-xs rounded-full font-medium">近30天</div>
            </div>
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-50 rounded-lg">
              <font-awesome-icon icon="ellipsis-h" />
            </button>
          </div>
          <div id="categoryPieChart" class="w-full h-[280px]"></div>
        </div>

        <!-- 热销商品排行 -->
        <div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <h2 class="text-lg font-medium bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">热销商品排行</h2>
              <div class="px-2.5 py-1 bg-yellow-50 text-yellow-500 text-xs rounded-full font-medium">TOP 5</div>
            </div>
            <button class="text-blue-500 text-sm hover:text-blue-600 flex items-center space-x-2 group px-3 py-1.5 rounded-lg hover:bg-blue-50">
              <span>查看更多</span>
              <font-awesome-icon icon="chevron-right" class="transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="(product, index) in topProducts" :key="product.id"
                 class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-100">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                   :class="[
                     index === 0 ? 'bg-yellow-50 text-yellow-500' : 
                     index === 1 ? 'bg-gray-100 text-gray-500' :
                     index === 2 ? 'bg-orange-50 text-orange-500' :
                     'bg-gray-50 text-gray-400'
                   ]">
                <span class="text-base font-medium">{{ index + 1 }}</span>
              </div>
              <div class="relative w-12 h-12 mr-3">
                <img :src="product.image" 
                     :alt="product.name"
                     class="w-full h-full rounded-lg object-cover shadow-sm group-hover:shadow-md transition-all duration-300"/>
              </div>
              <div class="flex-1">
                <div class="font-medium group-hover:text-blue-500 transition-colors duration-200">{{ product.name }}</div>
                <div class="text-sm text-gray-500 mt-1">销量 {{ product.sales }}</div>
              </div>
              <div class="text-right">
                <div class="font-medium text-lg">{{ product.amount }}</div>
                <div class="text-sm mt-1" :class="product.trend.includes('↑') ? 'text-green-500' : 'text-red-500'">
                  {{ product.trend }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 实时动态 -->
        <div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <h2 class="text-lg font-medium bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">实时动态</h2>
              <div class="px-2.5 py-1 bg-purple-50 text-purple-500 text-xs rounded-full font-medium animate-pulse">实时</div>
            </div>
            <button @click="refreshActivities" 
                    class="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all duration-200">
              <font-awesome-icon icon="sync-alt" />
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="activity in activities" :key="activity.id"
                 class="flex items-start group p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100">
              <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                   :class="getActivityIconClass(activity.type)">
                <font-awesome-icon :icon="getActivityIcon(activity.type)" />
              </div>
              <div class="flex-1">
                <div class="font-medium group-hover:text-blue-500 transition-colors duration-200">{{ activity.title }}</div>
                <div class="text-sm text-gray-500 mt-2">{{ activity.description }}</div>
              </div>
              <div class="text-sm text-gray-400 whitespace-nowrap">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import StatCard from '@/components/common/StatCard.vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

// 图表实例
let salesTrendChart: echarts.ECharts | null = null
let categoryPieChart: echarts.ECharts | null = null

// 销售趋势周期
const salesTrendPeriod = ref('week')

// 生成模拟销售数据
const generateSalesData = (period: string) => {
  const now = dayjs()
  let dates: string[] = []
  let data: number[] = []
  
  switch (period) {
    case 'week':
      // 生成最近7天的数据
      for (let i = 6; i >= 0; i--) {
        const date = now.subtract(i, 'day')
        dates.push(date.format('MM-DD'))
        // 生成 5000-15000 之间的随机数，并保持一定的趋势性
        const base = 10000
        const random = Math.random() * 5000
        const trend = i < 3 ? 2000 : 0 // 最近几天有上升趋势
        data.push(Math.floor(base + random + trend))
      }
      break
    case 'month':
      // 生成最近30天的数据，按5天聚合
      for (let i = 5; i >= 0; i--) {
        const date = now.subtract(i * 5, 'day')
        dates.push(date.format('MM-DD'))
        const base = 40000
        const random = Math.random() * 20000
        const trend = i < 2 ? 10000 : 0
        data.push(Math.floor(base + random + trend))
      }
      break
    case 'year':
      // 生成最近12个月的数据
      for (let i = 11; i >= 0; i--) {
        const date = now.subtract(i, 'month')
        dates.push(date.format('YYYY-MM'))
        const base = 150000
        const seasonal = Math.sin(i * Math.PI / 6) * 50000 // 季节性波动
        const random = Math.random() * 30000
        const trend = (12 - i) * 5000 // 整体上升趋势
        data.push(Math.floor(base + seasonal + random + trend))
      }
      break
  }
  
  return { dates, data }
}

// 商品分类数据
const categoryData = [
  { 
    value: 2580, 
    name: '食品饮料',
    percentage: '32%',
    itemStyle: { color: '#3b82f6' }
  },
  { 
    value: 1850, 
    name: '生鲜水果',
    percentage: '23%',
    itemStyle: { color: '#10b981' }
  },
  { 
    value: 1420, 
    name: '休闲零食',
    percentage: '18%',
    itemStyle: { color: '#f59e0b' }
  },
  { 
    value: 1260, 
    name: '日用百货',
    percentage: '16%',
    itemStyle: { color: '#6366f1' }
  },
  { 
    value: 890, 
    name: '酒水饮料',
    percentage: '11%',
    itemStyle: { color: '#ec4899' }
  }
]

// 热销商品数据
const topProducts = ref([
  {
    id: 1,
    name: '有机草莓',
    sales: 156,
    amount: '¥15,600',
    trend: '↑ 12.5%',
    image: 'https://ai-public.mastergo.com/ai/img_res/86f839615a018f782144b9ec9be235d4.jpg'
  },
  {
    id: 2,
    name: '进口牛奶',
    sales: 142,
    amount: '¥14,200',
    trend: '↑ 8.3%',
    image: 'https://ai-public.mastergo.com/ai/img_res/e4283893b198106bcb77f4a097397da1.jpg'
  },
  {
    id: 3,
    name: '日式面包',
    sales: 98,
    amount: '¥9,800',
    trend: '↓ 2.1%',
    image: 'https://ai-public.mastergo.com/ai/img_res/e9a1e0da333cfaae1d427e157bad44d1.jpg'
  },
  {
    id: 4,
    name: '柠檬气泡水',
    sales: 89,
    amount: '¥8,900',
    trend: '↑ 5.6%',
    image: 'https://ai-public.mastergo.com/ai/img_res/6727655713b31701481ece9fc2828521.jpg'
  },
  {
    id: 5,
    name: '蓝莓酸奶',
    sales: 76,
    amount: '¥7,600',
    trend: '↑ 3.2%',
    image: 'https://ai-public.mastergo.com/ai/img_res/f31932d1bd3fe0a4e3fd760b55213f51.jpg'
  }
])

// 实时动态数据
const activities = ref([
  {
    id: 1,
    type: 'sale',
    title: '新订单',
    description: '陈思悦购买了5件商品，共计1,580积分',
    time: '2分钟前'
  },
  {
    id: 2,
    type: 'recharge',
    title: '会员充值',
    description: '张明充值1,000元，获得13,000积分',
    time: '5分钟前'
  },
  {
    id: 3,
    type: 'pickup',
    title: '提货完成',
    description: '王丽完成提货，订单号：P202403160003',
    time: '8分钟前'
  },
  {
    id: 4,
    type: 'member',
    title: '新会员',
    description: '李强成为新会员',
    time: '15分钟前'
  }
])

// 周期文本
const getPeriodText = (period: string) => {
  const texts = {
    week: '本周',
    month: '本月',
    year: '本年'
  }
  return texts[period as keyof typeof texts]
}

// 活动图标样式
const getActivityIconClass = (type: string) => {
  const classes = {
    sale: 'bg-blue-50 text-blue-500',
    recharge: 'bg-green-50 text-green-500',
    pickup: 'bg-yellow-50 text-yellow-500',
    member: 'bg-purple-50 text-purple-500'
  }
  return classes[type as keyof typeof classes]
}

const getActivityIcon = (type: string) => {
  const icons = {
    sale: 'shopping-cart',
    recharge: 'coins',
    pickup: 'box',
    member: 'user'
  }
  return icons[type as keyof typeof icons]
}

// 监听销售趋势周期变化
watch(salesTrendPeriod, (newPeriod) => {
  updateSalesTrendChart(newPeriod)
})

// 更新销售趋势图表
const updateSalesTrendChart = (period: string) => {
  if (!salesTrendChart) return
  
  const { dates, data } = generateSalesData(period)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: { color: '#666' },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${data.seriesName}：¥${data.value.toLocaleString()}`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: {
        lineStyle: { color: '#eee' }
      },
      axisLabel: {
        color: '#666',
        formatter: (value: string) => {
          return period === 'year' ? value.split('-')[1] : value
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: '#f5f5f5' }
      },
      axisLabel: {
        formatter: (value: number) => {
          return `¥${(value / 1000).toFixed(0)}k`
        }
      }
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: data,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.02)' }
          ])
        },
        lineStyle: {
          width: 3,
          color: '#3b82f6'
        },
        itemStyle: {
          color: '#3b82f6',
          borderWidth: 2
        },
        emphasis: {
          itemStyle: {
            borderWidth: 3,
            borderColor: '#3b82f6',
            shadowColor: 'rgba(59, 130, 246, 0.5)',
            shadowBlur: 10
          }
        }
      }
    ]
  }
  
  salesTrendChart.setOption(option)
}

// 初始化销售趋势图表
const initSalesTrendChart = () => {
  const chartDom = document.getElementById('salesTrendChart')
  if (!chartDom) return

  salesTrendChart = echarts.init(chartDom)
  updateSalesTrendChart(salesTrendPeriod.value)
}

// 初始化商品分类占比图表
const initCategoryPieChart = () => {
  const chartDom = document.getElementById('categoryPieChart')
  if (!chartDom) return

  categoryPieChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: { color: '#666' },
      formatter: (params: any) => {
        return `${params.name}<br/>销售额：¥${params.value.toLocaleString()}<br/>占比：${params.data.percentage}`
      }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#666' },
      formatter: (name: string) => {
        const item = categoryData.find(item => item.name === name)
        return `${name} ${item?.percentage}`
      }
    },
    series: [
      {
        name: '商品分类',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        data: categoryData
      }
    ]
  }
  categoryPieChart.setOption(option)
}

// 刷新实时动态
const refreshActivities = () => {
  // TODO: 实现刷新逻辑
  ElMessage.success('数据已更新')
}

// 监听窗口大小变化
const handleResize = () => {
  salesTrendChart?.resize()
  categoryPieChart?.resize()
}

// 确保在DOM加载完成后初始化图表
onMounted(() => {
  // 添加一个小延时确保DOM完全渲染
  setTimeout(() => {
    initSalesTrendChart()
    initCategoryPieChart()
  }, 0)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例
  salesTrendChart?.dispose()
  categoryPieChart?.dispose()

  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.transform {
  transition: all 0.3s ease;
}
.hover\:scale-102:hover {
  transform: scale(1.02);
}

/* 渐变文字效果 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 自定义动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 