import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/Pages/Home.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/search',
		name: 'Search',
		component: () => import('@/Pages/Search.vue')
	},
	{
		path: '/discover',
		name: 'Discover',
		component: () => import('@/Pages/Discover.vue')
	},
	{
		path: '/:id',
		name: "Project Page",
		component: () => import ('@/Pages/IndividualPage.vue')
	},
	// {
	//   path: '/about',
	//   name: 'About',
	//   // route level code-splitting
	//   // this generates a separate chunk (about.[hash].js) for this route
	//   // which is lazy-loaded when the route is visited.
	//   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	// }
]

if (!(process.env.NODE_ENV === 'development')){
	routes.forEach(route => route.path = '/teachers/TOK' + route.path)
}

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	scrollBehavior () {
		window.scrollTo(0, 0)
	}
})

export default router
