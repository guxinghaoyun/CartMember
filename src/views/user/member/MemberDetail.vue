<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="会员详情"
    width="580px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="space-y-8">
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
            <div class="flex">
              <span class="text-gray-500 w-20 flex-shrink-0">姓名</span>
              <span class="text-gray-900">{{ member?.name }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-500 w-20 flex-shrink-0">手机号</span>
              <span class="text-gray-900">{{ member?.phone }}</span>
            </div>
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
            <div class="flex">
              <span class="text-gray-500 w-20 flex-shrink-0">IC卡号</span>
              <span class="text-gray-900">{{ member?.icNumber }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-500 w-20 flex-shrink-0">注册时间</span>
              <span class="text-gray-900">{{ member?.registerDate }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-500 w-20 flex-shrink-0">卡片状态</span>
              <span
                class="inline-flex items-center px-3 py-1 rounded-lg text-sm"
                :class="member?.icStatus ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
              >
                <span
                  class="w-2 h-2 mr-2 rounded-full"
                  :class="member?.icStatus ? 'bg-green-500' : 'bg-red-500'"
                ></span>
                {{ member?.icStatus ? '正常' : '停用' }}
              </span>
            </div>
            <div class="flex">
              <span class="text-gray-500 w-20 flex-shrink-0">剩余积分</span>
              <span class="text-gray-900">
                <span class="text-orange-500 font-medium">{{ member?.remainingPoints || 0 }}</span>
                分
              </span>
            </div>
            <div v-if="member?.frontPicture || member?.backPicture" class="space-y-4">
              <div class="flex">
                <span class="text-gray-500 w-20 flex-shrink-0">IC卡图片</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <!-- 正面 -->
                <div v-if="member?.frontPicture" class="space-y-2">
                  <div class="text-sm text-gray-500">正面</div>
                  <div
                    class="border border-gray-200 rounded-lg p-2 bg-white h-[190px] flex items-center justify-center cursor-pointer"
                    @click="showImagePreview(member?.frontPicture)"
                  >
                    <member-card-image
                      :member-id="member.id"
                      :image-uuid="member.frontPicture"
                      alt="IC卡正面"
                    />
                  </div>
                </div>
                <!-- 背面 -->
                <div v-if="member?.backPicture" class="space-y-2">
                  <div class="text-sm text-gray-500">背面</div>
                  <div
                    class="border border-gray-200 rounded-lg p-2 bg-white h-[190px] flex items-center justify-center cursor-pointer"
                    @click="showImagePreview(member?.backPicture)"
                  >
                    <member-card-image
                      :member-id="member.id"
                      :image-uuid="member.backPicture"
                      alt="IC卡背面"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 剩余商品 -->
      <div v-if="member?.remainingProducts?.length" class="space-y-4">
        <h3 class="text-base font-medium text-gray-900 flex items-center">
          <div class="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center mr-2">
            <font-awesome-icon icon="box" class="text-yellow-500" />
          </div>
          剩余商品
        </h3>
        <div class="bg-gray-50 rounded-lg p-5">
          <el-collapse>
            <el-collapse-item>
              <template #title>
                <div class="flex items-center text-gray-900">
                  <font-awesome-icon icon="list" class="mr-2 text-gray-500" />
                  共 {{ member.remainingProducts.length }} 种商品
                  <span class="ml-2 text-sm text-gray-500">(点击展开查看详情)</span>
                </div>
              </template>
              <div class="bg-white rounded-lg mt-2 divide-y divide-gray-100">
                <div
                  v-for="product in member.remainingProducts"
                  :key="product.id"
                  class="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <font-awesome-icon icon="gift" class="text-blue-500" />
                    </div>
                    <span class="text-gray-900">{{ product.name }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                      剩余
                      <span class="font-medium">{{ product.quantity }}</span>
                      件
                    </span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
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
          <div class="flex">
            <span class="text-gray-500 w-20 flex-shrink-0">备注</span>
            <span class="text-gray-900">{{ member?.note || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <el-button @click="handleClose" class="!border-gray-300">关闭</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 图片预览弹窗 -->
  <el-dialog
    v-model="previewVisible"
    title="IC卡照片预览"
    width="500px"
    class="image-preview-dialog"
  >
    <div class="flex justify-center">
      <member-card-image
        :member-id="member?.id || 0"
        :image-uuid="previewImageUuid"
        alt="IC卡照片"
        mode="contain"
        class="w-full object-contain max-h-[400px]"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Member } from '@/types/api/user/member'
import MemberCardImage from '@/components/common/MemberCardImage.vue'

interface Props {
  visible: boolean
  member?: Member
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

// 图片预览
const previewVisible = ref(false)
const previewImageUuid = ref('')

// 显示图片预览
const showImagePreview = (imageUuid: string | undefined) => {
  if (!imageUuid) return
  previewImageUuid.value = imageUuid
  previewVisible.value = true
}
</script>

<style scoped>
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

:deep(.image-preview-dialog) {
  .el-dialog__header {
    padding: 16px 16px 0;
  }

  .el-dialog__body {
    padding: 24px;
  }

  .el-dialog__footer {
    padding: 16px;
  }
}
</style>
