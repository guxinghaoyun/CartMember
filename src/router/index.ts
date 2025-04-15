import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/components/layout/admin/AdminLayout.vue'
import UserLayout from '@/components/layout/user/UserLayout.vue'
import LoginView from '@/views/LoginView.vue'

// 设置会话超时时间（毫秒）
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30分钟

// 存储上次活动时间
let lastActivityTime = Date.now()

// 更新活动时间的函数
const updateActivityTime = () => {
  lastActivityTime = Date.now()
  localStorage.setItem('lastActivityTime', lastActivityTime.toString())
}

// 检查会话是否超时
const isSessionTimedOut = () => {
  const storedTime = localStorage.getItem('lastActivityTime')
  if (!storedTime) return false

  const lastActivity = parseInt(storedTime)
  return Date.now() - lastActivity > SESSION_TIMEOUT
}

// 监听用户活动
if (typeof window !== 'undefined') {
  // 页面加载时初始化lastActivityTime
  const storedTime = localStorage.getItem('lastActivityTime')
  if (storedTime) {
    lastActivityTime = parseInt(storedTime)
  } else {
    updateActivityTime()
  }

  // 添加活动事件监听器
  ;['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, updateActivityTime, true)
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/login',
      redirect: '/'
    },
    {
      path: '/user',
      component: UserLayout,
      redirect: '/user/member',
      meta: { requiresAuth: true, userType: 'user' },
      children: [
        {
          path: 'member',
          name: 'user-member',
          component: () => import('@/views/user/member/MemberList.vue')
        },
        {
          path: 'shopping',
          name: 'user-shopping',
          component: () => import('@/views/user/shopping/ProductList.vue')
        },
        {
          path: 'cart',
          name: 'user-cart',
          component: () => import('@/views/user/shopping/ShoppingCart.vue')
        },
        {
          path: 'recharge',
          name: 'user-recharge',
          component: () => import('@/views/user/recharge/RechargeForm.vue')
        },
        {
          path: 'history',
          name: 'user-recharge-history',
          component: () => import('@/views/user/recharge/RechargeHistory.vue')
        },
        {
          path: 'pickup',
          name: 'user-pickup',
          component: () => import('@/views/user/pickup/PickupList.vue')
        },
        {
          path: 'stats',
          name: 'user-stats',
          component: () => import('@/views/user/statistics/Dashboard.vue')
        }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      redirect: '/admin/store',
      meta: { requiresAuth: true, userType: 'admin' },
      children: [
        {
          path: 'store',
          name: 'admin-store',
          component: () => import('@/views/admin/store/StoreList.vue')
        },
        {
          path: 'card',
          name: 'admin-card',
          component: () => import('@/views/admin/card/CardList.vue')
        },
        {
          path: 'product',
          name: 'admin-product',
          component: () => import('@/views/admin/product/ProductList.vue')
        },
        {
          path: 'member',
          name: 'admin-member',
          component: () => import('@/views/admin/member/MemberList.vue')
        },
        {
          path: 'member/:id',
          name: 'admin-member-detail',
          component: () => import('@/views/admin/member/MemberDetail.vue')
        },
        {
          path: 'stats',
          name: 'admin-stats',
          component: () => import('@/views/admin/statistics/Dashboard.vue')
        },
        {
          path: 'log',
          name: 'admin-log',
          component: () => import('@/views/admin/log/SystemLog.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')

  // 检查会话是否超时（仅对已认证用户）
  if (isAuthenticated && isSessionTimedOut() && to.meta.requiresAuth) {
    // 清除认证信息
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    localStorage.removeItem('lastActivityTime')

    // 重定向到登录页，并带上超时提示参数
    next({ path: '/', query: { timeout: 'true' } })
    // 刷新页面
    window.location.reload()
    return
  }

  // 如果访问登录页
  if (to.path === '/') {
    // 已登录则重定向到对应的首页
    if (isAuthenticated) {
      next(userType === 'admin' ? '/admin' : '/user')
    } else {
      next()
    }
    return
  }

  // 如果未登录，重定向到登录页
  if (!isAuthenticated && to.meta.requiresAuth) {
    next('/')
    return
  }

  // 检查用户权限
  if (to.meta.requiresAuth) {
    if (to.meta.userType && to.meta.userType !== userType) {
      next(userType === 'admin' ? '/admin' : '/user')
      return
    }
  }

  next()
})

export default router
