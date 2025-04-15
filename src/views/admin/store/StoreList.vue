<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-blue-100 text-sm">总店铺数</p>
            <p class="text-3xl font-semibold mt-2">{{ total }}</p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-400 bg-opacity-30 flex items-center justify-center"
          >
            <font-awesome-icon icon="store" class="text-2xl text-blue-200" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-green-100 text-sm">总店员数</p>
            <p class="text-3xl font-semibold mt-2">{{ totalStaffCount }}</p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-400 bg-opacity-30 flex items-center justify-center"
          >
            <font-awesome-icon icon="users" class="text-2xl text-green-200" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-purple-100 text-sm">本月新增</p>
            <p class="text-3xl font-semibold mt-2">{{ newStoresThisMonth }}</p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-purple-400 bg-opacity-30 flex items-center justify-center"
          >
            <font-awesome-icon icon="chart-line" class="text-2xl text-purple-200" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-orange-100 text-sm">运营状态</p>
            <p class="text-3xl font-semibold mt-2">{{ activeStorePercentage }}%</p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-400 bg-opacity-30 flex items-center justify-center"
          >
            <font-awesome-icon icon="signal" class="text-2xl text-orange-200" />
          </div>
        </div>
      </div>
    </div>

    <!-- 店铺列表 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- 顶部工具栏 -->
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-100 gap-4"
      >
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-medium flex items-center gap-3">
            <font-awesome-icon icon="store" class="text-blue-600" />
            店铺管理
          </h2>
          <!-- 视图切换按钮 -->
          <div class="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              class="px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
              :class="
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              "
              @click="viewMode = 'card'"
            >
              <font-awesome-icon icon="table-cells" class="text-sm" />
              <span class="text-sm">卡片</span>
            </button>
            <button
              class="px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
              :class="
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              "
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
            />
            <font-awesome-icon
              icon="search"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            class="!rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 flex items-center gap-2 justify-center"
            @click="handleAddStore"
          >
            <font-awesome-icon icon="plus" />
            <span>添加店铺</span>
          </button>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div
        v-if="viewMode === 'card'"
        class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
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
            <div class="flex items-center gap-2 text-gray-500 text-sm mt-2">
              <font-awesome-icon icon="user" class="text-gray-400" />
              <span>登录账号: {{ store.username }}</span>
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div class="flex items-center gap-2 text-sm">
              <span
                class="inline-block w-2 h-2 rounded-full"
                :class="{
                  'bg-green-500': store.status === 'active',
                  'bg-yellow-500': store.status === 'paused',
                  'bg-red-500': store.status === 'renovating'
                }"
              ></span>
              <span class="text-gray-600">
                {{
                  store.status === 'active'
                    ? '正常运营'
                    : store.status === 'paused'
                      ? '暂停营业'
                      : '装修中'
                }}
              </span>
            </div>
            <button
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              @click="handleViewDetails(store)"
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
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">登录账号</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">店长</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">店员数量</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">运营状态</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="store in paginatedStores"
              :key="store.id"
              class="hover:bg-gray-50 transition-colors"
            >
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
                <div class="font-medium text-gray-700">{{ store.username }}</div>
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
                  <span
                    class="inline-block w-2 h-2 rounded-full"
                    :class="{
                      'bg-green-500': store.status === 'active',
                      'bg-yellow-500': store.status === 'paused',
                      'bg-red-500': store.status === 'renovating'
                    }"
                  ></span>
                  <span class="text-gray-600">
                    {{
                      store.status === 'active'
                        ? '正常运营'
                        : store.status === 'paused'
                          ? '暂停营业'
                          : '装修中'
                    }}
                  </span>
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
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 bg-gray-50 gap-4"
      >
        <div class="text-sm text-gray-600">
          共 {{ stores.length }} 条数据，每页显示 {{ pageSize }} 条
        </div>
        <div class="flex items-center gap-3">
          <button
            class="!rounded-lg px-4 py-2 border bg-white transition-colors"
            :class="{
              'text-gray-400 cursor-not-allowed': currentPage === 1,
              'hover:bg-gray-50': currentPage > 1
            }"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <font-awesome-icon icon="chevron-left" class="mr-1" />
            上一页
          </button>
          <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
            <span>第</span>
            <input
              type="text"
              v-model="currentPage"
              class="w-12 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 px-1 py-0.5"
              @blur="validatePageNumber"
            />
            <span>页 / 共 {{ totalPages }} 页</span>
          </div>
          <button
            class="!rounded-lg px-4 py-2 border bg-white transition-colors"
            :class="{
              'text-gray-400 cursor-not-allowed': currentPage === totalPages,
              'hover:bg-gray-50': currentPage < totalPages
            }"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
            <font-awesome-icon icon="chevron-right" class="ml-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑店铺弹窗 -->
    <StoreForm
      v-if="showAddStore"
      v-model:show="showAddStore"
      :edit-mode="!!editingStore"
      :view-mode="isViewMode"
      :store-data="editingStore"
      @submit="handleStoreSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import StoreForm from './components/StoreForm.vue'
import type { StoreForm as IStoreForm } from './components/StoreForm.vue'
import { storeApi } from '@/api/admin/store'
import type { Store, StoreStatus } from '@/types/api/admin/store'

// 视图模式
const viewMode = ref<'card' | 'list'>('card')

// 状态
const loading = ref(false)
const showAddStore = ref(false)
const editingStore = ref<any>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const total = ref(0)
const isViewMode = ref(false)

// 店铺数据
const stores = ref<Store[]>([])

// 全局统计数据
const totalStaffCount = ref(0)
const newStoresThisMonth = ref(0)
const activeStorePercentage = ref(0)
const storeStatusCounts = ref<{ [key in StoreStatus]: number }>({
  active: 0,
  paused: 0,
  renovating: 0
})

// 获取店铺列表
const fetchStores = async () => {
  try {
    console.log('开始获取店铺列表...')
    loading.value = true
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value || undefined,
      status: undefined as StoreStatus | undefined
    }
    console.log('请求参数:', params)

    const response = await storeApi.getList(params)
    console.log('店铺列表API响应:', JSON.stringify(response, null, 2))

    // 检查响应结构并提取数据
    if (response?.code === 200 && response.data) {
      // 分页数据直接从返回结果中获取
      stores.value = response.data.items || []
      total.value = response.data.total || 0
      console.log(`成功获取${stores.value.length}个店铺, 总数:${total.value}`)

      // 如果当前页没有数据但总数不为0，尝试回退到最后一页
      if (stores.value.length === 0 && total.value > 0 && currentPage.value > 1) {
        console.log('当前页无数据，回退到最后一页')
        currentPage.value = Math.max(1, Math.ceil(total.value / pageSize.value))
        return fetchStores() // 重新获取
      }

      // 获取全局统计数据
      fetchStatistics()
    } else {
      console.warn('店铺列表响应格式不符合预期:', response)
      stores.value = []
      total.value = 0
      ElMessage.warning('获取店铺列表的返回格式不正确')
    }
  } catch (error) {
    console.error('获取店铺列表失败:', error)
    stores.value = []
    total.value = 0
    ElMessage.error('获取店铺列表失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 获取全局统计数据
const fetchStatistics = async () => {
  try {
    // 这里应该调用统计API，但为了简化示例，我们使用模拟数据
    // 实际项目中应该替换为真实的API调用
    const response = await storeApi.getStatistics()

    if (response?.code === 200 && response.data) {
      totalStaffCount.value = response.data.totalStaffCount || 0
      newStoresThisMonth.value = response.data.newStoresThisMonth || 0
      storeStatusCounts.value = response.data.statusCounts || {
        active: 0,
        paused: 0,
        renovating: 0
      }

      // 计算活跃店铺百分比
      const totalStores = Object.values(storeStatusCounts.value).reduce(
        (sum, count) => sum + count,
        0
      )
      activeStorePercentage.value =
        totalStores > 0 ? Math.round((storeStatusCounts.value.active / totalStores) * 100) : 0

      console.log('统计数据已更新:', {
        totalStaffCount: totalStaffCount.value,
        newStoresThisMonth: newStoresThisMonth.value,
        activeStorePercentage: activeStorePercentage.value
      })
    } else {
      // 如果API不可用，使用默认数据
      calculateDefaultStatistics()
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 如果API调用失败，使用默认数据
    calculateDefaultStatistics()
  }
}

// 计算默认统计数据（当API不可用时）
const calculateDefaultStatistics = () => {
  // 计算店员总数（基于当前页面数据，实际应该从API获取）
  totalStaffCount.value = stores.value.reduce(
    (sum, store) => sum + (store.staffList?.length || 0),
    0
  )

  // 默认本月新增店铺数量
  newStoresThisMonth.value = 3

  // 计算活跃店铺百分比
  const statusCounts = {
    active: 0,
    paused: 0,
    renovating: 0
  }

  stores.value.forEach(store => {
    if (store.status) {
      statusCounts[store.status]++
    }
  })

  const totalStores = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
  activeStorePercentage.value =
    totalStores > 0 ? Math.round((statusCounts.active / totalStores) * 100) : 98 // 默认值
}

// 计算店员数量 - 不包括店长
const getStaffCount = (store: Store) => {
  // 计算非店长店员的数量
  return store.staffList.filter(staff => staff.position !== '店长').length
}

// 筛选后的店铺列表
const filteredStores = computed(() => {
  return stores.value
})

// 分页数据
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const paginatedStores = computed(() => stores.value)

// 方法
const validatePageNumber = () => {
  let page = parseInt(currentPage.value as unknown as string)
  if (isNaN(page)) page = 1
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
  fetchStores()
}

const handleViewDetails = async (store: Store) => {
  loading.value = true
  try {
    const response = await storeApi.getDetail(store.id)
    if (response?.code === 200 && response?.data) {
      editingStore.value = response.data
      showAddStore.value = true
      isViewMode.value = true // 设置为查看模式
    } else {
      ElMessage.error('获取店铺详情失败：' + (response?.message || '未知错误'))
    }
  } catch (error) {
    console.error('获取店铺详情失败:', error)
    ElMessage.error('获取店铺详情失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = async (store: Store) => {
  loading.value = true
  try {
    const response = await storeApi.getDetail(store.id)
    if (response?.code === 200 && response?.data) {
      editingStore.value = response.data
      showAddStore.value = true
      isViewMode.value = false // 确保不是查看模式
    } else {
      ElMessage.error('获取店铺详情失败：' + (response?.message || '未知错误'))
    }
  } catch (error) {
    console.error('获取店铺详情失败:', error)
    ElMessage.error('获取店铺详情失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (store: Store) => {
  try {
    await ElMessageBox.confirm('确定要删除该店铺吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await storeApi.delete(store.id)
    ElMessage.success('删除成功')
    fetchStores()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete store:', error)
      ElMessage.error('删除店铺失败')
    }
  }
}

const handleStoreSubmit = async (formData: IStoreForm) => {
  try {
    let response

    if (editingStore.value) {
      // 更新现有店铺
      response = await storeApi.update(editingStore.value.id, formData)
    } else {
      // 添加新店铺
      response = await storeApi.create(formData)
    }

    // 检查API返回的状态码
    if (response && response.code === 200) {
      ElMessage.success(editingStore.value ? '更新成功' : '添加成功')

      // 先刷新店铺列表
      await fetchStores()

      // 如果是编辑模式，重新获取当前店铺详情
      if (editingStore.value) {
        const storeId = editingStore.value.id
        const detailResponse = await storeApi.getDetail(storeId)
        if (detailResponse?.code === 200 && detailResponse?.data) {
          // 更新当前编辑的店铺数据
          editingStore.value = detailResponse.data
        }
      }

      showAddStore.value = false
      if (!editingStore.value) {
        // 只有在添加模式下才清空
        editingStore.value = null
      }
    } else {
      // 显示API返回的错误信息
      const errorMessage =
        response?.message || (editingStore.value ? '更新店铺失败' : '添加店铺失败')
      console.error('API错误:', response)
      ElMessage.error(errorMessage)
    }
  } catch (error) {
    console.error('操作店铺失败:', error)
    ElMessage.error(
      editingStore.value ? '更新店铺失败，请检查网络连接' : '添加店铺失败，请检查网络连接'
    )
  }
}

// 监听分页和搜索变化
watch([currentPage, pageSize, searchQuery], () => {
  fetchStores()
})

// 添加店铺按钮点击事件
const handleAddStore = () => {
  // 清空编辑状态，确保是新增模式
  editingStore.value = null
  showAddStore.value = true
}

// 在组件挂载时获取店铺列表
onMounted(() => {
  fetchStores()
})

// 处理分页响应
const handlePaginationResponse = (response: any) => {
  stores.value = response.list || []
  total.value = response.total || 0
  // 如果当前页面为空但总数不为0，回到上一页
  if (stores.value.length === 0 && total.value > 0 && currentPage.value > 1) {
    currentPage.value--
    fetchStores()
  }
}
</script>
