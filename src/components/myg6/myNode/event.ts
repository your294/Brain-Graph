import type { Graph } from '@antv/g6'

//展开收起子节点
export function collapseNode(graph: Graph) {
  graph.on('node:click', (event: any) => {
    if (event.target.get('name') === 'collapse-icon') {
      event.item.getModel().collapsed = !event.item.getModel().collapsed
      graph.setItemState(
        event.item,
        'collasped',
        event.item.getModel().collapsed,
      )
      graph.layout()
    }
  })
}

export function mouseenterNode(graph: Graph) {
  graph.on('node:mousemove', (event: any) => {
    const { item, target } = event
    if (item._cfg.id === 'root') return
    const canHoverName = ['chart-rect', 'delete-icon']
    if (!canHoverName.includes(target.get('name'))) return
    // 显示Icon
    const deleteIcon = item.get('group').find((ele: any) => {
      return ele.cfg.name === 'delete-icon'
    })
    if (deleteIcon) {
      deleteIcon.attr('opacity', 1)
    }
    graph.setItemState(item, 'active', true)
  })
}

// 鼠标离开
export function mouseLeaveNode(graph: Graph) {
  graph.on('node:mouseout', (event: any) => {
    const { item, target } = event
    const canHoverName = ['chart-rect', 'delete-icon']
    if (item._cfg.id === 'root') return
    if (!canHoverName.includes(target.get('name'))) return
    // hide icon
    const deleteIcon = item.get('group').find((ele: any) => {
      return ele.cfg.name === 'delete-icon'
    })
    if (deleteIcon) {
      deleteIcon.attr({
        opacity: 0,
      })
    }
    graph.setItemState(item, 'active', false)
  })
}
