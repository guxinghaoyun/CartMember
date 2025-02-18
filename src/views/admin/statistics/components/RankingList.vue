<template>
  <div class="bg-white rounded-xl p-3">
    <div class="flex justify-between items-center mb-6">
      <h3 class="font-medium flex items-center gap-2">
        <font-awesome-icon :icon="icon" :class="`text-${iconColor}-500`" />
        {{ title }}
      </h3>
      <button class="!rounded-button text-gray-400 hover:text-gray-600 transition-colors">
        <font-awesome-icon icon="ellipsis-h" />
      </button>
    </div>
    <div class="space-y-4">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-4"
      >
        <span
          class="w-6 h-6 rounded-full flex items-center justify-center"
          :class="{
            'bg-yellow-100 text-yellow-600': index === 0,
            'bg-gray-100 text-gray-600': index === 1,
            'bg-orange-100 text-orange-600': index === 2,
            'bg-blue-100 text-blue-600': index > 2
          }"
        >{{ index + 1 }}</span>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm">{{ item.name }}</span>
            <span class="text-sm text-gray-500">{{ item.count }}件</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 rounded-full"
              :style="{ width: item.percent + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RankingItem {
  name: string
  count: number
  percent: number
}

defineProps<{
  title: string
  icon: string
  iconColor: string
  items: RankingItem[]
}>()</script> 