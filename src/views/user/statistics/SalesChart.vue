<template>
  <div class="bg-white rounded-lg p-6 shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-medium">销售趋势</h2>
      <div class="flex items-center space-x-2">
        <button v-for="period in periods"
                :key="period.value"
                :class="{'bg-blue-50 text-blue-500': modelValue === period.value}"
                class="px-3 py-1 rounded-lg text-sm hover:bg-gray-50"
                @click="$emit('update:modelValue', period.value)">
          {{ period.label }}
        </button>
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
  modelValue: string
  loading?: boolean
  data?: ConsumptionStatistics['trend']
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits(['update:modelValue'])

// 图表实例
let chart: echarts.ECharts | null = null

// 图表容器引用
const chartRef = ref<HTMLElement>()

// 时间周期选项
const periods = [
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'year', label: '本年' }
]

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
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#374151'
      },
      padding: [12, 16],
      formatter: function(params: any) {
        const sales = params[0].value
        const orders = params[1].value
        return `<div class="text-base font-medium text-gray-800">${params[0].axisValue}</div>
        <div class="flex justify-between mt-3 space-x-8">
          <span class="text-gray-500">${params[0].seriesName}:</span>
          <span class="font-medium text-blue-500">¥${sales.toLocaleString()}</span>
        </div>
        <div class="flex justify-between mt-2 space-x-8">
          <span class="text-gray-500">${params[1].seriesName}:</span>
          <span class="font-medium text-green-500">${orders}单</span>
        </div>`
      }
    },
    legend: {
      data: ['销售额', '订单量'],
      right: '4%',
      top: '0%',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 20,
      textStyle: {
        color: '#4b5563',
        fontSize: 13
      },
      icon: 'roundRect'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data?.dates || [],
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#4b5563',
        fontSize: 12,
        padding: [8, 0]
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额',
        nameTextStyle: {
          color: '#4b5563',
          fontSize: 12,
          padding: [0, 30, 0, 0]
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#e5e7eb',
            type: 'dashed',
            width: 0.8
          }
        },
        axisLabel: {
          formatter: '¥{value}',
          color: '#4b5563',
          fontSize: 12
        }
      },
      {
        type: 'value',
        name: '订单量',
        nameTextStyle: {
          color: '#4b5563',
          fontSize: 12,
          padding: [0, 0, 0, 30]
        },
        position: 'right',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: '{value}单',
          color: '#4b5563',
          fontSize: 12
        }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        showSymbol: false,
        data: props.data?.amounts || [],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.15)'
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.02)'
              }
            ]
          }
        },
        emphasis: {
          focus: 'series',
          showSymbol: true,
          itemStyle: {
            color: '#3b82f6',
            borderWidth: 3,
            borderColor: '#fff',
            shadowColor: 'rgba(59, 130, 246, 0.3)',
            shadowBlur: 12
          }
        },
        lineStyle: {
          color: '#3b82f6',
          width: 3,
          shadowColor: 'rgba(59, 130, 246, 0.25)',
          shadowBlur: 12,
          cap: 'round'
        },
        itemStyle: {
          color: '#3b82f6',
          borderWidth: 2,
          borderColor: '#fff'
        }
      },
      {
        name: '订单量',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        showSymbol: false,
        data: props.data?.orders || [],
        emphasis: {
          focus: 'series',
          showSymbol: true,
          itemStyle: {
            color: '#10b981',
            borderWidth: 3,
            borderColor: '#fff',
            shadowColor: 'rgba(16, 185, 129, 0.3)',
            shadowBlur: 12
          }
        },
        lineStyle: {
          color: '#10b981',
          width: 3,
          shadowColor: 'rgba(16, 185, 129, 0.25)',
          shadowBlur: 12,
          cap: 'round'
        },
        itemStyle: {
          color: '#10b981',
          borderWidth: 2,
          borderColor: '#fff'
        }
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