<template>
  <div class="myNode-wrapper">
    <el-button class="clear-btn" type="primary" @click="clearGraph"
      >重置树图</el-button
    >
    <div class="content">
      <!-- 此处展示实际内容 -->
      <div id="container"></div>
      <el-input
        v-if="state.showInput"
        ref="inputRef"
        v-model="state.input"
        class="node-input"
        :style="state.inputStyle"
        @keyup.enter="handleBlurInput"
        @blur="handleBlurInput"
      ></el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { uniqueId } from 'lodash-es'
import { nextTick, reactive, ref, onMounted } from 'vue'
import { renderMap, initGraph } from '.'

const inputRef = ref()
const state = reactive({
  treeData: {
    id: 'root',
    sname: 'root',
    name: uniqueId(),
    children: [],
  } as any,
  showInput: false,
  input: '',
  inputStyle: {
    top: '0px',
    left: '0px',
  },
  editOne: null as any,
  editType: '',
  graph: null as any,
})

const handleBlurInput = () => {
  const { editOne, editType, input } = state
  const item = editType === 'edit' ? editOne._cfg.id : editOne.id
  // 如果添加并且无输入值
  if (editType === 'add' && !input) {
    state.graph.removeChild(item)
    state.showInput = false
    return
  }
  state.graph.updateItem(item, {
    sname: input,
  })
  // 添加时需要更新父节点信息
  if (editType === 'add') {
    state.graph.updateItem(editOne.parentId, {})
  }
  state.showInput = false
  const editOneStates =
    editOne && typeof editOne.getStates === 'function'
      ? editOne.getStates()
      : null
  if (editOneStates && editOneStates.length > 0) {
    state.graph.setItemState(editOne, 'selected', false)
  }
}

const addEvent = (graph: any) => {
  graph.on('node:click', (event: any) => {
    const { item, target } = event
    const name = target.get('name')

    // model ?
    const model = item.getModel()
    if (name === 'add-icon') {
      state.editType = 'add'
      if (model.collapsed) model.collapsed = false
      if (!model.children) model.children = []
      const id = uniqueId()
      model.children.push({
        id,
        name: 1,
        sname: '',
        parentId: model.id,
      })
      graph.updateChild(model, model.id)
      // 设置input
      const curTarget = graph.findDataById(id)
      const canvasXY = graph.getCanvasByPoint(curTarget.x, curTarget.y)
      state.editOne = curTarget
      state.input = curTarget.sname
      setTimeout(() => {
        state.showInput = true
        nextTick(() => {
          inputRef.value.focus()
        })
      }, 200)
      state.inputStyle = {
        left: `${canvasXY.x}px`,
        top: `${canvasXY.y}px`,
      }
    }
    //删除节点
    if (name === 'delete-icon') {
      graph.removeChild(model.id)
      graph.updateItem(model.parentId, {})
    }
    if (name === 'chart-rect') {
      const curTarget = graph.findDataById(item._cfg.id)
      const canvasXY = graph.getCanvasByPoint(curTarget.x, curTarget.y)
      state.editOne = event.item
      state.input = curTarget.sname
      state.showInput = true
      state.editType = 'edit'
      nextTick(() => {
        inputRef.value.focus()
      })
      state.inputStyle = {
        left: `${canvasXY.x}px`,
        top: `${canvasXY.y}px`,
      }
      graph.setItemState(item, 'selected', true)
    }
  })
  // 画布滚动、拖动时，不能编辑节点名称
  graph.on('dragstart', () => {
    state.showInput = false
  })
  graph.on('wheel', () => {
    state.showInput = false
  })
}

// 清空树图
const clearGraph = () => {
  state.treeData = {
    id: 'root',
    sname: 'root',
    name: '1',
    children: [],
  }
  renderMap(state.treeData, state.graph)
}

onMounted(() => {
  nextTick(() => {
    state.graph = initGraph('container')
    state.graph.clear()
    addEvent(state.graph)
    renderMap(state.treeData, state.graph)
  })
})
</script>

<style scoped lang="less">
.myNode-wrapper {
  height: 100%;
  width: 100%;
  margin: 50px;
  display: flex;
  flex-direction: column;

  .clear-btn {
    width: 120px;
    margin-bottom: 20px;
  }

  .content {
    flex: 1;
    position: relative;
    overflow-y: auto;
  }

  #container {
    width: 100%;
    height: 100%;
    :deep(canvas) {
      position: relative;
    }
  }
}

.node-input {
  position: absolute;
  line-height: 15px;
  height: 18px;
  width: 100px;
  background-color: #d2f397;
  color: #333;
}
</style>
