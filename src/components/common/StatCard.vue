<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <div class="flex items-center space-x-3">
      <div class="w-12 h-12 rounded-full flex items-center justify-center"
           :class="iconBgClass">
        <font-awesome-icon :icon="icon" :class="iconColorClass" class="text-xl" />
      </div>
      <div>
        <div class="text-sm text-gray-500">{{ title }}</div>
        <div class="text-xl font-medium mt-1">{{ value }}</div>
      </div>
    </div>
    <div class="mt-4" v-if="subValue || subLabel">
      <div class="flex items-center justify-between text-sm">
        <span :class="trendColorClass" v-if="subValue">
          <font-awesome-icon :icon="trendIcon" class="mr-1" />
          {{ subValue }}
        </span>
        <span class="text-gray-500">{{ subLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  icon: string
  title: string
  value: string | number
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
  trend?: 'up' | 'down' | 'none'
  subValue?: string
  subLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  trend: 'none'
})

const iconBgClass = computed(() => ({
  'bg-blue-50': props.color === 'blue',
  'bg-green-50': props.color === 'green',
  'bg-yellow-50': props.color === 'yellow',
  'bg-purple-50': props.color === 'purple',
  'bg-red-50': props.color === 'red'
}))

const iconColorClass = computed(() => ({
  'text-blue-500': props.color === 'blue',
  'text-green-500': props.color === 'green',
  'text-yellow-500': props.color === 'yellow',
  'text-purple-500': props.color === 'purple',
  'text-red-500': props.color === 'red'
}))

const trendColorClass = computed(() => ({
  'text-green-500': props.trend === 'up',
  'text-red-500': props.trend === 'down',
  'text-gray-500': props.trend === 'none'
}))

const trendIcon = computed(() => ({
  'arrow-up': props.trend === 'up',
  'arrow-down': props.trend === 'down',
  'minus': props.trend === 'none'
}))
</script> 