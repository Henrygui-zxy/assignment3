// 应用入口文件：创建 Vue 实例，注册路由和 Element Plus
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
// 引入 Element Plus 的样式文件
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

// 创建 Vue 应用实例
const app = createApp(App)

// 注册路由插件
app.use(router)
// 注册 Element Plus 组件库
app.use(ElementPlus)

// 挂载到 index.html 中的 #app 节点
app.mount('#app')
