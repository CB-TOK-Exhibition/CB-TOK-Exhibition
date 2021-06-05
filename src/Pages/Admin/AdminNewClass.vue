<template>
    <div class="min-h-screen pt-16 px-10">
        <h1 class="text-4xl font-bold mb-2">Create New Classes</h1>
        <h2 class="mb-6">Adding classes to {{releventYears}}</h2>

        <div class="bg-red-500 p-4 border-4 border-red-200 rounded-xl mb-4 font-bold text-white">WARNING: REMOVING THE CLASS WILL ALSO REMOVE THE UPLOADED PROJECTS UNDER THAT CLASS</div>

        <div class="flex flex-row items-center mb-4 gap-x-3">
            <input type="text" class="border-2 p-2 rounded-lg noOutline focus:ring" name="newClassName" id="newClassName" placeholder="New Class Id...">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" @click="addClass">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <transition-group name="list" tag="ul" class="flex flex-col gap-y-2 mb-6">
            <li v-for="(c, i) in classes" :key="c" class="list-thingy flex flex-row items-center gap-x-4">
                {{c}}
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" @click="promptRemoveClass(i)">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </li>
        </transition-group>

        <button @click="submit" class="p-4 px-10 bg-green-400 rounded-xl focus:ring text-white font-bold noOutline">Submit</button>
    </div>    
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {db} from "@/firebase"

export default defineComponent({
    name:"Admin New Class",
    data() {
        return {
            classes: [] as string[],
            releventYears:""
        }
    },
    async created(){
        const dateMachine = new Date();
        const year = dateMachine.getFullYear();
        const month = dateMachine.getMonth();
        if(month < 9) this.releventYears =  (year - 1) + "-" + year
        else if (month >= 9) this.releventYears = year + "-" + (year + 1)

        // let yearsObject = (await db.collection("years").doc(this.releventYears).get()).data() as {classes: string[]}
        // this.classes = yearsObject.classes
        db.collection("years").doc(this.releventYears).onSnapshot(doc=>{
            console.log("UPDATE??")
            const yearObject = doc.data() as {classes: string[]}
            this.classes = yearObject.classes
        })
    },
    methods: {
        addClass(){
            if(!document.getElementById("newClassName")){
                console.error("WHERE IS CLASS INPUT???")
                return
            }
            const val = (document.getElementById("newClassName") as HTMLInputElement).value;
            this.classes.push(val);
            (document.getElementById("newClassName") as HTMLInputElement).value = ""
        },

        // eslint-disable-next-line
        promptRemoveClass(classNum: number){
            //TODO PROMPT HIM TO MAKE SURE THAT HE WANTS TO DELETE THIS CLASS

            //UNCOMMENT ONLY WHEN DONE
            // this.removeClass(classNum)
        },
        async removeClass(classNum: number){
            const relevantClass = this.classes[classNum]
            this.classes.splice(classNum, 1)
            
            //REMOVE THE CLASS FORM THE YEAR/RELEVENTYEARS DOC ARRAY
            db.collection("years").doc(this.releventYears).update({
                classes: this.classes
            })
            
            //REMOVE THE CLASS FROM THE PROJECT DUMP
            console.log("remove classes", this.releventYears, relevantClass)

            const removeClasses = await db.collection("projects").where("year", "==", this.releventYears).where("class", "==", relevantClass).get()
            removeClasses.forEach(thing=> thing.ref.delete())
        },
        submit(){
            db.collection("years").doc(this.releventYears).set({
                classes: this.classes
            })
        }
    }
})
</script>

<style lang="scss" scoped>
.list-thingy {
    margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
    transition: all .2s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>