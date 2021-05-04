<template>
    <nav class="h-16 w-full fixed z-10 p-1 overflow-hidden flex justify-center items-center gap-x-5" v-if="$route.fullPath != '/'" id="nav">
        <router-link to="/">Home</router-link>
		<router-link to="/search">Search</router-link>
		<router-link to="/discover">Discover</router-link>
		<router-link to="/uploadInstructions">Sign in and Upload</router-link>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name:"Navbar",
})
</script>
