<template>
    <div id="home" class='min-h-screen'>
        <div id="splash" class="pt-40 lg:pt-64 pb-24">
            <h1 class="text-6xl lg:text-7xl leading-none font-bold">CB TOK EXHIBITION</h1>
            <h2 class="text-2xl lg:text-4xl pt-5 font-semibold">Effects of semen retention on the male anatomy</h2>
            <div id="buttonRow" class="flex flex-col md:flex-row justify-center gap-x-10 mt-10 mx-5 lg:mx-0 flex-wrap">
                <button class="py-2 px-10 rounded-lg border-black border-2 text-2xl font-bold noOutline focus:ring mb-3 lg:mb-0">SEARCH</button>
                <button class="py-2 px-10 rounded-lg border-black border-2 text-2xl font-bold noOutline focus:ring">DISCOVER</button>
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
    #buttonRow button{
        transition: transform 0.1s ease;
        &:hover{
            transform: scale(1.05);
        }
    }
}
</style>