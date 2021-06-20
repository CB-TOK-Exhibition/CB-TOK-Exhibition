<template>
	<transition name="fade" mode="out-in">
	<div v-if="!userDetermined" class="h-screen grid place-items-center" key="loading">
		<PulseLoader />
	</div>

	<div v-else-if="banned" class="h-screen pt-16 grid place-items-center" key="banned">
		<h1 class="text-6xl font-bold">BANNED</h1>
	</div>

	<!-- Basically not banned -->
	<Form v-else key="form"></Form>
	</transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {auth, db} from '@/firebase'
import firebase from "firebase"
import Form from '@/components/Form.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default defineComponent({
	name:"Upload",
	components:{
		"Form": Form,
		PulseLoader
	},
	data() {
		return {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			userDetermined: false, //if false, loading page
			banned: false //causes user to see banned page
		}
	},
	async created(){
		// IF THE MAIN USER HAS BEEN LOADED
		if(this.$store.state.userLoaded) await this.penis(this.$store.getters.getUser)
		
		else{
			auth.onAuthStateChanged(async (user)=>{
				//logged in
				if (user) await this.penis(user)
				//not logged in
				else this.$router.push('/uploadInstructions')
			});
		}
	},
	methods: {
		async penis(user: firebase.User){
			//check if user is banned
			console.log(user)
			this.banned = await this.checkBanned(user)
			if(this.banned){
				this.userDetermined = true
				return
			}

			//check if user has already submitted
			if(await this.checkSubmitted(user)){
				this.$router.push("/edit")
				return
			}
			this.userDetermined = true
		},
		async checkBanned(user: firebase.User): Promise<boolean>{
			const snap2 = await db.collection("meta").doc("banned").get()
			const dat = snap2.data()
			if(snap2.exists && dat && dat.emails.includes(user.email)){
				return true
			}
			else return false
		},
		async checkSubmitted(user: firebase.User): Promise<boolean>{
			const snapshot = await db.collection("projects").where("author", "==", user.email).get()
			return !snapshot.empty
		}
	},
})
</script>