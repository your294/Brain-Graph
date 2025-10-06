<script lang="ts" setup>
import { Chart } from '@antv/g2'
import { onMounted } from 'vue'

onMounted(() => {
  initDonutChart()
})

const data = [
  { genre: 'Sports', sold: 27500 },
  { genre: 'Strategy', sold: 11500 },
  { genre: 'Action', sold: 6000 },
  { genre: 'Shooter', sold: 3500 },
  { genre: 'Other', sold: 1500 },
]

function initDonutChart() {
  const chart = new Chart({
    container: 'container',
    width: 600,
    height: 400,
  })
  chart.options({
    type: 'interval',
    data,
    encode: {
      color: 'genre',
      y: 'sold',
    },
    coordinate: {
      type: 'theta',
      innerRadius: 0.5,
    },
    transform: [{ type: 'stackY' }],
    labels: [
      { text: 'genre', radius: 0.5 },
      { text: 'sold', radius: 0.5, style: { dy: 12 } },
    ],
    legend: {
      color: {
        layout: {
          justifyContent: 'center',
        },
      },
    },
  })
  chart.render()
}
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 400px;
  height: 600px;
  margin: 20px auto;
}
</style>
