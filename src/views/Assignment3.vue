<template>
  <div class="page">
    <!-- ====== 顶部导航栏 ====== -->
    <el-header class="navbar">
      <div class="navbar-inner">
        <!-- 平台 Logo 与名称 -->
        <div class="logo">
          <el-icon :size="28" color="#409EFF"><Reading /></el-icon>
          <span class="logo-text">智慧云课堂</span>
        </div>
        <!-- 导航菜单 -->
        <el-menu
          mode="horizontal"
          :default-active="activeNav"
          class="nav-menu"
          background-color="#ffffff"
          text-color="#333333"
          active-text-color="#409EFF"
        >
          <el-menu-item index="home">首页</el-menu-item>
          <el-menu-item index="courses">全部课程</el-menu-item>
          <el-menu-item index="record">学习记录</el-menu-item>
          <el-menu-item index="help">帮助中心</el-menu-item>
        </el-menu>
        <!-- 导航栏搜索框：按课程名称关键字过滤 -->
        <el-input
          v-model="searchKey"
          class="nav-search"
          placeholder="搜索课程"
          clearable
          :prefix-icon="Search"
        />
        <!-- 用户头像区域 -->
        <div class="user-area">
          <el-avatar :size="36" icon="UserFilled" />
        </div>
      </div>
    </el-header>

    <!-- ====== 轮播 Banner ====== -->
    <el-carousel height="360px" class="banner">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <!-- 使用渐变色背景 + 文字，无需外部图片 -->
        <div class="banner-item" :style="{ background: item.bg }">
          <h2 class="banner-title">{{ item.title }}</h2>
          <p class="banner-desc">{{ item.desc }}</p>
          <el-button type="primary" round size="large">立即学习</el-button>
        </div>
      </el-carousel-item>
    </el-carousel>

    <!-- ====== 精选课程列表 ====== -->
    <div class="section">
      <h2 class="section-title">精选课程</h2>
      <el-empty v-if="filteredCourses.length === 0" description="没有匹配的课程" />
      <!-- el-row / el-col 栅格布局：一行4个课程卡片 -->
      <el-row :gutter="20">
        <el-col
          :xs="24" :sm="12" :md="8" :lg="6"
          v-for="course in filteredCourses"
          :key="course.id"
        >
          <!-- el-card 课程卡片 -->
          <el-card shadow="hover" class="course-card">
            <!-- 课程封面（渐变色占位） -->
            <div class="course-cover" :style="{ background: course.color }">
              <el-icon :size="48" color="#ffffff"><VideoCamera /></el-icon>
            </div>
            <!-- 课程信息 -->
            <div class="course-info">
              <h3 class="course-name">{{ course.name }}</h3>
              <!-- 课程内容简介 -->
              <p class="course-content">{{ course.content }}</p>
              <!-- 课程归属大类标记 -->
              <el-tag size="small" class="course-category">{{ course.category }}</el-tag>
              <!-- 讲师 / 课时 信息行 -->
              <div class="course-meta">
                <span>讲师：{{ course.teacher }}</span>
                <span>{{ course.hours }}课时</span>
              </div>
              <div class="course-bottom">
                <!-- 价格：0 显示为免费 -->
                <span class="course-price" :class="{ free: course.price === 0 }">
                  {{ course.price === 0 ? '免费' : '¥' + course.price }}
                </span>
                <!-- 立即学习按钮：点击弹出浮层提示已加入学习 -->
                <el-button type="primary" size="small" round @click="joinCourse(course)">
                  立即学习
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- ====== 我的学习记录（表格形式） ====== -->
    <div class="section">
      <h2 class="section-title">我的学习记录</h2>
      <el-card shadow="never" class="record-table-card">
        <el-table :data="recordList" stripe style="width: 100%">
          <!-- 序号列：使用表格自带索引 -->
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column prop="name" label="课程名称" min-width="180" />
          <el-table-column prop="chapter" label="当前章节" min-width="200" />
          <!-- 学习进度列：进度条 + 百分比 -->
          <el-table-column label="学习进度" width="220">
            <template #default="{ row }">
              <el-progress
                :percentage="row.progress"
                :stroke-width="10"
                striped
                striped-flow
              />
            </template>
          </el-table-column>
          <!-- 状态列：学习中 / 已完成 标记 -->
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.progress === 100 ? 'success' : 'primary'">
                {{ row.progress === 100 ? '已完成' : '学习中' }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 操作列：继续学习按钮 -->
          <el-table-column label="操作" width="120" align="center">
            <template #default="{ row }">
              <el-button type="primary" link @click="continueLearn(row)">继续学习</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- ====== 帮助中心：常见问题解答（下拉展开答案） ====== -->
    <div class="section">
      <h2 class="section-title">帮助中心</h2>
      <el-card shadow="never" class="help-card">
        <!-- el-collapse 手风琴模式：点击问题展开答案 -->
        <el-collapse accordion>
          <el-collapse-item
            v-for="faq in faqList"
            :key="faq.id"
            :title="faq.question"
            :name="faq.id"
          >
            <p class="faq-answer">{{ faq.answer }}</p>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>

    <!-- ====== 底部版权 Footer（含意见反馈按钮） ====== -->
    <el-footer class="footer">
      <p>© 2026 智慧云课堂平台 · 前端实验作业3 · Vue3 + Element Plus</p>
      <!-- 点击打开意见反馈弹窗 -->
      <el-button type="primary" link class="feedback-btn" @click="dialogVisible = true">
        意见反馈
      </el-button>
    </el-footer>

    <!-- ====== 意见反馈弹窗 ====== -->
    <el-dialog
      v-model="dialogVisible"
      title="意见反馈"
      width="480px"
      :close-on-click-modal="false"
    >
      <!-- 表单：:rules 绑定校验规则，校验失败时在字段下方显示红字提示 -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="反馈类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择反馈类型" style="width: 100%">
            <el-option
              v-for="t in feedbackTypes"
              :key="t"
              :label="t"
              :value="t"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您的问题或建议"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 使用 Vue3 组合式 API
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
// 引入 Element Plus 图标组件
import { Reading, VideoCamera, Search } from '@element-plus/icons-vue'

// 当前激活的导航菜单项
const activeNav = ref('home')

// 搜索关键字：绑定导航栏搜索框，用于过滤课程
const searchKey = ref('')

// 轮播 Banner 数据
const bannerList = ref([
  {
    id: 1,
    title: '智慧云课堂，学习永不下课',
    desc: '海量优质课程，随时随地开启你的学习之旅',
    bg: 'linear-gradient(135deg, #409EFF 0%, #53a8ff 100%)'
  },
  {
    id: 2,
    title: '名师在线，精品课程',
    desc: '汇聚行业名师，打造高质量在线课程体系',
    bg: 'linear-gradient(135deg, #67C23A 0%, #95d475 100%)'
  },
  {
    id: 3,
    title: '因材施教，智能推荐',
    desc: '基于学习大数据，为你智能推荐合适的课程',
    bg: 'linear-gradient(135deg, #E6A23C 0%, #eebe77 100%)'
  }
])

// 精选课程数据（含课程内容、归属大类、讲师、课时、价格）
const courseList = ref([
  { id: 1, name: 'Vue3 从入门到精通', content: '掌握组合式 API、路由与状态管理，独立开发前端工程化项目', category: '前端开发', teacher: '张老师', hours: 36, price: 199, color: 'linear-gradient(135deg, #409EFF, #79bbff)' },
  { id: 2, name: 'Python 数据分析实战', content: '从 NumPy 到 Pandas，结合真实数据集完成可视化分析报告', category: '数据科学', teacher: '李老师', hours: 42, price: 249, color: 'linear-gradient(135deg, #67C23A, #b3e19d)' },
  { id: 3, name: 'Java 后端开发基础', content: '面向对象、集合框架到 Spring Boot，打下扎实的后端开发功底', category: '后端开发', teacher: '王老师', hours: 48, price: 299, color: 'linear-gradient(135deg, #E6A23C, #f3d19e)' },
  { id: 4, name: 'UI 设计入门与进阶', content: '配色、布局与组件设计规范，学会使用 Figma 完成界面设计', category: '界面设计', teacher: '刘老师', hours: 30, price: 159, color: 'linear-gradient(135deg, #F56C6C, #fab6b6)' },
  { id: 5, name: '机器学习理论与实践', content: '从线性回归到神经网络，配合案例讲解常用机器学习算法', category: '人工智能', teacher: '陈老师', hours: 52, price: 399, color: 'linear-gradient(135deg, #909399, #cdd0d6)' },
  { id: 6, name: 'MySQL 数据库优化', content: '索引原理、SQL 调优与分库分表，让查询性能提升一个量级', category: '数据库', teacher: '赵老师', hours: 28, price: 179, color: 'linear-gradient(135deg, #7c3aed, #b794f6)' },
  { id: 7, name: '微信小程序开发', content: '从零开发一款完整小程序，涵盖云开发、支付与发布上线全流程', category: '移动开发', teacher: '孙老师', hours: 40, price: 0, color: 'linear-gradient(135deg, #07c160, #6dd400)' },
  { id: 8, name: '计算机网络原理', content: 'TCP/IP 协议栈逐层拆解，结合抓包实验理解网络通信本质', category: '计算机基础', teacher: '周老师', hours: 44, price: 0, color: 'linear-gradient(135deg, #3b82f6, #93c5fd)' }
])

// 根据搜索关键字过滤课程（按课程名称模糊匹配）
const filteredCourses = computed(() =>
  courseList.value.filter(c => c.name.includes(searchKey.value.trim()))
)

// 我的学习记录数据（含当前章节与学习进度）
const recordList = ref([
  { id: 1, name: 'Vue3 从入门到精通', chapter: '第3章 组合式 API 详解', progress: 68 },
  { id: 2, name: 'Python 数据分析实战', chapter: '第2章 Pandas 数据处理', progress: 45 },
  { id: 3, name: 'Java 后端开发基础', chapter: '第6章 Spring Boot 实战', progress: 100 }
])

// 点击"立即学习"：弹出浮层提示已加入学习该课程
const joinCourse = (course) => {
  ElMessage.success(`已加入学习《${course.name}》`)
}

// 点击"继续学习"：提示继续学习当前章节
const continueLearn = (row) => {
  ElMessage.info(`继续学习《${row.name}》：${row.chapter}`)
}

// 帮助中心常见问题数据
const faqList = ref([
  {
    id: 1,
    question: '如何购买课程？',
    answer: '在精选课程中选择心仪的课程，点击卡片右下角的"立即学习"按钮即可完成选购，支付成功后课程将自动加入您的学习列表。'
  },
  {
    id: 2,
    question: '课程是否支持永久回看？',
    answer: '所有已购买的课程均支持永久回看，您可以随时在"我的学习记录"中继续上一次的学习进度，系统会自动保存学习进度。'
  },
  {
    id: 3,
    question: '遇到问题如何联系客服？',
    answer: '您可以点击页面底部的"意见反馈"按钮提交问题，客服会在 1 个工作日内通过邮箱与您联系；也可以在工作日 9:00-18:00 拨打客服热线。'
  }
])

// ====== 意见反馈弹窗相关 ======

// 弹窗显示状态
const dialogVisible = ref(false)
// 表单引用：用于调用表单校验方法
const formRef = ref(null)

// 反馈类型下拉框选项
const feedbackTypes = ['课程内容问题', '平台功能建议', '账户与支付问题', '其他']

// 反馈表单数据
const form = ref({
  name: '',
  email: '',
  type: '',
  description: ''
})

// 表单校验规则：必填项为空时在对应字段下方显示红字提示
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择反馈类型', trigger: 'change' }],
  description: [{ required: true, message: '请填写详细描述', trigger: 'blur' }]
}

// 取消：关闭弹窗并重置表单和校验状态
const handleCancel = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

// 提交：先触发整体校验，全部通过才提示成功并关闭弹窗
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('反馈提交成功，感谢您的意见！')
      dialogVisible.value = false
      formRef.value?.resetFields()
    }
    // 校验不通过时，el-form 会自动在各字段下方显示红字错误提示
  })
}
</script>

<style scoped>
/* ====== 页面整体 ====== */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ====== 顶部导航栏 ====== */
.navbar {
  height: 60px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

/* Logo 区域 */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
}

/* 导航菜单 */
.nav-menu {
  margin-left: 24px;
  border-bottom: none;
}

/* 导航栏搜索框 */
.nav-search {
  width: 180px;
  margin-left: 16px;
}

/* 用户头像 */
.user-area {
  margin-left: 16px;
  cursor: pointer;
}

/* ====== 轮播 Banner ====== */
.banner {
  width: 100%;
}

.banner-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  text-align: center;
}

.banner-title {
  font-size: 36px;
  margin-bottom: 16px;
}

.banner-desc {
  font-size: 18px;
  margin-bottom: 24px;
  opacity: 0.9;
}

/* ====== 通用区块样式 ====== */
.section {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px 0;
  flex: 1;
}

.section-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
  border-left: 4px solid #409EFF;
  padding-left: 12px;
}

/* ====== 课程卡片 ====== */
.course-card {
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  /* 悬停效果：上浮 + 阴影加深 + 过渡动画 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(64, 158, 255, 0.25);
}

/* 课程封面占位图 */
.course-cover {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
}

/* 课程信息 */
.course-info {
  padding-top: 12px;
}

.course-name {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
}

/* 课程内容简介：两行截断 */
.course-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 39px;
}

/* 课程归属大类标记 */
.course-category {
  margin-bottom: 10px;
}

/* 讲师 / 课时信息行 */
.course-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}

/* 课程底部：价格 + 立即学习按钮 */
.course-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 价格样式：免费为绿色，收费为橙红色 */
.course-price {
  font-size: 18px;
  font-weight: bold;
  color: #F56C6C;
}

.course-price.free {
  color: #67C23A;
}

/* ====== 学习记录表格卡片 ====== */
.record-table-card {
  border-radius: 8px;
}

/* ====== 帮助中心 ====== */
.help-card {
  border-radius: 8px;
}

/* 问答答案文本 */
.faq-answer {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
}

/* ====== 底部版权 ====== */
.footer {
  margin-top: 40px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  background-color: #2b2f36;
  color: #9ca3af;
  font-size: 14px;
}

/* 意见反馈按钮 */
.feedback-btn {
  font-size: 14px;
}
</style>
