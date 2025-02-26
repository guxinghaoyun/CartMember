<template>
  <div class="space-y-8 p-6 bg-gray-50 min-h-screen">
    <!-- 会员统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-blue-100 text-sm font-medium">会员总数</p>
            <p class="text-4xl font-bold mt-3">{{ total }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
            <font-awesome-icon icon="users" class="text-2xl" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-green-100 text-sm font-medium">本月新增</p>
            <p class="text-4xl font-bold mt-3">{{ newMembers }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-green-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
            <font-awesome-icon icon="user-plus" class="text-2xl" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-purple-100 text-sm font-medium">总积分</p>
            <p class="text-4xl font-bold mt-3">{{ totalPoints }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
            <font-awesome-icon icon="coins" class="text-2xl" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-orange-100 text-sm font-medium">平均积分</p>
            <p class="text-4xl font-bold mt-3">{{ averagePoints }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-orange-400 bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
            <font-awesome-icon icon="chart-line" class="text-2xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="bg-white rounded-xl p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索会员姓名/手机号/卡号"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              @keyup.enter="handleSearch"
            />
            <font-awesome-icon icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            @click="handleSearch"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 会员列表 -->
    <div class="bg-white rounded-xl shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                会员信息
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                卡号
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                积分
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                注册日期
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                    <div class="text-sm text-gray-500">{{ member.phone }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ member.surfaceNumber }}</div>
                <div class="text-sm text-gray-500">{{ member.internalNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">当前积分: {{ member.points }}</div>
                <div class="text-sm text-gray-500">累计积分: {{ member.totalPoints }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ member.registerDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  class="text-blue-600 hover:text-blue-900"
                  @click="handleViewDetail(member.id)"
                >
                  查看详情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页 -->
      <div class="px-6 py-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next"
          class="!text-sm"
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
import type { PaginatedData } from '@/types/api/response'
import { memberApi } from '@/api/admin/member'

const router = useRouter()

// 状态
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const total = ref(0)
const members = ref<Member[]>([])

// 加载会员列表
const loadMembers = async () => {
  loading.value = true
  try {
    const params: PaginationParams & MemberQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      name: searchQuery.value
    }
    const response = await memberApi.getList(params)
    const paginatedData = response.data.data
    members.value = paginatedData.items
    total.value = paginatedData.total
  } catch (error) {
    console.error('加载会员列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 页码改变
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadMembers()
}

// 每页条数改变
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadMembers()
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadMembers()
}

// 查看详情
const handleViewDetail = (id: number) => {
  router.push(`/admin/member/${id}`)
}

// 初始化加载
onMounted(() => {
  loadMembers()
})

// 计算属性
const newMembers = computed(() => {
  const currentDate = new Date()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  return members.value.filter(member => new Date(member.registerDate) >= firstDayOfMonth).length
})

const totalPoints = computed(() => {
  return members.value.reduce((sum, member) => sum + member.points, 0)
})

const averagePoints = computed(() => {
  return members.value.length > 0 ? Math.round(totalPoints.value / members.value.length) : 0
})

const filteredMembers = computed(() => {
  let result = [...members.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(member => 
      member.name.toLowerCase().includes(query) ||
      member.phone.includes(query) ||
      member.surfaceNumber.toLowerCase().includes(query) ||
      member.internalNumber.toLowerCase().includes(query)
    )
  }
  
  return result
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