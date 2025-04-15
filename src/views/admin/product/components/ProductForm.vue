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
                  <font-awesome-icon
                    icon="tag"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入商品名称"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="relative" ref="storeDropdownRef">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">所属店铺</label>
                  <div class="relative">
                    <button
                      type="button"
                      class="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                      @click.stop="showStoreDropdown = !showStoreDropdown"
                    >
                      <div class="flex items-center gap-2 overflow-hidden">
                        <font-awesome-icon icon="store" class="text-blue-500 flex-shrink-0" />
                        <span class="text-gray-700 truncate">{{ selectedStoresText }}</span>
                      </div>
                      <font-awesome-icon icon="chevron-down" class="text-gray-400 flex-shrink-0" />
                    </button>

                    <div
                      v-if="showStoreDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                      <div class="max-h-[240px] overflow-y-auto p-2 space-y-1">
                        <div
                          v-for="store in stores"
                          :key="store.id"
                          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer w-full"
                          :class="{ 'bg-gray-50': form.storeIds === store.id }"
                          @click="handleStoreSelect(store.id)"
                        >
                          <div class="flex items-center gap-2 flex-1">
                            <font-awesome-icon
                              icon="store"
                              class="text-sm text-blue-500 flex-shrink-0"
                            />
                            <span class="text-sm text-gray-700 truncate">{{ store.name }}</span>
                          </div>
                          <div v-if="form.storeIds === store.id">
                            <font-awesome-icon icon="check" class="text-blue-500 text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">商品分类</label>
                  <div class="relative" ref="categoryDropdownRef">
                    <button
                      type="button"
                      class="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                      @click.stop="showCategoryDropdown = !showCategoryDropdown"
                    >
                      <div class="flex items-center gap-2 overflow-hidden">
                        <font-awesome-icon
                          :icon="getCategoryIcon(form.category)"
                          :class="getCategoryIconClass(form.category)"
                          class="flex-shrink-0"
                        />
                        <span class="text-gray-700 truncate">{{ selectedCategoryText }}</span>
                      </div>
                      <font-awesome-icon icon="chevron-down" class="text-gray-400 flex-shrink-0" />
                    </button>

                    <div
                      v-if="showCategoryDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                      <div class="max-h-[240px] overflow-y-auto p-2 space-y-1">
                        <div
                          v-for="option in categoryOptions.filter(o => o.value !== '')"
                          :key="option.value"
                          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer w-full"
                          :class="{ 'bg-gray-50': form.category === option.value }"
                          @click="handleCategorySelect(option.value)"
                        >
                          <div class="flex items-center gap-2 flex-1">
                            <font-awesome-icon
                              :icon="getCategoryIcon(option.value)"
                              :class="getCategoryIconClass(option.value)"
                              class="text-sm flex-shrink-0"
                            />
                            <span class="text-sm text-gray-700 truncate">{{ option.label }}</span>
                          </div>
                          <div v-if="form.category === option.value">
                            <font-awesome-icon icon="check" class="text-blue-500 text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">积分价格</label>
                  <div class="relative">
                    <font-awesome-icon
                      icon="coins"
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      :value="form.price === 0 ? '' : form.price"
                      type="number"
                      class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入积分价格"
                      @focus="handlePriceFocus"
                      @blur="handlePriceBlur"
                      @input="e => handlePriceInput(e)"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">库存数量</label>
                  <div class="relative">
                    <font-awesome-icon
                      icon="cubes"
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      :value="form.quantity === 0 ? '' : form.quantity"
                      type="number"
                      class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入库存数量"
                      @focus="handleQuantityFocus"
                      @blur="handleQuantityBlur"
                      @input="e => handleQuantityInput(e)"
                    />
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
                  <button
                    class="!rounded-button px-6 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-2"
                    @click.stop="triggerFileInput"
                  >
                    <font-awesome-icon icon="folder-open" />
                    <span>选择图片</span>
                  </button>
                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/jpeg,image/png"
                    class="hidden"
                    @change="handleFileChange"
                  />
                </template>
                <template v-else-if="isExistingImageUuid">
                  <div class="relative w-full h-full p-2">
                    <product-image
                      :product-id="props.productData?.id || 0"
                      :image-uuid="props.productData?.productImageUuid || ''"
                      class="w-full h-full object-contain rounded-lg"
                      alt="商品图片"
                    />
                    <button
                      class="absolute top-2 right-2 w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                      @click.stop="form.image = ''"
                    >
                      <font-awesome-icon icon="times" />
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="relative w-full h-full p-2">
                    <img
                      :src="form.image"
                      class="w-full h-full object-contain rounded-lg"
                      alt="商品图片"
                    />
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

      <div
        class="flex justify-end gap-4 px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl"
      >
        <button
          class="rounded-lg px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          @click="handleClose"
        >
          <font-awesome-icon icon="times" />
          <span>取消</span>
        </button>
        <button
          class="rounded-lg px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
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
import type { ProductCategoryType, Product } from '@/types/api/admin/product'
import ProductImage from '@/components/common/ProductImage.vue'

export interface ProductForm {
  name: string
  storeIds: number
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
const categoryDropdownRef = ref<HTMLDivElement | null>(null)
const form = ref<ProductForm>({
  name: '',
  storeIds: 0,
  price: 0,
  image: '',
  quantity: 0,
  category: 'digital',
  description: ''
})

const showStoreDropdown = ref(false)
const showCategoryDropdown = ref(false)

const isAllStoresSelected = computed(() => {
  return props.stores.length > 0 && form.value.storeIds === props.stores[0].id
})

const isIndeterminate = computed(() => {
  return false
})

const selectedStoresText = computed(() => {
  if (form.value.storeIds === 0) return '请选择店铺'
  return props.stores.find(store => store.id === form.value.storeIds)?.name || '请选择店铺'
})

const selectedCategoryText = computed(() => {
  if (!form.value.category) return '请选择商品分类'
  return (
    props.categoryOptions.find(option => option.value === form.value.category)?.label ||
    '请选择商品分类'
  )
})

const handleSelectAllStores = () => {
  if (isAllStoresSelected.value) {
    form.value.storeIds = 0
  } else {
    form.value.storeIds = props.stores[0].id
  }
}

const handleStoreSelect = (storeId: number) => {
  form.value.storeIds = storeId
  showStoreDropdown.value = false
}

const handleCategorySelect = (category: ProductCategoryType) => {
  form.value.category = category
  showCategoryDropdown.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (storeDropdownRef.value && !storeDropdownRef.value.contains(target)) {
    showStoreDropdown.value = false
  }
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(target)) {
    showCategoryDropdown.value = false
  }
}

onMounted(() => {
  if (props.editMode && props.productData) {
    // 转换Product对象的storeIds数组为单个值
    const storeId =
      props.productData.storeIds && props.productData.storeIds.length > 0
        ? props.productData.storeIds[0]
        : 0

    form.value = {
      ...form.value,
      name: props.productData.name,
      price: props.productData.price,
      quantity: props.productData.quantity,
      category: props.productData.category,
      image: props.productData.image,
      description: props.productData.description,
      storeIds: storeId
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
  if (form.storeIds === 0) return '请选择所属店铺'
  if (!form.category) return '请选择商品分类'
  if (form.price <= 0) return '请输入有效的积分价格'
  if (form.quantity < 0) return '请输入有效的库存数量'
  if (!form.description.trim()) return '请输入商品描述'
  // 图片上传是可选的
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

  // 提交表单数据，让父组件处理API调用
  emit('submit', form.value)
  handleClose()
}

const handlePriceFocus = () => {
  if (form.value.price === 0) {
    const priceInput = document.querySelector(
      'input[placeholder="请输入积分价格"]'
    ) as HTMLInputElement
    if (priceInput) {
      priceInput.value = ''
    }
  }
}

const handlePriceBlur = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement
  const value = parseFloat(input.value)
  if (isNaN(value) || value < 0) {
    form.value.price = 0
    input.value = '0'
  } else {
    form.value.price = value
  }
}

const handleQuantityFocus = () => {
  if (form.value.quantity === 0) {
    const quantityInput = document.querySelector(
      'input[placeholder="请输入库存数量"]'
    ) as HTMLInputElement
    if (quantityInput) {
      quantityInput.value = ''
    }
  }
}

const handleQuantityBlur = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value)
  if (isNaN(value) || value < 0) {
    form.value.quantity = 0
    input.value = '0'
  } else {
    form.value.quantity = value
  }
}

const handlePriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = parseFloat(input.value)
  if (isNaN(value) || value < 0) {
    form.value.price = 0
    input.value = '0'
  } else {
    form.value.price = value
  }
}

const handleQuantityInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value = parseInt(input.value)
  if (isNaN(value) || value < 0) {
    form.value.quantity = 0
    input.value = '0'
  } else {
    form.value.quantity = value
  }
}

// 判断是否是编辑模式下的已有图片UUID
const isExistingImageUuid = computed(() => {
  return (
    props.editMode &&
    props.productData &&
    props.productData.productImageUuid &&
    form.value.image === props.productData.image
  )
})

// 根据分类获取对应的图标
const getCategoryIcon = (category: ProductCategoryType) => {
  switch (category) {
    case 'digital':
      return 'shopping-cart'
    case 'office':
      return 'pencil-alt'
    case 'life':
      return 'tags'
    case 'gift':
      return 'credit-card'
    default:
      return 'tag'
  }
}

// 根据分类获取图标的颜色类
const getCategoryIconClass = (category: ProductCategoryType) => {
  switch (category) {
    case 'digital':
      return 'text-blue-500'
    case 'office':
      return 'text-green-500'
    case 'life':
      return 'text-orange-500'
    case 'gift':
      return 'text-purple-500'
    default:
      return 'text-gray-400'
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
