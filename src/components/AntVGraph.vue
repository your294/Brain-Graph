<template>
  <div id="g6-tree-container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Graph } from '@antv/g6'
import { fetchTreeJson } from '../mock/api/tree'

onMounted(() => {
  initGraph()
})

async function initGraph() {
  const g6Container = document.getElementById('g6-tree-container')
  if (!g6Container) {
    console.error('g6 Tree Container不存在')
    return
  }
  const treeJson = await fetchTreeJson()
  const graph = new Graph({
    container: g6Container,
    width: g6Container.clientWidth || 800,
    height: g6Container.clientHeight || 600,
    modes: {
      default: ['drag-canvas', 'zoom-canvas'],
    },
    layout: {
      type: 'compact-box',
      direction: 'TB',
      getHeight: () => 16,
      getWidth: () => 16,
      getVGap: () => 16,
      getHGap: () => 16,
      getSide: () => 'bottom',
    },
  })
  graph.render()
}
</script>
