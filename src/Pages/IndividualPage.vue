<template>
	<div class="min-h-screen pt-16 bg-red-200">
		<div class="grid grid-cols-2">
			<div>
				{{project.id}}
				{{project.projectTitle}}
				{{project.topics}}
				{{project.class}}
				{{project.filePath}}
				<div id="tagList" class="flex flex-row gap-x-2 gap-y-2 flex-wrap">
					<p v-for="(tag, i) in project.topics" :key="i" :style="{ backgroundColor: topicColours[tag-1]}" class="p-1 px-3 rounded-full text-sm text-white font-semibold">
						{{topicsList[tag-1]}}
					</p>
				</div>
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


export default defineComponent({
	name:"Project Page",
	data() {
		return {
			project:{} as project,
			topicsList: topicsList,
			topicColours: topicColours,
		}
	},
	async created(){
		const projectID = this.$route.fullPath.substring(1)
		const docRef = db.collection('projects').doc(projectID)
		
		const doc = await docRef.get().catch(err => {
			console.error(err);
			this.$router.push('/')
		})

		if (doc && doc.exists) {
			const data = doc.data();
			if(data) {
				this.project = data as project
				this.project.id = projectID
			}
			else this.$router.push('/')
		}
		else this.$router.push('/')

		const url = await this.getURL().catch(err=> console.error("A caught error: ", err));
		if(!url) throw "URL Empty"

		console.log("this.url set to", url)
		this.mount(url);
	},
	methods: {
		async getURL(): Promise<(string)>{
			const url = `https://cb-tok-exhibition.github.io/databasePDFs/${this.project.filePath}` //`http://localhost:5001/cb-tok-exhibition/us-central1/ftp/get/${this.project.filePath}`
			const request = await fetch(url, {
				method: 'GET',
				mode: 'cors'
			}).catch(err=>{
				//TODO Display this error
				console.error("A caught error: " + err.message)
			})

			await fetch(`http://localhost:5001/cb-tok-exhibition/us-central1/ftp/getControl`, {
				method: 'GET',
				mode: 'cors'
			}).catch(err=>console.error("A caught error: " + err.message))

			if(!request || !request?.body) throw "FILE NOT FOUND"
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