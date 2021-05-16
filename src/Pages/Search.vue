<template>
    <div class="min-h-screen w-full">
        <div class="h-72 w-full bg-blue-300 flex flex-col justify-end pl-6 pb-12 lg:pl-32 lg:pb-20" id="searchBanner">
            <p>
                PUT SOMETHING IN THE BACKGROUND HERE
            </p>
            <h1 class="text-white text-6xl font-bold">Search</h1>
        </div>


        <div class="w-full px-4 lg:px-32">
            <div id="searchBar" class="w-full">
                <input type="search" class="border-4 border-gray-300 w-full p-4 rounded-xl noOutline focus:ring text-xl hover:shadow-lg" name="search" id="search" v-model="search">
            </div>
            <div class="w-full mt-4">filter by: </div>
            <div id="searchResults" class="h-full w-full py-10 grid md:grid-cols-2 xl:grid-cols-3 gap-2">
                <div v-for="(project, i) in projectList" class="rounded-3xl overflow-hidden shadow-md transition-shadow hover:shadow-xl active:shadow-xl" :key="i">
                    <router-link :to="`/${project.id}`">
                        <!-- IMAGE -->
                        <img :src="project.imageFeature" class="w-full"/>

                        <!-- BOTTOM BITS -->
                        <div class="p-4">
                            <p class="font-bold text-3xl mt-4 text-center">{{project.projectTitle}}</p>
                            <!-- TAG LIST -->
                            <div id="tagList" class="flex flex-row gap-x-2 gap-y-2 mt-6 flex-wrap justify-center">
                                <p v-for="(tag, i) in project.topics" :key="i" :style="{ backgroundColor: topicColours[tag-1]}" class="p-1 px-3 rounded-full text-sm text-white font-semibold">
                                    {{topicsList[tag-1]}}
                                </p>
                            </div>

                            <!-- STARS -->
                            <div class="flex flex-row justify-center mt-3">
                                <svg class="w-8 h-8" v-for="i in project.rating" :key="i" fill="#f0e769" stroke="#ccbf0c" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                                <svg class="w-8 h-8" v-for="j in 5-(project.rating)" :key="j" fill="#a3a3a3" stroke="#636363" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
//TODO FILTER BY DROPDOWNS
import {defineComponent} from 'vue'
import project from '@/types/projects'
import {topicsList, topicColours} from "../types/projects"
import {db} from '@/firebase'

export default defineComponent({
    name:'Search',
    data() {
        return {
            search:"",
            projectList:[] as project[],
            topicsList: topicsList,
            topicColours: topicColours
        }
    },
    async created(){
        const docRef = db.collection('projects');
        const querySnapshot = await docRef.get()
        querySnapshot.forEach((doc) => {
            let project = doc.data() as project
            project.id = doc.id
            this.projectList.push(project)
        });
    }
})
</script>

<style lang="scss">
    #searchBanner{
        margin-bottom: -1.5rem;
    }
    #searchBar input{
        transition: background-color 0.3s ease, box-shadow 0.15s ease;
        &:hover{
            background-color: #f0f0f0;
        }
    }

</style>