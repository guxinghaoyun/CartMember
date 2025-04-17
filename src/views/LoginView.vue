<template>
  <div
    class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 fixed inset-0 overflow-hidden login-background"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- 左上角装饰 -->
      <div
        class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-float"
      ></div>
      <!-- 右下角装饰 -->
      <div
        class="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-indigo-200 rounded-full filter blur-3xl opacity-20 animate-float-delay"
      ></div>
      <!-- 中间装饰 -->
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"
      ></div>
      <!-- 额外的装饰元素 -->
      <div
        class="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-300 rounded-full filter blur-2xl opacity-10 animate-float-slow"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/4 w-32 h-32 bg-indigo-300 rounded-full filter blur-2xl opacity-10 animate-float-delay-slow"
      ></div>

      <!-- 替换粒子效果为纯CSS背景效果 -->
      <div class="absolute inset-0 z-0 bg-grid-pattern"></div>

      <!-- 添加悬浮图形元素 -->
      <div class="absolute w-full h-full z-0 overflow-hidden">
        <!-- 右侧悬浮元素 -->
        <div
          class="absolute top-[15%] right-[10%] w-16 h-16 bg-blue-400/20 rounded-lg transform rotate-12 animate-float-icons backdrop-blur-sm border border-blue-200/30 pulse-border"
        ></div>
        <div
          class="absolute top-[25%] right-[15%] w-8 h-8 bg-indigo-400/20 rounded-full animate-float-icons-delay backdrop-blur-sm border border-indigo-200/30 pulse-border-delay"
        ></div>
        <div
          class="absolute bottom-[30%] right-[20%] w-12 h-12 bg-blue-300/20 rounded-lg transform -rotate-12 animate-float-icons-slow backdrop-blur-sm border border-blue-200/30 pulse-border"
        ></div>

        <!-- 左侧悬浮元素 -->
        <div
          class="absolute top-[20%] left-[15%] w-10 h-10 bg-indigo-400/20 rounded-lg transform rotate-45 animate-float-icons-delay backdrop-blur-sm border border-indigo-200/30 pulse-border-delay"
        ></div>
        <div
          class="absolute top-[35%] left-[10%] w-14 h-14 bg-blue-400/20 rounded-full animate-float-icons-slow backdrop-blur-sm border border-blue-200/30 pulse-border"
        ></div>
        <div
          class="absolute bottom-[25%] left-[18%] w-8 h-8 bg-indigo-300/20 rounded-lg transform -rotate-12 animate-float-icons backdrop-blur-sm border border-indigo-200/30 pulse-border-delay"
        ></div>

        <!-- 新增额外浮动方框 -->
        <div
          class="absolute top-[10%] left-[30%] w-6 h-6 bg-purple-400/10 rounded-md transform rotate-45 animate-rotate-slow backdrop-blur-sm border border-purple-200/30 pulse-border"
        ></div>
        <div
          class="absolute bottom-[15%] right-[35%] w-7 h-7 bg-blue-400/10 rounded-md transform -rotate-12 animate-rotate-delay backdrop-blur-sm border border-blue-200/30 pulse-border-delay"
        ></div>
        <div
          class="absolute top-[45%] right-[28%] w-10 h-10 bg-indigo-400/10 rounded-md animate-scale backdrop-blur-sm border border-indigo-200/30 pulse-border"
        ></div>
        <div
          class="absolute bottom-[40%] left-[25%] w-12 h-12 bg-blue-400/10 rounded-md animate-scale-delay backdrop-blur-sm border border-blue-200/30 pulse-border-delay"
        ></div>
      </div>
    </div>

    <!-- 主内容区域 - 分为两栏 -->
    <div
      class="container mx-auto px-4 z-10 flex items-center justify-center gap-8 lg:gap-16 max-w-6xl"
    >
      <!-- 左侧品牌宣传区域 -->
      <div class="hidden md:flex md:w-1/2 flex-col items-start justify-center p-8">
        <div class="mb-8 transform hover:scale-105 transition-all duration-500">
          <div class="relative w-20 h-20 mb-6">
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl rotate-6 opacity-80"
            ></div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl -rotate-3 opacity-80"
            ></div>
            <el-image
              src="https://ai-public.mastergo.com/ai/img_res/38e7f1a0e577f2e66f3fad5a897e5ba6.jpg"
              class="relative w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>
          <h1 class="text-4xl font-bold text-gray-800 mb-3">智慧零售管理系统</h1>
          <p class="text-xl text-gray-600 mb-2">全方位提升您的零售业务</p>
        </div>

        <div class="space-y-6 text-gray-600">
          <div class="flex items-center space-x-3 transform hover:translate-x-2 transition-all">
            <div
              class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <font-awesome-icon icon="chart-line" class="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">数据分析</h3>
              <p class="text-sm">实时监控销售数据，洞察市场趋势</p>
            </div>
          </div>

          <div class="flex items-center space-x-3 transform hover:translate-x-2 transition-all">
            <div
              class="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center"
            >
              <font-awesome-icon icon="box" class="text-indigo-600 text-xl" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">库存管理</h3>
              <p class="text-sm">智能化库存追踪，降低运营成本</p>
            </div>
          </div>

          <div class="flex items-center space-x-3 transform hover:translate-x-2 transition-all">
            <div
              class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <font-awesome-icon icon="users" class="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">客户管理</h3>
              <p class="text-sm">深入了解客户需求，提升忠诚度</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录卡片 -->
      <div
        class="w-full md:w-1/2 max-w-[480px] relative transform hover:scale-[1.02] transition-all duration-300 login-card-container"
      >
        <!-- 卡片背景 -->
        <div class="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-2xl shadow-custom"></div>

        <!-- 卡片光晕效果 -->
        <div
          class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-20 blur-sm card-glow"
        ></div>

        <!-- 卡片内容 -->
        <div class="relative p-8 sm:p-12">
          <!-- 会话超时提示 -->
          <div
            v-if="sessionTimedOut"
            class="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 transform hover:scale-[1.01] transition-all"
          >
            <div class="flex items-center">
              <font-awesome-icon
                icon="exclamation-triangle"
                class="mr-2 text-amber-500 pulse-warning"
              />
              <span>您的会话已过期，请重新登录</span>
            </div>
          </div>

          <!-- Logo和标题区域 -->
          <div class="text-center mb-8">
            <div
              class="relative w-20 h-20 mx-auto mb-5 transform hover:rotate-12 transition-all duration-500 logo-container md:hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl rotate-6 opacity-70"
              ></div>
              <div
                class="absolute inset-0 bg-gradient-to-tr from-blue-300 to-indigo-300 rounded-2xl -rotate-6 opacity-70"
              ></div>
              <el-image
                src="https://ai-public.mastergo.com/ai/img_res/38e7f1a0e577f2e66f3fad5a897e5ba6.jpg"
                class="relative w-full h-full object-cover rounded-2xl shadow-lg logo-image"
              />
            </div>
            <h1
              class="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-animate bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent title-text"
            >
              欢迎回来
            </h1>
            <p class="text-gray-700 subtitle-text">登录后开启您的专属服务</p>
          </div>

          <!-- 登录表单 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="space-y-6">
            <!-- 用户名输入框 -->
            <el-form-item prop="username" class="input-wrapper">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                class="custom-input"
                @focus="handleInputFocus"
                @blur="handleInputBlur"
              >
                <template #prefix>
                  <font-awesome-icon icon="user" class="text-blue-500 text-lg input-icon" />
                </template>
              </el-input>
              <div class="input-progress-bar"></div>
            </el-form-item>

            <!-- 密码输入框 -->
            <el-form-item prop="password" class="input-wrapper">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                class="custom-input"
                show-password
                @focus="handleInputFocus"
                @blur="handleInputBlur"
              >
                <template #prefix>
                  <font-awesome-icon icon="lock" class="text-blue-500 text-lg input-icon" />
                </template>
              </el-input>
              <div class="input-progress-bar"></div>
            </el-form-item>

            <!-- 登录按钮 -->
            <el-button
              type="primary"
              class="login-button"
              :loading="loading"
              @click="handleSubmit"
              @mouseenter="handleButtonHover"
            >
              <span class="relative z-10">登录</span>
              <span class="btn-shine"></span>
            </el-button>

            <!-- 其他登录选项 -->
            <div class="mt-6 text-center">
              <p class="text-gray-500 text-sm flex items-center justify-center space-x-6">
                <a
                  href="#"
                  class="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                >
                  <font-awesome-icon icon="question-circle" class="mr-1" />
                  忘记密码
                </a>
                <a
                  href="#"
                  class="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                >
                  <font-awesome-icon icon="headset" class="mr-1" />
                  联系客服
                </a>
              </p>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <footer
      class="bg-transparent backdrop-blur-none py-2 text-center text-xs text-gray-500 border-t border-gray-200/10 w-full fixed bottom-0 left-0 right-0 z-40"
    >
      © 2024 智慧零售管理系统 版权所有
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { login } from '@/api/login'
import type { LoginParams } from '@/types/api/login'

const router = useRouter()
const route = useRoute()

// 会话超时状态
const sessionTimedOut = ref(false)

// 表单引用
const loginFormRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 表单数据
const loginForm = reactive<LoginParams>({
  username: '',
  password: '',
  remember: false
})

// 添加节流函数，减少事件处理频率
const throttle = (fn: Function, delay: number) => {
  let lastCall = 0
  return function (this: any, ...args: any[]) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn.apply(this, args)
    }
  }
}

// 检查是否是因为会话超时被重定向到登录页
onMounted(() => {
  sessionTimedOut.value = route.query.timeout === 'true'

  // 添加鼠标移动交互效果(优化版)
  addMouseInteraction()
})

// 优化后的鼠标移动交互效果
const addMouseInteraction = () => {
  const container = document.querySelector('.login-background')
  if (container) {
    // 使用节流函数，降低处理频率，每50ms处理一次
    const throttledMouseMove = throttle((e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      const card = document.querySelector('.login-card-container')
      if (card) {
        // 根据鼠标位置微调卡片角度和阴影
        const rotateX = (y - 0.5) * 4
        const rotateY = (x - 0.5) * -4
        card.setAttribute(
          'style',
          `transform: perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg); box-shadow: ${rotateY / 2}px ${rotateX / 2}px 30px rgba(0,0,0,0.1)`
        )
      }
    }, 50)

    container.addEventListener('mousemove', (e: Event) => {
      throttledMouseMove(e as MouseEvent)
    })

    container.addEventListener('mouseleave', () => {
      const card = document.querySelector('.login-card-container')
      if (card) {
        // 恢复默认状态
        card.setAttribute('style', '')
      }
    })
  }
}

// 处理输入框焦点效果
const handleInputFocus = (e: Event) => {
  const target = e.target as HTMLElement
  const wrapper = target.closest('.input-wrapper')
  if (wrapper) {
    const progressBar = wrapper.querySelector('.input-progress-bar')
    if (progressBar) {
      progressBar.classList.add('active')
    }
  }
}

const handleInputBlur = (e: Event) => {
  const target = e.target as HTMLElement
  const wrapper = target.closest('.input-wrapper')
  if (wrapper) {
    const progressBar = wrapper.querySelector('.input-progress-bar')
    if (progressBar) {
      progressBar.classList.remove('active')
    }
  }
}

// 按钮悬停效果
const handleButtonHover = () => {
  const btnShine = document.querySelector('.btn-shine')
  if (btnShine) {
    btnShine.classList.add('animate-shine')

    // 动画结束后移除类名
    setTimeout(() => {
      btnShine.classList.remove('animate-shine')
    }, 1000)
  }
}

// 表单验证规则
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ]
})

// 提交处理
const handleSubmit = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    // 调用登录API
    const response = await login(loginForm)

    // 保存登录信息
    localStorage.setItem('token', response.token)
    localStorage.setItem('userType', response.userType)
    localStorage.setItem('user', JSON.stringify(response.userInfo))

    ElMessage.success(`${response.userType === 'admin' ? '管理员' : '用户'}登录成功`)
    router.push(`/${response.userType}`)
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 浮动动画 */
@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

@keyframes float-delay {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(-5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delay {
  animation: float-delay 7s ease-in-out infinite;
  animation-delay: -3s;
}

/* 添加新的动画 */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}

@keyframes float-slow {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-20px, -20px) rotate(5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@keyframes float-delay-slow {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(20px, -20px) rotate(-5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 10s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 15s ease-in-out infinite;
}

.animate-float-delay-slow {
  animation: float-delay-slow 15s ease-in-out infinite;
  animation-delay: -7s;
}

/* 卡片样式增强 */
.login-card-container {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-style: preserve-3d;
}

.shadow-custom {
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 5px 15px rgba(0, 0, 0, 0.05);
}

.card-glow {
  transition: opacity 0.3s ease;
}

.login-card-container:hover .card-glow {
  opacity: 0.3;
}

/* Logo动画效果 */
.logo-container {
  perspective: 1000px;
}

.logo-image {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-container:hover .logo-image {
  transform: scale(1.05);
}

/* 标题文字效果 */
.title-text {
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.subtitle-text {
  transition: all 0.3s ease;
  opacity: 0.9;
}

.title-text:hover {
  letter-spacing: 1px;
}

/* 背景渐变动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-animate {
  background-size: 400% 400%;
  animation: gradient 8s ease infinite;
}

/* 确保页面不会滚动 */
:deep(body) {
  overflow: hidden;
}

/* 输入框样式增强 */
.input-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.input-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(to right, #3b82f6, #6366f1);
  transition: width 0.3s ease;
  border-radius: 2px;
  opacity: 0;
}

.input-progress-bar.active {
  width: 100%;
  opacity: 1;
}

.input-icon {
  transition: all 0.3s ease;
}

:deep(.el-form-item__content) {
  border: none !important;
}

:deep(.el-form-item) {
  margin-bottom: 24px !important;
  border: none !important;
}

:deep(.el-form-item__error) {
  padding-top: 4px !important;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.7) !important;
  box-shadow: none !important;
  border: 2px solid transparent !important;
  padding: 0 16px !important;
  height: 50px !important;
  border-radius: 0.75rem !important;
  transition: all 0.3s !important;
  backdrop-filter: blur(8px) !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.el-input__wrapper:hover) {
  background-color: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(59, 130, 246, 0.1) !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.1) !important;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(59, 130, 246, 1) !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15) !important;
  transform: translateY(-2px);
}

:deep(.el-input__inner) {
  color: #1f2937 !important;
  font-weight: 500 !important;
  height: 100% !important;
  box-shadow: none !important;
}

:deep(.el-input__inner::placeholder) {
  color: #6b7280 !important;
  font-weight: normal !important;
}

:deep(.el-input__prefix) {
  margin-right: 12px !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.el-input__prefix-inner) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 24px !important;
  height: 24px !important;
}

:deep(.el-input__prefix .svg-inline--fa) {
  transition: transform 0.3s ease !important;
}

:deep(.el-input__wrapper.is-focus .el-input__prefix .svg-inline--fa) {
  transform: scale(1.2) !important;
  color: #2563eb !important;
}

/* 登录按钮样式增强 */
.login-button {
  position: relative !important;
  overflow: hidden !important;
  width: 100% !important;
  height: 52px !important;
  background: linear-gradient(to right, #3b82f6, #6366f1) !important;
  border: none !important;
  border-radius: 0.75rem !important;
  font-weight: 600 !important;
  font-size: 1.05rem !important;
  letter-spacing: 1px !important;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5) !important;
  transition: all 0.4s !important;
}

.login-button:hover {
  background: linear-gradient(to right, #2563eb, #4f46e5) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 20px 30px -10px rgba(59, 130, 246, 0.6) !important;
}

.login-button:active {
  transform: translateY(1px) !important;
  box-shadow: 0 5px 10px -3px rgba(59, 130, 246, 0.25) !important;
}

/* 按钮闪光效果 */
.btn-shine {
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  ) !important;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

.animate-shine {
  animation: shine 1s ease-in-out;
}

/* 警告动画 */
@keyframes pulse-warning {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.pulse-warning {
  animation: pulse-warning 2s infinite;
}

/* 悬浮图标动画 */
@keyframes float-icons {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(15deg) scale(1.15);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes float-icons-delay {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-25px) rotate(-15deg) scale(1.2);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes float-icons-slow {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg) scale(1.1);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

/* 新增旋转动画 */
@keyframes rotate-slow {
  0% {
    transform: rotate(0deg) translateY(0) scale(1);
  }
  50% {
    transform: rotate(180deg) translateY(-20px) scale(1.3);
  }
  100% {
    transform: rotate(360deg) translateY(0) scale(1);
  }
}

@keyframes rotate-delay {
  0% {
    transform: rotate(0deg) translateY(0) scale(1);
  }
  50% {
    transform: rotate(-180deg) translateY(-15px) scale(1.25);
  }
  100% {
    transform: rotate(-360deg) translateY(0) scale(1);
  }
}

/* 新增缩放动画 */
@keyframes scale {
  0% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.5) translateY(-15px);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

@keyframes scale-delay {
  0% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.4) translateY(-10px);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

/* 边框脉冲动画 */
@keyframes pulse-border-anim {
  0%,
  100% {
    border-color: rgba(191, 219, 254, 0.3);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
  50% {
    border-color: rgba(96, 165, 250, 0.8);
    box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.5);
  }
}

@keyframes pulse-border-anim-delay {
  0%,
  100% {
    border-color: rgba(165, 180, 252, 0.3);
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
  }
  50% {
    border-color: rgba(99, 102, 241, 0.8);
    box-shadow: 0 0 20px 5px rgba(79, 70, 229, 0.5);
  }
}

.animate-float-icons {
  animation: float-icons 5s ease-in-out infinite;
}

.animate-float-icons-delay {
  animation: float-icons-delay 7s ease-in-out infinite;
  animation-delay: -2s;
}

.animate-float-icons-slow {
  animation: float-icons-slow 9s ease-in-out infinite;
  animation-delay: -4s;
}

.animate-rotate-slow {
  animation: rotate-slow 12s linear infinite;
}

.animate-rotate-delay {
  animation: rotate-delay 15s linear infinite;
  animation-delay: -3s;
}

.animate-scale {
  animation: scale 7s ease-in-out infinite;
}

.animate-scale-delay {
  animation: scale-delay 8s ease-in-out infinite;
  animation-delay: -2s;
}

.pulse-border {
  animation: pulse-border-anim 4s infinite;
}

.pulse-border-delay {
  animation: pulse-border-anim-delay 5s infinite;
  animation-delay: -2s;
}

/* 背景网格图案 */
.bg-grid-pattern {
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
