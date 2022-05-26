import {db} from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
export default {
    methods: {
        async isAdmin(email: string): Promise<boolean>{
            const adminsRef = await getDoc(doc(db, "meta", "admins"))
            const admins = adminsRef.data() as { emails: string[] }
            return admins.emails.includes(email)
        }
    },
}