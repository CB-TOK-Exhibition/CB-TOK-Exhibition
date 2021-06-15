<template>
	<transition name="slide">
	<Navbar></Navbar>
	</transition>
	<router-view v-slot="slotProps">
		<transition name="fade" mode="out-in">
			<component v-if="$store.state.routeLoaded" :is="slotProps.Component"></component>
			<div v-else class="h-screen grid place-items-center">
				<h1 class="text-4xl font-bold">LOADING</h1>
			</div>
		</transition>
	</router-view>
	<footitty></footitty>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import footer from '@/components/Footer.vue'
	import Navbar from "./components/Navbar.vue"

	export default defineComponent({
		name:"App",
		components:{
			'footitty': footer,
			Navbar,
		}
	})
</script>

<style lang="scss">
#app {
	font-family: Roboto;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

#nav {
	&::before{
		position:absolute;
		top:0;
		left:0;
		content:'';
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.8);
		transform: scale(1.1);
		backdrop-filter: blur(10px);
		z-index: -1;
	}
	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>