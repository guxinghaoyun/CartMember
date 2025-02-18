import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/components/layout/admin/AdminLayout.vue'
import UserLayout from '@/components/layout/user/UserLayout.vue'
import LoginView from '@/views/LoginView.vue'

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
