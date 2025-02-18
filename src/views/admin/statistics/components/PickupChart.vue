<template>
  <div class="bg-white rounded-xl p-3">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-medium">取货数量统计</h3>
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
    values: {
      completed: number[]
      pending: number[]
    }
  }
}>()

const chartTypes = [
  { label: '按日', value: 'daily' },
  { label: '按周', value: 'weekly' },
  { label: '按月', value: 'monthly' }
]

const selectedType = ref('daily')
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
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['已完成', '待取货'],
      top: 0,
      right: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
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
        name: '已完成',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: props.data.values.completed,
        itemStyle: {
          color: '#3B82F6'
        }
      },
      {
        name: '待取货',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: props.data.values.pending,
        itemStyle: {
          color: '#93C5FD'
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