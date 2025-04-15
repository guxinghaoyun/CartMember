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
          <font-awesome-icon
            icon="search"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          />
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
            <th class="px-4 py-4 text-left">卡片状态</th>
            <th class="px-4 py-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="member in paginatedMembers"
            :key="member.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-4 text-base">
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <font-awesome-icon icon="user" class="text-blue-500" />
                </div>
                {{ member.name }}
              </div>
            </td>
            <td class="px-4 py-4 text-base text-gray-600">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <font-awesome-icon icon="phone" class="text-purple-500" />
                </div>
                {{ member.phone }}
              </div>
            </td>
            <td class="px-4 py-4 text-base text-gray-600">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <font-awesome-icon icon="credit-card" class="text-indigo-500" />
                </div>
                {{ member.icNumber }}
              </div>
            </td>
            <td class="px-4 py-4 text-base text-gray-600">
              <div class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                  <font-awesome-icon icon="calendar-alt" class="text-green-500 text-lg" />
                </div>
                {{ member.registerDate }}
              </div>
            </td>
            <td class="px-4 py-4 text-base">
              <div class="flex items-center">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-lg text-sm"
                  :class="
                    member.icStatus === '正常'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  "
                >
                  <span
                    class="w-2 h-2 mr-2 rounded-full"
                    :class="member.icStatus === '正常' ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ member.icStatus === '正常' ? '正常' : '停用' }}
                </span>
              </div>
            </td>
            <td class="px-4 py-4 text-base text-right space-x-1">
              <button
                @click="handleDetails(member)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                title="查看详情"
              >
                <font-awesome-icon icon="info-circle" class="text-gray-500" />
              </button>
              <button
                @click="handleEdit(member)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                title="编辑"
              >
                <font-awesome-icon icon="edit" class="text-blue-500" />
              </button>
              <button
                @click="handleDelete(member)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                title="删除"
              >
                <font-awesome-icon icon="trash" class="text-red-500" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页器 -->
      <div
        class="px-4 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-base"
      >
        <div class="text-gray-600">
          <font-awesome-icon icon="list-ul" class="mr-2" />
          显示 {{ (currentPage - 1) * pageSize + 1 }} -
          {{ Math.min(currentPage * pageSize, total) }} 条，共 {{ total }} 条
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
    <MemberAdd v-model:visible="showAddDialog" @success="handleAddSuccess" />

    <!-- 编辑会员弹窗 -->
    <MemberEdit
      v-model:visible="showEditDialog"
      :member="currentMember"
      @success="handleEditSuccess"
    />

    <!-- 会员详情弹窗 -->
    <MemberDetail v-model:visible="showDetailDialog" :member="currentMember" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import MemberAdd from './MemberAdd.vue'
import MemberEdit from './MemberEdit.vue'
import MemberDetail from './MemberDetail.vue'
import { memberApi } from '@/api/user/member'
import type { Member, MemberQueryParams } from '@/types/api/user/member'
import type { PaginationParams, ApiResponse, PaginationResponse } from '@/types/api/common'

// 会员数据
const members = ref<Member[]>([])
const total = ref(0)
const loading = ref(false)

// 搜索和分页
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗控制
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const currentMember = ref<Member | undefined>(undefined)

// 获取会员列表
const fetchMembers = async () => {
  try {
    loading.value = true
    const params: PaginationParams & MemberQueryParams = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value || undefined
    }

    const response = await memberApi.getMembers(params)
    const paginationData = response.data as unknown as any
    members.value = paginationData.items || []
    total.value = paginationData.total || 0
  } catch (error) {
    console.error('获取会员列表失败:', error)
    ElMessage.error('获取会员列表失败')
  } finally {
    loading.value = false
  }
}

// 监听搜索和分页变化
watch([searchQuery, currentPage], () => {
  fetchMembers()
})

// 初始化加载
onMounted(() => {
  fetchMembers()
})

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const paginatedMembers = computed(() => members.value)

// 方法
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleDetails = async (member: Member) => {
  try {
    const response = await memberApi.getMemberById(member.id)
    const memberData = response.data as unknown as Member
    currentMember.value = memberData
    showDetailDialog.value = true
  } catch (error) {
    console.error('获取会员详情失败:', error)
    ElMessage.error('获取会员详情失败')
  }
}

const handleEdit = async (member: Member) => {
  try {
    const response = await memberApi.getMemberById(member.id)
    const memberData = response.data as unknown as Member
    currentMember.value = memberData
    showEditDialog.value = true
  } catch (error) {
    console.error('获取会员详情失败:', error)
    ElMessage.error('获取会员详情失败')
  }
}

const handleDelete = async (member: Member) => {
  try {
    await ElMessageBox.confirm(`确定要删除会员 ${member.name} 吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await memberApi.deleteMember(member.id)
    ElMessage.success('会员删除成功')
    fetchMembers() // 重新加载列表
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除会员失败:', error)
      ElMessage.error('删除会员失败')
    }
  }
}

const handleAddSuccess = (member: Member) => {
  showAddDialog.value = false
  ElMessage.success('会员添加成功')
  fetchMembers() // 重新加载列表
}

const handleEditSuccess = (member: Member) => {
  showEditDialog.value = false
  ElMessage.success('会员信息更新成功')
  fetchMembers() // 重新加载列表
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
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

:deep(td),
:deep(th) {
  white-space: nowrap;
  padding: 0.75rem 1.5rem;
}

:deep(tbody tr:hover) {
  background-color: #f9fafb;
}

/* 操作按钮样式 */
button:focus {
  outline: none;
  @apply ring-2 ring-offset-2 ring-blue-500;
}

.space-x-1 > * + * {
  margin-left: 0.25rem;
}

.space-x-3 > * + * {
  margin-left: 0.75rem;
}

/* 搜索框样式 */
input::placeholder {
  color: #9ca3af;
}

input:focus {
  border-color: transparent;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
