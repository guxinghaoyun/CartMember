<template>
  <div class="product-image-container" :class="{ 'is-loading': loading }">
    <img
      v-if="imageUrl && !error"
      :src="imageUrl"
      :alt="alt"
      class="product-image"
      :class="imageClass"
      @error="handleError"
    />
    <div v-else-if="loading" class="product-image-placeholder loading">
      <div class="loading-spinner"></div>
    </div>
    <div v-else class="product-image-placeholder error">
      <font-awesome-icon icon="image" class="text-gray-400" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { productApi } from '@/api/admin/product'

const props = defineProps({
  productId: { type: Number, required: true },
  imageUuid: { type: String, default: '' },
  alt: { type: String, default: '商品图片' },
  imageClass: { type: String, default: '' }
})

const imageUrl = ref('')
const loading = ref(true)
const error = ref(false)

const loadImage = async () => {
  if (!props.productId || !props.imageUuid) {
    loading.value = false
    error.value = true
    return
  }

  loading.value = true
  error.value = false

  try {
    const url = await productApi.getProductImage(props.productId, props.imageUuid)
    imageUrl.value = url
    loading.value = false
  } catch (e) {
    console.error('加载图片失败', e)
    error.value = true
    loading.value = false
  }
}

const handleError = () => {
  error.value = true
}

watch(
  () => [props.productId, props.imageUuid],
  () => {
    loadImage()
  }
)

onMounted(() => {
  loadImage()
})
</script>

<style scoped>
.product-image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
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
