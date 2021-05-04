<template>
    <div class="min-h-screen">
        {{project.id}}
        {{project.projectTitle}}
        {{project.topics}}
        {{project.class}}
        {{project.filePath}}
        <div id="tagList" class="flex flex-row gap-x-2 gap-y-2 flex-wrap">
            <p v-for="(tag, i) in project.topics" :key="i" :style="{ backgroundColor: topicColours[tag-1]}" class="p-1 px-3 rounded-full text-sm text-white font-semibold">
                {{topicsList[tag-1]}}
            </p>
        </div>
        <img :src="project.imageFeature" alt="Project Image">
    </div>
</template>
<script lang="ts">
import project from '@/types/projects'
import { defineComponent } from "@vue/runtime-core";
import {db} from '@/firebase'
import {topicsList, topicColours} from "../types/projects"

export default defineComponent({
    name:"Project Page",
    data() {
        return {
            project:{} as project,
            topicsList: topicsList,
            topicColours: topicColours
        }
    },
    async created(){
        const projectID = this.$route.fullPath.substring(1)
        const docRef = db.collection('projects').doc(projectID)
        
        const doc = await docRef.get().catch(err => {
            console.error(err);
            this.$router.push('/')
        })

        if (doc && doc.exists) {
            const data = doc.data();
            if(data) {
                this.project = data as project
                this.project.id = projectID
            }
            else this.$router.push('/')
        }
        else this.$router.push('/')
    }
})
</script>