<template>
	<div class="w-full">
		<div class="h-72 w-full relative overflow-hidden" id="searchBanner">
			<div class="h-full w-full flex flex-col justify-end pl-6 pb-12 lg:pl-32 lg:pb-20">
				<h1 class="text-white text-6xl font-bold">Search</h1>
			</div>
			<div class="absolute top-0 left-0 w-full h-full bg-cover bg-center" id="backgroundImage"></div>
		</div>


		<div class="w-full px-4 lg:px-32">
			<div id="searchBar" class="w-full">
				<input
				type="search"
				class="border-4 border-gray-300 w-full p-4 rounded-xl noOutline focus:ring text-xl hover:shadow-lg"
				name="search" id="search" v-model="search" @change="searchChange">
			</div>
			<div class="flex flex-row mt-4 gap-x-4">
				<Dropdown @change="changeYear" v-model="filterYear" :options="years" optionLabel="name" placeholder="Filter Year..."/>
				<Dropdown @change="changeClass" v-model="filterClass" :options="classes" optionLabel="name" placeholder="Filter Class..." :loading="classFilterLoading" :disabled="classes.length == 0"/>
			</div>

			<transition name="fade" mode="out-in">
					<div v-if="projectsLoaded && projectList.length != 0">
						<div id="searchResults" class="py-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
							<transition-group name="fade">
							<div v-for="(project, i) in projectList" id="projectMain" class="rounded-3xl overflow-hidden shadow-md hover:shadow-xl active:shadow-xl flex flex-col" :key="i">
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
					<div v-else-if="projectsLoaded" class="w-full mt-10 h-64">
						<h1 class="text-3xl font-bold">No Projects Found</h1>
					</div>
					<div v-else class="w-full h-64 grid place-items-center">
						<PulseLoader />
					</div>
				</transition>

				<transition name="heightEnterPag">
					<div class="overflow-hidden" v-if="recordCount > 0 && pagControl">
						<Paginator class="w-full mb-4" :rows="21" :totalRecords="recordCount" @page="onPage($event)"/>
					</div>
				</transition>
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

import algoliasearch from "algoliasearch"
import {SearchResponse} from "@algolia/client-search"
interface pageEvent{
	page: number,
	first: number,
	rows: number,
	pageCount: number
}
interface dropdownEvent{
	originalEvent: MouseEvent,
	value: {name: string, code: string}
}

// TODO PROPER PAGINATION, right now it is very manual and taxing
export default defineComponent({
	name:'Search',
	components:{Pods, PulseLoader, Stars},
	mixins:[getThumbnail],
	data() {
		const searchClient = algoliasearch("JERBZD5TNR", "7b3aa8569e2b61645013ab83a6341c2b")
		const index = searchClient.initIndex("projects")
		return {
			//FOR DISPLAY THINGS
			projectList:[] as project[],
			projectsLoaded: false,
			recordCount: 0,
			pagControl: true,
			index: index,

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
		this.updateSearch()
	},
	methods:{
		async changeYear(a: dropdownEvent){
			this.updateSearch()
		
			//GET CLASSES FOR THAT YEAR
			this.classFilterLoading = true

			this.filterClass = {name:"No Filter",code:""} as okboomer
			this.classes = [{name:"No Filter",code:""}]
			if(a.value.code){
				const data = (await db.collection("years").doc(a.value.code).get()).data() as {classes: string[]}
				data.classes.forEach(className=>{this.classes.push({name:className,code:className})})
			}

			this.classFilterLoading = false
		},

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		changeClass(a: dropdownEvent){
			this.updateSearch()
		},
		searchChange(){
			//TODO SET UP ALGOLIA AND SEARCH
			this.updateSearch()
		},

		// PAGNATION
		async onPage(e: pageEvent){
			window.scroll(0, 0)
			await this.updateSearch(e.page)
		},
		async updateSearch(pageNum?: number){
			this.projectsLoaded = false

			if(!pageNum) pageNum = 0
			const result = await this.algoliaQuery(pageNum)
			this.recordCount = result.nbHits
			this.projectList = await this.getByIds(result)

			this.projectsLoaded = true
		},
		async algoliaQuery(pageNum: number){
			this.projectsLoaded = false;
			const [className, year] = [this.filterClass.code, this.filterYear.code]
			//generate filter
			let filters = []
			if(className) filters.push(`class:${className}`)
			if(year) filters.push(`year:${year}`)
			const result = await this.index.search(this.search, {
				facetFilters: filters,
				page: pageNum,
			})
			return result
		},
		async getByIds(result: SearchResponse): Promise<project[]>{
			// console.time()
			let ids = result.hits.map(doc => doc.objectID)
			
			let temp = []
			let out = [] as project[]
			for(const id of ids) temp.push(db.collection("projects").doc(id).get())
			// console.log("For loop push")
			// console.timeLog()
			// console.log(temp)
			temp = await Promise.all(temp)
			// console.log(temp)
			// console.log("Promise.all the temp")
			// console.timeLog()


			for(const doc of temp){
				const project = doc.data() as project
				project.id = doc.id
				out.push(project)
			}
			// console.log("For loop doc")
			// console.timeLog()
			out.map(async project=>{
				project.imageURL = await this.getThumbnailURL(project)
			})
			// console.log("Final")
			// console.timeLog()
			
			return out
		},
		// async getProjects(projectCount: number){
		// 	this.projectsLoaded = false;
		// 	projectCount += 21
		// 	this.unSub()
			
		// 	const onSnap = async (snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>): Promise<void> =>{
		// 		this.projectsLoaded = false;
		// 		//LOAD PROJECTS

		// 		let out = [] as project[]

		// 		//starts at next multiple of 21 of (length - 21)
		// 		const starting = Math.ceil((snapshot.docs.length-21)/21) * 21
		// 		for(let i = starting; i < snapshot.docs.length; i++){
		// 			let project = snapshot.docs[i].data() as project
		// 			project.id = snapshot.docs[i].id
		// 			out.push(project)
		// 		}
		// 		await Promise.all(out)
		// 		out.forEach(async p=> p.imageURL = await this.getThumbnailURL(p))
		// 		await Promise.all(out)
				
		// 		this.projectList = out

		// 		//UPDATE PROJECT COUNT
		// 		this.totalProjectCount = ((await db.collection("meta").doc("projects").get()).data() as {projectCount: number}).projectCount
		// 		this.projectsLoaded = true;
		// 	}

		// 	let query = db.collection('projects').orderBy("rating", "desc").limit(projectCount);
		// 	if(this.filterYear.code) query = query.where("year", "==", this.filterYear.code)
		// 	if(this.filterClass.code) query = query.where("class", "==", this.filterClass.code)
			
		// 	this.unSub = query.onSnapshot(onSnap)
		// },
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

#backgroundImage{
	z-index: -1;
	background-image: url("../assets/backgroundImage.jpg");
	filter: blur(6px) grayscale(63%) hue-rotate(20deg);
	transform: scale(1.05);
}
</style>
