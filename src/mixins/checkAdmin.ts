import {db} from '@/firebase'
export default {
    methods: {
        async isAdmin(email: string){
            const adminsRef = await db.collection("meta").doc("admins").get()
            const admins = adminsRef.data() as { emails: string[] }
            return admins.emails.includes(email)
        }
    },
}