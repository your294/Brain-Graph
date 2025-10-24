import { Graph, Marker, registerEdge, registerNode, TreeGraph } from '@antv/g6'
import {
  collapseNode,
  mouseenterNode,
  mouseLeaveNode,
  fittingString,
} from './event'
import {
  comboStateStyles,
  defaultEdgeStyle,
  defaultLabelCfg,
  defaultLayout,
  defaultNodeStyle,
  blueColorPallete,
  midColorPallete,
  funcColorPallete,
} from './style'

export function renderMap(data: any[], graph: Graph) {
  // 思维导图节点
  registerNode(
    'chart-node',
    {
      options: {
        size: [100, 100],
        stroke: midColorPallete.base,
        fill: blueColorPallete.blue5,
        stateStyles: {
          active: {
            stroke: funcColorPallete.warning3,
            fill: funcColorPallete.success1,
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
            stroke: midColorPallete.base,
            lineWidth: 1,
            fill: cfg.style?.fill || blueColorPallete.blue5,
          },
          name: 'chart-rect',
          draggble: true,
        })
        // 添加具体的{officePos}信息字段
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 31,
            width: width,
            height: 19,
            fill: 'transparent',
            cursor: 'pointer',
          },
          name: 'officePos-wrap',
        })
        group.addShape('text', {
          attrs: {
            x: 10,
            y: 50,
            cursor: 'pointer',
            textAlign: 'left',
            fill: funcColorPallete.error1,
            fontSize: 14,
            text: fittingString(cfg.officePos, 80, 14),
          },
          name: 'officePos',
        })
        group.addShape('path', {
          attrs: {
            path: [
              ['M', 0, 51],
              ['L', width, 51],
            ],
            stroke: midColorPallete.base,
            lineWidth: 1,
          },
        })
        // 添加具体的办公地点{userPostion}字段
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 50,
            width: width,
            height: 25,
            fill: 'transparent',
            cursor: 'pointer',
          },
          name: 'userPosition-wrap',
        })
        group.addShape('text', {
          attrs: {
            x: 10,
            y: 75,
            cursor: 'pointer',
            textAlign: 'left',
            fill: funcColorPallete.warning1,
            fontSize: 14,
            text: fittingString(cfg.userPosition, 80, 14),
          },
          name: 'userPosition',
        })
        group.addShape('path', {
          attrs: {
            path: [
              ['M', 0, 76],
              ['L', width, 76],
            ],
            stroke: midColorPallete.base,
            lineWidth: 1,
          },
        })
        // 添加按钮及icon
        group.addShape('text', {
          attrs: {
            cursor: 'pointer',
            x: width + 12,
            y: 10,
            stroke: '#707070',
            fill: '#B5C',
            textAlign: 'center',
            textBaseline: 'middle',
            fontFamily: 'iconfont',
            text: '\ue658',
            fontSize: 20,
          },
          name: 'add-icon',
          draggble: true,
        })
        if (cfg.id !== 'root') {
          group.addShape('text', {
            attrs: {
              x: width + 12,
              y: height - 20,
              cursor: 'pointer',
              fontFamily: 'iconfont',
              textAlign: 'center',
              textBaseline: 'middle',
              text: '\ue74b',
              fontSize: 16,
              stroke: '#707070',
              fill: '#B5C',
              opacity: 0,
            },
            name: 'delete-icon',
          })
        }
        // 添加sname外围样式展示组件
        group.addShape('rect', {
          attrs: {
            ...styles,
            radius: [styles.radius, styles.radius, 0, 0],
            cursor: 'default',
            x: 1.5,
            y: 1,
            height: 30,
            width: width - 3,
            fill: blueColorPallete.blue1,
          },
          name: 'label-wrap',
        })
        group.addShape('path', {
          attrs: {
            path: [
              ['M', 0, 31],
              ['L', width, 31],
            ],
            stroke: midColorPallete.base,
            lineWidth: 2,
          },
        })
        // 添加核心内容{sname}展示组件
        group.addShape('text', {
          attrs: {
            ...labelCfg.style,
            cursor: 'pointer',
            text: fittingString(cfg.sname, 80, 16),
            textAlign: 'center',
            textBaseline: 'middle',
            fontSize: 16,
            fontWeight: 400,
            fill: funcColorPallete.white1,
            x: width / 2,
            y: 15,
          },
          name: 'label',
        })
        if (cfg.children && cfg.children.length > 0) {
          group.addShape('circle', {
            attrs: {
              x: width - 1,
              y: height - 1,
              r: 10,
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
                stroke: blueColorPallete.blue3,
                lineWidth: 2,
              })
            } else {
              chartRect?.attr({
                stroke: midColorPallete.base,
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
                stroke: funcColorPallete.warning3,
                fill: funcColorPallete.success1,
              })
            } else {
              chartRect.attr({
                stroke: midColorPallete.base,
                fill: blueColorPallete.blue5,
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
      size: [100, 100],
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
