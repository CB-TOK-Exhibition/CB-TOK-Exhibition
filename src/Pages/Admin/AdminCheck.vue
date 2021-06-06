<template>
	<div class="min-h-screen pt-16 grid place-items-center bg-blue-500">
        <Toast />
		<div class="bg-white p-10 rounded-xl">
			<h1 class="text-4xl font-bold mb-6">Admin Login</h1>
			<h2>Sign in <strong>USING SCHOOL ACCOUNT</strong> with Google</h2>
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
import checkAdminMixin from "@/mixins/checkAdmin"

export default defineComponent({
	name: "Admin Check Page",
	created(){
        auth.onAuthStateChanged(async (user)=>{
            //not OCDSB
            if(user && !user?.email?.endsWith("ocdsb.ca")){
                this.$toast.add({severity:'error', summary: 'You Must login with a OCDSB email', detail:'Use your school email', life:5000})
                user.delete()
                auth.signOut()
                return
            }

            //check if it is admin
            if(user?.email && !this.isAdmin(user.email)){
                this.$toast.add({severity:'error', summary: 'You Must login with a ADMIN email', detail:'Only admins allowed', life:5000})
                auth.signOut()
                return
            }

            //if admin
            if (user?.email && await this.isAdmin(user.email)){
				this.$router.push('/admin')
			}
        })
    },

	mixins:[checkAdminMixin],
    methods: {
        signIn(){
            auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(err=>{
                //TODO ADD SOME UI THINGS 
                const errorCode = err.code;
                const errorMessage = err.message;
                this.$toast.add({severity:'error', summary: errorMessage, detail:'Google Auth Error ' + errorCode, life: 5000})
                return;
            })
        }
    },
})
</script>
