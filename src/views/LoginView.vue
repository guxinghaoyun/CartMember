<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute top-0 left-0 w-full h-full">
      <div class="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-float"></div>
      <div class="absolute bottom-10 right-10 w-64 h-64 bg-indigo-200 rounded-full filter blur-3xl opacity-20 animate-float-delay"></div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="w-[480px] bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-12 relative">
      <!-- Logo和标题区域 -->
      <div class="text-center mb-10">
        <div class="relative w-24 h-24 mx-auto mb-6">
          <div class="absolute inset-0 bg-blue-100 rounded-2xl rotate-6"></div>
          <div class="absolute inset-0 bg-blue-50 rounded-2xl -rotate-6"></div>
          <el-image 
            src="https://ai-public.mastergo.com/ai/img_res/38e7f1a0e577f2e66f3fad5a897e5ba6.jpg"
            class="relative w-full h-full object-cover rounded-2xl" />
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">欢迎回来</h1>
        <p class="text-gray-500">登录后开启您的专属服务</p>
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
              <font-awesome-icon icon="user" class="text-gray-400" />
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
              <font-awesome-icon icon="lock" class="text-gray-400" />
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
        <div class="text-center text-sm text-gray-500 mt-4">
          <div>管理员账号：admin / admin</div>
          <div class="mt-1">用户账号：user / user</div>
        </div>
      </el-form>
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
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

@keyframes float-delay {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delay {
  animation: float-delay 7s ease-in-out infinite;
  animation-delay: -3s;
}

/* 输入框样式 */
.input-wrapper {
  position: relative;
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(249, 250, 251, 0.5) !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 16px !important;
  height: 48px !important;
  border-radius: 0.75rem !important;
  transition: all 0.3s !important;
}

:deep(.el-input__wrapper:hover) {
  background-color: rgba(249, 250, 251, 0.7) !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
}

:deep(.el-input__prefix) {
  margin-right: 12px !important;
}

/* 登录按钮样式 */
.login-button {
  width: 100% !important;
  height: 48px !important;
  background: linear-gradient(to right, #3B82F6, #6366F1) !important;
  border: none !important;
  border-radius: 4px !important;
  font-weight: 500 !important;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.25) !important;
  transition: all 0.3s !important;
}

.login-button:hover {
  background: linear-gradient(to right, #2563EB, #4F46E5) !important;
  transform: translateY(-1px) !important;
}

.login-button:active {
  transform: translateY(1px) !important;
}
</style>