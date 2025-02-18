<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-blue-100 text-sm">总店铺数</p>
            <p class="text-3xl font-semibold mt-2">{{ stores.length }}</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-blue-400 bg-opacity-30 flex items-center justify-center">
            <font-awesome-icon icon="store" class="text-2xl text-blue-200" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-green-100 text-sm">总店员数</p>
            <p class="text-3xl font-semibold mt-2">{{ stores.reduce((sum, store) => sum + getStaffCount(store), 0) }}</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-green-400 bg-opacity-30 flex items-center justify-center">
            <font-awesome-icon icon="users" class="text-2xl text-green-200" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-purple-100 text-sm">本月新增</p>
            <p class="text-3xl font-semibold mt-2">3</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-purple-400 bg-opacity-30 flex items-center justify-center">
            <font-awesome-icon icon="chart-line" class="text-2xl text-purple-200" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-orange-100 text-sm">运营状态</p>
            <p class="text-3xl font-semibold mt-2">98%</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-orange-400 bg-opacity-30 flex items-center justify-center">
            <font-awesome-icon icon="signal" class="text-2xl text-orange-200" />
          </div>
        </div>
      </div>
    </div>

    <!-- 店铺列表 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- 顶部工具栏 -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-100 gap-4">
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-medium flex items-center gap-3">
            <font-awesome-icon icon="store" class="text-blue-600" />
            店铺管理
          </h2>
          <!-- 视图切换按钮 -->
          <div class="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              class="px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
              :class="viewMode === 'card' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
              @click="viewMode = 'card'"
            >
              <font-awesome-icon icon="table-cells" class="text-sm" />
              <span class="text-sm">卡片</span>
            </button>
            <button
              class="px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
              :class="viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
              @click="viewMode = 'list'"
            >
              <font-awesome-icon icon="list" class="text-sm" />
              <span class="text-sm">列表</span>
            </button>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索店铺名称/店长"
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            >
            <font-awesome-icon icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            class="!rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 flex items-center gap-2 justify-center"
            @click="showAddStore = true"
          >
            <font-awesome-icon icon="plus" />
            <span>添加店铺</span>
          </button>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div v-if="viewMode === 'card'" class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="store in paginatedStores"
          :key="store.id"
          class="bg-white rounded-xl border border-gray-200 hover:border-blue-500 transition-colors overflow-hidden group"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <font-awesome-icon icon="store" class="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 class="font-medium text-lg">{{ store.name }}</h3>
                  <p class="text-gray-500 text-sm mt-1">{{ store.manager }} (店长)</p>
                </div>
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex gap-2">
                  <button
                    class="!rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                    @click="handleEdit(store)"
                  >
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button
                    class="!rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                    @click="handleDelete(store)"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 text-gray-500 text-sm">
              <font-awesome-icon icon="users" class="text-gray-400" />
              <span>{{ getStaffCount(store) }} 名店员</span>
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div class="flex items-center gap-2 text-sm">
              <span class="inline-block w-2 h-2 rounded-full" :class="{
                'bg-green-500': store.status === 'active',
                'bg-yellow-500': store.status === 'paused',
                'bg-red-500': store.status === 'renovating'
              }"></span>
              <span class="text-gray-600">{{ 
                store.status === 'active' ? '正常运营' :
                store.status === 'paused' ? '暂停营业' :
                '装修中'
              }}</span>
            </div>
            <button
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              @click="handleEdit(store)"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">店铺信息</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">店长</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">店员数量</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">运营状态</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="store in paginatedStores" :key="store.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <font-awesome-icon icon="store" class="text-blue-600" />
                  </div>
                  <div>
                    <div class="font-medium">{{ store.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ store.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <font-awesome-icon icon="user-tie" class="text-gray-500" />
                  </div>
                  <span>{{ store.manager }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <font-awesome-icon icon="users" class="text-gray-400" />
                  <span>{{ getStaffCount(store) }} 人</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="inline-block w-2 h-2 rounded-full" :class="{
                    'bg-green-500': store.status === 'active',
                    'bg-yellow-500': store.status === 'paused',
                    'bg-red-500': store.status === 'renovating'
                  }"></span>
                  <span class="text-gray-600">{{ 
                    store.status === 'active' ? '正常运营' :
                    store.status === 'paused' ? '暂停营业' :
                    '装修中'
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    class="!rounded-lg px-3 py-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                    @click="handleEdit(store)"
                  >
                    <font-awesome-icon icon="edit" class="mr-1" />
                    编辑
                  </button>
                  <button
                    class="!rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50 transition-colors"
                    @click="handleDelete(store)"
                  >
                    <font-awesome-icon icon="trash" class="mr-1" />
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 bg-gray-50 gap-4">
        <div class="text-sm text-gray-600">
          共 {{ stores.length }} 条数据，每页显示 {{ pageSize }} 条
        </div>
        <div class="flex items-center gap-3">
          <button
            class="!rounded-lg px-4 py-2 border bg-white transition-colors"
            :class="{ 'text-gray-400 cursor-not-allowed': currentPage === 1, 'hover:bg-gray-50': currentPage > 1 }"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <i class="fas fa-chevron-left mr-1"></i>
            上一页
          </button>
          <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <span>第</span>
            <input
              type="text"
              v-model="currentPage"
              class="w-12 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 px-1 py-0.5"
              @blur="validatePageNumber"
            >
            <span>页 / 共 {{ totalPages }} 页</span>
          </div>
          <button
            class="!rounded-lg px-4 py-2 border bg-white transition-colors"
            :class="{ 'text-gray-400 cursor-not-allowed': currentPage === totalPages, 'hover:bg-gray-50': currentPage < totalPages }"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
            <i class="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑店铺弹窗 -->
    <store-form
      v-if="showAddStore"
      v-model:show="showAddStore"
      :edit-mode="!!editingStore"
      :store-data="editingStore"
      @submit="handleStoreSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import StoreForm from './components/StoreForm.vue'
import type { StoreForm as IStoreForm } from './components/StoreForm.vue'

// 定义类型
type StoreStatus = 'active' | 'paused' | 'renovating'

interface Store extends IStoreForm {
  id: number
  status: StoreStatus
}

// 状态
const showAddStore = ref(false)
const editingStore = ref<Store | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(6)

// 视图模式
const viewMode = ref<'card' | 'list'>('card')

// 店铺数据
const stores = ref<Store[]>([
  { 
    id: 1, 
    name: '北京朝阳店', 
    location: '北京市朝阳区建国路88号', 
    manager: '张明', 
    phone: '13800138000',
    staffList: [
      { name: '李四', position: '销售' },
      { name: '王五', position: '收银' }
    ],
    username: 'beijing_store',
    password: '******',
    status: 'active' 
  },
  { 
    id: 2, 
    name: '上海浦东店', 
    location: '上海市浦东新区陆家嘴88号', 
    manager: '李华', 
    phone: '13900139000',
    staffList: [
      { name: '张三', position: '销售' },
      { name: '李四', position: '收银' }
    ],
    username: 'shanghai_store',
    password: '******',
    status: 'active' 
  },
  { 
    id: 3, 
    name: '广州天河店', 
    location: '广州市天河区天河路88号', 
    manager: '王芳', 
    phone: '13700137000',
    staffList: [
      { name: '王一', position: '销售' },
      { name: '赵二', position: '收银' }
    ],
    username: 'guangzhou_store',
    password: '******',
    status: 'active' 
  },
  { 
    id: 4, 
    name: '深圳南山店', 
    location: '深圳市南山区科技园88号', 
    manager: '刘强', 
    phone: '13600136000',
    staffList: [
      { name: '钱一', position: '销售' },
      { name: '孙二', position: '收银' }
    ],
    username: 'shenzhen_store',
    password: '******',
    status: 'active' 
  },
  { 
    id: 5, 
    name: '杭州西湖店', 
    location: '杭州市西湖区西湖路88号', 
    manager: '陈静', 
    phone: '13500135000',
    staffList: [
      { name: '周一', position: '销售' },
      { name: '吴二', position: '收银' }
    ],
    username: 'hangzhou_store',
    password: '******',
    status: 'paused' 
  },
  { 
    id: 6, 
    name: '成都锦江店', 
    location: '成都市锦江区春熙路88号', 
    manager: '赵伟', 
    phone: '13400134000',
    staffList: [
      { name: '郑一', position: '销售' },
      { name: '王二', position: '收银' }
    ],
    username: 'chengdu_store',
    password: '******',
    status: 'renovating' 
  }
])

// 计算店员数量
const getStaffCount = (store: Store) => store.staffList.length

// 搜索相关状态
const showAdvancedSearch = ref(false)
const searchForm = ref({
  name: '',
  manager: '',
  staffCountRange: [0, 100],
  status: 'all'
})

// 店铺状态选项
const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '正常运营', value: 'active' },
  { label: '暂停营业', value: 'paused' },
  { label: '装修中', value: 'renovating' }
]

// 筛选后的店铺列表
const filteredStores = computed(() => {
  let result = [...stores.value]
  
  // 快速搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(store => 
      store.name.toLowerCase().includes(query) ||
      store.manager.toLowerCase().includes(query)
    )
  }
  
  // 高级搜索
  if (showAdvancedSearch.value) {
    if (searchForm.value.name) {
      result = result.filter(store => 
        store.name.toLowerCase().includes(searchForm.value.name.toLowerCase())
      )
    }
    if (searchForm.value.manager) {
      result = result.filter(store => 
        store.manager.toLowerCase().includes(searchForm.value.manager.toLowerCase())
      )
    }
    if (searchForm.value.status !== 'all') {
      result = result.filter(store => store.status === searchForm.value.status)
    }
    result = result.filter(store => {
      const staffCount = getStaffCount(store)
      return staffCount >= searchForm.value.staffCountRange[0] &&
             staffCount <= searchForm.value.staffCountRange[1]
    })
  }
  
  return result
})

// 计算属性
const totalPages = computed(() => Math.ceil(filteredStores.value.length / pageSize.value))
const paginatedStores = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStores.value.slice(start, end)
})

// 方法
const validatePageNumber = () => {
  let page = parseInt(currentPage.value as unknown as string)
  if (isNaN(page)) page = 1
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
}

const handleEdit = (store: Store) => {
  editingStore.value = store
  showAddStore.value = true
}

const handleDelete = (store: Store) => {
  ElMessageBox.confirm('确定要删除该店铺吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = stores.value.findIndex(s => s.id === store.id)
    if (index > -1) {
      stores.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}

const handleStoreSubmit = (formData: IStoreForm) => {
  if (editingStore.value) {
    // 更新现有店铺
    const index = stores.value.findIndex(s => s.id === editingStore.value!.id)
    if (index > -1) {
      stores.value[index] = { 
        ...stores.value[index], 
        ...formData
      }
      ElMessage.success('更新成功')
    }
  } else {
    // 添加新店铺
    const newStore: Store = {
      ...formData,
      id: Math.max(0, ...stores.value.map(s => s.id)) + 1,
      status: 'active' // 新店铺默认为正常运营状态
    }
    stores.value.push(newStore)
    ElMessage.success('添加成功')
  }
  showAddStore.value = false
  editingStore.value = null
}

// 重置搜索
const resetSearch = () => {
  searchQuery.value = ''
  searchForm.value = {
    name: '',
    manager: '',
    staffCountRange: [0, 100],
    status: 'all'
  }
  currentPage.value = 1
}
</script> 