<template>
    <div v-if="!userResolved" class="h-screen pt-16 grid place-items-center">
        <PulseLoader />
    </div>
    <div v-else class="h-screen pt-16">
        <button class="border-2 bg-gray-200 p-2" @click="deleteProject">DELETE PROJECT</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {db, auth, storage} from "@/firebase"
import project from "@/types/projects"
import { collection, deleteDoc, doc, getDocs, query, where } from '@firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'

export default defineComponent({
    name: "Edit",
    data() {
        return {
            project:{} as project,
            userResolved: false,
        }
    },
    created(){
        // TODO CHECK IF USER HAS PROJECT
        if(this.$store.state.userLoaded) this.loadProject()
        else{
            auth.onAuthStateChanged((user) => {
                if(user) this.loadProject()
                else this.$router.push("/uploadInstructions")
            })
        }
    },
    methods: {
        async loadProject(){
            const email = this.$store.getters.getUser.email
            const snapshot = await getDocs(query(collection(db, "projects"), where("author", "==", email)))
            if(snapshot.empty){
                this.$router.push("/upload")
                return
            }
            const doc = snapshot.docs[0]
            this.project = doc.data() as project
            this.project.id = doc.id
            this.userResolved = true;
        },

        async deleteProject(){
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const a = deleteDoc(doc(db, "projects", this.project.id!))
            const b = deleteObject(ref(storage, `/images/${this.project.year}/${this.project.class}/${this.project.id}.${this.project.imageExtension}`))
            const c = deleteObject(ref(storage, `/projects/${this.project.year}/${this.project.class}/${this.project.id}.pdf`))
            await Promise.all([a, b, c])
            this.$router.push("/upload")
        },
    },
})
</script>
