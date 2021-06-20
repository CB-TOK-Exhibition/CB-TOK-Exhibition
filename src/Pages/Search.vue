<template>

	<div class="min-h-screen w-full">
		<div class="h-72 w-full bg-blue-300 flex flex-col justify-end pl-6 pb-12 lg:pl-32 lg:pb-20" id="searchBanner">
			<p>
				PUT SOMETHING IN THE BACKGROUND HERE
			</p>
			<h1 class="text-white text-6xl font-bold">Search</h1>
		</div>


		<div class="w-full px-4 lg:px-32">


			<div id="searchBar" class="w-full">
				<input
				type="search"
				class="border-4 border-gray-300 w-full p-4 rounded-xl noOutline focus:ring text-xl hover:shadow-lg"
				name="search" id="search" v-model="search" v-on:input="searchChange">
			</div>
			<div class="flex flex-row mt-4 gap-x-4">
				<Dropdown @change="changeYear" v-model="filterYear" :options="years" optionLabel="name" placeholder="Filter Year..."/>
				<Dropdown @change="changeClass" v-model="filterClass" :options="classes" optionLabel="name" placeholder="Filter Class..." :loading="classFilterLoading" :disabled="classes.length == 0"/>
			</div>

			<transition name="fade" mode="out-in">
			<div v-if="projectsLoaded && projectsShown.length != 0">
				<div id="searchResults" class="py-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
					<transition-group name="fade">
					<div v-for="(project, i) in projectsShown" id="projectMain" class="rounded-3xl overflow-hidden shadow-md hover:shadow-xl active:shadow-xl flex flex-col" :key="i">
						<router-link :to="`/${project.id}`" class="flex-1 flex flex-col h-full">
							<!-- IMAGE -->
							<img :src="project.imageURL" class="w-full" id="itemPhoto"/>

							<!-- BOTTOM BITS -->
							<div class="p-4 flex-1 flex flex-col justify-around">
								<p class="font-bold text-2xl mt-4 text-center">{{project.projectTitle}}</p>
								<!-- TAG LIST -->
								<Pods :topics="project.topics"></Pods>

								<!-- STARS -->
								<Stars :clickable="false" :rating="project.rating" :centered="true"/>
							</div>
						</router-link>
					</div>
					</transition-group>
				</div>
			</div>
			<div v-else-if="projectsLoaded" class="w-full mt-10">
				<h1 class="text-3xl font-bold">No Projects Found</h1>
			</div>
			<div v-else class="w-full h-64 grid place-items-center">
				<PulseLoader />
			</div>
			</transition>
			<Paginator v-if="projectsShown.length != 0" class="w-full mb-4" v-model:first="offset" :rows="21" :totalRecords="totalProjectCount" @page="onPage($event)"/>
		</div>
	</div>

</template>

<script lang="ts">
import {defineComponent} from 'vue'
import project from '@/types/projects'
import {db} from '@/firebase'
import okboomer from '@/types/okbm'

import Pods from "@/components/Pods.vue"
import Stars from "@/components/Stars.vue"

import getThumbnail from "@/mixins/getThumbnail"
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'


import firebase from "firebase"

interface pageEvent{
	page: number,
	first: number,
	rows: number,
	pageCount: number
}

export default defineComponent({
	name:'Search',
	components:{Pods, PulseLoader, Stars},
	mixins:[getThumbnail],
	data() {
		return {
			//FOR DISPLAY THINGS
			projectList:[] as project[],
			projectsShown:[] as project[],
			projectsLoaded: false,
			totalProjectCount: 0,
			offset:0,

			// PAGINATION
			lastProject:{} as project,
			nextProject:{} as project,
			lastID:0,


			//FILTERS
			search:"",

			filterYear:{} as okboomer,
			years:[
				{
					name:"No Filter",
					code:""
				},
				{
					name:"2020-2021",
					code:"2020-2021"
				}
			] as okboomer[],

			filterClass:{} as okboomer,
			classes:[] as okboomer[],
			classFilterLoading: false,
		}
	},
	created(){
		this.getProjects();
	},
	methods:{
		async changeYear(){
			this.classes = []
			this.filterClass = {name:"No Filter",code:""} as okboomer
			
			this.getProjects();

			if(!this.filterYear.code) return
			this.classFilterLoading = true
			const a = await db.collection("years").doc(this.filterYear.code).get()
			const data = a.data() as {classes: string[]}

			data.classes.forEach(className=>{
				this.classes.push({
					name:className,
					code:className
				})
			})
			this.classFilterLoading = false
		},
		changeClass(){
			this.getProjects();
		},
		async getProjects(direction?: "up"|"down"){
			this.projectsLoaded = false;
			
			const onSnap = async (snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>): Promise<void> =>{
				//LOAD PROJECTS
				let out = [] as project[]
				this.projectsLoaded = false;
				for(let i = 0; i < snapshot.docs.length; i++){
					let project = snapshot.docs[i].data() as project
					project.id = snapshot.docs[i].id
					project.imageURL = await this.getThumbnailURL(project)
					out.push(project)
				}
				await Promise.all(out)
				this.projectList = out
				this.projectsShown = out;

				//UPDATE PROJECT COUNT
				this.totalProjectCount = ((await db.collection("meta").doc("projects").get()).data() as {projectCount: number}).projectCount
				this.lastProject = out[0]
				this.nextProject = out[out.length - 1]
				this.projectsLoaded = true;
				this.searchChange()
			}

			this.totalProjectCount = ((await db.collection("meta").doc("projects").get()).data() as {projectCount: number}).projectCount

			const baseRef = db.collection('projects').orderBy("rating", "desc").limit(21);
			let query = baseRef;
			if(this.filterYear.code) query = query.where("year", "==", this.filterYear.code)
			if(this.filterClass.code) query = query.where("class", "==", this.filterClass.code)
			if(direction == "up"){
				const ppp = this.nextProject
				delete ppp.id
				query = query.startAfter(ppp)
			}
			else if(direction == "down"){
				const ppp = this.lastProject
				delete ppp.id
				query = query.endBefore(ppp)
			}
			
			query.onSnapshot(onSnap)
		},
		async onPage(e: pageEvent){
			console.log(e);
			if(e.page > this.lastID) this.getProjects("up")
			else if(e.page < this.lastID) this.getProjects("down")
			this.lastID = e.page
		},
		searchChange(){
			//TODO SET UP ALGOLIA AND SEARCH
			let projectsToBeShown = []
			for (let i = 0; i < this.projectList.length; i++) {
				try {
					const currentTitle = this.projectList[i].projectTitle
					if (currentTitle.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) projectsToBeShown.push(this.projectList[i])
				}
				catch {null}
			}
			this.projectsShown = projectsToBeShown

		},
	}
})
</script>

<style lang="scss">
#searchBanner{
	margin-bottom: -1.5rem;
}
#searchBar input{
	transition: background-color 0.3s ease, box-shadow 0.15s ease;
	&:hover{
		background-color: #f0f0f0;
	}
}

#projectMain{
	transition: transform 0.5s ease, box-shadow 0.15s ease;
	&:hover{
		transform: scale(1.01);
	}
}

#itemPhoto{
	height: 19rem;
	object-fit: cover;
}
</style>
