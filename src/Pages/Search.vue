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
			<div id="searchResults" v-if="projectsLoaded && projectsShown.length != 0" class="h-full w-full py-8 grid md:grid-cols-2 xl:grid-cols-3 gap-2">
				<div v-for="(project, i) in projectsShown" class="rounded-3xl overflow-hidden shadow-md transition-shadow hover:shadow-xl active:shadow-xl flex flex-col" :key="i">
					<router-link :to="`/${project.id}`" class="flex-1 flex flex-col h-full">
						<!-- IMAGE -->
						<img :src="getThumbnailURL(project)" class="w-full" id="itemPhoto"/>

						<!-- BOTTOM BITS -->
						<div class="p-4 flex-1 flex flex-col justify-around">
							<p class="font-bold text-3xl mt-4 text-center">{{project.projectTitle}}</p>
							<!-- TAG LIST -->
							<Pods :topics="project.topics"></Pods>

							<!-- STARS -->
							<div class="flex flex-row justify-center mt-3">
								<svg class="w-8 h-8" v-for="i in project.rating" :key="i" fill="#f0e769" stroke="#ccbf0c" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
								<svg class="w-8 h-8" v-for="j in 5-(project.rating)" :key="j" fill="#a3a3a3" stroke="#636363" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
							</div>
						</div>
					</router-link>
				</div>
			</div>
			<div v-else class="w-full mt-10">
				<h1 class="text-3xl font-bold">No Projects Found</h1>
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
import getThumbnail from "@/mixins/getThumbnail"

export default defineComponent({
	name:'Search',
	components:{Pods},
	mixins:[getThumbnail],
	data() {
		return {
			//FOR DISPLAY THINGS
			projectList:[] as project[],
			projectsShown:[] as project[],
			projectsLoaded: false,


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
		async getProjects(){
			this.projectsLoaded = false;

			//TODO UPDATE SEARCHING ALGORITHM
			let out = [] as project[]

			const ref = db.collection('projects');
			let query;
			if(this.filterYear.code) query = ref.where("year", "==", this.filterYear.code)
			if(this.filterClass.code) query = ref.where("class", "==", this.filterClass.code)
			
			let querySnapshot;
			if(query) querySnapshot = await query.get();
			else querySnapshot = await ref.get()

			querySnapshot.forEach((doc) => {
				let project = doc.data() as project
				project.id = doc.id
				out.push(project)
			});
			this.projectList = out
			
			this.projectsLoaded = true;
			this.projectsShown = out;
		},
		searchChange(){
			//TODO SET UP ALGOLIA AND SEARCH
			var projectsToBeShown = []
			for (var i = 0; i < this.projectList.length; i++) {
				try {
					var currentTitle = this.projectList[i].projectTitle
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

#itemPhoto{
	height: 19rem;
	object-fit: cover;
}
</style>
