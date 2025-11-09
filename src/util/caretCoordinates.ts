// 这里我们根据Range 和 getBoundingClientRect()推导出插入符坐标
// 需要注意这里对应input和textarea不适用
/**
 * 但对于 <input> 或 <textarea>：
 * window.getSelection() 可能为空或不准确
 * 应使用 element.selectionStart 和测量技巧（如隐藏 span）来定位光标
 */
function getCaretCoordinates() {
  const selection = window.getSelection()
  if (!selection?.rangeCount)
    return {
      x: 0,
      y: 0,
      height: 0,
    }

  const range = selection.getRangeAt(0).cloneRange() // 复制当前选区
  range.collapse(false) // 到光标末端

  const rect = range.getBoundingClientRect()
  return {
    x: rect.left,
    y: rect.top,
    height: rect.height,
  }
}

function setCursorToEnd(element: HTMLElement) {
  const range = document.createRange()
  const selection = window.getSelection()

  if (!selection) return

  // 清除现有选择
  selection.removeAllRanges()

  // 将 range 的终点设为元素内容的末尾
  // 此处选中element内的内容作为range
  range.selectNodeContents(element)
  range.collapse(false) // 折叠到末尾（true=开头，false=结尾）

  // 添加到选区
  selection.addRange(range)

  // 可选：聚焦元素
  element.focus()
}

export { getCaretCoordinates, setCursorToEnd }
