<template>
    <div id="tagList" class="flex flex-row gap-x-2 gap-y-2 mt-6 flex-wrap" :class="{'justify-center': center}">
        <p v-for="(tag, i) in topics" :key="i" :style="{ backgroundColor: topicColours[tag]}" class="p-1 px-3 rounded-full text-sm text-white font-semibold">
            {{topicsList[tag]}}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {topicColours, topicsList} from '@/types/projects'

export default defineComponent({
    props:{
        topics:{type: Array},
        center:{type: Boolean, default:true}
    },
    data() {
        return {
            topicColours,
            topicsList
        }
    },
})
</script>
