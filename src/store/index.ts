import { createStore } from 'vuex'

export default createStore({
  state: {
    routeLoaded:false 
  },
  mutations: {
    routeLoaded(state, payload: boolean) {
      state.routeLoaded = payload
    },
  },
  actions: {
  },
  modules: {
  }
})
