<template>
    <div>
        Project Page
    </div>
</template>
<script lang="ts">
import project from '@/types/projects'
import { defineComponent } from "@vue/runtime-core";
import {db} from '@/firebase'

export default defineComponent({
    name:"Project Page",
    data() {
        return {
            project:{} as project
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
            if(data) this.project = data as project
            else this.$router.push('/')
        }
        else this.$router.push('/')
    }
})
</script>