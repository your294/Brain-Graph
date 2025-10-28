<template>
  <div class="dropDown-wrapper">
    <el-input
      ref="inputRef"
      v-model="inputText"
      @input="handleInput"
      @keydown="handleKeyDown"
      @blur="() => (showList = false)"
    ></el-input>
    <dropDownList
      ref="dropDownListRef"
      :list-data="promptListData"
      :show="showList"
      :list-style="listStyle"
      :fuzzy="false"
      :hovered-index="hoveredIndex"
      @selected="handleSelected"
      @mouseenter="handleMouseEnter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import dropDownList from './component/dropDownList.vue'
import { requestMockAPI } from './mock'

const inputText = ref('')
const inputRef = ref<any>(null)
const promptListData = ref<Array<any>>([])
const showList = ref(false)
const listStyle = reactive<any>({ x: 0, y: 0 })

async function startRequest() {
  try {
    const res = await requestMockAPI()
    if (Array.isArray(res)) {
      promptListData.value = res
    }
  } catch (e: any) {
    ElMessage(e)
  }
}

async function handleInput(event: any) {
  if (event.charAt(event.length - 1) === '$') {
    await startRequest()
    nextTick(() => {
      if (inputRef.value) {
        const { left, bottom } = inputRef.value.$el.getBoundingClientRect()
        ;((listStyle.x = left), (listStyle.y = bottom))
        showList.value = true
      }
    })
  }
}

// 当前悬停的索引
const hoveredIndex = ref(-1)
const dropDownListRef = ref<any>(null)

function handleKeyDown(event: KeyboardEvent) {
  if (!showList.value || promptListData.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      hoveredIndex.value = Math.min(
        hoveredIndex.value + 1,
        promptListData.value.length - 1,
      )
      scrollToHoveredItem()
      break
    case 'ArrowUp':
      event.preventDefault()
      hoveredIndex.value = Math.max(hoveredIndex.value - 1, 0)
      scrollToHoveredItem()
      break
    case 'Enter':
      event.preventDefault()
      if (
        hoveredIndex.value >= 0 &&
        hoveredIndex.value < promptListData.value.length
      ) {
        handleSelected(promptListData.value[hoveredIndex.value].text, false)
      }
      break
    case 'Escape':
      event.preventDefault()
      showList.value = false
      hoveredIndex.value = -1
      break
  }
}

function scrollToHoveredItem() {
  nextTick(() => {
    if (dropDownListRef.value && hoveredIndex.value >= 0) {
      dropDownListRef.value.scrollToItem(hoveredIndex.value)
    }
  })
}

function handleMouseEnter(index: number) {
  hoveredIndex.value = index
}

function handleSelected(val: any, show: boolean) {
  const len = inputText.value.length || 0
  inputText.value = inputText.value.slice(0, len) + val
  showList.value = show
  hoveredIndex.value = -1 // 选择后重置悬停索引
}
</script>

<style scoped lang="less">
.dropDown-wrapper {
  position: relative;
}
</style>
