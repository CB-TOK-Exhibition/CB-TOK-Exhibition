<template>
    <div class="pt-16 px-10 min-h-screen">
        <Toast />
        <h1 class="text-4xl mb-6 font-bold">Create New Year</h1>

        <h2 class="text-2xl font-semibold mb-2">Years</h2>
        <!-- TODO Check Valid Year -->
        <div class="flex flex-row items-center mb-4">
            <input type="text" class="border-2 p-2 rounded-lg noOutline focus:ring" @change="checkYear" v-model="yearStart" name="yearStart" id="yearStart" placeholder="Start Year">
            <p class="mx-4 text-5xl"> - </p>
            <input type="text" class="border-2 p-2 rounded-lg noOutline focus:ring" @change="checkYear" v-model="yearEnd" name="yearEnd" id="yearEnd" placeholder="End Year">
        </div>

        <transition name="flyIn">
        <div v-if="classErrorMessage" class="bg-red-400 text-white p-4 inline-block border-4 border-red-500 rounded-md mb-6">{{classErrorMessage}}</div>
        </transition>

        <h2 class="text-2xl font-semibold mb-2">Classes</h2>
        <div class="flex flex-row items-center mb-4 gap-x-3">
            <input type="text" class="border-2 p-2 rounded-lg noOutline focus:ring" name="newClassName" id="newClassName" placeholder="New Class Id...">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" @click="addClass">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <transition-group name="list" tag="ul" class="flex flex-col gap-y-2 mb-6">
            <li v-for="(c, i) in classes" :key="c" class="list-thingy flex flex-row items-center gap-x-4">
                {{c}}
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" @click="removeClass(i)">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </li>
        </transition-group>
        <button @click="submit" class="p-4 px-10 bg-green-400 rounded-xl focus:ring text-white font-bold noOutline">Submit</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {db} from '@/firebase'
import { doc, getDoc, setDoc } from "firebase/firestore"
import getSchoolYear from "@/mixins/getSchoolYear"

export default defineComponent({
    name: "Admin New Year Page",
    mixins:[getSchoolYear],
    data() {
        return {
            classes: [] as string[],
            yearStart: 2020,
            yearEnd: 2021,
            classErrorMessage: "",
        }
    },
    created(){
        [this.yearStart, this.yearEnd] = this.getSchoolYear()
        this.checkYear()
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
        removeClass(i: number){this.classes.splice(i, 1)},
        async checkYear(){
            if(this.yearEnd - this.yearStart > 1){
                this.classErrorMessage = "Years too far apart"
                return
            }
            else if(this.yearEnd - this.yearStart < 1){
                this.classErrorMessage = "Years too close together/not possible"
                return
            }
            const path = this.yearStart.toString() + "-" + this.yearEnd.toString();
            const piss = await getDoc(doc(db, "years", path))
            if(piss.exists()){
                this.classErrorMessage = "This Class is Already Taken, Try Again"
                return
            }

            this.classErrorMessage = ""
        },
        submit(){
            if(this.classErrorMessage) return
            if(this.classes.length <= 0){
                this.$toast.add({severity:"error", summary:"Make at least one class", life:5000})
                return
            }
            console.log("submit")
            setDoc(doc(db, "years", this.yearStart.toString()+"-"+this.yearEnd.toString()), {
                classes: this.classes
            })
        }
    },
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

.flyIn-enter-active,
.flyIn-leave-active {
    transition: all .2s ease;
}
.flyIn-enter-from,
.flyIn-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>