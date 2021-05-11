<template>
    <footer class="w-full py-14 px-10 md:px-20 bg-gray-200 flex flex-col md:grid grid-cols-none md:grid-cols-3 grid-rows-3 md:grid-rows-none gap-x-4">
        <div class="mb-6 md:mb-0">
            <div class="flex flex-row gap-x-6 mb-4">
                <img class="h-20 w-20 md:h-24 md:w-24 mr-4 lg:mr-0" src="@/assets/ib.svg" alt="IB Logo">
                <img class="h-20 w-20 md:h-24 md:w-24" src="@/assets/cb.png" alt="CB">
            </div>
            <h1 class="text-4xl font-bold">Colonel By Theory of Knowledge Exhibition</h1>
        </div>
        <div class="mb-6 md:mb-0">
            <h1 class="text-3xl font-bold mb-2">Sitemap</h1>
            <ul>
                <li class="text-xl font-semibold"><router-link to="/">Home</router-link></li>
                <li class="text-xl font-semibold"><router-link to="/discover">Discover</router-link></li>
                <li class="text-xl font-semibold"><router-link to="/search">Search</router-link></li>
                <li class="text-xl font-semibold"><router-link to="/upload">Upload</router-link></li>
            </ul>
        </div>
        <div>
            <h1 class="text-3xl font-bold mb-2">Contact</h1>

            <h2 class="font-medium text-xl"><span class="font-semibold">Created</span> by the Students of CB</h2>
            <h2 class="font-medium text-xl"><span class="font-semibold">Organized</span> by Mr.Richardson</h2>
            <h2 class="font-medium text-xl"><span class="font-semibold">Realized</span> by Amro, Briana, Brandon, Edwin, Oscar, Vansh, Aarya, Richard</h2>
        </div>
    </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name:"Footer",
})
</script>