import tree from '../json/tree.json'

const fetchTreeJson = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(tree)
    }, 2000)
  })
}

export { fetchTreeJson }
