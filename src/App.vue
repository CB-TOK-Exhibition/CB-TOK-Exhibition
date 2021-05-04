<template>
	<router-view v-slot="slotProps">
		<transition name="fade" mode="out-in">
			<component :is="slotProps.Component"></component>			
		</transition>
	</router-view>
	<footitty></footitty>
</template>

<script lang="ts">
	import { defineComponent } from "vue"
	import footer from '@/components/Footer.vue'
	export default defineComponent({
		name:"App",
		components:{
			'footitty': footer
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
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>