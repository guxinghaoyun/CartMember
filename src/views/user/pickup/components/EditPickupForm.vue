<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑提货单"
    width="1200px"
    class="pickup-form-dialog"
    @close="handleClose">
    <div class="flex space-x-6">
      <!-- 左侧表单区域 -->
      <div class="w-[500px] flex-shrink-0">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="space-y-6">
          <!-- 会员信息 -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-medium text-gray-800 flex items-center">
                <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <i class="fas fa-user text-blue-500"></i>
                </div>
                会员信息
              </h3>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="text-sm text-gray-600">
                <span class="font-medium">{{ editData?.memberName }}</span>
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium">{{ editData?.memberPhone }}</span>
              </div>
            </div>
          </div>

          <!-- 提货信息 -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 class="text-base font-medium text-gray-800 flex items-center mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <font-awesome-icon icon="truck" class="text-green-500" />
              </div>
              提货信息
            </h3>
            <el-form-item label="提货方式" prop="deliveryType">
              <el-radio-group v-model="form.deliveryType" class="flex space-x-4">
                <el-radio-button label="store" class="!flex-1">
                  <div class="flex items-center justify-center py-2 space-x-2">
                    <font-awesome-icon icon="store" class="text-lg" />
                    <span>门店自提</span>
                  </div>
                </el-radio-button>
                <el-radio-button label="delivery" class="!flex-1">
                  <div class="flex items-center justify-center py-2 space-x-2">
                    <font-awesome-icon icon="truck" class="text-lg" />
                    <span>快递配送</span>
                  </div>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            
            <!-- 配送地址（当选择快递配送时显示） -->
            <el-form-item 
              v-if="form.deliveryType === 'delivery'" 
              label="配送地址" 
              prop="deliveryAddress"
              :rules="[
                { required: true, message: '请输入配送地址', trigger: 'blur' }
              ]">
              <el-input
                v-model="form.deliveryAddress"
                type="textarea"
                :rows="2"
                placeholder="请输入详细配送地址"
                class="!rounded-xl"/>
            </el-form-item>

            <el-form-item label="提货时间" prop="pickupTime">
              <el-date-picker
                v-model="form.pickupTime"
                type="datetime"
                placeholder="选择提货时间"
                :disabled-date="disabledDate"
                :disabled-hours="disabledHours"
                class="!w-full"/>
            </el-form-item>
          </div>

          <!-- 操作员信息 -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 class="text-base font-medium text-gray-800 flex items-center mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                <font-awesome-icon icon="user-cog" class="text-purple-500" />
              </div>
              操作员信息
            </h3>
            <div class="space-y-4">
              <el-form-item label="操作员" prop="operator">
                <el-select v-model="form.operator" placeholder="请选择操作员" class="!w-full">
                  <el-option
                    v-for="op in operators"
                    :key="op"
                    :label="op"
                    :value="op"/>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="notes" class="!mb-0">
                <el-input
                  v-model="form.notes"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入备注信息"
                  class="!rounded-xl !text-base notes-textarea"/>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>

      <!-- 右侧商品区域 -->
      <div class="flex-1 space-y-6">
        <!-- 会员可提商品 -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700 flex items-center">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center mr-2">
                <font-awesome-icon icon="box-open" class="text-blue-500 text-sm" />
              </div>
              可提商品
            </h4>
            <span class="text-xs bg-blue-50 text-blue-500 px-3 py-1.5 rounded-full">
              {{ memberProducts.length }} 件商品可提
            </span>
          </div>
          <div class="h-[300px] overflow-y-auto custom-scrollbar bg-gray-50/50 rounded-xl border border-gray-100/50">
            <div class="space-y-2 p-3">
              <div v-if="memberProducts.length === 0" 
                   class="h-[280px] flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <font-awesome-icon icon="box-open" class="text-gray-300 text-2xl" />
                  </div>
                  <div>暂无可提商品</div>
                </div>
              </div>
              <template v-else>
                <div v-for="product in memberProducts" 
                     :key="product.id"
                     class="flex items-center justify-between bg-white p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-sm group">
                  <div class="flex items-center space-x-4">
                    <el-image
                      :src="product.image"
                      class="w-12 h-12 object-cover rounded-xl flex-shrink-0 border border-gray-100"
                      fit="cover">
                      <template #error>
                        <div class="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                          <font-awesome-icon icon="image" class="text-gray-300 text-xl" />
                        </div>
                      </template>
                    </el-image>
                    <div class="min-w-0">
                      <div class="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-200">{{ product.name }}</div>
                      <div class="text-xs text-gray-500 mt-1 flex items-center space-x-3">
                        <span class="flex items-center">
                          <font-awesome-icon icon="barcode" class="text-gray-400 mr-1" />
                          {{ product.sku }}
                        </span>
                        <span class="flex items-center">
                          <font-awesome-icon icon="cube" class="text-gray-400 mr-1" />
                          可提: {{ product.availableQuantity }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    class="flex items-center px-4 py-2 rounded-lg transition-all duration-200 space-x-1"
                    :class="[
                      isProductAdded(product.id)
                        ? 'bg-green-50 text-green-600 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    ]"
                    :disabled="isProductAdded(product.id)"
                    @click="addToPickupList(product)">
                    <template v-if="isProductAdded(product.id)">
                      <font-awesome-icon icon="check" class="text-green-500" />
                      <span>已添加</span>
                    </template>
                    <template v-else>
                      <font-awesome-icon icon="plus" class="text-blue-500" />
                      <span>添加</span>
                    </template>
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 已选商品 -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-700 flex items-center">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg flex items-center justify-center mr-2">
                <font-awesome-icon icon="shopping-cart" class="text-blue-500 text-sm" />
              </div>
              已选商品
            </h4>
            <div class="flex items-center space-x-4 text-sm">
              <span class="text-gray-500 flex items-center">
                <font-awesome-icon icon="box" class="text-gray-400 mr-1" />
                总计: <span class="font-medium text-gray-700 ml-1">{{ form.items.length }}</span> 件
              </span>
              <span class="text-gray-500 flex items-center">
                <font-awesome-icon icon="cube" class="text-gray-400 mr-1" />
                数量: <span class="font-medium text-gray-700 ml-1">{{ totalQuantity }}</span>
              </span>
            </div>
          </div>
          
          <div class="h-[300px] overflow-y-auto custom-scrollbar bg-gray-50/50 rounded-xl border border-gray-100/50">
            <div class="space-y-2 p-3">
              <div v-if="form.items.length === 0" 
                   class="h-[280px] flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <font-awesome-icon icon="shopping-cart" class="text-gray-300 text-2xl" />
                  </div>
                  <div>请添加提货商品</div>
                </div>
              </div>
              <template v-else>
                <div v-for="(item, index) in form.items" 
                     :key="index" 
                     class="flex items-center space-x-4 bg-white p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:shadow-sm group">
                  <el-image
                    :src="item.image"
                    class="w-12 h-12 object-cover rounded-xl flex-shrink-0 border border-gray-100"
                    fit="cover">
                    <template #error>
                      <div class="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                        <font-awesome-icon icon="image" class="text-gray-300 text-xl" />
                      </div>
                    </template>
                  </el-image>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors duration-200">{{ item.name }}</div>
                    <div class="text-xs text-gray-500 mt-1 flex items-center">
                      <font-awesome-icon icon="barcode" class="text-gray-400 mr-1" />
                      {{ item.sku }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <el-input-number
                      v-model="item.quantity"
                      :min="1"
                      :max="item.maxQuantity || 99"
                      size="small"
                      class="flex-shrink-0"
                      @change="handleQuantityChange(item, $event)"/>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200" 
                            type="button"
                            @click.prevent="removeItem(index)">
                      <font-awesome-icon icon="times" />
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose" class="!px-6">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading" class="!px-6">
          保存
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
import type { 
  PickupOrder,
  PickupOrderItem,
  UpdatePickupOrderRequest, 
  MemberPickupProduct,
  PickupMethod
} from '@/types/api/user/pickup'
import type { ApiResponse } from '@/types/api/common'
import { pickupApi } from '@/api/user/pickup'

interface Props {
  visible: boolean
  editData: PickupOrder | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', data: UpdatePickupOrderRequest): void
}

// 扩展的表单数据类型
interface PickupFormData {
  deliveryType: PickupMethod
  deliveryAddress?: string
  pickupTime: string
  operator: string
  notes?: string
  items: PickupOrderItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

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
const form = ref<PickupFormData>({
  deliveryType: 'store',
  pickupTime: '',
  operator: '',
  items: []
})

// 会员可提商品列表
const memberProducts = ref<MemberPickupProduct[]>([])

// 计算总数量
const totalQuantity = computed(() => {
  return form.value.items.reduce((total, item) => total + item.quantity, 0)
})

// 禁用过去的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7 // 禁用今天之前的日期
}

// 禁用营业时间外的小时
const disabledHours = () => {
  return Array.from({ length: 24 }).map((_, i) => i).filter(h => h < 9 || h > 21)
}

// 检查商品是否已添加到提货列表
const isProductAdded = (productId: number) => {
  return form.value.items.some(item => item.id === productId)
}

// 添加到提货列表
const addToPickupList = (product: MemberPickupProduct) => {
  if (!isProductAdded(product.id)) {
    form.value.items.push({
      id: product.id,
      name: product.name,
      sku: product.sku,
      image: product.image,
      quantity: 1,
      maxQuantity: product.availableQuantity,
      originalQuantity: product.availableQuantity // 保存原始可提数量
    })
    // 更新可提商品的可提数量
    const memberProduct = memberProducts.value.find(p => p.id === product.id)
    if (memberProduct) {
      memberProduct.availableQuantity = product.availableQuantity - 1
    }
    ElMessage.success(`已添加商品：${product.name}`)
  }
}

// 移除商品
const removeItem = (index: number) => {
  const removedItem = form.value.items[index]
  // 恢复可提商品的可提数量
  const memberProduct = memberProducts.value.find(p => p.id === removedItem.id)
  if (memberProduct) {
    memberProduct.availableQuantity = removedItem.originalQuantity
  }
  form.value.items.splice(index, 1)
}

// 表单校验规则
const rules: FormRules = {
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
    const formData: PickupFormData = {
      deliveryType: newData.deliveryType,
      deliveryAddress: newData.deliveryAddress,
      pickupTime: newData.pickupTime,
      operator: newData.operator,
      notes: newData.notes,
      items: newData.items.map(item => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        image: item.image,
        quantity: item.quantity,
        maxQuantity: item.maxQuantity,
        originalQuantity: item.originalQuantity
      }))
    }
    form.value = formData
  }
}, { immediate: true, deep: true })

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 转换表单数据为提交格式
    const submitData: UpdatePickupOrderRequest = {
      deliveryType: form.value.deliveryType,
      deliveryAddress: form.value.deliveryAddress,
      pickupTime: form.value.pickupTime,
      operator: form.value.operator,
      notes: form.value.notes,
      items: form.value.items.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    }
    
    emit('submit', submitData)
    handleClose()
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
  const emptyForm: PickupFormData = {
    deliveryType: 'store',
    pickupTime: '',
    operator: '',
    items: []
  }
  form.value = emptyForm
  if (formRef.value) {
    formRef.value.resetFields()
  }
  memberProducts.value = []
}

// 修改商品数量时检查限制
const handleQuantityChange = (item: PickupOrderItem, value: number) => {
  const memberProduct = memberProducts.value.find(p => p.id === item.id)
  if (!memberProduct) return

  // 检查新数量是否超过原始可提数量
  if (value > item.originalQuantity) {
    item.quantity = item.originalQuantity
    memberProduct.availableQuantity = 0
    ElMessage.warning(`该商品最多可提 ${item.originalQuantity} 件`)
    return
  }

  // 确保数量不小于1
  if (value < 1) {
    item.quantity = 1
    memberProduct.availableQuantity = item.originalQuantity - 1
    return
  }

  // 更新可提商品的可提数量
  memberProduct.availableQuantity = item.originalQuantity - value
  item.quantity = value
}
</script>

<style scoped>
.pickup-form-dialog {
  --el-dialog-padding-primary: 24px;
}

.pickup-form-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.pickup-form-dialog :deep(.el-dialog__title) {
  font-size: 1.125rem;
  font-weight: 500;
}

.pickup-form-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.pickup-form-dialog :deep(.el-dialog__footer) {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #D1D5DB;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 0 0 1px #e5e7eb;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 0 0 2px #e5e7eb;
}

:deep(.notes-textarea .el-textarea__inner) {
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.75rem;
  min-height: 120px !important;
}
</style> 