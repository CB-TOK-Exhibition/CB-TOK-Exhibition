<template>
	<div class="min-h-screen pt-16">
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
		<img :src="project.imageFeature" alt="Project Image">
			<object id="pdfIframe" class="w-full h-56" data="" type="application/pdf">
				<embed src="" type="application/pdf" />
			</object>
		<a id="athing" href="">yeetus</a>
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
			topicColours: topicColours
		}
	},
	async mounted(){
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


		//FUNCTIONS METHOD
		const request = await fetch(`http://localhost:5001/cb-tok-exhibition/us-central1/ftp/get/testFile4.pdf`, { //${this.project.filePath}
			method: 'GET',
			mode: 'cors'
		}).catch(err=>{
			//TODO Display this error
			console.error(err)
		})

		if(!request || !request?.body){console.error("FILE NOT FOUND");return;}
		const bodyReader = request.body.getReader();
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const { done, value } = await bodyReader.read();
			if (done) break;
			console.log('Just read a chunk:', value);
		}

		// const rawFile = await request.body.getReader().read()
		// if(!rawFile.value) return
		// // const string = new TextDecoder().decode(rawFile.value);
		// // console.log(string);
		// const blob = new Blob([rawFile.value], { type: 'application/pdf' }); 
		// const url = URL.createObjectURL(blob);
		// console.log("blob information", blob.type, blob.size)

		// const pdfIframe = document.getElementById("pdfIframe") as HTMLObjectElement
		// if(!pdfIframe) return;
		// pdfIframe.data = url;
		// (pdfIframe.querySelector("embed") as HTMLEmbedElement).src = url;
		// (document.getElementById("athing")as HTMLAnchorElement).href = url


		// READER
		// var reader = new FileReader();
		// reader.onload = function(){
		//     const dataURL = reader.result as string;
		//     if(!dataURL) return
		//     (document.getElementById("pdfIframe") as HTMLIFrameElement).src = dataURL;
		// };
		// reader.readAsArrayBuffer(blob);
	}
})
</script>