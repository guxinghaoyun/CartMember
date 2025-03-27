<template>
  <div class="member-card-image-container" :class="{ 'is-loading': loading }">
    <img
      v-if="imageUrl && !error"
      :src="imageUrl"
      :alt="alt"
      class="member-card-image w-full h-full object-contain"
      :class="imageClass"
      @error="handleError"
    />
    <div v-else-if="loading" class="member-card-image-placeholder loading">
      <div class="loading-spinner"></div>
    </div>
    <div v-else class="member-card-image-placeholder error">
      <font-awesome-icon icon="credit-card" class="text-gray-400" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { memberApi } from '@/api/user/member'

const props = defineProps({
  memberId: { type: Number, default: 0 },
  imageUuid: { type: String, default: '' },
  imageUrl: { type: String, default: '' }, // 直接传入图片URL或base64
  alt: { type: String, default: 'IC卡图片' },
  imageClass: { type: String, default: '' },
  mode: { type: String, default: 'contain' } // contain, cover, fill
})

const internalImageUrl = ref('')
const loading = ref(true)
const error = ref(false)

// 计算实际显示的图片URL
const imageUrl = computed(() => {
  // 如果直接提供了imageUrl，优先使用
  if (props.imageUrl) {
    return props.imageUrl
  }
  // 否则使用内部加载的URL
  return internalImageUrl.value
})

const loadImage = async () => {
  // 如果直接提供了imageUrl，则无需加载
  if (props.imageUrl) {
    loading.value = false
    error.value = false
    return
  }

  // 如果没有提供memberId或imageUuid，则显示错误状态
  if (!props.memberId || !props.imageUuid) {
    loading.value = false
    error.value = true
    return
  }

  loading.value = true
  error.value = false

  try {
    const url = await memberApi.getMemberCardImage(props.memberId, props.imageUuid)
    internalImageUrl.value = url
    loading.value = false
  } catch (e) {
    console.error('加载IC卡图片失败', e)
    error.value = true
    loading.value = false
  }
}

const handleError = () => {
  error.value = true
}

watch(
  () => [props.memberId, props.imageUuid, props.imageUrl],
  () => {
    loadImage()
  }
)

onMounted(() => {
  loadImage()
})
</script>

<style scoped>
.member-card-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 8rem; /* 128px = 8rem */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.member-card-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: v-bind('props.mode');
}

.member-card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.5rem;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 123, 255, 0.3);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
