<template>
  <div class="bg-white rounded-xl p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-medium">销售额统计</h3>
      <div class="flex gap-2">
        <button
          v-for="type in chartTypes"
          :key="type.value"
          class="px-3 py-1 rounded-full text-sm"
          :class="selectedType === type.value ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
          @click="selectedType = type.value"
        >
          {{ type.label }}
        </button>
      </div>
    </div>
    <div ref="chartRef" class="w-full h-[300px]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  data: {
    dates: string[]
    values: number[]
  }
}>()

const chartTypes = [
  { label: '金额', value: 'amount' },
  { label: '订单数', value: 'orders' }
]

const selectedType = ref('amount')
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const [param] = params
        return `${param.name}<br/>${selectedType.value === 'amount' ? '¥' : ''}${param.value}${selectedType.value === 'orders' ? '单' : ''}`
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
      data: props.data.dates,
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      }
    },
    series: [
      {
        data: props.data.values,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#3B82F6'
        },
        lineStyle: {
          color: '#3B82F6',
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(59, 130, 246, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(59, 130, 246, 0.1)'
            }
          ])
        }
      }
    ]
  }

  chart.setOption(option)
}

watch(() => props.data, updateChart, { deep: true })
watch(selectedType, updateChart)

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart?.resize())
})

defineExpose({
  updateChart
})</script> 