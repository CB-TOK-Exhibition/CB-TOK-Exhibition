<template>
	<transition name="fade" mode="out-in">
	<div v-if="!userDetermined" class="h-screen bg-green-400" key="loading">
		Loading
	</div>
	<Form v-else-if="!userSubmitted" key="form" :currentUser="currentUser"></Form>
	<div class="h-screen pt-16 grid place-items-center" v-else key="submitted">
		<div class="flex flex-col gap-y-6 items-center">
			<h1 class="text-4xl font-bold">You've already submitted</h1>
			<router-link to="/">Go Home</router-link>
		</div>
	</div>
	</transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {auth, db} from '@/firebase'
import Form from '@/components/Form.vue'

export default defineComponent({
	name:"Upload",
	components:{
		"Form": Form
	},
	data() {
		return {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			currentUser: {},
			userDetermined: false,
			userSubmitted:false,
		}
	},
	async created(){
		auth.onAuthStateChanged(async (user)=>{
			//logged in
			if (user && user != null) {
				this.currentUser = user
				//check if user has already submitted
				const snapshot = await db.collection("projects").where("author", "==", user.email).get()
				snapshot.forEach(()=>{
					this.userSubmitted = true
				})
				this.userDetermined = true;
			}
			
			//not logged in
			else {
				this.$router.push('/uploadInstructions')
			}
		});
	},
})
</script>