<template>
    <div class="min-h-screen flex flex-col p-16">
        <h1 class="text-6xl font-black mb-4">Discover</h1>
        <div class="flex flex-row text-xs gap-x-2 gap-y-2 flex-wrap">
            <div v-for="(topic, i) in topicsList" class="bg-gray-100 p-1 px-2 rounded-full border-2" :key="i">
                {{topic}}
            </div>
        </div>
        <div class="flex-1 flex flex-row items-center p-4 gap-x-4">
            <svg class="w-6 h-6 arrows" @click="lastProject" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
            
            <!-- PROJECT BULK -->
            <div class="flex-1 bg-red-200 h-full" v-if="!loading">
                <img :src="doc.imageFeature" alt="">
                <h1>{{doc.projectTitle}}</h1>
                <div class="flex flex-row mt-3">
                    <svg class="w-8 h-8" v-for="i in doc.rating" :key="i" fill="#f0e769" stroke="#ccbf0c" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                    <svg class="w-8 h-8" v-for="j in 5-(doc.rating)" :key="j" fill="#a3a3a3" stroke="#636363" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                </div>
                <Pods :topics="doc.topics" :center="false"></Pods>
            </div>
            <div v-else class="flex-1">
                LOADING
            </div>


            <svg class="w-6 h-6 arrows" @click="nextProject" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import project, {topicsList} from '@/types/projects'
import {db} from '@/firebase'
import Pods from '@/components/Pods.vue'

export default defineComponent({
    name:'Discover',
    components:{Pods},
    data() {
        return {
            topicsList,
            doc:{} as project,
            loading: true,

            ids: [] as string[],
            id: 0,
        }
    },
    async created(){
        //TODO GET the project
        const doc = await db.collection("meta").doc("featureProjects").get()
        this.ids = (doc.data() as {projects: string[]}).projects
        await this.getProject()
    },
    methods:{
        lastProject(){
            this.id -= 1
            if(this.id < 0) this.id = this.ids.length - 1
            this.getProject()
        },
        nextProject(){
            this.id += 1
            if (this.id >= this.ids.length) this.id = 0
            this.getProject()
        },
        async getProject(){
            console.log("get project")
            this.loading = true

            const projectId = this.ids[this.id]
            const projectSnapshot = await db.collection("projects").doc(projectId).get()
            const projectData = projectSnapshot.data() as project
            console.log(projectData)
            this.doc = projectData

            this.loading = false
        }
    }
})
</script>

<style lang="scss" scoped>
.arrows{
    transition: transform .2s ease;
    &:hover{
        transform: scale(1.4);
    }
}
</style>