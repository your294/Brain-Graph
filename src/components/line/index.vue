<script setup lang="ts">
import { onMounted } from 'vue';
import { Chart } from '@antv/g2';

const klineData = [
  { time: '2025-04-01', open: 150.00, high: 158.50, low: 149.20, close: 156.30, volume: 234567 },
  { time: '2025-04-02', open: 156.30, high: 160.80, low: 155.00, close: 159.20, volume: 278900 },
  { time: '2025-04-03', open: 159.20, high: 162.10, low: 157.30, close: 158.00, volume: 210345 },
  { time: '2025-04-04', open: 158.00, high: 159.90, low: 154.80, close: 156.50, volume: 256789 },
  { time: '2025-04-05', open: 156.50, high: 157.20, low: 153.00, close: 154.00, volume: 301234 },
  { time: '2025-04-06', open: 154.00, high: 158.70, low: 153.50, close: 157.80, volume: 287654 },
  { time: '2025-04-07', open: 157.80, high: 161.50, low: 157.00, close: 160.90, volume: 320111 },
  { time: '2025-04-08', open: 160.90, high: 163.20, low: 159.80, close: 161.50, volume: 298766 }
];

onMounted(() => {
  initKChart();
});

function initKChart() {
  const data = [
  {
    time: '2015-11-19',
    start: 8.18,
    max: 8.33,
    min: 7.98,
    end: 8.32,
    volumn: 1810,
  },
  {
    time: '2015-11-18',
    start: 8.37,
    max: 8.6,
    min: 8.03,
    end: 8.09,
    volumn: 2790,
  },
  {
    time: '2015-11-17',
    start: 8.7,
    max: 8.78,
    min: 8.32,
    end: 8.37,
    volumn: 3729,
  },
  {
    time: '2015-11-16',
    start: 8.48,
    max: 8.85,
    min: 8.43,
    end: 8.7,
    volumn: 2890,
  },
];

  const KChart = new Chart({
    container: 'kChart',
    autoFit: true,
  });

  KChart.options({
    type: 'view',
    data,
    encode: {
      x: 'time',
      color: (d: any) => {
        const trend = Math.sign(d.start - d.end);
        return trend > 0 ? '下跌' : trend === 0 ? '不变' : '上涨';
      },
    },
    scale: {
      color: {
        domain: ['下跌', '不变', '上涨'],
        range: ['#4daf4a', '#999999', '#e41a1c'],
      },
    },
    children: [
      {
        type: 'link',
        encode: { y: ['min', 'max'] },
      },
      {
        type: 'interval',
        encode: { y: ['start', 'end'] },
        style: { fillOpacity: 1 },
      },
    ],
    axis: {
      y: { title: '价格' },
    },
  });

  // 成交量图
  const VolumeChart = new Chart({
    container: 'volumeChart',
    autoFit: true,
  });

  VolumeChart.options({
    type: 'interval',
    data,
    encode: {
      x: 'time',
      y: 'volumn',
      color: (d: any) => {
        const trend = Math.sign(d.start - d.end);
        return trend > 0 ? '下跌' : trend === 0 ? '不变' : '上涨';
      },
    },
    scale: {
      color: {
        domain: ['下跌', '不变', '上涨'],
        range: ['#4daf4a', '#999999', '#e41a1c'],
      },
    },
    axis: {
      y: { title: '成交量' },
    },
  });

  KChart.render();
  VolumeChart.render();
}
</script>


<template>
  <div id="kChart"></div>
  <div id="volumeChart"></div>
</template>

<style>
  #kChart {
    width: 600px;
    height: 300px;
    margin: 20px auto;
  }
  #volumeChart {
    width: 600px;
    height: 150px;
    margin: 20px auto;
  }
</style>