<template>
  <el-dialog
    v-model="visible"
    title="新增提货单"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px">
      <!-- 会员信息 -->
      <div class="bg-blue-50 p-4 rounded-lg mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-700">会员信息</h3>
          <button @click="handleReadCard" 
                  class="!rounded-button bg-blue-500 text-white px-4 py-1.5 text-sm hover:bg-blue-600">
            <i class="fas fa-credit-card mr-2"></i>
            读取会员卡
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="会员" prop="member" class="!mb-0">
            <div class="relative">
              <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <el-input v-model="form.member" placeholder="请输入会员手机号" class="!pl-10" />
            </div>
          </el-form-item>
          <div>
            <div class="text-sm text-gray-500">可用积分</div>
            <div class="font-medium mt-1">{{ memberPoints || '0' }} 积分</div>
          </div>
        </div>
      </div>

      <!-- 提货信息 -->
      <div class="bg-green-50 p-4 rounded-lg mb-6">
        <h3 class="text-sm font-medium text-gray-700 mb-4">提货信息</h3>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="商品" prop="items" class="!mb-0">
            <div class="relative">
              <i class="fas fa-box absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <el-input-number v-model="form.items" :min="1" placeholder="请输入商品数量" class="!w-full" />
            </div>
          </el-form-item>
          <el-form-item label="方式" prop="method" class="!mb-0">
            <div class="relative">
              <i class="fas fa-truck absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <el-select v-model="form.method" placeholder="请选择提货方式" class="!w-full !pl-10">
                <el-option value="门店自提" label="门店自提">
                  <i class="fas fa-store mr-2"></i>
                  门店自提
                </el-option>
                <el-option value="快递配送" label="快递配送">
                  <i class="fas fa-truck mr-2"></i>
                  快递配送
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="时间" prop="pickupTime" class="!mb-0">
            <div class="relative">
              <i class="fas fa-clock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <el-date-picker
                v-model="form.pickupTime"
                type="datetime"
                placeholder="请选择提货时间"
                class="!w-full !pl-10" />
            </div>
          </el-form-item>
          <el-form-item label="操作员" prop="operator" class="!mb-0">
            <div class="relative">
              <i class="fas fa-user-circle absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <el-select v-model="form.operator" placeholder="请选择操作员" class="!w-full !pl-10">
                <el-option v-for="op in operators" :key="op.id" :value="op.name" :label="op.name">
                  <i class="fas fa-user-tie mr-2"></i>
                  {{ op.name }} ({{ op.role }})
                </el-option>
              </el-select>
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- 备注信息 -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 mb-4">备注信息</h3>
        <el-form-item prop="notes" class="!mb-0">
          <div class="relative">
            <i class="fas fa-comment-alt absolute left-3 top-3 text-gray-400"></i>
            <el-input
              v-model="form.notes"
              type="textarea"
              :rows="3"
              placeholder="请输入备注信息"
              class="!pl-10" />
          </div>
        </el-form-item>
      </div>
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
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success', order: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 会员积分
const memberPoints = ref('')

// 操作员列表
const operators = [
  { id: 1, name: '李海燕', role: '主管' },
  { id: 2, name: '王建国', role: '店员' },
  { id: 3, name: '张晓芳', role: '店员' },
  { id: 4, name: '刘明亮', role: '店员' },
  { id: 5, name: '赵雪梅', role: '店员' }
]

// 表单数据
const form = ref({
  member: '',
  items: 1,
  method: '',
  pickupTime: '',
  operator: '',
  notes: ''
})

// 表单验证规则
const rules: FormRules = {
  member: [
    { required: true, message: '请输入会员手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  items: [
    { required: true, message: '请输入商品数量', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请选择提货方式', trigger: 'change' }
  ],
  pickupTime: [
    { required: true, message: '请选择提货时间', trigger: 'change' }
  ],
  operator: [
    { required: true, message: '请选择操作员', trigger: 'change' }
  ]
}

// 读取会员卡
const handleReadCard = () => {
  // TODO: 实现读卡逻辑
  form.value.member = '13812345678'
  memberPoints.value = '3,560'
  ElMessage.success('会员卡读取成功')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 构造提货单数据
    const currentDate = new Date().toISOString().split('T')[0]
    const order = {
      id: Date.now(),
      orderNo: `PK${currentDate.replace(/-/g, '')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      items: form.value.items,
      member: form.value.member,
      phone: form.value.member.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      method: form.value.method,
      pickupTime: form.value.pickupTime,
      status: '待提货',
      operator: form.value.operator,
      notes: form.value.notes
    }
    
    // TODO: 调用API保存提货单数据
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API调用
    
    emit('success', order)
    handleClose()
    ElMessage.success('提货单创建成功')
    
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
    member: '',
    items: 1,
    method: '',
    pickupTime: '',
    operator: '',
    notes: ''
  }
  memberPoints.value = ''
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