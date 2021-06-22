import { createStore } from 'vuex'

export default createStore({
	state: {
		routeLoaded:false,
		currentUser: {},
		userLoaded: false,
	},
	mutations: {
		routeLoaded(state, payload: boolean) {
			state.routeLoaded = payload
		},
		setUser(state, newUser){
			state.userLoaded = !!newUser
			state.currentUser = newUser
			console.log("set user changed", state.userLoaded, newUser.displayName)
		},
	},
	getters:{
		getUser(state){
			return state.currentUser
		}
	},
	actions: {
	},
	modules: {
	}
})
