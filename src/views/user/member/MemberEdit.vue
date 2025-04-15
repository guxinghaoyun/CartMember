<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="编辑会员"
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
            <el-form-item label="姓名" prop="name" class="!mb-0">
              <el-input v-model="form.name" placeholder="请输入会员姓名" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone" class="!mb-0">
              <el-input v-model="form.phone" placeholder="请输入手机号码" />
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
            <el-form-item label="IC卡号" prop="icNumber" class="!mb-0">
              <el-input v-model="form.icNumber" disabled class="!bg-gray-50" />
            </el-form-item>
            <el-form-item label="注册时间" prop="registerDate" class="!mb-0">
              <el-input v-model="form.registerDate" disabled class="!bg-gray-50" />
            </el-form-item>
            <el-form-item label="卡片状态" prop="icStatus" class="!mb-0">
              <el-radio-group v-model="form.icStatus" class="!w-full flex gap-4">
                <el-radio :value="'正常'" class="flex-1 !mr-0">
                  <div class="flex items-center">
                    <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    正常
                  </div>
                </el-radio>
                <el-radio :value="'停用'" class="flex-1 !mr-0">
                  <div class="flex items-center">
                    <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    停用
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 卡片图片 -->
            <div class="mt-4">
              <div class="text-base text-gray-500 mb-2">卡片图片</div>
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
                      >
                        <div v-if="!form.frontPicture" class="space-y-2 p-2 text-center">
                          <font-awesome-icon icon="image" class="text-3xl text-gray-400" />
                          <div class="text-sm text-gray-500">
                            点击或拖拽上传正面图片
                            <div class="text-xs">支持 jpg、png 格式，大小不超过 2MB</div>
                          </div>
                        </div>
                        <div v-else class="relative group w-full h-full">
                          <template v-if="isBase64Image(form.frontPicture)">
                            <img
                              :src="form.frontPicture"
                              alt="IC卡正面预览"
                              class="w-full h-full object-contain rounded-lg"
                            />
                          </template>
                          <member-card-image
                            v-else
                            :member-id="form.id"
                            :image-uuid="form.frontPicture"
                            alt="IC卡正面预览"
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
                      >
                        <div v-if="!form.backPicture" class="space-y-2 p-2 text-center">
                          <font-awesome-icon icon="image" class="text-3xl text-gray-400" />
                          <div class="text-sm text-gray-500">
                            点击或拖拽上传背面图片
                            <div class="text-xs">支持 jpg、png 格式，大小不超过 2MB</div>
                          </div>
                        </div>
                        <div v-else class="relative group w-full h-full">
                          <template v-if="isBase64Image(form.backPicture)">
                            <img
                              :src="form.backPicture"
                              alt="IC卡背面预览"
                              class="w-full h-full object-contain rounded-lg"
                            />
                          </template>
                          <member-card-image
                            v-else
                            :member-id="form.id"
                            :image-uuid="form.backPicture"
                            alt="IC卡背面预览"
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
          确认修改
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Member, UpdateMemberRequest } from '@/types/api/user/member'
import { memberApi } from '@/api/user/member'
import MemberCardImage from '@/components/common/MemberCardImage.vue'

interface Props {
  visible: boolean
  member?: Member
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
interface FormData {
  id: number
  name: string
  phone: string
  icNumber: string
  registerDate: string
  icStatus: string
  frontPicture: string
  backPicture: string
  note: string
  remainingPoints: number
  shopId: number
}

const form = ref<FormData>({
  id: 0,
  name: '',
  phone: '',
  icNumber: '',
  registerDate: '',
  icStatus: '正常',
  frontPicture: '',
  backPicture: '',
  note: '',
  remainingPoints: 0,
  shopId: 0
})

// 用于存储原始图片UUID
const originalPictures = ref({
  frontPicture: '',
  backPicture: ''
})

// 监听会员数据变化
watch(
  () => props.member,
  async newMember => {
    if (newMember) {
      form.value = {
        id: newMember.id,
        name: newMember.name,
        phone: newMember.phone,
        icNumber: newMember.icNumber,
        registerDate: newMember.registerDate,
        icStatus: newMember.icStatus,
        frontPicture: newMember?.frontPicture || '',
        backPicture: newMember?.backPicture || '',
        note: newMember.note || '',
        remainingPoints: newMember.remainingPoints,
        shopId: newMember.shopId || 0
      }

      // 保存原始图片UUID以便后续比较
      originalPictures.value = {
        frontPicture: newMember?.frontPicture || '',
        backPicture: newMember?.backPicture || ''
      }

      // 加载图片为base64
      await loadImagesAsBase64()
    }
  },
  { immediate: true, deep: true }
)

// 将UUID格式的图片加载为base64
const loadImagesAsBase64 = async () => {
  try {
    // 处理正面图片
    if (form.value.frontPicture && !isBase64Image(form.value.frontPicture)) {
      console.log('加载正面图片为base64')
      form.value.frontPicture = await fetchImageAsBase64(form.value.id, form.value.frontPicture)
    }

    // 处理背面图片
    if (form.value.backPicture && !isBase64Image(form.value.backPicture)) {
      console.log('加载背面图片为base64')
      form.value.backPicture = await fetchImageAsBase64(form.value.id, form.value.backPicture)
    }
  } catch (error) {
    console.error('加载图片失败:', error)
    ElMessage.error('加载图片失败')
  }
}

// 通过UUID获取图片并转换为base64
const fetchImageAsBase64 = async (memberId: number, imageUuid: string): Promise<string> => {
  try {
    const response = await fetch(`/api/memberships/${memberId}/images/${imageUuid}`, {
      headers: {
        Authorization: localStorage.getItem('token') || ''
      }
    })

    if (!response.ok) {
      throw new Error('图片获取失败')
    }

    const blob = await response.blob()
    return readBlobAsBase64(blob)
  } catch (error) {
    console.error('获取图片失败:', error)
    return ''
  }
}

// 将Blob转换为base64
const readBlobAsBase64 = (blob: Blob): Promise<string> => {
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
    reader.readAsDataURL(blob)
  })
}

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
  icStatus: [{ required: true, message: '请选择卡片状态', trigger: 'change' }]
}

// 处理图片变更
const handleImageChange = async (file: UploadFile, side: 'frontPicture' | 'backPicture') => {
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

  try {
    // 将图片转换为base64
    const imageBase64 = await readFileAsBase64(file.raw)

    // 直接更新表单数据，显示base64图片
    form.value[side] = imageBase64

    // 在表单提交时会统一处理图片上传和UUID获取
  } catch (error) {
    console.error('上传图片失败:', error)
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
  form.value[side] = ''
}

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    console.log('开始提交会员编辑表单...')
    console.log('表单原始数据:', form.value)

    // 检查是否有shopId，如果没有则从localStorage获取
    if (!form.value.shopId) {
      const shopInfoStr = localStorage.getItem('shopInfo')
      if (shopInfoStr) {
        const shopInfo = JSON.parse(shopInfoStr)
        form.value.shopId = shopInfo.id
      }

      // 如果仍然没有shopId，尝试从用户信息获取
      if (!form.value.shopId) {
        const userInfoStr = localStorage.getItem('user')
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr)
          form.value.shopId = userInfo.shopId || 0
        }
      }
    }

    // 将表单数据转换为符合后端格式的对象 - 避免嵌套结构
    const submitData = {
      shopId: form.value.shopId,
      name: form.value.name,
      phone: form.value.phone,
      icStatus: form.value.icStatus,
      note: form.value.note || '',
      // 确保传递的是base64格式的图片数据
      frontPicture: form.value?.frontPicture || '',
      backPicture: form.value?.backPicture || ''
    }

    // 详细打印提交数据
    console.log('提交数据:', JSON.stringify(submitData, null, 2))
    console.log('icStatus:', submitData.icStatus)
    console.log('shopId:', submitData.shopId) // 特别打印shopId
    console.log(
      'Base64图片长度 - 正面:',
      submitData.frontPicture ? submitData.frontPicture.length : 0
    )
    console.log(
      'Base64图片长度 - 背面:',
      submitData.backPicture ? submitData.backPicture.length : 0
    )

    // 更新会员
    console.log('调用API: updateMember, ID:', form.value.id.toString())
    const response = await memberApi.updateMember(form.value.id.toString(), submitData)
    console.log('API响应:', response)

    // 修复类型错误：直接使用response作为会员数据
    const updatedMember = response as unknown as Member

    console.log('更新成功，返回的会员数据:', updatedMember)

    emit('success', updatedMember)
    handleClose()
    ElMessage.success('会员更新成功')
  } catch (error) {
    console.error('表单提交失败:', error)
    if (error !== 'cancel') {
      console.error('错误详情:', error)
      ElMessage.error(error instanceof Error ? error.message : '更新会员失败')
    }
  } finally {
    loading.value = false
    console.log('表单提交流程结束')
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
    icNumber: '',
    registerDate: '',
    icStatus: '正常',
    frontPicture: '',
    backPicture: '',
    note: '',
    remainingPoints: 0,
    shopId: 0
  }
  formRef.value?.resetFields()
}

// 在 script setup 部分添加以下函数
const isBase64Image = (str: string): boolean => {
  return str?.startsWith('data:image/')
}

// 确保组件挂载时加载图片
onMounted(async () => {
  if (props.member) {
    await loadImagesAsBase64()
  }
})
</script>

<style scoped>
/* 输入框样式 */
:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: none !important;
  border: 1px solid #e5e7eb !important;
  background-color: white !important;
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
