<template>
	<div class="min-h-screen pt-16 bg-red-200">
		<div class="grid grid-cols-2">
			<div>
				{{project.id}}
				{{project.projectTitle}}
				{{project.class}}
				{{project.filePath}}
				{{project.topics}}
				<Pods :topics="project.topics" :center="false"></Pods>
			</div>
			<img :src="project.imageFeature" alt="Project Image">
		</div>
		<div id="pdfIframe" class="w-full h-screen lg:px-64" />
	</div>
</template>
<script lang="ts">
import project from '@/types/projects'
import { defineComponent } from "@vue/runtime-core";
import {db} from '@/firebase'
import {topicsList, topicColours} from "../types/projects";
import Pods from "@/components/Pods.vue"

export default defineComponent({
	name:"Project Page",
	components:{
		Pods
	},
	data() {
		return {
			project:{} as project,
			topicsList: topicsList,
			topicColours: topicColours,
		}
	},
	async created(){
		//GET THE YEAR AND CLASS OF THE PROJECT IN QUESTION
		const projectID = this.$route.fullPath.substring(1)		
		const docRef = db.collection('projects').doc(projectID)
		
		const doc = await docRef.get().catch(err => {
			console.error(err);
			this.$router.push('/')
		})

		if (!doc || !doc.exists){console.error("doc doesn't exist???");this.$router.push('/');return}

		const data = doc.data();
		if(!data){console.error("data can't even???");this.$router.push('/');return}
		this.project = data as project
		this.project.id = projectID

		const url = await this.getURL().catch(err=> console.error("A caught error: ", err));
		if(!url){
			//TODO HANDLE URL EMPTY
			console.error("url is empty")
			return
		}
		console.log("this.url set to", url)
		this.mount(url);
	},
	methods: {
		async getURL(): Promise<(string)>{
			const url = `https://cb-tok-exhibition.github.io/databasePDFs/${this.project.year}/${this.project.class}/${this.project.filePath}` //`http://localhost:5001/cb-tok-exhibition/us-central1/ftp/get/${this.project.filePath}`
			
			const request = await fetch(url, {
				method: 'GET',
				mode: 'cors'
			})

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