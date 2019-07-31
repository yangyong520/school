export default {
  state: {
    bedList: [],
    peopleList: []
  },
  mutations: {
    setBed (state, data) {
      state.bedList = data
    },
    setPeo (state, data) {
      state.peopleList = data
    }
  },
  // getters: {
  //   getBed: state => state.bedList,
  //   getPeo: state => state.peopleList
  // },
  // actions: {
  //   selectBedList ({ commit }, data) {
  //     commit('setBed', data)
  //   },
  //   selectPeo ({commit}, data) {
  //     commit('setPeo', data)
  //   }
  // },
  namespaced: true
}
