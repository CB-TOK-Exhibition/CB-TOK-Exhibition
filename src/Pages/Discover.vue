<template>
	<div class="min-h-screen flex flex-col p-16">
		<h1 class="text-6xl font-black mb-4">Discover</h1>


		<!-- <div id="podsList" class="flex flex-row text-xs gap-x-2 gap-y-4 flex-wrap">
			<!- - TODO MAKE FILTER WORK - ->
			<div v-for="(topic, i) in topicsList" :key="i">
				<input type="radio" class="hidden" name="name" :id="i">
				<label class="bg-gray-100 p-1 px-2 rounded-full border-2 cursor-pointer select-none" :for="i">
					{{topic}}
				</label>
			</div>
		</div> -->


		<div class="flex-1 flex flex-row items-center p-4 gap-x-6 overflow-x-hidden">
			<svg class="w-6 h-6 arrows cursor-pointer" @click="lastProject" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
			
			<!-- PROJECT BULK -->
			<transition-group tag="div" name="slideX" mode="out-in" @enter="enterImage">
			
			<router-link id="projectTile" class="flex-1 h-full w-full border-4 rounded-xl" :to="`/${doc.id}`" v-for="number in [id]" :key="number"><transition name="fade" @enter="enterImage" mode="out-in">
				<div class="flex flex-row p-8 gap-x-2" v-if="!loading" :key="3*id">
					<div class="flex-1 flex flex-col justify-center">
						<h1 class="text-5xl font-bold">{{doc.projectTitle}}</h1>
						<div class="flex flex-row mt-3">
							<svg class="w-8 h-8" v-for="i in doc.rating" :key="i" fill="#f0e769" stroke="#ccbf0c" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
							<svg class="w-8 h-8" v-for="j in 5-(doc.rating)" :key="6-j" fill="#a3a3a3" stroke="#636363" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
						</div>
						<Pods :topics="doc.topics" :center="false"></Pods>
					</div>
					<img id="mainImage" class="max-w-2xl" alt="">
				</div>
				<div v-else class="flex-1 grid place-items-center h-64" :key="3*id+1">
					<PulseLoader></PulseLoader>
				</div>
			</transition></router-link>


			</transition-group>

			<!-- <transition name="slideX" mode="out-in">
				<div id="projectTile" class="w-20 h-20 border-4 rounded-xl" :key="id">
				</div>
			</transition> -->
			


			<svg class="w-6 h-6 arrows cursor-pointer" @click="nextProject" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import project, {topicsList} from '@/types/projects'
import {db} from '@/firebase'
import Pods from '@/components/Pods.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import getThumbnail from '@/mixins/getThumbnail'

export default defineComponent({
	name:'Discover',
	mixins:[getThumbnail],
	components:{Pods, PulseLoader},
	data() {
		return {
			topicsList,
			doc:{} as project,
			loading: true,

			ids: [] as string[],
			id: 0,
		}
	},
	async created(){
		//Get Featured Project List
		const doc = await db.collection("meta").doc("featureProjects").get()
		this.ids = (doc.data() as {projects: string[]}).projects

		//Get project first run
		await this.getProject()
	},
	methods:{
		//NAVIGATE THROUGH PROJECTS
		lastProject(){
			this.id -= 1
			if(this.id < 0) this.id = this.ids.length - 1
			this.getProject()
		},
		nextProject(){
			this.id = ((this.id + 1)%this.ids.length);
			this.getProject()
		},

		//MAIN GET PROJECT FUNCTION
		async getProject(){
			this.loading = true
			
			// Get the project at 'this.id' and place in this.doc
			this.doc = {} as project;
			const projectSnapshot = await db.collection("projects").doc(this.ids[this.id]).get()
			this.doc = projectSnapshot.data() as project
			this.doc.id = projectSnapshot.id

			//LOAD THE IMAGE
			var img = new Image();
			img.src = await this.getThumbnailURL(this.doc);
			img.onload = ()=>{
				this.loading = false
			};
		},
		
		//when a project element enters, set the image as the preloaded image
		async enterImage(){
			if(!this.loading){
				// eslint-disable-next-line 
				(document.getElementById("mainImage") as HTMLImageElement).src = await this.getThumbnailURL(this.doc);
			}
		}
	}
})
</script>

<style lang="scss" scoped>
.arrows{
	transition: transform .2s ease;
	&:hover{
		transform: scale(1.4);
	}
}

#podsList{
	label{
		transition: .1s ease;
	}
	input:checked + label{
		// SELECTED
		background-color: rgb(74, 40, 224);
		color:white;
	}
}

#projectTile{
	transition: transform 0.2s ease;
	box-shadow:  0px 30px 14px -20px #0000003b;
	&:hover{
		transform:scale(1.02)
	}
}
</style>