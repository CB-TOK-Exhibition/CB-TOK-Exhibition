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
					<div id="projectTile" class="flex flex-row p-8 gap-x-2 border-4 rounded-xl bg-white" v-if="loaded[i]" :key="3*i" :data-project="i">
						<div class="flex-1 flex flex-col justify-center">
							<h1 class="text-5xl font-bold">{{projects[i].projectTitle}}</h1>
							<div class="flex flex-row mt-3">
								<svg class="w-8 h-8" v-for="i in projects[i].rating" :key="i" fill="#f0e769" stroke="#ccbf0c" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
								<svg class="w-8 h-8" v-for="j in 5-(projects[i].rating)" :key="6-j" fill="#a3a3a3" stroke="#636363" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
							</div>
							<Pods :topics="projects[i].topics" :center="false"></Pods>
						</div>
						<img class="max-w-2xl" style="min-width: 30rem;" alt="">
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
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import getThumbnail from '@/mixins/getThumbnail'
//SWIPING
import SwiperCore, { Navigation} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
SwiperCore.use([Navigation]);

export default defineComponent({
	name:'Discover',
	mixins:[getThumbnail],
	components: {
		Swiper,
		SwiperSlide,
		Pods, 
		PulseLoader,
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
	transition: transform 0.2s ease, opacity 0.2s ease;
	box-shadow:  0px 30px 14px -20px #0000003b;
	&:hover{
		transform:scale(1.02)
	}
}

.yCenter{
	top: 50%;
	transform: translateY(-50%)
}
</style>