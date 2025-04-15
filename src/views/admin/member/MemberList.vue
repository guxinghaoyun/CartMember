<template>
  <div class="space-y-4 p-6 bg-gray-50 min-h-screen">
    <!-- 会员统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-blue-100 text-sm font-medium">会员总数</p>
            <p class="text-4xl font-bold mt-3">{{ total }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-blue-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm"
          >
            <font-awesome-icon icon="users" class="text-2xl" />
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-green-100 text-sm font-medium">本月新增</p>
            <p class="text-4xl font-bold mt-3">{{ newMembers }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-green-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm"
          >
            <font-awesome-icon icon="user-plus" class="text-2xl" />
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-purple-100 text-sm font-medium">总积分</p>
            <p class="text-4xl font-bold mt-3">{{ totalPoints }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-purple-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm"
          >
            <font-awesome-icon icon="coins" class="text-2xl" />
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-orange-100 text-sm font-medium">平均积分</p>
            <p class="text-4xl font-bold mt-3">{{ averagePoints }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-xl bg-orange-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm"
          >
            <font-awesome-icon icon="chart-line" class="text-2xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- 会员列表 -->
    <div class="bg-white rounded-xl shadow-sm">
      <!-- 搜索栏嵌入表格顶部 -->
      <div class="flex justify-between items-center px-8 py-4 border-b">
        <div class="flex items-center space-x-4">
          <font-awesome-icon icon="users" class="text-blue-500 text-lg" />
          <h3 class="text-lg font-medium text-gray-900">会员管理</h3>
        </div>
        <div class="flex items-center space-x-5">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索会员姓名/手机号/卡号"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
              @keyup.enter="handleSearch"
            />
            <font-awesome-icon
              icon="search"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            @click="handleSearch"
          >
            搜索
          </button>
        </div>
      </div>

      <div class="overflow-x-auto" style="max-width: 100%">
        <div class="max-h-[820px] overflow-y-auto">
          <table class="min-w-full divide-y divide-gray-200" style="min-width: 1200px">
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  class="px-10 py-3 text-left text-sm text-gray-500 tracking-wider w-[15%]"
                >
                  <div class="flex items-center space-x-1">
                    <font-awesome-icon icon="user" class="text-gray-400" />
                    <span>会员信息</span>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-sm text-gray-500 tracking-wider w-[18%]"
                >
                  <div class="flex items-center space-x-1">
                    <font-awesome-icon icon="credit-card" class="text-gray-400" />
                    <span>IC卡信息</span>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-sm text-gray-500 tracking-wider w-[15%]"
                >
                  <div class="flex items-center space-x-1">
                    <font-awesome-icon icon="phone" class="text-gray-400" />
                    <span>手机号</span>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-sm text-gray-500 tracking-wider w-[12%]"
                >
                  <div class="flex items-center space-x-1">
                    <font-awesome-icon icon="coins" class="text-gray-400" />
                    <span>当前积分</span>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-sm text-gray-500 tracking-wider w-[12%]"
                >
                  <div class="flex items-center space-x-1">
                    <font-awesome-icon icon="chart-line" class="text-gray-400" />
                    <span>累计积分</span>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-sm text-gray-500 tracking-wider w-[15%]"
                >
                  <div class="flex items-center space-x-1">
                    <font-awesome-icon icon="calendar-alt" class="text-gray-400" />
                    <span>注册时间</span>
                  </div>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-sm text-gray-500 tracking-wider w-[13%]"
                >
                  <div class="flex items-center space-x-1">
                    <font-awesome-icon icon="cog" class="text-gray-400" />
                    <span>操作</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50">
                <td class="px-10 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center"
                    >
                      <font-awesome-icon icon="user" class="text-blue-500" />
                    </div>
                    <div class="ml-3">
                      <div class="text-base font-medium text-gray-900">{{ member.name }}</div>
                      <!-- <div class="text-sm text-gray-500">ID: {{ member.id }}</div> -->
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <font-awesome-icon icon="credit-card" class="text-blue-500 mr-2" />
                    <div>
                      <div class="text-base text-gray-900">
                        {{ formatCardNumber(member.surfaceNumber) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        内部号: {{ member.internalNumber || '无' }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <font-awesome-icon icon="phone" class="text-gray-400 mr-2" />
                    <span class="text-base text-gray-900">{{ member.phone }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <font-awesome-icon icon="coins" class="text-purple-500 mr-2" />
                    <span class="text-base text-gray-900 font-medium">{{ member.points }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <font-awesome-icon icon="chart-line" class="text-green-500 mr-2" />
                    <span class="text-base text-gray-900 font-medium">
                      {{ member.totalPoints }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <font-awesome-icon icon="calendar-alt" class="text-gray-400 mr-2" />
                    <span class="text-base text-gray-500">
                      {{ formatDate(member.registerDate) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    class="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    @click="handleViewDetail(member)"
                  >
                    <font-awesome-icon icon="eye" />
                    <span class="text-base">查看</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 分页 -->
      <div class="px-6 py-4 flex justify-between items-center border-t border-gray-200 flex-wrap">
        <div class="text-sm text-gray-500 mb-2 md:mb-0">共 {{ total }} 条记录</div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next"
          class="!text-sm"
          :pager-count="5"
          size-change-label="条/页"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Member, MemberQueryParams } from '@/types/api/admin/member'
import type { PaginationParams } from '@/types/api/common'
import type { PaginationResponse } from '@/types/api/response'
import { memberApi } from '@/api/admin/member'

const router = useRouter()

// 状态
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const total = ref(0)
const allMembers = ref<Member[]>([])
const members = ref<Member[]>([])

// 加载会员列表
const loadMembers = async () => {
  loading.value = true
  try {
    const params: PaginationParams & MemberQueryParams = {
      shopId: -1,
      page: 1,
      pageSize: 1000 // 加载更多数据一次性获取
    }

    if (searchQuery.value) {
      // @ts-ignore - 如果MemberQueryParams类型定义中没有searchQuery，暂时忽略类型错误
      params.searchQuery = searchQuery.value
    }

    const response = await memberApi.getList(params)
    const data = response.data.data
    allMembers.value = data.items || []
    total.value = allMembers.value.length
    updateDisplayedMembers()
  } catch (error) {
    console.error('加载会员列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 更新显示的会员列表（前端分页）
const updateDisplayedMembers = () => {
  const filteredList = allMembers.value.filter(member => {
    if (!searchQuery.value) return true

    const query = searchQuery.value.toLowerCase()
    return (
      member.name.toLowerCase().includes(query) ||
      member.phone.includes(query) ||
      member.surfaceNumber.toLowerCase().includes(query) ||
      (member.internalNumber && member.internalNumber.toLowerCase().includes(query))
    )
  })

  total.value = filteredList.length

  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value

  members.value = filteredList.slice(startIndex, endIndex)
}

// 格式化卡号，确保"NO."前缀
const formatCardNumber = (cardNumber: string) => {
  if (!cardNumber) return '无卡号'
  return cardNumber.startsWith('NO.') ? cardNumber : `NO.${cardNumber}`
}

// 格式化日期为"YYYY-MM-DD"格式
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 页码改变
const handlePageChange = (page: number) => {
  currentPage.value = page
  updateDisplayedMembers()
}

// 每页条数改变
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  updateDisplayedMembers()
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  updateDisplayedMembers()
}

// 查看会员详情
const handleViewDetail = (member: Member) => {
  // 将完整的会员数据存储到sessionStorage，避免页面刷新时数据丢失
  sessionStorage.setItem('currentMemberData', JSON.stringify(member))
  router.push(`/admin/member/${member.id}`)
}

// 初始化加载
onMounted(() => {
  loadMembers()
})

// 计算属性
const newMembers = computed(() => {
  const currentDate = new Date()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  return allMembers.value.filter(member => new Date(member.registerDate) >= firstDayOfMonth).length
})

const totalPoints = computed(() => {
  return allMembers.value.reduce((sum, member) => sum + member.points, 0)
})

const averagePoints = computed(() => {
  return allMembers.value.length > 0 ? Math.round(totalPoints.value / allMembers.value.length) : 0
})

const filteredMembers = computed(() => {
  return members.value
})
</script>

<style scoped>
.bg-gold-100 {
  background-color: #fff7e6;
}
.text-gold-800 {
  color: #d48806;
}
.bg-silver-100 {
  background-color: #fafafa;
}
.text-silver-800 {
  color: #595959;
}
</style>
