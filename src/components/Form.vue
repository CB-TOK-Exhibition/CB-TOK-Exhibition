<template>
    <div class="min-h-screen grid grid-cols-5" key="form">
		<!-- POPUPS -->
		<Toast/>

		<div class="col-span-5 lg:col-span-3 pt-16 mx-4 lg:mx-10">
			<h1 class="text-4xl font-bold mb-6">Upload Page</h1>
			<!-- USER ZONE -->
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

			<!-- FORM BODY -->
			<form @submit="pageSubmit">
				<label for="title" class="text-2xl font-bold mb-2 mt-6">Title / Prompt</label>
				<input type="text" name="title" id="title" class="block border-2 w-full p-2 focus:ring noOutline rounded-lg" v-model="title" autocomplete="false">

				<!-- PDF -->
				<input type="file" class="hidden" name="fileInput" id="fileInput" accept="application/pdf" @change="inputChange">
				<label for="fileInput" id="dropArea" class="h-24 w-full mt-6 border-2 inline-grid place-items-center cursor-pointer" @drop="dropHandle">
					<p class="inline-block">
						Click or Drop Files Here...
					</p>
					<p class="inline-block">
						{{fileName}}
					</p>
				</label>


				<!-- THUMBNAIL -->
				<h1  class="text-2xl font-bold mt-6">Add Thumbnail</h1>
				<input type="file" class="hidden" name="imageInput" id="imageInput" accept="image/*" @change="inputImageChange">
				<label for="imageInput" id="dropImageArea" class="h-24 w-full border-2 inline-grid place-items-center cursor-pointer" @drop="dropImageHandle">
					<p class="inline-block">
						Click or Drop Thumbnail Here...
					</p>
					<p class="inline-block">
						{{imageFileName}}
					</p>
				</label>

				<h1 class="text-2xl font-bold mb-2 mt-6">Select Your Class</h1>
				<Dropdown v-model="selectedClass" :options="classes" optionLabel="name" placeholder="Select a Class" />

				<h1 class="text-2xl font-bold mb-2 mt-6">Select Your Topics (Pick at least 1)</h1>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-6 md:grid-rows-3 lg:grid-rows-2 gap-3">
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

				<!-- LOADER FOR STORAGE -->
				<ProgressBar :showValue="false" style="transition: height 0.2s ease" :value="fileProgress" class="h-0 mt-2" :class="{'h-2': fileProgress > 0}"/>
				<ProgressBar :showValue="false" style="transition: height 0.2s ease" :value="imageProgress" class="h-0 mt-2" :class="{'h-2': imageProgress > 0}"/>

				<button type="submit" :disabled="!formReady || disableButton" class="mt-2 mb-4 p-2 px-10 bg-blue-200 border-blue-400 disabled:opacity-50 disabled:cursor-default border-2 rounded-lg font-bold noOutline focus:ring">
					<span v-if="!disableButton">
						Submit
					</span>
					<ClipLoader v-else :loading="true" :size="20"></ClipLoader>
				</button>
			</form>
		</div>

		<!-- SIDE IMAGE -->
		<div class="col-span-2 hidden lg:block">
			<img class="h-full w-full object-cover" src="https://www.lplegal.com/dam/jcr:c45130cc-0dbc-4c58-98e6-a73fec1306cd/iStock-979449394-3.jpg" alt="Image">
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {analytics, auth,db,storage} from '@/firebase'
import getSchoolYear from "@/mixins/getSchoolYear"

//TYPES
import project, {topicsList} from '@/types/projects'
import okboomer from '@/types/okbm'
import firebase from "firebase"
// import {User} from '@firebase/auth-types'

//COMPONENTS
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import ProgressBar from 'primevue/progressbar';

export default defineComponent({
    name:"Form",
	mixins:[getSchoolYear],
	components:{ClipLoader, ProgressBar},
    data() {
        return {
			title:'',
			currentUser:{},

			// FILE AND RELATED
			uploaded:false,
			fileName:'',
			fileProgress: 0,

			imageUploaded:false,
			imageFileName:'',
			imageProgress:0,
			
			//CLASS SELECT
			selectedClass:{
				name:"default",
				code:"default"
			},
			classes:[] as okboomer[],
			
			//TOPICS
			limitCount: 7,
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

			disableButton: false,
        }
    },
    async created(){
        //Load classes for dropdown
		const doc = await db.collection('years').doc(this.getSchoolYearString()).get();
		if(doc.exists){
			const data = doc.data()?.classes as string[];
			data.forEach(a=>{
				this.classes.push({
					"name":a,
					"code":a
				})
			})
		}
		this.currentUser = this.$store.getters.getUser
    },
	mounted(){
		// === ADD EVENT LISTENERS === 
		//DEFINE AREAS
		const dropArea = document.getElementById('dropArea')
		if(!dropArea){console.error("dropArea not found");return;}

		const imageDropArea = document.getElementById("dropImageArea")
		if(!imageDropArea){console.error("dropImageArea not found");return;}

		//HELPFUL FUNCTIONS
		const preventDefaults = (e: Event) => {e.preventDefault();e.stopPropagation()}
		['dragenter', 'dragleave', 'drop', 'dragover'].forEach(eventName =>{
			dropArea.addEventListener(eventName, preventDefaults, false)
			imageDropArea.addEventListener(eventName, preventDefaults, false)
		});

		const highlight = (element: HTMLElement)=>{element.classList.add('highlight')}
		['dragenter'].forEach(eventName => {
			dropArea.addEventListener(eventName, ()=>{highlight(dropArea)}, false)
			imageDropArea.addEventListener(eventName, ()=>{highlight(imageDropArea)}, false)
		});

		const unhighlight = (element: HTMLElement)=> {element.classList.remove('highlight')}
		['dragleave', 'drop'].forEach(eventName => {
			dropArea.addEventListener(eventName, ()=>{unhighlight(dropArea)}, false)
			imageDropArea.addEventListener(eventName, ()=>{unhighlight(imageDropArea)}, false)
		});

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
			return vm.formReadyM();
		},
	},
    methods:{
		signOut(e: Event){
			e.preventDefault();
			auth.signOut();
			this.$router.push('/uploadInstructions')
		},
        limit(e:Event){
			const target = e.target as HTMLInputElement;
			if(!target) return

			if(this.checkedTopics.length > this.limitCount){
				target.checked = false
				this.removeItem(this.checkedTopics, target.value);
				return
			}
		},

		formReadyM(){
			return (!!this.title) && (this.uploaded) && (this.imageUploaded) && (this.checkedTopics.length >= 1) && (this.selectedClass.name != "default");
		},

		pageSubmit(e: Event){
			try{
				this.submit(e)
			}
			catch{
				this.disableButton = false
			}
		},
        async submit(e: Event){
			e.preventDefault()
			this.disableButton = true;

			//check if all needed elements are here
			const fileInput = document.getElementById('fileInput') as HTMLInputElement
			const imageInput = document.getElementById('imageInput') as HTMLInputElement
			const q = this.imageFileName.split(".")
			const extension = q[q.length - 1];

			if(!this.formReadyM() || !fileInput?.files || !fileInput.files[0] || !imageInput?.files || !imageInput.files[0]){
				this.$toast.add({severity:'error', summary: 'Form Not Complete', detail:'Complete form to submit', life: 5000});
				return;
			}

			//upload to projects database
			const project = {
				class: this.selectedClass.name as string,
				year: this.getSchoolYearString(),

				//eslint-disable-next-line
				author: this.$store.getters.getUser.email,
				projectTitle: this.title,
				imageExtension: extension,
				rating: 0,
				votes: 0,
				topics: this.checkedTopics.map(topic => topicsList.indexOf(topic)) as number[],
			} as project
			const fun = await db.collection("projects").add(project)


			//upload files
			const year = this.getSchoolYearString()
			const selectedClass = this.selectedClass.name
			const [pdfRef, imageRef] = [storage.ref(`projects/${year}/${selectedClass}/${fun.id}.pdf`), storage.ref(`images/${year}/${selectedClass}/${fun.id}.${extension}`)]
			const pdfTask = pdfRef.put(fileInput.files[0])
			const imageTask = imageRef.put(imageInput.files[0])
			
			const stateChange = (snapshot: firebase.storage.UploadTaskSnapshot)=>{
				return (snapshot.bytesTransferred / snapshot.totalBytes) * 100
			}
			const errorPut = (error: firebase.storage.FirebaseStorageError) => console.error(error.code)
			const completePut = () => console.log("complete")
			pdfTask.on('state_changed', (snapshot)=>{
				this.fileProgress = stateChange(snapshot)
				console.log(this.fileProgress)
			}, errorPut, completePut)
			imageTask.on('state_changed', (snapshot)=>{
				this.imageProgress = stateChange(snapshot)
				console.log(this.imageProgress)
			}, errorPut, completePut)

			const snapshots = await Promise.all([pdfTask, imageTask])

			analytics.logEvent("Submit Event", {
				pdfbytesTransferred: snapshots[0].bytesTransferred,
				imageBytesTransferred: snapshots[1].bytesTransferred,
				pdfState: snapshots[0].state,
				imageState: snapshots[1].state,
				projectTitle: project.projectTitle,
				uploader: this.$store.getters.getUser.displayName,
			})
			this.disableButton = false
			this.$router.push("/uploadCheck")
			
			// #region OLD CODE
			// const octokit = new Octokit({ auth: process.env.VUE_APP_ACCESS_CODE });

			// //upload pdf
			// const fileReader = new FileReader();
			// console.log("File to Upload", fileInput.files[0])
			// fileReader.readAsDataURL(fileInput.files[0]);
			// fileReader.onload = async (event) => {
			// 	if(!event.target?.result){console.error("[BACKEND/LOGIC] Encoding Error");return;}
			// 	const result = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
			// 		owner: 'CB-TOK-Exhibition',
			// 		repo: 'databasePDFs',
			// 		path: `${year}/${selectedClass}/${fun.id}.pdf`,
			// 		message: `[API] Uploading file for ${this.currentUser.displayName}`,
			// 		content: (event.target.result as string).split(',')[1],
			// 	}).catch(err=>{
			// 		console.error("[Github_Upload_Error]", err);
			// 		return;
			// 	})
			// };

			// //upload image
			// const imageReader = new FileReader();
			// console.log("Image to Upload", imageInput.files[0])
			// imageReader.readAsDataURL(imageInput.files[0]);
			// imageReader.onload = async (event) => {
			// 	if(!event.target?.result){console.error("[BACKEND/LOGIC] Encoding Error");return;}
			// 	console.log(event.target)
			// 	const result = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
			// 		owner: 'CB-TOK-Exhibition',
			// 		repo: 'databasePDFs',
			// 		path: `${year}/${selectedClass}/${fun.id}.${this.imageFileName.split(".")[1]}`,
			// 		message: `[API] Uploading Image for ${this.currentUser.displayName}`,
			// 		content: (event.target.result as string).split(',')[1],
			// 	}).catch(err=>{
			// 		console.error("[Github_Upload_Error]", err);
			// 		return;
			// 	})
			// };
			//#endregion
		},


		//PDFS
        dropHandle(e: DragEvent){
			const files = this.dropVerify(e, "pdf");

			if(!files) return;
			const file = files[0]

			this.fileName = file.name;
			this.uploaded = true;
			(document.querySelector('#fileInput') as HTMLInputElement).files = files
		},
		inputChange(e: InputEvent){
			if(!this.verify(e, "pdf")) return
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.fileName = (e.target as HTMLInputElement).files![0].name;
			this.uploaded = true;
		},

		//IMAGES
		dropImageHandle(e: DragEvent){
			const files = this.dropVerify(e, "img");

			if(!files) return;
			const file = files[0]

			this.imageFileName = file.name;
			this.imageUploaded = true;
			(document.querySelector('#imageInput') as HTMLInputElement).files = files
		},
		inputImageChange(e: InputEvent){
			if(!this.verify(e, "img")) return
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.imageFileName = (e.target as HTMLInputElement).files![0].name;
			this.imageUploaded = true;
		},

		//VERIFY FOR INPUTS
		verify(e: InputEvent, fileType: string){
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const files = (e.target! as HTMLInputElement).files!
			return !!this.backVerify(files, fileType)
		},
		//VERIFY FOR DROPS
		dropVerify(e: DragEvent, fileType: string){
			if(!e.dataTransfer){return}
			const files = e.dataTransfer.files
			return this.backVerify(files, fileType)
		},
		//CORE VERIFY
		backVerify(files: FileList, fileType: string){
			if(files.length > 1){
				this.$toast.add({severity:'error', summary: 'Too Many Files', detail:'Only Drop 1 file at a time', life: 5000});
				return false;
			}
			else if(fileType == "pdf" && files[0].type != "application/pdf"){
				this.$toast.add({severity:'error', summary: 'Only Submit PDFs', detail:'Don\'t submit anything other than PDFs', life: 5000});
				return false;
			}
			else if(fileType == "img" && files[0].type.split("/")[0] != "image"){
				this.$toast.add({severity:'error', summary: 'Only Submit images', detail:'Don\'t submit anything other than images', life: 5000});
				return false;
			}

			return files
		},


        removeItem<T> (arr: Array<T>, value: T): Array<T> { 
			const index = arr.indexOf(value);
			if (index > -1) {
				arr.splice(index, 1);
			}
			return arr;
		},
    }
})
</script>

<style lang="scss" scoped>
	#dropArea, #dropImageArea{
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
		// CHECKED
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

	//once done disable
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