import {
  Arrow,
  Graph,
  Marker,
  registerEdge,
  registerNode,
  TreeGraph,
} from '@antv/g6'
import { collapseNode, mouseenterNode, mouseLeaveNode } from './event'
import {
  comboStateStyles,
  defaultEdgeStyle,
  defaultLabelCfg,
  defaultLayout,
  defaultNodeStyle,
} from './style'

export function renderMap(data: any[], graph: Graph) {
  // 思维导图节点
  registerNode(
    'chart-node',
    {
      options: {
        size: [100, 60],
        stroke: '#0B1220',
        fill: '#B5C6E7',
        stateStyles: {
          active: {
            stroke: '#E8EDDB',
            fill: '#D2F397',
          },
        },
      },
      /**
       * 绘制节点，包括文本
       */
      draw(cfg: any, group) {
        const styles = (this as any).getShapeStyle(cfg)
        const { labelCfg = {} } = cfg
        const width = cfg.size[0]
        const height = cfg.size[1]
        // 加入基本的矩形
        const keyShape = group.addShape('rect', {
          attrs: {
            ...styles,
            cursor: 'pointer',
            x: 0,
            y: 0,
            width,
            height,
            fill: cfg.style?.fill || '#B5C6E7',
          },
          name: 'chart-rect',
          draggble: true,
        })
        // 添加按钮及icon
        group.addShape('text', {
          attrs: {
            cursor: 'pointer',
            x: 112,
            y: 10,
            stroke: '#707070',
            fill: '#B5C',
            textAlign: 'center',
            textBaseline: 'middle',
            fontFamily: 'iconfont',
            text: '\ue658',
            fontSize: 12,
          },
          name: 'add-icon',
          draggble: true,
        })
        if (cfg.id !== 'root') {
          group.addShape('text', {
            attrs: {
              x: 112,
              y: 20,
              cursor: 'pointer',
              fontFamily: 'iconfont',
              textAlign: 'center',
              textBaseline: 'middle',
              text: '\ue74b',
              fontSize: 12,
              stroke: '#707070',
              fill: '#B5C',
              opacity: 0,
            },
            name: 'delete-icon',
          })
        }
        if (cfg.sname) {
          if (typeof cfg.sname === 'string') {
            group.addShape('text', {
              attrs: {
                ...labelCfg.style,
                text: cfg.sname,
                textAlign: 'left',
                x: 10,
                y: 15,
              },
              name: 'label',
            })
          } else if (Array.isArray(cfg.sname)) {
            cfg.sname.forEach((name: string, i: number) => {
              let x = 0,
                y = 0
              switch (i) {
                case 0:
                  ;((x = 10), (y = 15))
                  break
                case 1:
                  ;((x = 10), (y = 35))
                case 2:
                  ;((x = 10), (y = 45))
                default:
                  break
              }
              group.addShape('text', {
                attrs: {
                  ...labelCfg.style,
                  text: name,
                  textAlign: 'left',
                  x,
                  y,
                },
                name: `label${i}`,
              })
            })
          }
        }
        if (cfg.children && cfg.children.length > 0) {
          group.addShape('circle', {
            attrs: {
              x: 102,
              y: 20,
              r: 6,
              cursor: 'pointer',
              lineWidth: 1,
              fill: !cfg.collapsed ? '#9e9e9e' : '#2196f3',
              opacity: 1,
              text: 1,
            },
            name: 'collapse-icon',
          })
        }
        return keyShape
      },
      setState(name, value, item) {
        const group = item?.getContainer()
        if (name === 'collapsed') {
          const marker = item
            ?.get('group')
            .find((ele: any) => ele.get('name') === 'collapse-icon')
          const icon = value ? Marker.expand : Marker.collapse
          marker.attr('symbol', icon)
        }
        if (name == 'selected') {
          const chartRect = group?.find((shape) => {
            return shape.get('name') == 'chart-rect'
          })
          if (chartRect) {
            if (value) {
              chartRect.attr({
                stroke: '#2196f3',
                lineWidth: 2,
              })
            } else {
              chartRect?.attr({
                stroke: '#0B1220',
                lineWidth: 1,
              })
            }
          }
        }
        if (name == 'hover') {
          const addIcon = group?.find((shape) => {
            return shape.get('name') == 'add-icon'
          })
          const deleteIcon = group?.find((shape) => {
            return shape.get('name') == 'delete-icon'
          })
          if (addIcon && value) {
            addIcon.attr({
              opacity: 1,
            })
            deleteIcon?.attr({
              opacity: 1,
            })
          }
        }
        // 针对active状态的变化
        if (name == 'active') {
          const chartRect = group?.find((shape: any) => {
            return shape.get('name') === 'chart-rect'
          })
          if (chartRect) {
            if (value) {
              chartRect.attr({
                stroke: '#E8EDDB',
                fill: '#D2F397',
              })
            } else {
              chartRect.attr({
                stroke: '#0B1220',
                fill: '#B5C6E7',
              })
            }
          }
        }
      },
      update: undefined,
    },
    'rect',
  )
  registerEdge('flow-line', {
    draw(cfg: any, group: any) {
      const { startPoint, endPoint, style } = cfg
      const shape = group.addShape('path', {
        attrs: {
          stroke: style.stroke,
          endArrow: style.endArrow,
          path: [
            ['M', startPoint.x, startPoint.y],
            ['L', startPoint.x, (startPoint.y + endPoint.y) / 2],
            ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
            ['L', endPoint.x, endPoint.y],
          ],
        },
        name: 'flow-line',
      })
      return shape
    },
  })
  graph.data(data)
  graph.render()
  // 初始化事件
  mouseenterNode(graph)
  mouseLeaveNode(graph)
  collapseNode(graph)
}

export function initGraph(graphWrapId: string): Graph {
  const width =
    (document.getElementById(graphWrapId) as HTMLElement).clientWidth || 800
  const height =
    (document.getElementById(graphWrapId) as HTMLElement).clientHeight || 800
  const graph = new TreeGraph({
    container: graphWrapId,
    width,
    height,
    linkCenter: true,
    animate: false,
    fitView: false,
    modes: {
      default: ['scoll-canvas'],
      edit: ['click-select'],
    },
    defaultNode: {
      type: 'chart-node',
      size: [100, 60],
      style: defaultNodeStyle,
      labelCfg: defaultLabelCfg,
    },
    defaultEdge: {
      type: 'cubic-vertical',
      style: {
        ...defaultEdgeStyle,
        endArrow: false,
      },
    },
    comboStateStyles,
    layout: defaultLayout,
  })
  return graph
}
