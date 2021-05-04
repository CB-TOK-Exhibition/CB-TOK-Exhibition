<template>
    <div class="min-h-screen pt-16 grid place-items-center bg-green-500">
        <div class="bg-white p-10 rounded-xl">
            <h1 class="text-4xl font-bold mb-6">Upload Instructions</h1>
            <ol>
                <li>Sign in <strong>USING SCHOOL ACCOUNT</strong> with Google</li>
                <li>Enter important information and upload <strong>1 PDF</strong></li>
                <li>Submit!</li>
            </ol>
            <button @click="signIn" class="flex flex-row items-center gap-x-4 mx-auto mt-4 px-4 py-3 focus:ring noOutline rounded-md shadow-md font-smibold text-lg">
                <img src="@/assets/google.svg" class="h-10 w-10" alt="Google Icon">
                Sign in with Google
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {auth} from '@/firebase'
import firebase from 'firebase'

export default defineComponent({
    name:"Upload Instructions",
    created(){
        auth.onAuthStateChanged((user)=>{
            if (user) {
                this.$router.push('/upload')
            }
        })
    },
    methods: {
        async signIn(){
            const result = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(err=>{
                //TODO ADD SOME UI THINGS 
                const errorCode = err.code;
                const errorMessage = err.message;
                console.warn(errorCode, errorMessage)
                return;
            })
            if(result){
                if(result.user?.email && !result.user?.email?.endsWith("ocdsb.ca")){
                    //TODO ADD SOME UI THINGS 
                    console.error("Log in with OCDSB Email")
                    result.user.delete()
                    auth.signOut()
                    return;
                }
                this.$router.push("/upload")
            }
        }
    },
})
</script>

<style lang="scss">
ol{
    list-style-type: decimal;
}
</style>