<script setup lang="ts">
import dropDownList from './components/dropDownList/index.vue'
</script>

<template>
  <div class="main-layout">
    <drop-down-list class="base-list" />
  </div>
</template>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.base-list {
  width: 100px;
}
</style>
