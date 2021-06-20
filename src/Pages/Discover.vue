<template>
	<div class="min-h-screen pt-16">
		<h1 class="text-6xl font-black mb-4 mx-16">Discover</h1>
		<!-- <div id="podsList" class="flex flex-row text-xs gap-x-2 gap-y-4 flex-wrap">
			<!- - TODO MAKE FILTER SUBJECTS WORK - ->
			<div v-for="(topic, i) in topicsList" :key="i">
				<input type="radio" class="hidden" name="name" :id="i">
				<label class="bg-gray-100 p-1 px-2 rounded-full border-2 cursor-pointer select-none" :for="i">
					{{topic}}
				</label>
			</div>
		</div> -->
		<swiper
			:slides-per-view="1"
			:space-between="50"
			@swiper="onSwiper"
			@slideChange="onSlideChange"
			navigation
			class="w-full"
			style="height: 45rem"
		>
			<swiper-slide
				v-for="(id, i) in ids"
				:key="i"
				:virtualIndex="i"
				class="p-10 px-24 grid place-items-center"
			>
			<!-- MAIN CONTENT -->
				<transition name="fade" mode="out-in" @enter="mountImage">
					<!-- MAIN VISUAL -->
					<div id="projectTile" @click="goToProject(id)" class="flex flex-row p-8 gap-x-6 border-4 rounded-xl bg-white shadow-md hover:shadow-lg cursor-pointer" v-if="loaded[i]" :key="3*i" :data-project="i">
						<div class="flex-1 flex flex-col justify-center">
							<h1 class="text-5xl font-bold">{{projects[i].projectTitle}}</h1>
							<Stars :clickable="false" :rating="projects[i].rating" :centered="false"/>
							<Pods :topics="projects[i].topics" :center="false"></Pods>
						</div>
						<img class="max-w-2xl" id="projectImage">
					</div>
					<!-- LOADING -->
					<div v-else class="flex-1 h-64 grid place-items-center" :key="3*i+1">
						<PulseLoader></PulseLoader>
					</div>
				</transition>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import project, {topicsList} from '@/types/projects'
import {db} from '@/firebase'
import Pods from '@/components/Pods.vue'
import Stars from "@/components/Stars.vue"
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import getThumbnail from '@/mixins/getThumbnail'
//SWIPING
import { Swiper, SwiperSlide } from 'swiper/vue'

export default defineComponent({
	name:'Discover',
	mixins:[getThumbnail],
	components: {
		Swiper,
		SwiperSlide,
		Pods, 
		PulseLoader,
		Stars
    },
	data() {
		return {
			topicsList,
			projects:[] as project[],
			loaded:[] as boolean[],
			ids: [] as string[],
			swiper: {} as typeof Swiper,
		}
	},
	async created(){
		//Get Featured Project List
		const doc = await db.collection("meta").doc("featureProjects").get()
		this.ids = (doc.data() as {projects: string[]}).projects
		this.loaded = new Array(this.ids.length).fill(false);
		this.projects = new Array(this.ids.length).fill({});
		//Get project first run
		await this.getProject(0)
	},
	methods:{
		//MAIN GET PROJECT FUNCTION
		async getProject(i: number){	
			// Get the project at 'this.id' and place in this.doc
			if(this.loaded[i]) return
			const projectSnapshot = await db.collection("projects").doc(this.ids[i]).get()
			const getProject = projectSnapshot.data() as project
			this.projects[i] = getProject
			this.projects[i].id = projectSnapshot.id
			//LOAD THE IMAGE
			var img = new Image();
			img.onload = ()=>{
				this.loaded[i] = true
			};
			const url = await this.getThumbnailURL(this.projects[i]);
			img.src = url
			this.projects[i].imageURL = url
		},
		mountImage(e: HTMLDivElement){
			(e.querySelector("img") as HTMLImageElement).src = this.projects[parseInt(e.getAttribute("data-project") as string)].imageURL
		},

		goToProject(e: string){
			this.$router.push(`/${e}`)
		},

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onSwiper(swiper: any) {
			this.swiper = swiper
		},
		onSlideChange() {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const number = this.swiper!.activeIndex!
			this.getProject(number)
		},
	}
})
</script>

<style lang="scss">
.swiper-button-prev{
	left:40px
}
.swiper-button-next{
	right:40px
}
</style>

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
	transition: transform 0.2s ease, opacity .1s linear, box-shadow 0.2s ease;
	&:hover{
		transform:scale(1.02)
	}
}

#projectImage{
	width: 33rem;
    height: 27rem;
    object-fit: cover;
}

.yCenter{
	top: 50%;
	transform: translateY(-50%)
}
</style>