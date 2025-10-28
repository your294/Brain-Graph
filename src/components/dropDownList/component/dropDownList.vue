<template>
  <ul
    class="list-container"
    v-if="show"
    :style="{
      top: listStyle.x,
      left: listStyle.y,
    }"
    tabindex="-1"
    ref="listContainerRef"
  >
    <listItem
      v-for="(obj, index) in listData"
      :text="obj.text"
      :key="obj.id"
      :index="index"
      :is-hovered="props.hoveredIndex === index"
      @selected="handleSeleceted"
      @mouseenter="handleMouseEnter(index)"
    />
  </ul>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import listItem from './listItem.vue'

interface ListStyle {
  x: number
  y: number
}

const props = withDefaults(
  defineProps<{
    listData: Array<any>
    fuzzy: boolean
    show: boolean
    listStyle: ListStyle
    hoveredIndex: number
  }>(),
  {
    listData: () => [],
    fuzzy: false,
    show: false,
    listStyle: () => ({ x: 0, y: 0 }),
    hoveredIndex: -1,
  },
)

const emit = defineEmits(['selected', 'mouseenter'])

const listContainerRef = ref<HTMLElement | null>(null)

function handleSeleceted(val: any) {
  emit('selected', val, false)
}

function handleMouseEnter(index: number) {
  // 通过事件向父组件传递鼠标悬停的索引
  emit('mouseenter', index)
}

// 滚动到指定索引的列表项
function scrollToItem(index: number) {
  if (!listContainerRef.value) return

  const container = listContainerRef.value
  const items = container.querySelectorAll('.list-item-wrapper')
  const targetItem = items[index] as HTMLElement

  if (!targetItem) return

  // 使用 scrollIntoView 方法，更简单且支持平滑滚动
  targetItem.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest', // 尽可能少地滚动，只在必要时滚动
    inline: 'nearest',
  })
}

// 暴露方法给父组件
defineExpose({
  scrollToItem,
})
</script>

<style scoped lang="less">
.list-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 70px;
  height: 100px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 5px;
  outline: none; /* 移除焦点时的默认轮廓 */
  scroll-behavior: smooth; /* 添加平滑滚动效果 */
}
</style>
