<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl w-[880px] max-h-[90vh] flex flex-col shadow-2xl">
      <div class="flex justify-between items-center py-5 px-8 border-b border-gray-100">
        <h3 class="text-xl font-medium flex items-center gap-3">
          <font-awesome-icon icon="box-open" class="text-blue-600" />
          <span>{{ editMode ? '编辑商品' : '添加商品' }}</span>
        </h3>
        <button
          class="!rounded-button w-8 h-8 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          @click="handleClose"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-8">
        <div class="flex gap-8">
          <div class="flex-1 space-y-6">
            <div class="bg-gray-50 p-6 rounded-xl space-y-5">
              <h4 class="font-medium flex items-center gap-2 text-gray-700">
                <font-awesome-icon icon="info-circle" class="text-blue-500" />
                基本信息
              </h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">商品名称</label>
                <div class="relative">
                  <font-awesome-icon icon="tag" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入商品名称"
                  >
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="relative" ref="storeDropdownRef">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">所属店铺</label>
                  <div class="relative">
                    <button
                      type="button"
                      class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                      @click.stop="showStoreDropdown = !showStoreDropdown"
                    >
                      <div class="flex items-center gap-2">
                        <font-awesome-icon icon="store" class="text-gray-400" />
                        <span class="text-gray-700">{{ selectedStoresText }}</span>
                      </div>
                      <font-awesome-icon icon="chevron-down" class="text-gray-400" />
                    </button>

                    <div
                      v-if="showStoreDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                      <div class="p-2 border-b border-gray-100">
                        <label
                          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          :class="{ 'bg-gray-50': isAllStoresSelected || isIndeterminate }"
                        >
                          <div
                            class="w-4 h-4 border border-gray-300 rounded"
                            :class="{
                              'bg-blue-500 border-blue-500': isAllStoresSelected,
                              'bg-blue-500 border-blue-500 opacity-50': isIndeterminate
                            }"
                          >
                            <font-awesome-icon v-if="isAllStoresSelected" icon="check" class="text-xs text-white" />
                            <div v-if="isIndeterminate" class="w-2 h-2 bg-white mx-auto mt-1"></div>
                          </div>
                          <span class="text-sm font-medium text-gray-700">全选</span>
                          <input
                            type="checkbox"
                            class="hidden"
                            :checked="isAllStoresSelected"
                            :indeterminate="isIndeterminate"
                            @change="handleSelectAllStores"
                          >
                        </label>
                      </div>

                      <div class="max-h-[240px] overflow-y-auto p-2 space-y-1 store-dropdown">
                        <label
                          v-for="store in stores"
                          :key="store.id"
                          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          :class="{ 'bg-gray-50': form.storeIds.includes(store.id) }"
                        >
                          <div
                            class="w-4 h-4 border border-gray-300 rounded"
                            :class="{ 'bg-blue-500 border-blue-500': form.storeIds.includes(store.id) }"
                          >
                            <font-awesome-icon v-if="form.storeIds.includes(store.id)" icon="check" class="text-xs text-white" />
                          </div>
                          <span class="text-sm text-gray-700">{{ store.name }}</span>
                          <input
                            type="checkbox"
                            class="hidden"
                            :checked="form.storeIds.includes(store.id)"
                            @change="handleStoreSelect(store.id)"
                          >
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">商品分类</label>
                  <div class="relative">
                    <font-awesome-icon icon="tags" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      v-model="form.category"
                      class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option v-for="option in categoryOptions.slice(1)" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <font-awesome-icon icon="chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">积分价格</label>
                  <div class="relative">
                    <font-awesome-icon icon="coins" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model.number="form.price"
                      type="number"
                      class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入积分价格"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">库存数量</label>
                  <div class="relative">
                    <font-awesome-icon icon="cubes" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model.number="form.quantity"
                      type="number"
                      class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入库存数量"
                    >
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">商品描述</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入商品描述"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="w-[320px]">
            <div class="bg-gray-50 p-6 rounded-xl space-y-5">
              <h4 class="font-medium flex items-center gap-2 text-gray-700">
                <font-awesome-icon icon="image" class="text-blue-500" />
                商品图片
              </h4>
              
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer aspect-square flex flex-col items-center justify-center gap-4"
                @click="triggerFileInput"
                @dragover.prevent
                @drop.prevent="handleFileDrop"
              >
                <template v-if="!form.image">
                  <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <font-awesome-icon icon="cloud-upload-alt" class="text-3xl text-blue-500" />
                  </div>
                  <div class="text-center px-4">
                    <p class="text-sm font-medium text-gray-900">点击或拖拽上传图片</p>
                    <p class="text-xs text-gray-500 mt-1">支持 JPG、PNG 格式，最大 5MB</p>
                  </div>
                  <button class="!rounded-button px-6 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-2">
                    <font-awesome-icon icon="folder-open" />
                    <span>选择文件</span>
                  </button>
                </template>
                <template v-else>
                  <div class="relative w-full h-full p-2">
                    <img :src="form.image" class="w-full h-full object-contain rounded-lg" alt="商品图片">
                    <button
                      class="absolute top-2 right-2 w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                      @click.stop="form.image = ''"
                    >
                      <font-awesome-icon icon="times" />
                    </button>
                  </div>
                </template>
              </div>
              
              <p class="text-xs text-gray-500">
                <font-awesome-icon icon="info-circle" class="mr-1" />
                建议尺寸：800x800px，支持 JPG、PNG 格式
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-4 px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <button
          class="!rounded-button px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          @click="handleClose"
        >
          <font-awesome-icon icon="times" />
          <span>取消</span>
        </button>
        <button
          class="!rounded-button px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
          @click="handleSubmit"
        >
          <font-awesome-icon icon="check" />
          <span>{{ editMode ? '保存修改' : '确认添加' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { productApi } from '@/api/admin/product'
import type { CreateProductRequest, UpdateProductRequest, ProductCategoryType, Product } from '@/types/api/admin/product'

export interface ProductForm {
  name: string
  storeIds: number[]
  price: number
  image: string
  quantity: number
  category: ProductCategoryType
  description: string
  status?: '在售' | '下架' | '缺货'
}

interface Props {
  show: boolean
  editMode: boolean
  productData?: Product | null
  stores: { id: number; name: string }[]
  categoryOptions: { label: string; value: ProductCategoryType }[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'submit', value: ProductForm): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const storeDropdownRef = ref<HTMLDivElement | null>(null)
const form = ref<ProductForm>({
  name: '',
  storeIds: [],
  price: 0,
  image: '',
  quantity: 0,
  category: 'digital',
  description: ''
})

const showStoreDropdown = ref(false)

const isAllStoresSelected = computed(() => {
  return props.stores.length > 0 && form.value.storeIds.length === props.stores.length
})

const isIndeterminate = computed(() => {
  return form.value.storeIds.length > 0 && form.value.storeIds.length < props.stores.length
})

const selectedStoresText = computed(() => {
  if (form.value.storeIds.length === 0) return '请选择店铺'
  if (form.value.storeIds.length === props.stores.length) return '全部店铺'
  return `已选 ${form.value.storeIds.length} 个店铺`
})

const handleSelectAllStores = () => {
  if (isAllStoresSelected.value) {
    form.value.storeIds = []
  } else {
    form.value.storeIds = props.stores.map(store => store.id)
  }
}

const handleStoreSelect = (storeId: number) => {
  const index = form.value.storeIds.indexOf(storeId)
  if (index === -1) {
    form.value.storeIds.push(storeId)
  } else {
    form.value.storeIds.splice(index, 1)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (storeDropdownRef.value && !storeDropdownRef.value.contains(target)) {
    showStoreDropdown.value = false
  }
}

onMounted(() => {
  if (props.editMode && props.productData) {
    form.value = {
      ...form.value,
      ...props.productData
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

// 表单验证规则
const validateForm = (form: ProductForm): string | null => {
  if (!form.name.trim()) return '请输入商品名称'
  if (form.storeIds.length === 0) return '请选择所属店铺'
  if (!form.category) return '请选择商品分类'
  if (form.price <= 0) return '请输入有效的积分价格'
  if (form.quantity < 0) return '请输入有效的库存数量'
  if (!form.description.trim()) return '请输入商品描述'
  if (!form.image) return '请上传商品图片'
  return null
}

// 处理图片上传
const handleImageUpload = async (file: File): Promise<string> => {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('图片大小不能超过 5MB')
  }

  const allowedTypes = ['image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('只支持 JPG、PNG 格式的图片')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
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

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    try {
      form.value.image = await handleImageUpload(input.files[0])
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '图片上传失败')
    }
  }
}

const handleFileDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file) {
    try {
      form.value.image = await handleImageUpload(file)
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '图片上传失败')
    }
  }
}

const handleClose = () => {
  emit('update:show', false)
}

const handleSubmit = async () => {
  const error = validateForm(form.value)
  if (error) {
    ElMessage.warning(error)
    return
  }

  try {
    const productData: CreateProductRequest = {
      ...form.value,
      status: '在售'
    }

    if (props.editMode && props.productData?.id) {
      await productApi.updateProduct(props.productData.id, productData as UpdateProductRequest)
      ElMessage.success('商品更新成功')
    } else {
      await productApi.createProduct(productData)
      ElMessage.success('商品添加成功')
    }

    emit('submit', form.value)
    handleClose()
  } catch (error) {
    console.error('Failed to save product:', error)
    ElMessage.error(props.editMode ? '更新商品失败' : '添加商品失败')
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 下拉列表滚动条样式 */
.store-dropdown::-webkit-scrollbar {
  width: 6px;
}

.store-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.store-dropdown::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.store-dropdown::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 