<template>
  <div id="g6-tree-container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Graph, type EdgeData, type NodeData } from '@antv/g6'
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
  const treeJson: NodeData = await fetchTreeJson()
  const nodeData = buildTreeNode(treeJson)
  const edgeData = buildTreeEdge(treeJson)
  const graph = new Graph({
    container: g6Container,
    width: g6Container.clientWidth || 800,
    height: g6Container.clientHeight || 600,
    layout: {
      type: 'compact-box',
      direction: 'LR',
      getHeight: () => 32,
      getWidth: () => 32,
      getVGap: () => 64,
      getHGap: () => 128,
      getSide: () => 'left',
    },
    behaviors: ['drag-canvas'],
    data: {
      nodes: nodeData,
      edges: edgeData,
    },
    autoFit: {
      type: 'view', // 自适应类型：'view' 或 'center'
      options: {
        // 仅适用于 'view' 类型
        when: 'overflow', // 何时适配：'overflow'(仅当内容溢出时) 或 'always'(总是适配)
        direction: 'both', // 适配方向：'x'、'y' 或 'both'
      },
      animation: {
        // 自适应动画效果
        duration: 1000, // 动画持续时间(毫秒)
        easing: 'ease-in-out', // 动画缓动函数
      },
    },
    autoResize: true,
  })
  graph.render()
  graph.fitView({
    when: 'overflow',
    direction: 'both',
  })
}

function buildTreeNode(data: NodeData): NodeData[] {
  const nodesData: NodeData[] = []
  function dfs(root: NodeData) {
    if (!root) return
    nodesData.push({
      ...root,
      type: 'rect', // 使用 rect 节点
      style: {
        labelPlacement: 'center',
        labelText: root.id,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#fff',
        stroke: '#5B8FF9',
        lineWidth: 2,
        size: [(root.id.length || 5) * 8, 25], // 设置大小
      },
    })
    if (root.children) {
      for (let node of root.children) {
        dfs(node as any as NodeData)
      }
    }
  }
  dfs(data)
  return nodesData
}

function buildTreeEdge(data: NodeData) {
  const edges: EdgeData[] = []
  function dfs(nodes: any) {
    if (!nodes || !nodes.children) return
    let source = nodes.id
    for (let target of nodes.children) {
      edges.push({
        source,
        target: target.id,
        type: 'cubic-vertical',
        style: {
          labelText: '',
          labelBackground: true,
          endArrow: true,
        },
        states: ['hover'],
      })
      dfs(target as any as NodeData)
    }
  }
  dfs(data)
  return edges
}
</script>

<style scoped>
#g6-tree-container {
  height: 100vh;
}
</style>
