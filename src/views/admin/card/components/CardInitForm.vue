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
          <label class="block text-sm font-medium text-gray-700 mb-1">所属店铺</label>
          <select
            v-model="form.store"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择店铺</option>
            <option v-for="store in stores" :key="store.id" :value="store.name">
              {{ store.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">会员姓名</label>
          <input
            v-model="form.memberName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入会员姓名"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
          <input
            v-model="form.memberPhone"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入手机号码"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">初始积分</label>
          <input
            v-model="form.points"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入初始积分"
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
          @click="handleSubmit"
        >确认初始化</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CardForm {
  store: string
  memberName: string
  memberPhone: string
  points: number | null
}

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'submit', value: CardForm): void
}>()

const stores = [
  { id: 1, name: '北京朝阳店' },
  { id: 2, name: '上海浦东店' },
  { id: 3, name: '广州天河店' }
]

const form = ref<CardForm>({
  store: '',
  memberName: '',
  memberPhone: '',
  points: null
})

const handleClose = () => {
  emit('update:show', false)
}

const handleSubmit = () => {
  emit('submit', form.value)
}
</script> 