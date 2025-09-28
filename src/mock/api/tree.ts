import type { NodeData } from '@antv/g6'
import tree from '../json/tree.json'

const fetchTreeJson: () => Promise<NodeData> = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(tree as any as NodeData)
    }, 2000)
  })
}

export { fetchTreeJson }
