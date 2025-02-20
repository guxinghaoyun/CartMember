<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm h-16 fixed w-full z-50">
      <div class="h-full w-full flex items-center justify-between">
        <div class="flex items-center pl-[30px]">
          <div class="flex items-center gap-3">
            <img src="https://ai-public.mastergo.com/ai/img_res/38e7f1a0e577f2e66f3fad5a897e5ba6.jpg" class="w-8 h-8 rounded-lg" alt="Logo">
            <h1 class="text-lg sm:text-xl font-medium truncate">智慧零售管理系统</h1>
          </div>
        </div>
        <div class="flex items-center gap-6 pr-[30px]">
          
          <el-dropdown trigger="click">
            <div class="flex pr-8 items-center gap-2 cursor-pointer">
              <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <font-awesome-icon icon="user" class="text-blue-600" />
              </div>
              <span class="text-gray-700 hidden sm:inline">{{ userInfo.name }}</span>
              
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item >
                  <div class="flex items-center gap-2 text-red-600" @click="handleLogout">
                    <font-awesome-icon icon="right-from-bracket" />
                    <span>退出登录</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <div class="flex flex-1 pt-16">
      <!-- 左侧导航 -->
      <nav class="w-20 sm:w-64 bg-white shadow-sm fixed h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300">
        <div class="py-4">
          <router-link 
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 sm:px-6 py-3 text-base sm:text-lg hover:bg-gray-50 transition-colors group"
            :class="{'bg-blue-50 text-blue-600': isActive(item.path)}">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                 :class="isActive(item.path) ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'">
              <font-awesome-icon 
                :icon="item.icon" 
                :class="['text-lg', isActive(item.path) ? 'text-blue-600' : 'text-gray-500']" />
            </div>
            <span class="hidden sm:inline ml-3 transition-colors" :class="isActive(item.path) ? 'text-blue-600' : 'text-gray-600'">
              {{ item.name }}
            </span>
          </router-link>
        </div>
      </nav>

      <!-- 主内容区域 -->
      <main class="flex-1 ml-20 sm:ml-64 min-h-[calc(100vh-4rem)] w-[calc(100vw-5rem)] sm:w-[calc(100vw-16rem)] overflow-x-hidden">
        <div class="w-full h-full p-4 sm:p-6 lg:p-8">
          <div class="h-full w-full p-4 overflow-auto">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 菜单配置
const menuItems = [
  { name: '店铺管理', path: '/admin/store', icon: 'store' },
  { name: 'IC卡管理', path: '/admin/card', icon: 'credit-card' },
  { name: '商品管理', path: '/admin/product', icon: 'box-open' },
  { name: '会员管理', path: '/admin/member', icon: 'users' },
  { name: '销售统计', path: '/admin/stats', icon: 'chart-line' },
  { name: '系统日志', path: '/admin/log', icon: 'history' }
]

// 用户信息
const userInfo = computed(() => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : {}
})

// 判断菜单是否激活
const isActive = (path: string) => {
  return route.path === path
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    localStorage.removeItem('user')
    router.push('/')
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 