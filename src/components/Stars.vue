<template>
    <div class="flex flex-row mt-3" :class="{'justify-center': centered}" v-if="clickable">
        <!-- MAKE IT BE ABLE TO FADE 1 at a time -->
        <svg 
            class="w-8 h-8 star starDeactivate cursor-pointer"
            :class="{'starActivate': i <= starCount, 'starBig': i <= starCount && hover}"
            @mouseenter="starEnter"
            @mouseleave="starLeave"

            @click="starClick"
            :data-star="i" v-for="i in 5"

            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            :key="i"
        >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
    </div>
    <div class="flex flex-row mt-3" :class="{'justify-center': centered}" v-else>
        <!-- MAKE IT BE ABLE TO FADE 1 at a time -->
        <svg 
            class="w-8 h-8 star starDeactivate cursor-pointer"
            :class="{'starActivate': i <= starCount}"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            :data-star="i" v-for="i in 5"
            :key="i"
        >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: "Stars",
    props:["clickable", "rating", "centered"],
    data() {
        return {
            starCount: 0,
            displayRating: 0,
            hover:false,
            voted: false,
            votedCount: -1,
        }
    },
    created(){
        this.displayRating = Math.ceil(this.rating)
        this.starCount = this.displayRating
    },
    methods: {
        starEnter(e: MouseEvent){
            e.preventDefault()
            e.stopPropagation()

            this.hover = true
            const target = (e.target as HTMLDivElement)
            // eslint-disable-next-line
            const count = parseInt(target.getAttribute("data-star")!)
            this.starCount = count
        },
        starLeave(e: MouseEvent){
            e.preventDefault()
            e.stopPropagation()
            this.hover = false

            if(this.voted) this.starCount = this.votedCount
            else this.starCount = this.displayRating
        },
        starClick(){
            if(this.voted) return;
            if(!this.$store.state.userLoaded){
                this.$emit("noPerms")
                return
            }

            const vote = this.starCount
            this.votedCount = vote
            this.$emit("vote", vote)
            this.voted = true
        }
    },
})
</script>

<style lang="scss" scoped>
.star{
    transition: transform 0.2s ease, fill 0.2s ease, stroke 0.2s ease;
    stroke: #636363;
    fill: #a3a3a3;
}
.starActivate{
    stroke: #ccbf0c;
    fill: #f0e769;
}

.starBig{
    transform: scale(1.1);
}
</style>