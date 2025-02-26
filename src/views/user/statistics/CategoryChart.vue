<template>
  <div class="bg-white rounded-lg p-6 shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-medium">商品分类占比</h2>
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <font-awesome-icon icon="info-circle" />
        <span>近30天数据</span>
      </div>
    </div>
    <div ref="chartRef" class="w-full h-[300px]"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { ConsumptionStatistics } from '@/types/api/user/statistics'

interface Props {
  loading?: boolean
  data?: ConsumptionStatistics['categories']
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// 图表实例
let chart: echarts.ECharts | null = null

// 图表容器引用
const chartRef = ref<HTMLElement>()

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表数据
const updateChart = () => {
  if (!chart) return

  const option = {
    animation: false,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      },
      padding: [12, 16],
      formatter: function(params: any) {
        return `<div class="text-base font-medium text-gray-800">${params.name}</div>
        <div class="flex justify-between mt-2 space-x-8">
          <span class="text-gray-500">销售额:</span>
          <span class="font-medium text-blue-500">¥${params.value.toLocaleString()}</span>
        </div>
        <div class="flex justify-between mt-1 space-x-8">
          <span class="text-gray-500">占比:</span>
          <span class="font-medium text-green-500">${params.percent}%</span>
        </div>`
      }
    },
    legend: {
      orient: 'vertical',
      right: '4%',
      top: 'center',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 16,
      textStyle: {
        color: '#4b5563',
        fontSize: 13,
        padding: [0, 0, 0, 8]
      },
      icon: 'roundRect',
      formatter: function(name: string) {
        const item = props.data?.find(d => d.category === name)
        if (!item) return name
        return `${name}  ${item.percentage}%`
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
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        data: props.data?.map(item => ({
          name: item.category,
          value: item.amount,
          percentage: item.percentage
        })) || []
      }
    ]
  }

  // 设置加载状态
  if (props.loading) {
    chart.showLoading({
      text: '加载中...',
      maskColor: 'rgba(255, 255, 255, 0.95)',
      textColor: '#6b7280',
      fontSize: 14,
      showSpinner: true,
      spinnerRadius: 6,
      lineWidth: 2,
      color: '#3b82f6'
    })
  } else {
    chart.hideLoading()
  }

  chart.setOption(option)
}

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

// 监听加载状态变化
watch(() => props.loading, () => {
  updateChart()
})

// 监听窗口大小变化
const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script> 