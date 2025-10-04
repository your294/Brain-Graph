<script setup lang="ts">
import TreeGraph from './components/tree/index.vue'
import kLineGraph from './components/line/index.vue'
</script>

<template>
  <div class="main-layout">
    <k-line-graph />
  </div>
</template>

<style scoped>
.main-layout {
  height: 100vh;
}
</style>
