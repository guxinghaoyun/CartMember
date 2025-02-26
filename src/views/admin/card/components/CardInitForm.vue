<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[500px] p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-medium">初始化IC卡</h3>
        <button class="!rounded-button text-gray-600" @click="handleClose" :disabled="loading">
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
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              @click="handleReadCard"
              :disabled="loading"
            >
              <font-awesome-icon v-if="loading" icon="spinner" class="animate-spin" />
              <span>{{ loading ? '读取中...' : '读卡' }}</span>
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
            :disabled="loading"
          >
        </div>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <button
          class="!rounded-button px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleClose"
          :disabled="loading"
        >取消</button>
        <button
          class="!rounded-button px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          :disabled="!form.internalNumber || !form.surfaceNumber || loading"
          @click="handleSubmit"
        >
          <font-awesome-icon v-if="loading" icon="spinner" class="animate-spin" />
          <span>{{ loading ? '初始化中...' : '确认初始化' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { cardApi } from '@/api/admin/card'
import type { CardForm } from '@/types/api/admin/card'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'submit', value: CardForm): void
}>()

const loading = ref(false)
const form = ref<CardForm>({
  surfaceNumber: '',
  internalNumber: ''
})

const handleClose = () => {
  form.value = {
    surfaceNumber: '',
    internalNumber: ''
  }
  emit('update:show', false)
}

const handleReadCard = async () => {
  if (loading.value) return

  try {
    loading.value = true
    // 这里模拟读卡操作，实际项目中需要调用真实的读卡API
    const mockInternalNumber = 'RF8A7B2C' + Math.random().toString(36).substr(2, 4).toUpperCase()
    
    // 检查内部号码是否已存在
    const response = await cardApi.getList({
      page: 1,
      pageSize: 1,
      keyword: mockInternalNumber
    })

    if (response.data.data.total > 0) {
      ElMessage.error('该卡片已被初始化')
      return
    }

    form.value.internalNumber = mockInternalNumber
    ElMessage.success('读卡成功')
  } catch (error) {
    console.error('读卡失败:', error)
    ElMessage.error('读卡失败，请重试')
  } finally {
    loading.value = false
  }
}

const validateForm = async (): Promise<string | null> => {
  if (!form.value.internalNumber) {
    return '请先读取IC卡'
  }
  if (!form.value.surfaceNumber) {
    return '请输入卡面号码'
  }
  if (!/^NO\.\d+$/.test(form.value.surfaceNumber)) {
    return '卡面号码格式不正确（如：NO.100001）'
  }

  try {
    // 检查卡面号码是否已存在
    const response = await cardApi.getList({
      page: 1,
      pageSize: 1,
      keyword: form.value.surfaceNumber
    })

    if (response.data.data.total > 0) {
      return '卡面号码已存在'
    }
  } catch (error) {
    console.error('验证卡面号码失败:', error)
    return '验证卡面号码失败，请重试'
  }

  return null
}

const handleSubmit = async () => {
  if (loading.value) return
  
  try {
    loading.value = true
    const error = await validateForm()
    if (error) {
      ElMessage.warning(error)
      return
    }

    // 创建新卡片
    await cardApi.createCard(form.value)
    ElMessage.success('IC卡初始化成功')
    emit('submit', form.value)
    handleClose()
  } catch (error) {
    console.error('初始化IC卡失败:', error)
    ElMessage.error('初始化IC卡失败，请重试')
  } finally {
    loading.value = false
  }
}
</script> 