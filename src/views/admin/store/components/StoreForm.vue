<template>
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="handleClose"
  >
    <div
      class="bg-white rounded-2xl w-[800px] max-h-[90vh] flex flex-col shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.002]"
    >
      <!-- 头部 -->
      <div class="flex justify-between items-center py-6 px-8 border-b border-gray-100">
        <h3 class="text-xl font-medium flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105"
          >
            <font-awesome-icon
              :icon="props.viewMode ? 'eye' : editMode ? 'edit' : 'plus'"
              class="text-blue-600"
            />
          </div>
          <span>{{ props.viewMode ? '查看店铺详情' : editMode ? '编辑店铺' : '添加店铺' }}</span>
        </h3>
        <button
          class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-all duration-300 hover:rotate-90"
          @click="handleClose"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        <!-- 基本信息卡片 -->
        <div
          class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl space-y-5 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <h4 class="font-medium flex items-center gap-2 text-gray-700">
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <font-awesome-icon icon="info-circle" class="text-blue-500" />
            </div>
            基本信息
          </h4>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">店铺名称</label>
            <div class="relative">
              <font-awesome-icon
                icon="store"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="form.name"
                type="text"
                :disabled="props.viewMode"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'bg-gray-50': props.viewMode }"
                placeholder="请输入店铺名称"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">店铺位置</label>
            <div class="relative">
              <font-awesome-icon
                icon="map-marker-alt"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="form.location"
                type="text"
                :disabled="props.viewMode"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'bg-gray-50': props.viewMode }"
                placeholder="请输入店铺详细地址"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">店铺状态</label>
            <div class="relative">
              <font-awesome-icon
                icon="signal"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                v-model="form.status"
                :disabled="props.viewMode"
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                :class="{ 'bg-gray-50': props.viewMode }"
              >
                <option
                  v-for="status in storeStatusOptions"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
              <font-awesome-icon
                icon="chevron-down"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">店长姓名</label>
              <div class="relative">
                <font-awesome-icon
                  icon="user-tie"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  v-model="form.manager"
                  type="text"
                  :disabled="props.viewMode || props.editMode"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'bg-gray-50': props.viewMode || props.editMode }"
                  placeholder="请输入店长姓名"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">联系电话</label>
              <div class="relative">
                <font-awesome-icon
                  icon="phone"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  v-model="form.phone"
                  type="text"
                  :disabled="props.viewMode"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'bg-gray-50': props.viewMode }"
                  placeholder="请输入手机号码"
                  maxlength="11"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 店员信息卡片 -->
        <div
          class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl space-y-5 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <h4 class="font-medium flex items-center gap-2 text-gray-700">
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <font-awesome-icon icon="users" class="text-blue-500" />
            </div>
            店员信息
          </h4>

          <div class="space-y-3">
            <TransitionGroup name="list">
              <div
                v-for="(staff, index) in form.staffList"
                :key="index"
                class="flex gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-300 group"
              >
                <div class="flex-1">
                  <div class="relative">
                    <font-awesome-icon
                      icon="user"
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors"
                    />
                    <input
                      v-model="staff.name"
                      type="text"
                      :disabled="props.viewMode"
                      class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      :class="{ 'bg-gray-50': props.viewMode }"
                      placeholder="请输入店员姓名"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="relative">
                    <font-awesome-icon
                      icon="phone"
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors"
                    />
                    <input
                      v-model="staff.phone"
                      type="text"
                      :disabled="props.viewMode"
                      class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      :class="{ 'bg-gray-50': props.viewMode }"
                      placeholder="请输入联系电话"
                      maxlength="11"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <div class="relative">
                    <font-awesome-icon
                      icon="briefcase"
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors"
                    />
                    <select
                      v-model="staff.position"
                      :disabled="props.viewMode"
                      class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-300"
                      :class="{ 'bg-gray-50': props.viewMode }"
                    >
                      <option
                        v-for="position in filteredPositions"
                        :key="position.value"
                        :value="position.value"
                      >
                        {{ position.label }}
                      </option>
                    </select>
                    <font-awesome-icon
                      icon="chevron-down"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
                <button
                  v-if="form.staffList.length > 1 && !props.viewMode"
                  class="w-10 h-10 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                  @click="removeStaff(index)"
                  type="button"
                >
                  <font-awesome-icon icon="trash-alt" />
                </button>
              </div>
            </TransitionGroup>

            <button
              v-if="!props.viewMode"
              class="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-300 text-gray-500 hover:text-blue-500 transition-all duration-300 hover:shadow-sm hover:scale-[1.01] flex items-center justify-center gap-2"
              @click="addStaff"
              type="button"
            >
              <font-awesome-icon
                icon="plus"
                class="transform group-hover:rotate-180 transition-transform duration-300"
              />
              <span>添加店员</span>
            </button>
          </div>
        </div>

        <!-- 系统信息卡片 -->
        <div
          class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl space-y-5 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <h4 class="font-medium flex items-center gap-2 text-gray-700">
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <font-awesome-icon icon="shield-alt" class="text-blue-500" />
            </div>
            系统信息
          </h4>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">系统账号</label>
              <div class="relative">
                <font-awesome-icon
                  icon="user-circle"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  v-model="form.username"
                  type="text"
                  :disabled="props.viewMode || props.editMode"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'bg-gray-50': props.viewMode || props.editMode }"
                  placeholder="请输入系统登录账号"
                />
              </div>
            </div>
            <div v-if="!props.viewMode">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">登录密码</label>
              <div class="relative">
                <font-awesome-icon
                  icon="lock"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入登录密码"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                </button>
              </div>
              <p v-if="editMode" class="mt-1.5 text-xs text-blue-500 flex items-center gap-1">
                <font-awesome-icon icon="info-circle" />
                <span>如不修改密码，请留空</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div
        class="flex justify-end gap-3 px-8 py-6 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50"
      >
        <button
          class="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          @click="handleClose"
          type="button"
        >
          <font-awesome-icon icon="times" />
          <span>{{ props.viewMode ? '关闭' : '取消' }}</span>
        </button>
        <button
          v-if="!props.viewMode"
          class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-105 flex items-center gap-2 transform hover:-translate-y-0.5"
          @click="handleSubmit"
          type="button"
        >
          <font-awesome-icon :icon="editMode ? 'save' : 'plus'" />
          <span>{{ editMode ? '保存修改' : '确认添加' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  StoreForm as IStoreForm,
  StoreStaff,
  StaffPosition,
  StoreStatus
} from '@/types/api/admin/store'

// 密码显示控制
const showPassword = ref(false)

// 店铺状态选项
const storeStatusOptions: { label: string; value: StoreStatus }[] = [
  { label: '正常运营', value: 'active' },
  { label: '暂停营业', value: 'paused' },
  { label: '装修中', value: 'renovating' }
]

// 店员职位选项
const staffPositions: { label: string; value: StaffPosition }[] = [
  { label: '店长', value: '店长' },
  { label: '收银员', value: '收银员' },
  { label: '导购员', value: '导购员' },
  { label: '仓管员', value: '仓管员' }
]

// 过滤掉店长职位的选项，避免在店员列表中重复添加店长
const filteredPositions = computed(() => {
  return staffPositions.filter(pos => pos.value !== '店长')
})

interface Staff {
  name: string
  position: StaffPosition
}

export type StoreForm = IStoreForm

interface Props {
  show: boolean
  editMode: boolean
  viewMode?: boolean // 添加viewMode属性，用于只读视图模式
  storeData?: Partial<StoreForm> | null
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  editMode: false,
  viewMode: false, // 默认为false
  storeData: () => ({})
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'submit', value: StoreForm): void
}>()

const form = ref<StoreForm>({
  name: '',
  location: '',
  status: 'active',
  manager: '',
  phone: '',
  staffList: [{ name: '', position: '导购员' }],
  username: '',
  password: ''
})

// 监听props.show的变化，当表单显示时初始化数据
watch(
  () => props.show,
  newVal => {
    if (newVal) {
      // 当表单显示时
      if (props.editMode && props.storeData) {
        // 编辑模式：初始化表单数据
        initFormData()
      } else {
        // 新增模式：重置表单
        resetForm()
      }
    }
  }
)

// 监听editMode和storeData变化，用于处理动态切换编辑/添加模式
watch([() => props.editMode, () => props.storeData], ([newEditMode, newStoreData]) => {
  if (props.show) {
    if (newEditMode && newStoreData) {
      // 编辑模式且有数据
      initFormData()
    } else if (!newEditMode) {
      // 切换到添加模式
      resetForm()
    }
  }
})

// 初始化表单数据，用于编辑模式
const initFormData = () => {
  if (!props.storeData) return

  // 提取店长信息
  const manager = props.storeData.staffList?.find(staff => staff.position === '店长')

  form.value = {
    ...form.value,
    ...props.storeData,
    // 如果店长信息在staffList中，提取到单独的字段
    manager: manager?.name || props.storeData.manager || '',
    phone: manager?.phone || props.storeData.phone || '',
    // 确保 staffList 中的每个职位都是有效的 StaffPosition，并过滤掉店长
    staffList: props.storeData.staffList
      ?.filter(staff => staff.position !== '店长')
      .map(staff => ({
        name: staff.name || '',
        position: staff.position || '导购员',
        phone: staff.phone || '',
        createTime: staff.createTime || new Date().toISOString() // 确保每个店员都有createTime
      })) || [
      {
        name: '',
        position: '导购员',
        phone: '',
        createTime: new Date().toISOString()
      }
    ]
  }
}

// 重置表单，用于添加模式
const resetForm = () => {
  form.value = {
    name: '',
    location: '',
    status: 'active',
    manager: '',
    phone: '',
    staffList: [
      {
        name: '',
        position: '导购员',
        phone: '',
        createTime: new Date().toISOString() // 添加创建时间
      }
    ],
    username: '',
    password: ''
  }
}

onMounted(() => {
  // 组件挂载时，如果是编辑模式且显示状态，初始化表单
  if (props.show && props.editMode && props.storeData) {
    initFormData()
  }
})

const addStaff = () => {
  form.value.staffList.push({
    name: '',
    position: '导购员',
    phone: '',
    createTime: new Date().toISOString() // 添加创建时间
  })
}

const removeStaff = (index: number) => {
  if (form.value.staffList.length > 1) {
    form.value.staffList.splice(index, 1)
  }
}

const handleClose = () => {
  // 关闭表单时重置
  resetForm()
  emit('update:show', false)
}

const validateForm = (): string | null => {
  if (!form.value.name.trim()) return '请输入店铺名称'
  if (!form.value.location.trim()) return '请输入店铺位置'
  if (!form.value.status) return '请选择店铺状态'
  if (!form.value.manager.trim()) return '请输入店长姓名'
  if (!form.value.phone.trim()) return '请输入联系电话'
  if (!form.value.username.trim()) return '请输入系统账号'
  if (!form.value.password.trim() && !props.editMode) return '请输入登录密码'

  // 验证手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(form.value.phone)) {
    return '请输入正确的手机号码'
  }

  // 验证系统账号格式（仅允许英文字母、数字和特殊符号，不允许中文）
  const usernameRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/
  if (!usernameRegex.test(form.value.username)) {
    return '系统账号只能包含英文字母、数字或特殊符号，不允许中文'
  }

  // 验证密码格式（仅允许英文字母、数字和特殊符号，不允许中文）
  if (!props.editMode || (props.editMode && form.value.password.trim())) {
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/
    if (!passwordRegex.test(form.value.password)) {
      return '登录密码只能包含英文字母、数字或特殊符号，不允许中文'
    }
  }

  // 验证店员信息
  const staffNames = new Set<string>()
  for (const staff of form.value.staffList) {
    if (!staff.name.trim()) return '请输入所有店员姓名'
    if (!staff.position) return '请选择所有店员职位'

    // 验证店员手机号格式
    if (staff.phone && !phoneRegex.test(staff.phone)) {
      return '请输入正确的店员手机号码'
    }

    // 检查店员姓名是否重复
    const staffName = staff.name.trim()
    if (staffNames.has(staffName)) {
      return '店员姓名不能重复，请修改'
    }
    staffNames.add(staffName)
  }

  return null
}

const handleSubmit = () => {
  const error = validateForm()
  if (error) {
    ElMessage.warning(error)
    return
  }
  emit('submit', form.value)
}
</script>

<style scoped>
/* 列表动画 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

/* 自定义滚动条 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}

/* 下拉选择框样式 */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

select:focus {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%233b82f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

/* 输入框聚焦效果 */
input:focus,
select:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* 卡片悬浮效果 */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
