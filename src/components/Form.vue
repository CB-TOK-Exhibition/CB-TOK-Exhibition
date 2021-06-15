<template>
    <div class="min-h-screen grid grid-cols-5" key="form">
		<!-- POPUPS -->
		<Toast/>

		<div class="col-span-5 lg:col-span-3 pt-16 mx-4 lg:mx-10">
			<h1 class="text-4xl font-bold mb-6">Upload Page</h1>
			<div class="flex flex-row flex-wrap border-2 rounded-lg p-4 mb-10 gap-x-5 gap-y-3">
				<img :src="currentUser.photoURL" alt="" class="flex-0 h-24 w-24">
				<div class="flex-1 flex items-center">
					<h1 class="text-3xl font-bold hidden lg:block">Current User: {{currentUser.displayName}}</h1>
					<h1 class="text-3xl font-bold block lg:hidden mt-5">{{currentUser.displayName}}</h1>
				</div>
				<div class="flex-0 flex items-center">
					<button class="border-2 p-4 rounded-lg noOutline focus:ring" @click="signOut">Sign Out</button>
				</div>
			</div>
			<form @submit="submit">
				<label for="title" class="text-2xl font-bold mb-2 mt-6">Title</label>
				<input type="text" name="title" id="title" class="block border-2 w-full p-2 focus:ring noOutline rounded-lg" v-model="title">

				<input type="file" class="hidden" name="fileInput" id="fileInput" accept="application/pdf">
				<label for="fileInput" id="dropArea" class="h-24 w-full mt-6 border-2 inline-grid place-items-center cursor-pointer" @drag="console.log('drag')" @drop="dropHandle">
					<p class="inline-block">
						Click or Drop Files Here...
					</p>
					<p class="inline-block">
						{{fileName}}
					</p>
				</label>

				<h1 class="text-2xl font-bold mb-2 mt-6">Select Your Class</h1>
				<Dropdown v-model="selectedClass" :options="classes" optionLabel="name" placeholder="Select a Class" />

				<h1 class="text-2xl font-bold mb-2 mt-6">Select Your Topics {{checkedCount}}/3</h1>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-6 md:grid-rows-3 lg:grid-rows-2 gap-3" :class="{'done': checkedCount==3}">
					<!-- topic repeater -->
					<div v-for="(topic, i) in topics" :key="i">
						<input type="checkbox" class="hidden topicTag" v-on:change="limit" :name="topic.tag" :id="topic.tag" :value="topic.name" v-model="checkedTopics">

						<!-- topic box -->
						<label :for="topic.tag" class="labelCheck grid border-2 rounded-xl place-items-center px-4 py-6 h-full select-none">
							<h1 class="font-medium text-md text-center">
								{{topic.name}}
							</h1>
						</label>
					</div>
				</div>

				<button type="submit" :disabled="!formReady" class="mt-6 mb-4 p-2 px-10 bg-blue-200 border-blue-400 disabled:opacity-50 disabled:cursor-default border-2 rounded-lg font-bold noOutline focus:ring">Submit</button>
			</form>
		</div>
		<div class="col-span-2 hidden lg:block">
			<img class="h-full w-full object-cover" src="https://www.lplegal.com/dam/jcr:c45130cc-0dbc-4c58-98e6-a73fec1306cd/iStock-979449394-3.jpg" alt="Image">
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {auth,db} from '@/firebase'

import { Octokit } from "@octokit/core";
import project, {topicsList} from '@/types/projects'
import okboomer from '@/types/okbm'

import {User} from '@firebase/auth-types'


export default defineComponent({
    name:"Form",
    props:{
        currentUser: {
			required: true,
			type: Object as PropType<User>
		}
    },
    data() {
        return {
            title:'',
			uploaded:false,
			fileName:'',
			topics:[
				{
					name:"Knowledge and the Knower",
					tag:"knower"
				},
				{
					name:"Knowledge and Language",
					tag:"language"
				},
				{
					name:"Knowledge and Tech",
					tag:"tech"
				},
				{
					name:"Knowledge and Religion",
					tag:"religion"
				},
				{
					name:"Knowledge and Politics",
					tag:"politics"
				},
				{
					name:"Knowledge and Indigenous Societies",
					tag:"indigenous"
				},
			],
			checkedTopics:[] as string[],
			selectedClass:{} as okboomer,
			classes:[] as okboomer[],
        }
    },
    async created(){
        //Load classes for dropdown
		const doc = await db.collection('years').doc(this.getSchoolYear()).get();
		if(doc.exists){
			const data = doc.data()?.classes as string[];
			data.forEach(a=>{
				this.classes.push({
					"name":a,
					"code":a
				})
			})
		}
    },
	mounted(){
		const dropArea = document.getElementById('dropArea')
		if(!dropArea){console.error("dropArea not found");return;}

		const preventDefaults = (e: Event) => {e.preventDefault();e.stopPropagation()}
		const highlight = ()=>{dropArea.classList.add('highlight')}
		const unhighlight = ()=> {dropArea.classList.remove('highlight')}

		['dragenter', 'dragleave', 'drop', 'dragover'].forEach(eventName => dropArea.addEventListener(eventName, preventDefaults, false));
		['dragenter'].forEach(eventName => dropArea.addEventListener(eventName, highlight, false));
		['dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, unhighlight, false));

		//EVENT LISTENER FOR THE INPUT ELEMENTS
		(document.getElementById("fileInput") as HTMLInputElement).addEventListener("input", (e) =>{
			const fileName = (e.target as HTMLInputElement).files?.[0].name;
			if(!fileName){console.error("File Name not Found");return}
			this.fileName = fileName;
			this.uploaded = true;
		})
	},
    computed:{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		formReady(vm:any){
			return (!!vm.title) && (vm.uploaded) && (vm.checkedTopics.length == 3) && (vm.selectedClass);
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		checkedCount(vm:any){
			return vm.checkedTopics.length;
		}
	},
    methods:{
		signOut(e: Event){
			e.preventDefault();
			auth.signOut();
			this.$router.push('/uploadInstructions')
		},
        limit(e:Event){
			const limit = 3
			const target = e.target as HTMLInputElement;
			if(!target) return

			if(this.checkedTopics.length > limit){
				target.checked = false
				this.removeItem(this.checkedTopics, target.value);
				return
			}
		},
        async submit(e: Event){
			e.preventDefault()
			console.log("Submit Start")

			//check if all needed elements are here
			const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
			if(!this.formReadyM() || !fileInput?.files){
				this.$toast.add({severity:'error', summary: 'Form Not Complete', detail:'Complete form to submit', life: 5000});
				return;
			}


			//upload to GITHUB
			const octokit = new Octokit({ auth: process.env.VUE_APP_ACCESS_CODE });

			const fileReader = new FileReader();
			console.log(fileInput.files[0])
			fileReader.readAsDataURL(fileInput.files[0]);
			fileReader.onload = async (event) => {
				if(!event.target?.result){console.error("Encoding Error");return;}
				console.log(await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
					owner: 'CB-TOK-Exhibition',
					repo: 'databasePDFs',
					path: this.fileName,
					message: `[API] Uploading file for ${this.currentUser.displayName}`,
					content: (event.target.result as string).substring(28, (event.target.result as string).length),
				}).catch(err=>{
					console.error(err);
					return;
				}))
			};
			
			//upload to database
			await db.collection("publishedUsers").doc().set({
				email: this.currentUser.email
			})

			await db.collection("projects").doc().set({
					class: this.selectedClass.name as string,
					year: this.getSchoolYear(),
					
					projectTitle: this.title,
					filePath: this.fileName,
					//TODO FIGURE THIS OUT
					imageFeature: "image.jpg",
					rating: 0,
					topics: this.checkedTopics.map(topic => topicsList.indexOf(topic)) as number[],
				} as project
			)

			this.$router.push("/uploadCheck")

			//OR UPLOAD TO FTP
			// fetch('http://localhost:5001/cb-tok-exhibition/us-central1/ftp/write', {
			//     method: 'POST',
			//     mode: 'cors',
			//     body: fileInput.files[0]
			// })
		},
        dropHandle(e: DragEvent){
			const dt = e.dataTransfer
			if(!dt){return;}
			const files = dt.files

			if(files.length > 1){
				this.$toast.add({severity:'error', summary: 'Too Many Files', detail:'Only Drop 1 file at a time', life: 5000});
				return;
			}else if(files[0].type != "application/pdf"){
				this.$toast.add({severity:'error', summary: 'Only Submit PDFs', detail:'Don\'t submit anything other than PDFs', life: 5000});
				return;
			}
			const file = files[0]
			this.fileName = file.name;
			this.uploaded = true;
			const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
			if(!fileInput){console.error("[BACKEND] INPUT DOES NOT EXIST");return}
			fileInput.files = files
		},

        getSchoolYear(){
			const dateMachine = new Date();
			const year = dateMachine.getFullYear();
			const month = dateMachine.getMonth();
			if(month < 9) return (year - 1) + "-" + year
			else if (month >= 9) return year + "-" + (year + 1)
		},
        removeItem<T> (arr: Array<T>, value: T): Array<T> { 
			const index = arr.indexOf(value);
			if (index > -1) {
				arr.splice(index, 1);
			}
			return arr;
		},
        range(size: number, startAt = 0) {
			return [...Array(size).keys()].map(i => i + startAt);
		},
		formReadyM(){
			return (!!this.title) && (this.uploaded) && (this.checkedTopics.length == 3) && (!!this.selectedClass);
		},
    }
})
</script>

<style lang="scss" scoped>
	#dropArea {
		border: 2px dashed #ccc;
		&.highlight {
			border-color: purple;
		}
	}

	.labelCheck{
		transition: transform 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
		cursor: pointer;
	}
	.labelCheck:hover{
		transform:scale(1.02);
		box-shadow: #00000036 0px 5px 14px;
	}
	.topicTag:checked{
		+ .labelCheck{
			background-color: #BFDBFE;
			border-color: #3B82F6;
			color:inherit;
			
			user-select: none;
			cursor: pointer;
			box-shadow: unset;
			
			&:hover{
				transform: scale(1);
			}
		}
	}

	.done{
		.labelCheck{
			color:#d4d4d4;

			user-select: none;
			cursor: unset;
			box-shadow: unset;
			
			&:hover{
				transform: scale(1);
			}
		}
	}
</style>