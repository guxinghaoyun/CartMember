import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

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
app.use(router)
app.use(ElementPlus)

// 注册 Font Awesome 组件
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')