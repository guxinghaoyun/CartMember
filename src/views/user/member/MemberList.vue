<template>
  <div class="space-y-4 pr-4">
    <!-- 顶部操作区 -->
    <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
      <div class="flex items-center space-x-4">
        <h2 class="text-lg font-medium">会员信息</h2>
        <div class="flex items-center text-green-600 text-sm">
          <font-awesome-icon icon="check-circle" class="text-xs mr-2" />
          IC读卡器已连接
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <div class="relative">
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="搜索会员"
            class="w-64 h-9 pl-9 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <font-awesome-icon icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>
        <button 
          @click="showAddDialog = true"
          class="h-9 px-4 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <font-awesome-icon icon="user-plus" class="text-sm mr-2" />
          新增会员
        </button>
      </div>
    </div>

    <!-- 会员列表表格 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr class="text-base sm:text-lg text-gray-500 uppercase tracking-wider font-medium">
            <th class="px-4 py-4 text-left">会员</th>
            <th class="px-4 py-4 text-left">电话</th>
            <th class="px-4 py-4 text-left">IC卡号</th>
            <th class="px-4 py-4 text-left">注册时间</th>
            <th class="px-4 py-4 text-left">积分</th>
            <th class="px-4 py-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="member in paginatedMembers" 
              :key="member.id"
              class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-4 text-base">
              <div class="flex items-center">
                <font-awesome-icon icon="user-circle" class="text-gray-400 mr-2" />
                {{ member.name }}
              </div>
            </td>
            <td class="px-4 py-4 text-base text-gray-600">
              <div class="flex items-center">
                <font-awesome-icon icon="phone" class="text-gray-400 mr-2" />
                {{ member.phone }}
              </div>
            </td>
            <td class="px-4 py-4 text-base text-gray-600">
              <div class="flex items-center">
                <font-awesome-icon icon="id-card" class="text-gray-400 mr-2" />
                {{ member.icCard }}
              </div>
            </td>
            <td class="px-4 py-4 text-base text-gray-600">
              <div class="flex items-center">
                <font-awesome-icon icon="calendar-alt" class="text-gray-400 mr-2" />
                {{ member.registerDate }}
              </div>
            </td>
            <td class="px-4 py-4 text-base">
              <div class="flex items-center">
                <font-awesome-icon icon="coins" class="text-yellow-500 mr-2" />
                {{ member.points }}
              </div>
            </td>
            <td class="px-4 py-4 text-base text-right">
              <button 
                @click="handleEdit(member)"
                class="text-blue-600 hover:text-blue-800 transition-colors px-2"
              >
                <font-awesome-icon icon="user-edit" class="text-base" />
              </button>
              <button 
                @click="handleDelete(member)"
                class="text-red-600 hover:text-red-800 transition-colors px-2"
              >
                <font-awesome-icon icon="user-times" class="text-base" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 分页器 -->
      <div class="px-4 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-base">
        <div class="text-gray-600">
          <font-awesome-icon icon="list-ul" class="mr-2" />
          显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredMembers.length) }} 条，共 {{ filteredMembers.length }} 条
        </div>
        <div class="flex items-center space-x-1">
          <button 
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <font-awesome-icon icon="chevron-left" class="mr-1" />
            上一页
          </button>
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'px-2 py-1 border rounded transition-colors',
              currentPage === page 
                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                : 'text-gray-600 border-gray-300 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
          <button 
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            下一页
            <font-awesome-icon icon="chevron-right" class="ml-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- 新增会员弹窗 -->
    <MemberAdd
      v-model:visible="showAddDialog"
      @success="handleAddSuccess" />

    <!-- 编辑会员弹窗 -->
    <MemberEdit
      v-model:visible="showEditDialog"
      :member="currentMember"
      @success="handleEditSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import MemberAdd from './MemberAdd.vue'
import MemberEdit from './MemberEdit.vue'
import type { Member } from '@/types'

// 会员数据
const members = ref<Member[]>([
  {
    id: 1,
    name: '陈思悦',
    phone: '13812345678',
    icCard: '8800 2233 4455',
    registerDate: '2023-12-01',
    points: '3,560'
  },
  {
    id: 2,
    name: '张翰明',
    phone: '13987654321',
    icCard: '8800 2233 4466',
    registerDate: '2023-11-15',
    points: '1,850'
  },
  {
    id: 3,
    name: '林美玲',
    phone: '13567891234',
    icCard: '8800 2233 4477',
    registerDate: '2023-10-28',
    points: '680'
  },
  {
    id: 4,
    name: '赵子涵',
    phone: '13789012345',
    icCard: '8800 2233 4488',
    registerDate: '2023-10-25',
    points: '2,100'
  },
  {
    id: 5,
    name: '吴雨轩',
    phone: '13601234567',
    icCard: '8800 2233 4499',
    registerDate: '2023-10-20',
    points: '4,200'
  },
  {
    id: 6,
    name: '黄嘉怡',
    phone: '13912345678',
    icCard: '8800 2233 4500',
    registerDate: '2023-10-18',
    points: '1,560'
  },
  {
    id: 7,
    name: '刘天成',
    phone: '13823456789',
    icCard: '8800 2233 4511',
    registerDate: '2023-10-15',
    points: '890'
  },
  {
    id: 8,
    name: '孙雅芝',
    phone: '13934567890',
    icCard: '8800 2233 4522',
    registerDate: '2023-10-12',
    points: '3,300'
  },
  {
    id: 9,
    name: '郑博文',
    phone: '13845678901',
    icCard: '8800 2233 4533',
    registerDate: '2023-10-10',
    points: '2,780'
  },
  {
    id: 10,
    name: '周诗涵',
    phone: '13756789012',
    icCard: '8800 2233 4544',
    registerDate: '2023-10-08',
    points: '1,920'
  }
])

// 搜索和分页
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗控制
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const currentMember = ref<Member | undefined>(undefined)

// 计算属性
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value
  const query = searchQuery.value.toLowerCase()
  return members.value.filter(member => 
    member.name.toLowerCase().includes(query) ||
    member.phone.includes(query) ||
    member.icCard.includes(query)
  )
})

const totalPages = computed(() => Math.ceil(filteredMembers.value.length / pageSize.value))

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMembers.value.slice(start, end)
})

// 方法
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleEdit = (member: Member) => {
  currentMember.value = member
  showEditDialog.value = true
}

const handleDelete = async (member: Member) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除会员 ${member.name} 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const index = members.value.findIndex(m => m.id === member.id)
    if (index > -1) {
      members.value.splice(index, 1)
      ElMessage.success('会员删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const handleAddSuccess = (member: Member) => {
  members.value.unshift(member)
  showAddDialog.value = false
  ElMessage.success('会员添加成功')
}

const handleEditSuccess = (member: Member) => {
  const index = members.value.findIndex(m => m.id === member.id)
  if (index > -1) {
    members.value[index] = member
    showEditDialog.value = false
    ElMessage.success('会员信息更新成功')
  }
}
</script>

<style scoped>
/* 表格样式优化 */
:deep(table) {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

:deep(tr) {
  transition: background-color 0.2s;
}

:deep(th) {
  font-weight: 500;
  background-color: #F9FAFB;
  border-color: #E5E7EB;
}

:deep(td), :deep(th) {
  white-space: nowrap;
  padding: 0.75rem 1.5rem;
}

:deep(tbody tr:hover) {
  background-color: #F9FAFB;
}

/* 操作按钮样式 */
.fa-edit, .fa-trash {
  font-size: 14px;
}

/* 分页按钮样式 */
button {
  transition: all 0.2s;
}

button:focus {
  outline: none;
  @apply ring-2 ring-offset-2 ring-blue-500;
}

.border-gray-200 {
  border-color: #E5E7EB;
}

.border-gray-300 {
  border-color: #D1D5DB;
}

/* 搜索框样式 */
input::placeholder {
  color: #9CA3AF;
}

input:focus {
  border-color: transparent;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style> 