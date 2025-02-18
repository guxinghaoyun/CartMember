<template>
  <div :class="[`bg-gradient-to-br from-${color}-500 to-${color}-600`]" class="rounded-xl p-6 text-white">
    <div class="flex justify-between items-start">
      <div>
        <p :class="[`text-${color}-100`]">{{ title }}</p>
        <p class="text-3xl font-semibold mt-2">{{ value }}</p>
      </div>
      <i :class="[icon, `text-3xl text-${color}-200`]"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}>()</script> 