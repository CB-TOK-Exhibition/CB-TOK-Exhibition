<template>
	<div class="pt-16 h-screen flex flex-col relative overflow-hidden">
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
            <div class="col-span-1 p-8 bg-white">
				<h1 class="text-5xl font-bold leading-tight">{{project.projectTitle}}</h1>
				<Pods :topics="project.topics" :center="false"></Pods>

				<!-- TODO Review Stars Impliment it -->
				<div class="flex flex-row mt-3">
					<svg class="w-8 h-8" v-for="i in project.rating" :key="i" fill="#f0e769" stroke="#ccbf0c" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
					<svg class="w-8 h-8" v-for="j in 5-(project.rating)" :key="j" fill="#a3a3a3" stroke="#636363" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
				</div>
			</div>
        </div>
    </div>
</template>
<script lang="ts">
import project from '@/types/projects'
import { defineComponent } from 'vue'
import {db, storage} from '@/firebase'
import getThumbnail from '@/mixins/getThumbnail'
import Pods from "@/components/Pods.vue"

export default defineComponent({
    name: "Individual Project Page",
    data() {
		return {
			project:{} as project,
			pdfURL:"",
			bgURL: "",
		}
	},
	mixins:[getThumbnail],
	components:{Pods},
    async created(){
		//GET THE YEAR AND CLASS OF THE PROJECT IN QUESTION
		const projectID = this.$route.fullPath.substring(1)		
		const doc = await db.collection('projects').doc(projectID).get().catch(err => {
			console.error(err);
			this.$router.push('/')
		})

		if (!doc || !doc.exists){console.error("doc doesn't exist???");this.$router.push('/');return}

		const data = doc.data();
		if(!data){console.error("data can't even???");this.$router.push('/');return}
		this.project = data as project
		this.project.id = projectID
		console.log("project loaded", this.project, projectID)
		
		//ADD BACKGROUND
		this.bgURL = await this.getThumbnailURL(this.project)
		console.log("Background added", this.bgURL)
		

		const url = await storage.ref(`/projects/${this.project.year}/${this.project.class}/${this.project.id}.pdf`).getDownloadURL().catch(err=>{
			this.$toast.add({severity:'error', summary: 'PDF not accessable', detail:err.code, life: 5000})
		})
		this.pdfURL = url
		console.log("PDF loaded", url)
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