export default {
  state: {
    userData: {}
  },
  mutations: {
    setUserData (state, update) {
      state.userData = update
    }
  },
  actions: {
    Login ({ commit }, userInfo) {
      commit('setUserData', userInfo)
    }
  },
  namespaced: true
}
