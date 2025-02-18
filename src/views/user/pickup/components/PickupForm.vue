<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑提货单' : '新增提货单'"
    width="640px"
    @close="handleClose">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="space-y-6">
      <!-- 会员信息 -->
      <div class="bg-gray-50 p-4 rounded-lg space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-700">会员信息</h3>
          <button class="text-sm text-blue-500 hover:text-blue-600"
                  @click="handleReadCard">
            <i class="fas fa-id-card mr-1"></i>
            读取会员卡
          </button>
        </div>
        <el-form-item label="会员姓名" prop="memberName">
          <el-input v-model="form.memberName" placeholder="请输入会员姓名"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="memberPhone">
          <el-input v-model="form.memberPhone" placeholder="请输入手机号码"/>
        </el-form-item>
      </div>

      <!-- 提货信息 -->
      <div class="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 class="text-sm font-medium text-gray-700">提货信息</h3>
        <el-form-item label="提货方式" prop="deliveryType">
          <el-radio-group v-model="form.deliveryType">
            <el-radio-button label="store">
              <i class="fas fa-store mr-1"></i>
              门店自提
            </el-radio-button>
            <el-radio-button label="delivery">
              <i class="fas fa-truck mr-1"></i>
              快递配送
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提货时间" prop="pickupTime">
          <el-date-picker
            v-model="form.pickupTime"
            type="datetime"
            placeholder="选择提货时间"
            class="!w-full"/>
        </el-form-item>
        <el-form-item label="商品数量" prop="itemCount">
          <el-input-number
            v-model="form.itemCount"
            :min="1"
            :max="99"
            class="!w-full"/>
        </el-form-item>
      </div>

      <!-- 操作员信息 -->
      <div class="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 class="text-sm font-medium text-gray-700">操作员信息</h3>
        <el-form-item label="操作员" prop="operator">
          <el-select v-model="form.operator" placeholder="请选择操作员" class="!w-full">
            <el-option
              v-for="op in operators"
              :key="op"
              :label="op"
              :value="op"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"/>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? '保存' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'

const props = defineProps<{
  visible: boolean
  isEdit?: boolean
  editData?: any
}>()

const emit = defineEmits(['update:visible', 'submit'])

// 对话框可见性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 操作员列表
const operators = [
  '李海燕',
  '王建国',
  '张晓芳',
  '刘明亮',
  '赵雪梅'
]

// 表单数据
const form = reactive({
  memberName: '',
  memberPhone: '',
  deliveryType: 'store',
  pickupTime: '',
  itemCount: 1,
  operator: '',
  notes: ''
})

// 表单校验规则
const rules: FormRules = {
  memberName: [
    { required: true, message: '请输入会员姓名', trigger: 'blur' }
  ],
  memberPhone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  deliveryType: [
    { required: true, message: '请选择提货方式', trigger: 'change' }
  ],
  pickupTime: [
    { required: true, message: '请选择提货时间', trigger: 'change' }
  ],
  operator: [
    { required: true, message: '请选择操作员', trigger: 'change' }
  ]
}

// 监听编辑数据变化
watch(() => props.editData, (newData) => {
  if (newData) {
    // 填充表单数据
    Object.assign(form, {
      memberName: newData.memberName,
      memberPhone: newData.memberPhone,
      deliveryType: newData.deliveryType,
      pickupTime: newData.pickupTime,
      itemCount: newData.itemCount,
      operator: newData.operator,
      notes: newData.notes || ''
    })
  }
}, { immediate: true })

// 监听visible变化
watch(() => props.visible, (newVisible) => {
  if (!newVisible) {
    // 重置表单
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }
})

// 读取会员卡
const handleReadCard = () => {
  // 模拟读取会员卡
  form.memberName = '陈思悦'
  form.memberPhone = '13812345678'
  ElMessage.success('会员卡读取成功')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 构造提交数据
    const submitData = {
      ...form,
      pickupTime: dayjs(form.pickupTime).format('YYYY-MM-DD HH:mm'),
      status: 'pending'
    }
    
    emit('submit', submitData)
    handleClose()
  } catch (error) {
    // 表单验证失败
  } finally {
    loading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script> 