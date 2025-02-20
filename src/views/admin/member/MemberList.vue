<template>
  <div class="space-y-8 p-6 bg-gray-50 min-h-screen">
    <!-- 会员统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-blue-100 text-sm font-medium">会员总数</p>
            <p class="text-4xl font-bold mt-3">{{ members.length }}</p>
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

    <!-- 会员列表 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- 顶部工具栏 -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 border-b border-gray-100 gap-4">
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-medium flex items-center gap-3">
            <font-awesome-icon icon="users" class="text-blue-600" />
            会员管理
          </h2>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索会员姓名/手机号"
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            >
            <font-awesome-icon icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- 会员列表表格 -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">IC卡信息</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">会员信息</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">手机号</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">当前积分</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">累计积分</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">注册时间</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <font-awesome-icon icon="credit-card" class="text-blue-600" />
                  </div>
                  <div>
                    <div class="font-medium">{{ member.surfaceNumber }}</div>
                    <div class="text-sm text-gray-500">内部号: {{ member.internalNumber }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <font-awesome-icon icon="user" class="text-blue-600" />
                  </div>
                  <div>
                    <div class="font-medium">{{ member.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ member.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">{{ member.phone }}</td>
              <td class="px-6 py-4">{{ member.points }}</td>
              <td class="px-6 py-4">{{ member.totalPoints }}</td>
              <td class="px-6 py-4">{{ member.registerDate }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    class="!rounded-lg px-3 py-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                    @click="handleViewDetails(member)"
                  >
                    <font-awesome-icon icon="eye" class="mr-1" />
                    查看
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div class="text-sm text-gray-600">
          共 {{ members.length }} 条数据
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="members.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next"
          class="!text-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Member {
  id: number
  name: string
  phone: string
  points: number
  totalPoints: number
  registerDate: string
  surfaceNumber: string
  internalNumber: string
}

// 状态
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟会员数据
const members = ref<Member[]>([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    points: 5000,
    totalPoints: 15800,
    registerDate: '2023-01-15',
    surfaceNumber: 'NO.100001',
    internalNumber: 'RF8A7B2C3D'
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    points: 3200,
    totalPoints: 8600,
    registerDate: '2023-02-20',
    surfaceNumber: 'NO.100002',
    internalNumber: 'RF8A7B2C4E'
  },
  {
    id: 3,
    name: '王五',
    phone: '13700137000',
    points: 1500,
    totalPoints: 3500,
    registerDate: '2023-03-10',
    surfaceNumber: 'NO.100003',
    internalNumber: 'RF8A7B2C5F'
  }
])

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
  let result = members.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(member =>
      member.name.toLowerCase().includes(query) ||
      member.phone.includes(query)
    )
  }
  return result
})

// 方法
const handleViewDetails = (member: Member) => {
  router.push(`/admin/member/${member.id}`)
}
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