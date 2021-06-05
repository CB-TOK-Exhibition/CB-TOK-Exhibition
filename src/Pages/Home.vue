<template>
    <div id="home" class="min-h-screen grid place-items-center">
        <div id="splash" class="text-white">
            <h1 class="text-6xl lg:text-7xl leading-none font-bold">CB TOK EXHIBITION</h1>
            <h2 class="text-2xl lg:text-4xl pt-5 font-semibold">A repository of exhibitions for theory of knowledge</h2>
            <div id="buttonRow" class="flex flex-col md:flex-row justify-center gap-x-6 mt-10 mx-5 lg:mx-0">
                <router-link to="/search" class="py-2 px-10 rounded-full border-grey-200 bg-white text-black border-4 text-2xl font-bold noOutline focus:ring mb-4 lg:mb-0"> 
                    SEARCH
                </router-link>
                <router-link to="/upload" class="py-2 px-10 rounded-full border-grey-200 bg-white text-black border-4 text-2xl font-bold noOutline focus:ring"> 
                    POST
                </router-link>
                <router-link to="/discover" class="py-2 px-10 rounded-full border-grey-200 bg-white text-black border-4 text-2xl font-bold noOutline focus:ring"> 
                    DISCOVER
                </router-link>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    name:"Home",
})
</script>

<style lang="scss" scoped>
#splash{
    text-align: center;
}
@media only screen and (min-width: 992px) {
    #buttonRow a{
        transition: transform 0.1s ease;
        &:hover{
            transform: scale(1.05);
        }
    }
    #home{
        border: 1.7rem white solid !important;
    }
}
#home{
    background: #348F50;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #56B4D3, #348F50);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #56B4D3, #348F50); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    border: 0.4rem white solid;
}
</style>