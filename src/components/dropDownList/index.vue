<template>
  <div class="dropDown-wrapper" id="myDropDownList">
    <div
      class="dollar-input"
      contenteditable="true"
      ref="inputRef"
      @input="handleChange"
      @keydown="handleKeyDown"
      @blur="() => (showList = false)"
      style="min-width: 300px"
    ></div>
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
import { getCaretCoordinates } from '@/util/caretCoordinates'

const inputText = ref('')
const inputRef = ref<any>(null)
const promptListData = ref<Array<any>>([])
const showList = ref(false)
const listStyle = reactive<any>({ x: 0, y: 0 })
const dollarPosition = ref(-1) // 记录 $ 符号的位置
const focusNode = ref<any>(null)

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

function onObserveInput() {
  let cursorBeforeStr = ''
  const selection: any = window.getSelection()
  if (selection?.focusNode?.data) {
    cursorBeforeStr = selection.focusNode?.data.slice(0, selection.focusOffset)
    focusNode.value = selection.focusNode
  }
  // 检查输入最后是否有$
  // return cursorBeforeStr?.lastIndexOf('$')
  return cursorBeforeStr.trimEnd().endsWith('$')
    ? cursorBeforeStr.trim().length - 1
    : -1
}

// 这里需要根据输入同时给出下拉列表的定位
async function handleChange(event: any) {
  const lastDollarIndex = onObserveInput()
  // 检测是否输入了 $ 符号
  if (lastDollarIndex !== -1) {
    dollarPosition.value = lastDollarIndex
    await startRequest()
    nextTick(() => {
      if (inputRef.value) {
        // 这是input相对视口的x, y
        const { left, bottom } = inputRef.value.getBoundingClientRect()
        // 需要获取光标相对视口的x, y
        const {
          left: eLeft,
          bottom: eBottom,
          top: eTop,
        } = window.document
          .getElementById('myDropDownList')
          ?.getBoundingClientRect() as any
        // 这是相对#myDropDownList的inputRef的坐标
        const rx = eLeft - left,
          ry = eBottom - bottom
        // 这是光标相对视口的坐标和height
        const selectionXY = getCaretCoordinates()
        const finalX = selectionXY.x - eLeft,
          finalY = selectionXY.y - eTop + selectionXY.height
        ;((listStyle.x = finalX), (listStyle.y = finalY))
        showList.value = true
      }
    })
  } else {
    showList.value = false
  }
  inputText.value = event.target!.innerText
}

// 当前悬停的索引
const hoveredIndex = ref(0)
const dropDownListRef = ref<any>(null)

// 处理键盘上下按键
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
        handleSelected(promptListData.value[hoveredIndex.value].text)
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

function handleSelected(val: any) {
  const selection = window.getSelection()
  const range = selection?.getRangeAt(0) as Range
  range.setStart(focusNode.value as Node, dollarPosition.value)
  range.setEnd(focusNode.value as Node, dollarPosition.value + 1)
  // 删除输入$
  range.deleteContents()
  range.insertNode(document.createTextNode(`${val}`))
  // 移动到替换完成内容的末尾
  range.collapse()
  dollarPosition.value = -1
  nextTick(() => {
    inputText.value = document.getElementById('myDropDownList')?.innerText || ''
    inputRef.value.focus()
  })

  showList.value = false
  hoveredIndex.value = -1 // 选择后重置悬停索引
}
</script>

<style scoped lang="less">
.dropDown-wrapper {
  position: relative;
}

.dollar-input {
  min-width: 300px;
  min-height: 50px;
  outline: none;
  color: #333;
  font-weight: 400;
  font-size: 16px;
  border: 1px solid #b2c5ff;
  background-color: 1px solid #e0e0f8;
}
</style>
