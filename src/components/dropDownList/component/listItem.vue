<template>
  <li
    class="list-item-wrapper"
    :class="{ 'is-hovered': isHovered }"
    role="option"
    @mousedown="handleSelected"
    @keyup.enter="handleSelected"
    @mouseenter="handleMouseEnter"
  >
    <span>{{ text }}</span>
  </li>
</template>

<script setup lang="ts">
const props = defineProps({
  text: String,
  index: Number,
  isHovered: Boolean,
})

const emit = defineEmits(['selected', 'mouseenter'])

function handleSelected() {
  emit('selected', props.text)
}

function handleMouseEnter() {
  emit('mouseenter', props.index)
}
</script>

<style scoped lang="less">
.list-item-wrapper {
  flex: 1;
  padding: 5px 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #f3f3f3;
  cursor: pointer;
  transition: background-color 0.2s ease;

  span {
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;
    color: #333;
  }

  &.is-hovered {
    background-color: cornflowerblue;
    color: white;

    span {
      color: white;
    }
  }
}
</style>
