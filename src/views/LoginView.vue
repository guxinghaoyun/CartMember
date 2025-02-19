<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 fixed inset-0 overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- 左上角装饰 -->
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-float"></div>
      <!-- 右下角装饰 -->
      <div class="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-indigo-200 rounded-full filter blur-3xl opacity-20 animate-float-delay"></div>
      <!-- 中间装饰 -->
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <!-- 额外的装饰元素 -->
      <div class="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-300 rounded-full filter blur-2xl opacity-10 animate-float-slow"></div>
      <div class="absolute bottom-1/4 left-1/4 w-32 h-32 bg-indigo-300 rounded-full filter blur-2xl opacity-10 animate-float-delay-slow"></div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="w-[480px] relative transform hover:scale-[1.02] transition-all duration-300 z-10">
      <!-- 卡片背景 -->
      <div class="absolute inset-0 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl"></div>
      
      <!-- 卡片内容 -->
      <div class="relative p-12">
        <!-- Logo和标题区域 -->
        <div class="text-center mb-10">
          <div class="relative w-24 h-24 mx-auto mb-6 transform hover:rotate-6 transition-all duration-300">
            <div class="absolute inset-0 bg-blue-100 rounded-2xl rotate-6"></div>
            <div class="absolute inset-0 bg-blue-50 rounded-2xl -rotate-6"></div>
            <el-image 
              src="https://ai-public.mastergo.com/ai/img_res/38e7f1a0e577f2e66f3fad5a897e5ba6.jpg"
              class="relative w-full h-full object-cover rounded-2xl shadow-lg" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">欢迎回来</h1>
          <p class="text-gray-700">登录后开启您的专属服务</p>
        </div>

        <!-- 登录表单 -->
        <el-form 
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="space-y-6">
          
          <!-- 用户名输入框 -->
          <el-form-item prop="username" class="input-wrapper">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名/手机号"
              class="custom-input">
              <template #prefix>
                <font-awesome-icon icon="user" class="text-blue-500 text-lg" />
              </template>
            </el-input>
          </el-form-item>
          
          <!-- 密码输入框 -->
          <el-form-item prop="password" class="input-wrapper">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              class="custom-input"
              show-password>
              <template #prefix>
                <font-awesome-icon icon="lock" class="text-blue-500 text-lg" />
              </template>
            </el-input>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleSubmit">
            登录
          </el-button>

          <!-- 测试账号提示 -->
          <div class="text-center text-sm text-gray-600 mt-4">
            <div class="bg-gray-50/50 rounded-lg px-4 py-3 backdrop-blur-sm">
              <div class="font-medium text-gray-700 mb-1">测试账号</div>
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">管理员账号：</span>
                  <code class="bg-white/80 px-2 py-0.5 rounded text-gray-800 font-medium">admin / admin</code>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">用户账号：</span>
                  <code class="bg-white/80 px-2 py-0.5 rounded text-gray-800 font-medium">user / user</code>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

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
    
    // 用户验证逻辑
    if (loginForm.username === 'admin' && loginForm.password === 'admin') {
      // 管理员登录
      localStorage.setItem('token', 'admin-token')
      localStorage.setItem('userType', 'admin')
      localStorage.setItem('user', JSON.stringify({
        name: '管理员',
        role: '店长',
        store: '天河城分店'
      }))
      
      ElMessage.success('管理员登录成功')
      router.push('/admin')
    } else if (loginForm.username === 'user' && loginForm.password === 'user') {
      // 普通用户登录
      localStorage.setItem('token', 'user-token')
      localStorage.setItem('userType', 'user')
      localStorage.setItem('user', JSON.stringify({
        name: '陈思远',
        role: '会员',
        points: 2580
      }))
      
      ElMessage.success('用户登录成功')
      router.push('/user')
    } else {
      ElMessage.error('用户名或密码错误')
    }
    
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 浮动动画 */
@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes float-delay {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(-5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
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
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}

@keyframes float-slow {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-20px, -20px) rotate(5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes float-delay-slow {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, -20px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
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

/* 确保页面不会滚动 */
:deep(body) {
  overflow: hidden;
}

/* 输入框样式 */
.input-wrapper {
  position: relative;
  margin-bottom: 24px;
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
  background-color: rgba(255, 255, 255, 0.9) !important;
  box-shadow: none !important;
  border: 2px solid transparent !important;
  padding: 0 16px !important;
  height: 48px !important;
  border-radius: 0.75rem !important;
  transition: all 0.3s !important;
  backdrop-filter: blur(8px) !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.el-input__wrapper:hover) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(59, 130, 246, 0.1) !important;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: rgba(255, 255, 255, 1) !important;
  border-color: rgba(59, 130, 246, 1) !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
}

:deep(.el-input__inner) {
  color: #1f2937 !important;
  font-weight: 500 !important;
  height: 100% !important;
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
  transform: scale(1.1) !important;
}

/* 登录按钮样式 */
.login-button {
  width: 100% !important;
  height: 48px !important;
  background: linear-gradient(to right, #3B82F6, #6366F1) !important;
  border: none !important;
  border-radius: 0.75rem !important;
  font-weight: 500 !important;
  font-size: 1rem !important;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.25) !important;
  transition: all 0.3s !important;
}

.login-button:hover {
  background: linear-gradient(to right, #2563EB, #4F46E5) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 15px 20px -3px rgba(59, 130, 246, 0.35) !important;
}

.login-button:active {
  transform: translateY(1px) !important;
  box-shadow: 0 5px 10px -3px rgba(59, 130, 246, 0.25) !important;
}

/* 背景渐变动画 */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.bg-gradient-animate {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}
</style>