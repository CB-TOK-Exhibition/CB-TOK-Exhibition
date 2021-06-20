<template>
	<div class="pt-16 h-screen flex flex-col relative overflow-hidden" v-if="!four04">
		<!-- TODO LOADING ANIMATOINS -->
		<Toast />
        <div id="penis" :style="{backgroundImage: `url(${bgURL})`}"></div>
        <div class="grid grid-cols-4 flex-1">
            <div class="col-span-1"></div>
            <div id="pdfIframe" class="w-full col-span-2 pt-4">
				<!-- IFRAME IN HERE -->
				<object :data="pdfURL" type="application/pdf" class="h-full w-full">
					<embed :src="pdfURL" type="application/pdf">
				</object>
			</div>
            <div class="col-span-1 p-8 bg-white" v-if="projectLoaded">
				<h1 class="text-5xl font-bold leading-tight">{{project.projectTitle}}</h1>
				<Pods :topics="project.topics" :center="false"></Pods>
				<Stars :clickable="true" :rating="project.rating" @vote="vote" @noPerms="noPerms"/>
			</div>
			<div class="col-span-1 grid bg-white place-items-center" v-else>
				<PulseLoader />
			</div>
        </div>
    </div>
	<div v-else class="h-screen pt-16 grid place-items-center">
		<h1 class="text-6xl font-bold">404</h1>
	</div>
</template>
<script lang="ts">
import project from '@/types/projects'
import { defineComponent } from 'vue'
import {db, storage} from '@/firebase'
import getThumbnail from '@/mixins/getThumbnail'
import Pods from "@/components/Pods.vue"
import Stars from "@/components/Stars.vue"
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default defineComponent({
    name: "Individual Project Page",
    data() {
		return {
			project:{} as project,
			projectLoaded: false,
			pdfURL:"",
			bgURL: "",
			four04: false,
		}
	},
	mixins:[getThumbnail],
	components:{Pods, Stars, PulseLoader},
    async created(){
		//GET THE YEAR AND CLASS OF THE PROJECT IN QUESTION
		const projectID = this.$route.fullPath.substring(1)		
		const doc = await db.collection('projects').doc(projectID).get().catch(err => {
			console.error(err);
			this.$router.push('/')
		})

		if (!doc || !doc.exists){
			this.four04 = true
			document.title = "404 | CB TOK Exhbition"
			return
		}

		const data = doc.data();
		if(!data){console.error("data can't even???");this.$router.push('/');return}
		this.project = data as project
		this.project.id = projectID
		this.projectLoaded = true
		
		//ADD BACKGROUND
		this.bgURL = await this.getThumbnailURL(this.project)
		
		const url = await storage.ref(`/projects/${this.project.year}/${this.project.class}/${this.project.id}.pdf`).getDownloadURL().catch(err=>{
			this.$toast.add({severity:'error', summary: 'PDF not accessable', detail:err.code, life: 5000})
		})
		this.pdfURL = url
    },
    methods: {

		//OLD FUNCTIONS
		async getURL(): Promise<(string)>{
			const url = `https://cb-tok-exhibition.github.io/databasePDFs/${this.project.year}/${this.project.class}/${(this.project.id as string).split(" ").join("_")}.pdf`
			const request = await fetch(url, {
				method: 'GET',
			}).catch(err=>{console.error("fetch error", err)})

			if(!request || !request?.body || !request.ok) throw "FILE NOT FOUND"
			const bodyReader = request.body.getReader();
			let final = new Uint8Array();
			for (let result = await bodyReader.read(); !result.done; result = await bodyReader.read()) final = this.concatenate(Uint8Array, final, result.value)
			
			return URL.createObjectURL(new Blob([final], { type: 'application/pdf' }));
		},
		mount(url: string){
			//INJECT ELEMENT
			if(!url) throw "URL Empty"
			const obj = document.createElement("object");
			obj.type = "application/pdf";
			obj.data = url;
			obj.classList.add("w-full")
			obj.classList.add("h-full")
			const embed = document.createElement("embed");
			embed.type = "application/pdf";
			embed.src = url;
			obj.appendChild(embed);
			const div = document.getElementById("pdfIframe")
			if(div) div.appendChild(obj);
		},
		async vote(a: number){
			// eslint-disable-next-line
			const shit = (await db.collection("projects").doc(this.project.id).get()).data()!
			
			let votes, rating;
			if(!shit.votes) votes = 0 
			else votes = shit.votes
			if(!shit.rating) rating = 0
			else rating = shit.rating

			const newRating = ((rating * votes) + a)/(votes + 1)

			await db.collection("projects").doc(this.project.id).update({
				rating: newRating,
				votes: votes + 1
			})

			this.$toast.add({severity:'success', summary: 'Voted', detail:'Vote submitted', life: 3000});
		},
		noPerms(){
			this.$toast.add({severity:'error', summary: 'You need to be signed in to vote', detail:'Sign in by clicking my projects at the top of the page', life: 3000});
		},

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		concatenate(resultConstructor: any, ...arrays: any[]) {
			let totalLength = 0;
			for (let arr of arrays) {
				totalLength += arr.length;
			}
			let result = new resultConstructor(totalLength);
			let offset = 0;
			for (let arr of arrays) {
				result.set(arr, offset);
				offset += arr.length;
			}
			return result;
		}
	}
})
</script>

<style lang="scss" scoped>
#penis{
	position: absolute;
	top: 0; left: 0;
	width: 100%; height: 100%;
	filter: blur(20px);
	transform:scale(1.2);
	background-size:cover;
	z-index:-1;
}
</style>