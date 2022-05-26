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
import {auth, db } from '@/firebase'
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { User } from "firebase/auth"
import Form from '@/components/Form.vue'

export default defineComponent({
	name:"Upload",
	components:{
		"Form": Form,
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
		async penis(user: User){
			//check if user is banned
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
		async checkBanned(user: User): Promise<boolean>{
			const snap = await getDoc(doc(db, "meta", "banned"));
			const data = snap.data()
			return snap.exists() && data?.emails.includes(user.email)
		},
		async checkSubmitted(user: User): Promise<boolean>{
			const projectRef = collection(db, "projects")
			const q = query(projectRef, where("author", "==", user.email))
			const snapshot = await getDocs(q);
			return !snapshot.empty
		}
	},
})
</script>