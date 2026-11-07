<template>
  <!-- 路由出口：页面组件在这里渲染 -->
  <router-view />
</template>

<script setup>
// 根组件，仅负责渲染路由页面
</script>

<style>
/* 全局基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  background-color: #f5f7fa;
}
</style>
