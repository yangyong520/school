export default { // 限制配置
  state: {
    bedLimt: { // 床位数量限制
      max: 20,
      min: 1
    },
    roomLimt: { // 房间数量限制
      max: 99,
      min: 1
    },
    floorLimt: { // 楼层数量限制
      max: 99,
      min: 1
    }
  },
  mutations: {},
  namespaced: true
}
