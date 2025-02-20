<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[500px] p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-medium">初始化IC卡</h3>
        <button class="!rounded-button text-gray-600" @click="handleClose">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">内部号码</label>
          <div class="flex gap-2">
            <input
              v-model="form.internalNumber"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请读取IC卡"
              readonly
            >
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              @click="handleReadCard"
            >
              读卡
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">卡面号码</label>
          <input
            v-model="form.surfaceNumber"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入卡面号码（NO.1）"
          >
        </div>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <button
          class="!rounded-button px-4 py-2 border border-gray-300 text-gray-700"
          @click="handleClose"
        >取消</button>
        <button
          class="!rounded-button px-4 py-2 bg-blue-600 text-white"
          :disabled="!form.internalNumber || !form.surfaceNumber"
          @click="handleSubmit"
        >确认初始化</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CardForm {
  surfaceNumber: string
  internalNumber: string
}

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'submit', value: CardForm): void
}>()

const form = ref<CardForm>({
  surfaceNumber: '',
  internalNumber: ''
})

const handleClose = () => {
  emit('update:show', false)
}

const handleReadCard = async () => {
  try {
    // 这里模拟读卡操作，实际项目中需要调用真实的读卡API
    const mockInternalNumber = 'RF8A7B2C' + Math.random().toString(36).substr(2, 4).toUpperCase()
    form.value.internalNumber = mockInternalNumber
  } catch (error) {
    console.error('读卡失败:', error)
    // 这里可以添加错误提示
  }
}

const handleSubmit = () => {
  if (!form.value.internalNumber || !form.value.surfaceNumber) {
    return
  }
  emit('submit', form.value)
  form.value = {
    surfaceNumber: '',
    internalNumber: ''
  }
}
</script> 