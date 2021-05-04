<template>
    <div class="min-h-screen w-full">
        <div class="h-72 w-full bg-blue-300 flex items-end pl-6 pb-12 lg:pl-16 lg:pb-16" id="searchBanner">
            <h1 class="text-white text-6xl font-bold">Search</h1>
        </div>
        <div id="searchBar" class="w-full px-4 lg:px-48">
            <input type="search" class="border-4 border-gray-300 w-full p-4 rounded-xl noOutline focus:ring text-xl hover:shadow-lg" name="search" id="search" v-model="search">
        </div>
        <div id="searchResults" class="h-full w-full p-16">
            hi
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
export default defineComponent({
    name:'Search',
    data() {
        return {
            search:""
        }
    },
})
</script>

<style lang="scss">
    #searchBanner{
        margin-bottom: -1.5rem;
    }
    #searchBar input{
        transition: transform 0.3s ease, box-shadow 0.15s ease;
        &:hover{
            transform: scale(1.01);
        }
    }

</style>