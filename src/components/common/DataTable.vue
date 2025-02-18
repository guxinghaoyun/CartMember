<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="column in columns" :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                :class="column.class">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50">
            <td v-for="column in columns" :key="column.key"
                class="px-6 py-4 whitespace-nowrap"
                :class="column.class">
              <slot :name="column.key" :item="item">
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页器 -->
    <div v-if="showPagination" class="flex items-center justify-between px-6 py-4 border-t">
      <div class="flex items-center text-sm text-gray-700">
        显示 {{ startIndex }} - {{ endIndex }} 条，共 {{ total }} 条
      </div>
      <div class="flex items-center space-x-2">
        <button class="!rounded-button px-3 py-1 border text-sm"
                :class="{'bg-gray-100': currentPage === 1}"
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)">
          上一页
        </button>
        <template v-for="page in displayPages" :key="page">
          <button class="!rounded-button px-3 py-1 border text-sm"
                  :class="{'bg-blue-500 text-white': currentPage === page}"
                  @click="handlePageChange(page)">
            {{ page }}
          </button>
        </template>
        <button class="!rounded-button px-3 py-1 border text-sm"
                :class="{'bg-gray-100': currentPage === totalPages}"
                :disabled="currentPage === totalPages"
                @click="handlePageChange(currentPage + 1)">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Column {
  key: string
  label: string
  class?: string
}

interface Props {
  columns: Column[]
  data: any[]
  currentPage?: number
  pageSize?: number
  total?: number
  showPagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  showPagination: true
})

const emit = defineEmits(['page-change'])

const startIndex = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const endIndex = computed(() => Math.min(props.currentPage * props.pageSize, props.total))
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

// 计算要显示的页码
const displayPages = computed(() => {
  const pages = []
  const maxPages = 5 // 最多显示5个页码
  let start = Math.max(1, props.currentPage - 2)
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const handlePageChange = (page: number) => {
  emit('page-change', page)
}
</script> 