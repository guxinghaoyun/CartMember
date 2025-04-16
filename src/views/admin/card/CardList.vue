<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-blue-100 text-sm">总卡数</p>
            <p class="text-3xl font-semibold mt-2">{{ cards.length }}</p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-400 bg-opacity-30 flex items-center justify-center"
          >
            <font-awesome-icon icon="credit-card" class="text-2xl text-blue-200" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-purple-100 text-sm">本月新增</p>
            <p class="text-3xl font-semibold mt-2">12</p>
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
            <p class="text-orange-100 text-sm">活跃率</p>
            <p class="text-3xl font-semibold mt-2">86%</p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-orange-400 bg-opacity-30 flex items-center justify-center"
          >
            <font-awesome-icon icon="signal" class="text-2xl text-orange-200" />
          </div>
        </div>
      </div>
    </div>

    <!-- IC卡列表 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- 顶部工具栏 -->
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-100 gap-4"
      >
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-medium flex items-center gap-3">
            <font-awesome-icon icon="credit-card" class="text-blue-600" />
            IC卡管理
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
              placeholder="搜索卡号/会员姓名/手机号"
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
            <font-awesome-icon
              icon="search"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            class="!rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 flex items-center gap-2 justify-center"
            @click="showInitCard = true"
          >
            <font-awesome-icon icon="plus" />
            <span>初始化IC卡</span>
          </button>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div
        v-if="viewMode === 'card'"
        class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="card in paginatedCards"
          :key="card.id"
          class="bg-white rounded-xl border border-gray-200 hover:border-blue-500 transition-colors overflow-hidden group"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <font-awesome-icon icon="credit-card" class="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 class="font-medium text-lg">{{ card.cardNumber }}</h3>
                  <div class="flex flex-col gap-1">
                    <p class="text-gray-500 text-sm">内部号: {{ card.internalNumber }}</p>
                  </div>
                </div>
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="!rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                  @click="toggleCardStatus(card)"
                  v-if="card.store"
                >
                  <font-awesome-icon
                    :icon="getStatusIcon(card.status)"
                    :class="getStatusClass(card.status)"
                  />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">所属店铺</span>
                <span class="font-medium">{{ card.store }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">手机号码</span>
                <span class="font-medium">{{ card.memberPhone }}</span>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div class="flex items-center gap-2 text-sm">
              <span
                class="inline-block w-2 h-2 rounded-full"
                :class="{
                  'bg-green-500': card.status === '正常',
                  'bg-red-500': card.status === '停用',
                  'bg-yellow-500': card.status === '未激活'
                }"
              ></span>
              <span class="text-gray-600 min-w-[48px]">{{ card.status }}</span>
            </div>
            <span class="text-gray-500 text-sm">{{ formatDate(card.createTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">卡片信息</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">所属店铺</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">会员信息</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">初始化时间</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="card in paginatedCards"
              :key="card.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <font-awesome-icon icon="credit-card" class="text-blue-600" />
                  </div>
                  <div>
                    <div class="font-medium">{{ card.cardNumber }}</div>
                    <div class="text-sm text-gray-500">内部号: {{ card.internalNumber }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <font-awesome-icon icon="store" class="text-gray-400" />
                  <span>{{ card.store }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <div class="font-medium">{{ card.memberName }}</div>
                  <div class="text-sm text-gray-500">{{ card.memberPhone }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(card.initTime) }}
              </td>
              <td class="px-6 py-4">
                <button
                  v-if="card.store"
                  class="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors min-w-[72px]"
                  :class="{
                    'bg-green-100 text-green-800 hover:bg-green-200': card.status === '正常',
                    'bg-red-100 text-red-800 hover:bg-red-200': card.status === '停用'
                  }"
                  @click="toggleCardStatus(card)"
                >
                  <font-awesome-icon :icon="getStatusIcon(card.status)" class="mr-1" />
                  {{ card.status }}
                </button>
                <span
                  v-else
                  class="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-800 min-w-[72px]"
                >
                  <font-awesome-icon icon="clock" class="mr-1" />
                  {{ card.status }}
                </span>
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
          共 {{ cards.length }} 条数据，每页显示 {{ pageSize }} 条
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

    <!-- 初始化IC卡弹窗 -->
    <card-init-form v-if="showInitCard" v-model:show="showInitCard" @button="handleCardInit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CardInitForm from './components/CardInitForm.vue'
import type { CardForm } from '@/types/api/admin/card'
import { cardApi } from '@/api/admin/card'
import type { Card, CardStatus } from '@/types/api/admin/card'
import { cardStatusMap } from '@/types/api/admin/card'
import type { CardResponse } from '@/types/api/admin/card'

// 视图模式
const viewMode = ref<'card' | 'list'>('card')

// 状态
const loading = ref(false)
const showInitCard = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 卡片数据
const cards = ref<Card[]>([])

// 将后端返回的数据转换为前端使用的格式
const transformCardData = (card: Card): Card => {
  const statusValue = cardStatusMap[card.status as keyof typeof cardStatusMap] || card.status

  // 创建一个新对象，确保包含所有必要字段
  return {
    ...card,
    surfaceNumber: card.cardNumber || 'N/A', // 将cardNumber映射为surfaceNumber
    initTime: card.createTime || 'N/A', // 将createTime映射为initTime
    status: statusValue, // 映射状态
    store: (card as any).shopName || '未分配', // 使用类型断言访问shopName
    memberName: (card as any).membershipName || card.memberName || '未绑定', // 使用类型断言访问membershipName
    memberPhone: (card as any).membershipPhone || card.memberPhone || '--' // 使用类型断言访问membershipPhone
  }
}

// 获取卡片列表
const fetchCards = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value || undefined,
      status: undefined as CardStatus | undefined
    }
    const response = await cardApi.getList(params)

    // 直接使用后端返回的数据
    console.log('API响应:', response)

    // 转换后端返回的数据，确保字段名与前端组件期望的一致
    // 使用类型断言解决TypeScript类型问题
    const apiResponse = response as unknown as { records: Card[]; totalRecords: number }
    cards.value = apiResponse.records.map(card => transformCardData(card))
    total.value = apiResponse.totalRecords

    console.log('总记录数:', total.value)
  } catch (error) {
    console.error('Failed to fetch cards:', error)
    ElMessage.error('获取卡片列表失败')
  } finally {
    loading.value = false
  }
}

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const paginatedCards = computed(() => cards.value)

// 方法
const validatePageNumber = () => {
  let page = parseInt(currentPage.value as unknown as string)
  if (isNaN(page)) page = 1
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
  fetchCards()
}

const getStatusIcon = (status: CardStatus | string) => {
  switch (status) {
    case '正常':
      return 'check'
    case '停用':
      return 'ban'
    case '未激活':
      return 'clock'
    default:
      return 'question'
  }
}

const getStatusClass = (status: CardStatus | string) => {
  switch (status) {
    case '正常':
      return 'text-green-600'
    case '停用':
      return 'text-red-600'
    case '未激活':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}

const toggleCardStatus = async (card: Card) => {
  // 如果是未激活状态，不允许手动切换状态
  if (card.status === '未激活') {
    return
  }

  try {
    if (card.status === '正常') {
      // 停用卡片前先进行确认
      await ElMessageBox.confirm('确定要停用此卡片吗？停用后卡片将无法使用。', '停用确认', {
        confirmButtonText: '确认停用',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await cardApi.disable(card.id, '手动停用')
      card.status = '停用'
      ElMessage.success('卡片已停用')
    } else {
      // 启用卡片前先进行确认
      await ElMessageBox.confirm('确定要启用此卡片吗？', '启用确认', {
        confirmButtonText: '确认启用',
        cancelButtonText: '取消',
        type: 'info'
      })

      await cardApi.activate(card.id, 0) // 0 表示不绑定会员
      card.status = '正常'
      ElMessage.success('卡片已启用')
    }
  } catch (error) {
    // 如果是用户取消操作，不显示错误信息
    if (error === 'cancel' || (error as any)?.message === 'cancel') {
      return
    }

    console.error('Failed to toggle card status:', error)
    ElMessage.error('操作失败')
    // 恢复原状态
    fetchCards()
  }
}

const handleCardInit = async (formData: CardForm) => {
  showInitCard.value = false
}

// 监听分页和搜索变化
watch([currentPage, pageSize, searchQuery], () => {
  fetchCards()
})

// 在组件挂载时获取卡片列表
onMounted(() => {
  fetchCards()
})

// 格式化日期，只显示年月日
const formatDate = (date: string | undefined): string => {
  if (!date) return '' // 处理undefined情况
  return date.split('T')[0] // 只返回日期部分
}
</script>
