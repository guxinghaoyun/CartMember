<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="新增会员"
    width="580px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="84px" class="space-y-8">
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
              <el-input v-model="form.name" placeholder="请输入会员姓名" class="!w-full" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone" class="!mb-0">
              <el-input v-model="form.phone" placeholder="请输入手机号码" class="!w-full" />
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
            <el-form-item label="IC卡号" prop="icNumber" class="!mb-0">
              <div class="flex space-x-2">
                <el-input v-model="form.icNumber" placeholder="请输入IC卡号" class="!w-full" />
                <el-button
                  type="primary"
                  class="whitespace-nowrap !bg-indigo-500 hover:!bg-indigo-600"
                  @click="handleReadCard"
                >
                  <font-awesome-icon icon="id-card" class="mr-1" />
                  读取卡号
                </el-button>
              </div>
            </el-form-item>

            <!-- 卡片状态 -->
            <el-form-item label="卡片状态" prop="icStatus" class="!mb-0">
              <el-radio-group v-model="form.icStatus" class="!w-full flex gap-4">
                <el-radio :value="true" class="flex-1 !mr-0">
                  <div class="flex items-center">
                    <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    正常
                  </div>
                </el-radio>
                <el-radio :value="false" class="flex-1 !mr-0">
                  <div class="flex items-center">
                    <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    停用
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 卡片图片 -->
            <div class="mt-4">
              <div class="text-base text-gray-500 mb-2">
                卡片图片
                <span class="text-red-500">*</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <!-- 正面图片 -->
                <div class="space-y-2">
                  <div class="text-sm text-gray-500">正面</div>
                  <el-upload
                    class="w-full"
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept="image/*"
                    :on-change="(file: UploadFile) => handleImageChange(file, 'frontPicture')"
                  >
                    <template #trigger>
                      <div
                        class="border border-gray-200 rounded-lg p-2 bg-white h-[190px] flex items-center justify-center"
                        :class="{
                          'border-red-300 bg-red-50':
                            !form?.frontPicture &&
                            formRef?.fields?.find(field => field.prop === 'frontPicture')
                              ?.validateState === 'error'
                        }"
                      >
                        <div v-if="!form?.frontPicture" class="space-y-2 p-2 text-center">
                          <font-awesome-icon icon="image" class="text-3xl text-gray-400" />
                          <div class="text-sm text-gray-500">
                            点击或拖拽上传正面图片
                            <div class="text-xs">支持 jpg、png 格式，大小不超过 2MB</div>
                            <div class="text-xs text-red-500 font-medium mt-1">（必填项）</div>
                          </div>
                        </div>
                        <div v-else class="relative group w-full h-full">
                          <member-card-image
                            :image-url="form.frontPicture"
                            alt="IC卡正面预览"
                            mode="contain"
                          />
                          <div
                            class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <span class="text-white text-sm">点击更换图片</span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-upload>
                  <transition name="el-fade-in-linear">
                    <div v-if="form.frontPicture" class="flex justify-end">
                      <el-button type="danger" link @click="handleRemoveImage('frontPicture')">
                        <font-awesome-icon icon="trash" class="mr-1" />
                        删除正面图片
                      </el-button>
                    </div>
                  </transition>
                </div>

                <!-- 背面图片 -->
                <div class="space-y-2">
                  <div class="text-sm text-gray-500">背面</div>
                  <el-upload
                    class="w-full"
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept="image/*"
                    :on-change="(file: UploadFile) => handleImageChange(file, 'backPicture')"
                  >
                    <template #trigger>
                      <div
                        class="border border-gray-200 rounded-lg p-2 bg-white h-[190px] flex items-center justify-center"
                        :class="{
                          'border-red-300 bg-red-50':
                            !form?.backPicture &&
                            formRef?.fields?.find(field => field.prop === 'backPicture')
                              ?.validateState === 'error'
                        }"
                      >
                        <div v-if="!form.backPicture" class="space-y-2 p-2 text-center">
                          <font-awesome-icon icon="image" class="text-3xl text-gray-400" />
                          <div class="text-sm text-gray-500">
                            点击或拖拽上传背面图片
                            <div class="text-xs">支持 jpg、png 格式，大小不超过 2MB</div>
                            <div class="text-xs text-red-500 font-medium mt-1">（必填项）</div>
                          </div>
                        </div>
                        <div v-else class="relative group w-full h-full">
                          <member-card-image
                            :image-url="form.backPicture"
                            alt="IC卡背面预览"
                            mode="contain"
                          />
                          <div
                            class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <span class="text-white text-sm">点击更换图片</span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-upload>
                  <transition name="el-fade-in-linear">
                    <div v-if="form.backPicture" class="flex justify-end">
                      <el-button type="danger" link @click="handleRemoveImage('backPicture')">
                        <font-awesome-icon icon="trash" class="mr-1" />
                        删除背面图片
                      </el-button>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他信息 -->
      <div class="space-y-4">
        <h3 class="text-base font-medium text-gray-900 flex items-center">
          <div class="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center mr-2">
            <font-awesome-icon icon="note-sticky" class="text-green-500" />
          </div>
          其他信息
        </h3>
        <div class="bg-gray-50 rounded-lg p-5">
          <el-form-item label="备注" prop="note" class="!mb-0">
            <el-input v-model="form.note" type="textarea" :rows="3" placeholder="请输入备注信息" />
          </el-form-item>
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
          class="!bg-blue-500 hover:!bg-blue-600"
        >
          <font-awesome-icon icon="check" class="mr-1" />
          确认添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Member, CreateMemberRequest } from '@/types/api/user/member'
import { memberApi } from '@/api/user/member'
import MemberCardImage from '@/components/common/MemberCardImage.vue'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success', member: Member): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 表单数据
const form = ref<CreateMemberRequest>({
  name: '',
  phone: '',
  icNumber: '',
  icStatus: '',
  frontPicture: '',
  backPicture: '',
  note: ''
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
  icNumber: [{ required: true, message: '请输入IC卡号', trigger: 'blur' }],
  icStatus: [{ required: true, message: '请选择卡片状态', trigger: 'change' }],
  frontPicture: [{ required: true, message: '请上传IC卡正面图片', trigger: 'change' }],
  backPicture: [{ required: true, message: '请上传IC卡背面图片', trigger: 'change' }]
}

// 读取IC卡
const handleReadCard = () => {
  // TODO: 实现读卡逻辑
  form.value.icNumber =
    '8800 2233 ' +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
  ElMessage.success('IC卡读取成功')
}

// 处理图片变更
const handleImageChange = async (file: UploadFile, side: 'frontPicture' | 'backPicture') => {
  if (!file || !file.raw) return

  console.group(`===== 会员卡图片处理: ${side} =====`)
  console.log('文件信息:', {
    name: file.name,
    size: file.raw.size,
    type: file.raw.type
  })

  // 验证文件类型
  const isImage = file.raw.type.startsWith('image/')
  console.log('是否为图片类型:', isImage)
  if (!isImage) {
    console.error('非图片类型文件被拒绝')
    console.groupEnd()
    ElMessage.error('请上传图片文件')
    return
  }

  // 验证文件大小（2MB）
  const isLt2M = file.raw.size / 1024 / 1024 < 2
  console.log('是否小于2MB:', isLt2M, `(${(file.raw.size / 1024 / 1024).toFixed(2)}MB)`)
  if (!isLt2M) {
    console.error('文件大小超过限制')
    console.groupEnd()
    ElMessage.error('图片大小不能超过 2MB!')
    return
  }

  try {
    console.log('开始转换图片为base64')
    console.time('图片转换耗时')
    // 将图片转换为base64
    const imageBase64 = await readFileAsBase64(file.raw)
    console.timeEnd('图片转换耗时')
    console.log('base64数据长度:', imageBase64.length)
    console.log('base64数据预览:', imageBase64.substring(0, 50) + '...')

    // 直接在前端显示base64图片
    if (form.value) {
      form.value[side] = imageBase64
      console.log(`更新form.${side}成功`)
    }
    console.groupEnd()
  } catch (error) {
    console.error('上传图片失败:', error)
    console.groupEnd()
    ElMessage.error('上传图片失败')
  }
}

// 将File对象转换为base64字符串
const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('图片读取失败'))
      }
    }
    reader.onerror = () => reject(new Error('图片读取失败'))
    reader.readAsDataURL(file)
  })
}

// 删除图片
const handleRemoveImage = (side: 'frontPicture' | 'backPicture') => {
  if (form.value) {
    form.value[side] = ''
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // 将表单数据转换为符合后端格式的对象
    const submitData = {
      name: form.value.name,
      phone: form.value.phone,
      icNumber: form.value.icNumber,
      icStatus: form.value.icStatus, // 转换为布尔值
      note: form.value.note || '',
      // 图片数据
      frontPicture: form.value?.frontPicture || '',
      backPicture: form.value?.backPicture || ''
    }

    console.log('提交数据:', JSON.stringify(submitData, null, 2))

    // 创建会员
    const response = await memberApi.createMember(submitData)

    if (response.code === 200) {
      const newMember = response as unknown as Member
      emit('success', newMember)
      handleClose()
      ElMessage.success('会员添加成功')
    } else {
      ElMessage.error(response.message || '添加会员失败')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
    if (error !== 'cancel') {
      ElMessage.error(error instanceof Error ? error.message : '添加会员失败')
    }
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
    icNumber: '',
    icStatus: '',
    frontPicture: '',
    backPicture: '',
    note: ''
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
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
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
