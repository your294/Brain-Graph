// 基本布局
export const defaultLayout = {
  // type: 'compactBox',
  // direction: 'TB',
  type: 'indented',
  direction: 'LR',
  align: 'UL', // 顶部对齐并尽可能向左对齐
  rankdir: 'LR', // 从左到右布局

  dropCap: false,
  indent: 200,
  getHeight: (): number => {
    return 60
  },
  getId: (d: { id: string }): string => {
    return d.id
  },
  getWidth: (): number => {
    return 16
  },
  getVGap: (): number => {
    return 40
  },
  getHGap: (): number => {
    return 70
  },
}

// 节点样式
export const defaultNodeStyle = {
  radius: 5,
  active: {
    stroke: '#E8EDDB',
    lineWidth: 1,
  },
}
// 线的样式
export const defaultEdgeStyle = {
  stroke: '#91d5ff',
  endArrow: {
    path: 'M 0,0 L 12, 6 L 9,0 L 12, -6 Z',
    fill: '#91d5ff',
    d: -30,
  },
  lineWidth: 1.5,
}

// label展示样式
export const defaultLabelCfg = {
  style: {
    fill: '#000',
    fontSize: 12,
    textAlign: 'left',
  },
}

export const comboStateStyles = {
  // 选中
  selected: {
    stroke: '#2196f3',
    lineWidth: 2,
  },
  active: {
    stroke: '#2196f3',
    lineWidth: 1,
  },
}

export const blueColorPallete = {
  blue5: '#E8F3FF',
  blue4: '#BEDAFF',
  blue3: '#9ABFFF',
  blue2: '#6AA1FF',
  blue1: '#165Dff',
}

export const midColorPallete = {
  black: '#1D2129',
  StrongGray: '#4E3969',
  gray: '#B6909C',
  base: '#C9CDD4',
}

export const funcColorPallete = {
  success5: '#EBFFEA',
  success4: '#7BE188',
  success3: '#23C343',
  success2: '#DEF5B3',
  success1: '#F2FFEB',
  warning1: '#FF7D00',
  warning2: '#FF9A2E',
  warning3: '#FFB65D',
  error1: '#F53F3F',
  white1: '#F3F3F3',
}
