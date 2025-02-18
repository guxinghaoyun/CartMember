<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="编辑会员"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入会员姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="IC卡号" prop="icCard">
        <div class="flex space-x-2">
          <el-input v-model="form.icCard" placeholder="请输入IC卡号" />
          <el-button type="primary" class="whitespace-nowrap" @click="handleReadCard">
            读取卡号
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="当前积分" prop="points">
        <div class="flex items-center space-x-4">
          <el-input-number v-model="form.points" :min="0" class="!w-full" />
          <div class="text-sm text-gray-500 whitespace-nowrap">
            原积分: {{ originalPoints }}
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="notes">
        <el-input
          v-model="form.notes"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end space-x-4">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

interface Props {
  visible: boolean
  member?: {
    id: number
    name: string
    phone: string
    icCard: string
    points: string
    notes?: string
  }
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success', member: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 原始积分
const originalPoints = ref('')

// 表单数据
const form = ref({
  id: 0,
  name: '',
  phone: '',
  icCard: '',
  points: 0,
  notes: ''
})

// 监听会员数据变化
watch(() => props.member, (newMember) => {
  if (newMember) {
    form.value = {
      id: newMember.id,
      name: newMember.name,
      phone: newMember.phone,
      icCard: newMember.icCard,
      points: parseInt(newMember.points.replace(/,/g, '')),
      notes: newMember.notes || ''
    }
    originalPoints.value = newMember.points
  }
}, { immediate: true })

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入会员姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  icCard: [
    { required: true, message: '请输入IC卡号', trigger: 'blur' }
  ],
  points: [
    { required: true, message: '请输入积分', trigger: 'blur' }
  ]
}

// 读取IC卡
const handleReadCard = () => {
  // TODO: 实现读卡逻辑
  form.value.icCard = '8800 2233 ' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  ElMessage.success('IC卡读取成功')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 构造更新数据
    const updatedMember = {
      id: form.value.id,
      name: form.value.name,
      phone: form.value.phone,
      icCard: form.value.icCard,
      points: form.value.points.toString(),
      notes: form.value.notes
    }
    
    // TODO: 调用API更新会员数据
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API调用
    
    emit('success', updatedMember)
    handleClose()
    ElMessage.success('会员信息更新成功')
    
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  // 重置表单
  form.value = {
    id: 0,
    name: '',
    phone: '',
    icCard: '',
    points: 0,
    notes: ''
  }
  originalPoints.value = ''
  formRef.value?.resetFields()
}
</script>

<style scoped>
:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: none !important;
  border: 1px solid #e5e7eb !important;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  border-color: #d1d5db !important;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}
</style> 