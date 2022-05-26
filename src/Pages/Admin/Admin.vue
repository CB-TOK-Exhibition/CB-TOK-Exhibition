<template>
	<transition name="fade" mode="out-in">
	<div class="flex flex-row" v-if="userChecked">
		<div class="w-2/5 float-left mt-16 p-10 bg-gray-300 flex flex-col" style="height:120vh">
			<div class="flex-1">
				<h1 class="text-3xl font-bold mb-5">Years</h1>

				<transition name="fade" mode="out-in">
				<div v-if="yearsLoaded">
					<div v-for="year in years" :key="year.year" class="bg-red-200 p-4 rounded-xl">
						<h1 class="font-semibold text-xl mb-2">Classes</h1>
						<ul class="grid grid-cols-2 w-3/5 gap-x-2 gap-y-2 font-bold text-white">
							<li v-for="(classInstance, i) in year.classes" :key="i" class="bg-gray-400 p-2 rounded-lg">{{classInstance}}</li>
						</ul>
						<h1 class="text-3xl font-semibold mt-4">{{year.year}}</h1>
					</div>
				</div>
				<div v-else>
					LOADING...
				</div>
				</transition>
			</div>
			<div>
				<button class="bg-white border-2 p-4 rounded-lg" @click="signOut">Sign Out</button>
			</div>
		</div>
		<div class="w-3/5 float-right sticky top-0 p-20 flex flex-col gap-y-10 h-screen text-3xl font-bold text-center text-white select-none">
			<router-link to="/adminNewClass" class="flex-1">
				<div class="flex flex-col items-center justify-center gap-y-4 p-10 bg-green-500 rounded-xl h-full">
					<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
					Add New Class
				</div>
			</router-link>
			<router-link to="/adminNewYear" class="flex-1">
				<div class="w-full flex flex-col items-center justify-center gap-y-4 p-10 bg-red-500 rounded-xl h-full">
					<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
					Add New Year
				</div>
			</router-link>
		</div>
	</div>
	<div v-else class="h-screen">
		Loading
	</div>
	</transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {db} from '@/firebase'
import {yearContainer} from '@/types/projects'
import {auth} from '@/firebase'
import checkAdminMixin from '@/mixins/checkAdmin'
import { collection, getDocs } from '@firebase/firestore'

export default defineComponent({
	name:"Admin",
	mixins:[checkAdminMixin],
	data(){
		return{
			userChecked:false,
			years:[] as yearContainer[],
			yearsLoaded: false
		}
	},
	beforeCreate(){
		auth.onAuthStateChanged(async (user)=>{
			//logged in
			if (user && user != null && user.email) {
				if(!await this.isAdmin(user.email)) this.$router.push("/adminCheck")
				this.userChecked = true
			}
			//not logged in
			else this.$router.push('/adminCheck')
		})
	},
	async created(){
		const querySnapshot = await getDocs(collection(db, "years")).catch(err=>{
			console.error("firebase error", err)
		})
		if(!querySnapshot) return
		
		querySnapshot.forEach(stuff=> this.years.push({
			year:stuff.id as string,
			...stuff.data() as {classes:string[]}
		}))
		this.yearsLoaded = true
	},
	methods: {
		signOut(e: Event){
			e.preventDefault();
			auth.signOut();
			this.$router.push('/adminCheck')
		},
	},
})
</script>
