import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import Home from '@/Pages/Home.vue'
import Vuex from '@/store'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			title: "Home"
		}
	},
	{
		path: '/search',
		name: 'Search',
		component: () => import(/* webpackChunkName: "search" */'@/Pages/Search.vue'),
		meta:{
			title:"Search"
		}
	},
	{
		path: '/discover',
		name: 'Discover',
		component: () => import(/* webpackChunkName: "discover" */'@/Pages/Discover.vue'),
		meta: {
			title: "Discover"
		}
	},

	//ADMIN PAGES
	{
		path:'/admin',
		name: 'Admin',
		component: () => import(/* webpackChunkName "admin" */'@/Pages/Admin/Admin.vue'),
		meta: {
			title: "Admin"
		}
	},
	{
		path: '/adminCheck',
		name: 'Admin Check',
		component: () => import(/* webpackChunkName "admin" */'@/Pages/Admin/AdminCheck.vue'),
		meta: {
			title: "Admin Check"
		}
	},
	{
		path: '/adminNewClass',
		name: 'AdminNewClass',
		component: () => import(/* webpackChunkName "adminNewClass" */'@/Pages/Admin/AdminNewClass.vue'),
		meta: {
			title: "Admin New Class"
		}
	},
	{
		path: '/uploadCheck',
		name: 'Upload Check',
		component: () => import(/* webpackChunkName: "uploadInstructions" */'@/Pages/Upload/UploadCheck.vue'),
		meta: {
			title: "Upload Check"
		}
	},
	{
		path: '/adminNewYear',
		name: 'AdminNewYear',
		component: () => import(/* webpackChunkName "adminNewYear" */'@/Pages/Admin/AdminNewYear.vue'),
		meta: {
			title: "Admin New Year"
		}
	},


	{
		path: '/upload',
		name: 'Upload',
		component: () => import(/* webpackChunkName: "upload" */'@/Pages/Upload/Upload.vue'),
		meta: {
			title: "Upload"
		}
	},
	{
		path:'/uploadInstructions',
		name:'Upload Instructions',
		component: () => import(/* webpackChunkName: "uploadInstructions" */'@/Pages/Upload/UploadInstructions.vue'),
		meta: {
			title: "Upload Instructions"
		}
	},
	{
		path: '/:id',
		name: "Individual Page",
		component: () => import(/* webpackChunkName: "individual_page" */'@/Pages/IndividualPage.vue')
	},
	{
		path: '/test',
		name: 'Test',
		component: () => import(/* webpackChunkName: "upload" */'@/Pages/Test.vue'),
		meta: {
			title: "Test"
		}
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

//ONLY IF WE USE HISTORY MODE
// if (!(process.env.NODE_ENV === 'development')){
// 	routes.forEach(route => route.path = '/teachers/TOK' + route.path)
// }

const router = createRouter({
	// history: createWebHistory(process.env.BASE_URL),
	history: createWebHashHistory(),
	routes,
	scrollBehavior () {
		window.scrollTo(0, 0)
	}
})

router.beforeEach((to, from, next) => {
	document.title = to.meta.title ? to.meta.title + " | CB TOK Exhbition" : "CB TOK Exhibition"
	Vuex.commit('routeLoaded', false);
	console.log("before")
	next()
})
router.afterEach(() => {
	Vuex.commit('routeLoaded', true);
	console.log("after")
})

export default router
