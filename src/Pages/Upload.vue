<template>
    <div class="mx-10 min-h-screen">
        <div class="h-16"></div>
        <h1 class="text-4xl font-bold mb-6">Upload Page</h1>
        <div class="flex flex-row border-2 rounded-lg p-4 mb-10 gap-x-5">
            <img :src="currentUser.photoURL" alt="" class="flex-0 h-24 w-24">
            <div class="flex-1 flex items-center">
                <h1 class="text-3xl font-bold">Current User: {{currentUser.displayName}}</h1>
            </div>
            <div class="flex-0 flex items-center">
                <button class="border-2 p-4 rounded-lg noOutline focus:ring" @click="signOut">Sign Out</button>
            </div>
        </div>
        <form @submit="submit">
            <label for="title" class="text-2xl font-bold mb-2 mt-6">Title</label>
            <input type="text" name="title" id="title" class="block border-2 w-full p-2 focus:ring noOutline rounded-lg" v-model="title">

            <h1 class="text-2xl font-bold mb-2 mt-6">Drop Files Here</h1>
            <input type="file" class="hidden" name="fileInput" id="fileInput" accept="application/pdf">
            <label for="fileInput" id="dropArea" class="h-24 w-56 border-2 inline-grid place-items-center cursor-pointer" @drop="dropHandle($event)">
                <p class="inline-block">
                    Click or Drop Files Here...
                </p>
                <p class="inline-block">
                    {{fileName}}
                </p>
            </label>

            <h1 class="text-2xl font-bold mb-2 mt-6">Select Your Topics {{checked}}/3</h1>
            <div class="flex flex-col">
                <label for="knower">
                    <input type="checkbox" v-on:change="limit" name="knower" id="knower">
                    Knowledge and the Knower
                </label>
                <label for="language">
                    <input type="checkbox" v-on:change="limit" name="language" id="language">
                    Knowledge and Language
                </label>
                <label for="tech">
                    <input type="checkbox" v-on:change="limit" name="tech" id="tech">
                    Knowledge and Tech
                </label>
                <label for="religion">
                    <input type="checkbox" v-on:change="limit" name="religion" id="religion">
                    Knowledge and Religion
                </label>
                <label for="politics">
                    <input type="checkbox" v-on:change="limit" name="politics" id="politics">
                    Knowledge and Politics
                </label>
                <label for="indigenous">
                    <input type="checkbox" v-on:change="limit" name="indigenous" id="indigenous">
                    Knowledge and Indigenous Societies
                </label>
            </div>

            <button type="submit" :disabled="!formReady" class="mt-6 p-2 px-10 bg-blue-200 border-blue-400 disabled:opacity-50 disabled:cursor-default border-2 rounded-lg font-bold noOutline focus:ring">Submit</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {auth, db} from '@/firebase'

export default defineComponent({
    name:"Upload",
    data() {
        return {
            checked:0,
            title:'',
            // eslint-disable-next-line
            currentUser: {} as any,
            uploaded:false,
            fileName:'',
        }
    },
    created(){
        auth.onAuthStateChanged(async (user)=>{
            if (user) {
                const user = auth.currentUser;
                this.currentUser = user

                const snapshot = await db.collection('publishedUsers').where("email", "==", user?.email).get().catch(err => {
                    console.error(err);
                    this.$router.push('/')
                })
                if(!snapshot) return
                snapshot.forEach(e => {
                    const doc = e.data()
                    if (doc && doc.exists) {
                        //TODO better reaction
                        this.$router.push('/')
                    }
                });
            } else {
                this.$router.push('/uploadInstructions')
            }
        });
    },
    mounted(){
        this.checked = 0
        const dropArea = document.getElementById('dropArea')
        if(!dropArea){return;}

        const preventDefaults = (e: Event) => {e.preventDefault();e.stopPropagation()}
        const highlight = ()=>{dropArea.classList.add('highlight')}
        const unhighlight = ()=> {dropArea.classList.remove('highlight')}

        ['dragenter', 'dragleave', 'drop', 'dragover'].forEach(eventName => dropArea.addEventListener(eventName, preventDefaults, false));
        ['dragenter'].forEach(eventName => dropArea.addEventListener(eventName, highlight, false));
        ['dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, unhighlight, false));
    },
    computed:{
        formReady(vm){
            return !!vm.title && vm.uploaded && vm.checked == 3;
        }
    },
    methods: {
        limit(e:Event){
            const limit = 3
            const target = e.currentTarget as HTMLInputElement;
            if(!target){return;}
            if(!target.checked) this.checked -= 1;
            else{
                //TODO ADD SOME USER INTERACTION TO SHOW THAT CHECKBOX NO MORE CLICK
                if(this.checked == limit){target.checked = false;console.error("NO MORE CHECKBOXES");return}
                this.checked += 1
            }
        },
        signOut(e: Event){
            e.preventDefault();
            auth.signOut();
            this.$router.push('/uploadInstructions')
        },
        async submit(e: Event){
            e.preventDefault()
            console.log("Submit Start")
            //check if all needed elements are here
            const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
            if(!(this.title) || !fileInput.files || fileInput.files?.length == 0 || !(this.checked == 3)){
                //TODO USER UI THING
                console.error("Form Incomplete")
                return;
            }

            //upload to FTP
            fetch('http://localhost:5001/cb-tok-exhibition/us-central1/ftp/write', {
                method: 'POST',
                mode: 'cors',
                body: fileInput.files[0]
            })
            
            //upload to database
            // db.collection("publishedUsers").doc().set({
            //     email: this.currentUser.email
            // })

            // db.collection("projects").doc().set({
            //     class:"6",
            //     filePath:"yeet.pdf",
            //     imageFeature:"image.jpg",
            //     rating:5,
            //     topics:[1, 2, 3]
            // })
        },
        dropHandle(e: DragEvent){
            const dt = e.dataTransfer
            if(!dt){return;}
            const files = dt.files

            if(files.length > 1){
                //TODO Add some UI thing to help with this
                console.error("ONLY DROP ONE AT A TIME")
                return;
            }else if(files[0].type != "application/pdf"){
                //TODO Add some UI thing to help with this
                console.error("PDF ONLY");
                return;
            }

            console.log("Upload")
            const file = files[0]
            console.log(file)
            this.fileName = file.name;
            this.uploaded = true;


            const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
            if(!fileInput){console.error("[BACKEND] INPUT DOES NOT EXIST");return}
            fileInput.files = files
        }
    },
})
</script>

<style lang="scss" scoped>

#dropArea {
    border: 2px dashed #ccc;
    &.highlight {
        border-color: purple;
    }
}
</style>