<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="新增会员"
    width="580px"
    :close-on-click-modal="false"
    @close="handleClose">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="84px"
      class="space-y-8">
      <!-- 基本信息 -->
      <div class="space-y-4">
        <h3 class="text-base font-medium text-gray-900 flex items-center">
          <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center mr-2">
            <font-awesome-icon icon="user" class="text-blue-500" />
          </div>
          基本信息
        </h3>
        <div class="bg-gray-50 rounded-lg p-5">
          <div class="space-y-4">
            <el-form-item label="会员姓名" prop="name" class="!mb-0">
              <el-input 
                v-model="form.name" 
                placeholder="请输入会员姓名"
                class="!w-full" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone" class="!mb-0">
              <el-input 
                v-model="form.phone" 
                placeholder="请输入手机号码"
                class="!w-full" />
            </el-form-item>
          </div>
        </div>
      </div>

      <!-- IC卡信息 -->
      <div class="space-y-4">
        <h3 class="text-base font-medium text-gray-900 flex items-center">
          <div class="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center mr-2">
            <font-awesome-icon icon="credit-card" class="text-indigo-500" />
          </div>
          IC卡信息
        </h3>
        <div class="bg-gray-50 rounded-lg p-5">
          <div class="space-y-4">
            <!-- IC卡号 -->
            <el-form-item label="IC卡号" prop="icCard" class="!mb-0">
              <div class="flex space-x-2">
                <el-input 
                  v-model="form.icCard" 
                  placeholder="请输入IC卡号"
                  class="!w-full" />
                <el-button 
                  type="primary" 
                  class="whitespace-nowrap !bg-indigo-500 hover:!bg-indigo-600" 
                  @click="handleReadCard">
                  <font-awesome-icon icon="id-card" class="mr-1" />
                  读取卡号
                </el-button>
              </div>
            </el-form-item>

            <!-- 所属店铺 -->
            <el-form-item label="所属店铺" prop="storeName" class="!mb-0">
              <el-input 
                v-model="form.storeName" 
                placeholder="当前店铺"
                :disabled="true"
                class="!w-full !bg-gray-50" />
            </el-form-item>

            <!-- 卡片状态 -->
            <el-form-item label="卡片状态" prop="status" class="!mb-0">
              <el-radio-group v-model="form.status" class="!w-full flex gap-4">
                <el-radio label="正常" class="flex-1 !mr-0">
                  <div class="flex items-center">
                    <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    正常
                  </div>
                </el-radio>
                <el-radio label="停用" class="flex-1 !mr-0">
                  <div class="flex items-center">
                    <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    停用
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 卡面图片 -->
            <el-form-item label="IC卡面图片" prop="cardImage" class="!mb-0">
              <div class="space-y-2">
                <el-upload
                  class="w-full"
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  accept="image/*"
                  :on-change="handleImageChange">
                  <template #trigger>
                    <div 
                      class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-white"
                      :class="{'border-indigo-500': form.cardImage}">
                      <div v-if="!form.cardImage" class="space-y-2">
                        <font-awesome-icon icon="image" class="text-3xl text-gray-400" />
                        <div class="text-sm text-gray-500">
                          点击或拖拽图片上传
                          <div class="text-xs">支持 jpg、png 格式，大小不超过 2MB</div>
                        </div>
                      </div>
                      <div v-else class="relative group">
                        <img 
                          :src="form.cardImage" 
                          class="w-full h-32 object-cover rounded-lg"
                          alt="卡面预览" 
                        />
                        <div class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span class="text-white text-sm">点击更换图片</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-upload>
                <transition name="el-fade-in-linear">
                  <div v-if="form.cardImage" class="flex justify-end">
                    <el-button 
                      type="danger" 
                      link
                      @click="handleRemoveImage">
                      <font-awesome-icon icon="trash" class="mr-1" />
                      删除图片
                    </el-button>
                  </div>
                </transition>
              </div>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose" class="!border-gray-300">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit" 
          :loading="loading"
          class="!bg-blue-500 hover:!bg-blue-600">
          <font-awesome-icon icon="check" class="mr-1" />
          确认添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

interface Props {
  visible: boolean
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

// 表单数据
const form = ref({
  name: '',
  phone: '',
  icCard: '',
  storeName: '总店',
  status: '正常' as '正常' | '停用',
  cardImage: ''
})

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
  storeName: [
    { required: true, message: '店铺名称不能为空', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择卡片状态', trigger: 'change' }
  ]
}

// 读取IC卡
const handleReadCard = () => {
  // TODO: 实现读卡逻辑
  form.value.icCard = '8800 2233 ' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  ElMessage.success('IC卡读取成功')
}

// 处理图片变更
const handleImageChange = (file: UploadFile) => {
  if (!file || !file.raw) return
  
  // 验证文件类型
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请上传图片文件')
    return
  }
  
  // 验证文件大小（2MB）
  const isLt2M = file.raw.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return
  }
  
  // 转换为 base64 用于预览
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.cardImage = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
}

// 删除图片
const handleRemoveImage = () => {
  form.value.cardImage = ''
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 构造会员数据
    const currentDate = new Date().toISOString().split('T')[0]
    const member = {
      id: Date.now(),
      name: form.value.name,
      phone: form.value.phone,
      icCard: form.value.icCard,
      storeName: form.value.storeName,
      registerDate: currentDate,
      status: form.value.status,
      cardImage: form.value.cardImage || undefined
    }
    
    // TODO: 调用API保存会员数据
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API调用
    
    emit('success', member)
    handleClose()
    ElMessage.success('会员添加成功')
    
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
    name: '',
    phone: '',
    icCard: '',
    storeName: '总店',
    status: '正常',
    cardImage: ''
  }
  formRef.value?.resetFields()
}
</script>

<style scoped>
/* 输入框样式 */
:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select .el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #e5e7eb !important;
  background-color: white !important;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover),
:deep(.el-select .el-input__wrapper:hover) {
  border-color: #d1d5db !important;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus),
:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}

/* Dialog 样式 */
:deep(.el-dialog) {
  border-radius: 12px !important;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
}

:deep(.el-dialog__header) {
  margin-right: 0 !important;
  padding: 16px 20px !important;
  border-bottom: 1px solid #e5e7eb !important;
}

:deep(.el-dialog__title) {
  font-weight: 600 !important;
  font-size: 1.125rem !important;
  line-height: 1.75rem !important;
}

:deep(.el-dialog__body) {
  padding: 20px !important;
}

:deep(.el-dialog__footer) {
  padding: 12px 20px !important;
  border-top: 1px solid #e5e7eb !important;
}

/* Radio 按钮样式 */
:deep(.el-radio) {
  height: 36px;
  padding: 0 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

:deep(.el-radio.is-checked) {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.el-radio__label) {
  padding-left: 4px;
}

/* 禁用输入框样式 */
:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f9fafb !important;
  color: #374151 !important;
  cursor: not-allowed;
}

:deep(.el-input.is-disabled .el-input__inner) {
  color: #374151 !important;
  -webkit-text-fill-color: #374151 !important;
}

/* Form Item Label */
:deep(.el-form-item__label) {
  font-size: 0.875rem !important;
  color: #374151 !important;
  font-weight: 500 !important;
  padding-right: 12px !important;
}
</style> 