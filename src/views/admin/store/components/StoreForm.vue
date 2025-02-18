<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[600px] p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-medium">{{ editMode ? '编辑店铺' : '添加店铺' }}</h3>
        <button class="!rounded-button text-gray-600" @click="handleClose">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">店铺名称</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入店铺名称"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">店铺位置</label>
          <input
            v-model="form.location"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入店铺详细地址"
          >
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">店长姓名</label>
            <input
              v-model="form.manager"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入店长姓名"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
            <input
              v-model="form.phone"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入联系电话"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">店员信息</label>
          <div class="space-y-2">
            <div v-for="(staff, index) in form.staffList" :key="index" class="flex gap-2">
              <input
                v-model="staff.name"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入店员姓名"
              >
              <input
                v-model="staff.position"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入职位"
              >
              <button
                class="!rounded-button px-3 text-red-600"
                @click="removeStaff(index)"
                v-if="form.staffList.length > 1"
              >
                <font-awesome-icon icon="minus" />
              </button>
            </div>
            <button
              class="!rounded-button text-blue-600 border border-blue-600 px-4 py-2 w-full flex items-center justify-center gap-2"
              @click="addStaff"
            >
              <font-awesome-icon icon="plus" />
              <span>添加店员</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">系统账号</label>
            <input
              v-model="form.username"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入系统登录账号"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">登录密码</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入登录密码"
            >
          </div>
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
        >{{ editMode ? '保存修改' : '确认添加' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Staff {
  name: string
  position: string
}

export interface StoreForm {
  name: string
  location: string
  manager: string
  phone: string
  staffList: Staff[]
  username: string
  password: string
}

interface Props {
  show: boolean
  editMode: boolean
  storeData?: Partial<StoreForm> | null
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  editMode: false,
  storeData: () => ({})
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'submit', value: StoreForm): void
}>()

const form = ref<StoreForm>({
  name: '',
  location: '',
  manager: '',
  phone: '',
  staffList: [{ name: '', position: '' }],
  username: '',
  password: ''
})

onMounted(() => {
  if (props.editMode && props.storeData) {
    form.value = {
      ...form.value,
      ...props.storeData
    }
  }
})

const addStaff = () => {
  form.value.staffList.push({ name: '', position: '' })
}

const removeStaff = (index: number) => {
  form.value.staffList.splice(index, 1)
}

const handleClose = () => {
  emit('update:show', false)
}

const handleSubmit = () => {
  emit('submit', form.value)
}
</script> 