export const requestMockAPI = () => {
  const res = new Array(15).fill(0).map((_, i) => {
    return {
      value: '' + i,
      text: 'action' + i,
      id: i,
    }
  })
  return new Promise((resolve, reject) => {
    resolve(res)
  })
}
