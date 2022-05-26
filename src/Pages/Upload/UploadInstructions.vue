<template>
	<div class="min-h-screen pt-16 grid place-items-center bg-green-500">
		<Toast />
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
import { auth } from '@/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import firebase from 'firebase/compat/app';

export default defineComponent({
	name:"Upload-Instructions",
	created(){
		onAuthStateChanged(auth, (user)=>{
			if (user) {
				if(!user?.email?.endsWith("ocdsb.ca")){
					this.$toast.add({severity:'error', summary: 'You Must login with a OCDSB email', detail:'Use your school email', life:5000})
					user.delete()
					auth.signOut()
					return
				}
				this.$router.push('/upload')
			}
		})
	},
	methods: {
		signIn(){
			const provider = new GoogleAuthProvider();
			signInWithPopup(auth, provider)
			.catch(err=>{
				const errorCode = err.code;
				const errorMessage = err.message;
				console.warn(errorCode, errorMessage)
				this.$toast.add({severity:'error', summary: errorMessage, detail:'Google Auth Error ' + errorCode, life: 5000});
				return;
			})
		}
	},
})
</script>

<style lang="scss">
ol{
	list-style-type: decimal;
}
</style>