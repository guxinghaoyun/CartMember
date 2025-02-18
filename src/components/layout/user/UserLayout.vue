<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm h-16 fixed w-full z-50">
      <div class="h-full w-full flex items-center justify-between">
        <div class="flex items-center pl-[30px]">
          <h1 class="text-lg sm:text-xl font-medium truncate">智慧零售管理系统</h1>
        </div>
        <div class="flex items-center space-x-6 pr-[60px]">
          <!-- <div class="relative group">
            <button class="flex items-center text-gray-600 text-sm sm:text-base hover:text-blue-500">
              <font-awesome-icon icon="user" class="mr-2" />
              <span class="hidden sm:inline">王店长</span>
              <font-awesome-icon icon="chevron-down" class="ml-2 text-xs" />
            </button>
            <div class="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
              <button 
                @click="handleLogout"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-500 flex items-center">
                <font-awesome-icon icon="right-from-bracket" class="mr-2" />
                退出登录
              </button>
            </div>
          </div> -->
          <div class="flex items-center gap-6 pr-[30px]">
          
            <el-dropdown trigger="click">
              <div class="flex items-center gap-2 cursor-pointer">
                <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <font-awesome-icon icon="user" class="text-blue-600" />
                </div>
                <span class="text-gray-700 hidden sm:inline">王店长</span>
                
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
          <span class="text-gray-600 text-sm sm:text-base">
            <font-awesome-icon icon="store" class="mr-2" />
            <span class="hidden sm:inline">天河城分店</span>
          </span>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <div class="flex flex-1 pt-16">
      <!-- 左侧导航 -->
      <nav class="w-20 sm:w-64 bg-white shadow-sm fixed h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300">
        <div class="py-4">
          <!-- 会员管理 -->
          <router-link 
            to="/user/member"
            class="flex items-center px-4 sm:px-6 py-3 text-base sm:text-lg hover:bg-gray-50 transition-colors"
            :class="{'bg-blue-50 text-blue-600': $route.path === '/user/member'}">
            <font-awesome-icon icon="user" class="w-6 text-center text-lg" />
            <span class="hidden sm:inline ml-4">会员管理</span>
          </router-link>

          <!-- 其他菜单项 -->
          <router-link 
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 sm:px-6 py-3 text-base sm:text-lg hover:bg-gray-50 transition-colors"
            :class="{'bg-blue-50 text-blue-600': $route.path === item.path}">
            <font-awesome-icon :icon="item.icon" class="w-6 text-center text-lg" />
            <span class="hidden sm:inline ml-4">{{ item.name }}</span>
          </router-link>
        </div>
      </nav>

      <!-- 主内容区域 -->
      <main class="flex-1 ml-20 sm:ml-64 min-h-[calc(100vh-4rem)] w-[calc(100vw-5rem)] sm:w-[calc(100vw-16rem)] overflow-x-hidden">
        <div class="w-full h-full p-6 sm:p-6 lg:p-8">
          <!-- <div class="h-full w-full p-4 overflow-auto"> -->
            <router-view></router-view>
          <!-- </div> -->
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
  { path: '/user/shopping', name: '购物', icon: 'shopping-bag' },
  { path: '/user/cart', name: '购物车/结算', icon: 'shopping-cart' },
  { path: '/user/recharge', name: '充值管理', icon: 'wallet' },
  { path: '/user/pickup', name: '取货管理', icon: 'box' },
  { path: '/user/stats', name: '统计报表', icon: 'chart-bar' }
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