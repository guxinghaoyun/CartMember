// 首先导入日志控制模块，确保尽早拦截console方法
import './utils/logger'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 导入认证存储适配器，确保它在应用初始化前加载
import './utils/authStorage'

// Font Awesome 配置
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false // 禁止自动注入CSS
import FontAwesomeIcon from './plugins/fontawesome'

// 自定义样式
import './assets/main.css'
import './assets/tailwind.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())

app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)

// 注册 Font Awesome 组件
app.component('font-awesome-icon', FontAwesomeIcon)

// 全局挂载ElMessage
window.ElMessage = ElMessage

app.mount('#app')
