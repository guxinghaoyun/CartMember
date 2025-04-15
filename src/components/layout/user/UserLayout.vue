<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm h-16 fixed w-full z-50">
      <div class="h-full w-full flex items-center justify-between">
        <div class="flex items-center pl-[30px]">
          <div class="flex items-center gap-3">
            <img
              src="https://ai-public.mastergo.com/ai/img_res/38e7f1a0e577f2e66f3fad5a897e5ba6.jpg"
              class="w-8 h-8 rounded-lg"
              alt="Logo"
            />
            <h1 class="text-lg sm:text-xl font-medium truncate">智慧零售管理系统</h1>
          </div>
        </div>
        <div class="flex items-center space-x-6 pr-[60px]">
          <div class="flex items-center gap-6 pr-[30px]">
            <el-dropdown trigger="click">
              <div class="flex items-center gap-2 cursor-pointer">
                <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <font-awesome-icon icon="user" class="text-blue-600" />
                </div>
                <span class="text-gray-700 hidden sm:inline">
                  {{ storeInfo.manager || '未知店长' }}
                </span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
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
            <span class="hidden sm:inline">{{ storeInfo.name || '未知店铺' }}</span>
          </span>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <div class="flex flex-1 pt-16">
      <!-- 左侧导航 -->
      <nav
        class="w-20 sm:w-64 bg-white shadow-sm fixed h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300"
      >
        <div class="py-4">
          <!-- 会员管理 -->
          <router-link
            to="/user/member"
            class="flex items-center px-4 sm:px-6 py-3 text-base sm:text-lg hover:bg-gray-50 transition-colors group"
            :class="{ 'bg-blue-50 text-blue-600': $route.path === '/user/member' }"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              :class="
                $route.path === '/user/member'
                  ? 'bg-blue-100'
                  : 'bg-gray-100 group-hover:bg-gray-200'
              "
            >
              <font-awesome-icon
                icon="user"
                :class="[
                  'text-lg',
                  $route.path === '/user/member' ? 'text-blue-600' : 'text-gray-500'
                ]"
              />
            </div>
            <span
              class="hidden sm:inline ml-3 transition-colors"
              :class="$route.path === '/user/member' ? 'text-blue-600' : 'text-gray-600'"
            >
              会员管理
            </span>
          </router-link>

          <!-- 其他菜单项 -->
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 sm:px-6 py-3 text-base sm:text-lg hover:bg-gray-50 transition-colors group"
            :class="{ 'bg-blue-50 text-blue-600': $route.path === item.path }"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              :class="
                $route.path === item.path ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
              "
            >
              <font-awesome-icon
                :icon="item.icon"
                :class="['text-lg', $route.path === item.path ? 'text-blue-600' : 'text-gray-500']"
              />
            </div>
            <span
              class="hidden sm:inline ml-3 transition-colors"
              :class="$route.path === item.path ? 'text-blue-600' : 'text-gray-600'"
            >
              {{ item.name }}
            </span>
          </router-link>
        </div>
      </nav>

      <!-- 主内容区域 -->
      <main
        class="flex-1 ml-20 sm:ml-64 min-h-[calc(100vh-4rem)] w-[calc(100vw-5rem)] sm:w-[calc(100vw-16rem)] overflow-x-hidden"
      >
        <div class="w-full h-full p-6 sm:p-6 lg:p-8">
          <!-- <div class="h-full w-full p-4 overflow-auto"> -->
          <router-view></router-view>
          <!-- </div> -->
        </div>
      </main>
    </div>

    <!-- 版权信息 -->
    <footer
      class="bg-white py-2 text-center text-xs text-gray-500 border-t border-gray-200 w-full fixed bottom-0 left-0 right-0 z-40"
    >
      © 2024 智慧零售管理系统 版权所有
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

// 店铺信息
const storeInfo = ref({
  name: '',
  manager: ''
})

// 获取店铺信息
const fetchStoreInfo = async () => {
  try {
    // 使用/api/shops/info接口获取店铺信息
    const response = await axios.get('/api/shops/info', {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })

    console.log('店铺信息:', response.data)

    // 将完整的店铺信息保存到localStorage
    if (response.data) {
      localStorage.setItem('shopInfo', JSON.stringify(response.data))
    }

    // 更新店铺名称
    storeInfo.value.name = response.data.name || '未知店铺'

    // 找到店长信息 (position为"店长"或manager为true的用户)
    const manager = response.data.users?.find(
      (user: any) => user.position === '店长' || user.manager === true
    )

    storeInfo.value.manager = manager?.name || '未知店长'
  } catch (error: any) {
    console.error('获取店铺信息失败:', error)

    // 检查是否是身份验证错误（401 Unauthorized）
    if (error.response && error.response.status === 401) {
      ElMessage.error('您的登录已过期，请重新登录')

      // 清除认证信息
      localStorage.removeItem('token')
      localStorage.removeItem('userType')
      localStorage.removeItem('lastActivityTime')

      // 重定向到登录页
      router.push('/?timeout=true')
    }
  }
}

// 检查token是否有效
const checkTokenValidity = () => {
  const token = localStorage.getItem('token')

  // 如果没有token，直接跳转到登录页
  if (!token) {
    ElMessage.error('您尚未登录或登录已过期，请重新登录')
    router.push('/?timeout=true')
    return false
  }

  // 这里可以添加一个简单的token格式验证
  if (token.startsWith('Bearer ')) {
    try {
      // 从token中提取JWT部分（去掉Bearer前缀）
      const jwt = token.replace('Bearer ', '')
      // 简单检查JWT格式（三段式，用.分隔）
      const parts = jwt.split('.')
      if (parts.length !== 3) {
        throw new Error('无效的token格式')
      }

      // 检查token是否过期
      // 尝试解析JWT payload
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))

      // 检查exp字段（JWT标准过期时间字段，单位为秒）
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        throw new Error('token已过期')
      }

      return true
    } catch (error) {
      console.error('Token验证失败:', error)
      ElMessage.error('您的登录已过期，请重新登录')

      // 清除认证信息
      localStorage.removeItem('token')
      localStorage.removeItem('userType')
      localStorage.removeItem('lastActivityTime')

      // 重定向到登录页
      router.push('/?timeout=true')
      return false
    }
  }

  return true
}

// 定义一个定时器，定期检查token有效性
let tokenCheckInterval: number | null = null

// 在组件挂载前检查token有效性
onBeforeMount(() => {
  checkTokenValidity()
})

// 组件挂载时获取店铺信息并启动定期检查
onMounted(() => {
  // 只有token有效时才获取店铺信息
  if (checkTokenValidity()) {
    fetchStoreInfo()

    // 每5分钟检查一次token有效性
    tokenCheckInterval = window.setInterval(
      () => {
        checkTokenValidity()
      },
      5 * 60 * 1000
    )
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval)
    tokenCheckInterval = null
  }
})

// 菜单配置
const menuItems = [
  { path: '/user/shopping', name: '购物', icon: 'shopping-bag' },
  { path: '/user/cart', name: '购物车/结算', icon: 'shopping-cart' },
  { path: '/user/recharge', name: '充值管理', icon: 'wallet' },
  { path: '/user/history', name: '充值记录', icon: 'credit-card' },
  { path: '/user/pickup', name: '提货管理', icon: 'box' },
  { path: '/user/stats', name: '统计报表', icon: 'chart-line' }
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
