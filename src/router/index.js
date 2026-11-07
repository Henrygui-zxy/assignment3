// 路由配置文件
import { createRouter, createWebHistory } from 'vue-router'
import Assignment3 from '../views/Assignment3.vue'

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory(),
  routes: [
    {
      // 默认路径重定向到实验页面
      path: '/',
      redirect: '/assignment3'
    },
    {
      // 前端实验作业3：智慧云课堂平台页面
      path: '/assignment3',
      name: 'Assignment3',
      component: Assignment3
    }
  ]
})

export default router
