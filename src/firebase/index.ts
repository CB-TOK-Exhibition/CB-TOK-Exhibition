import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBGWutrCQ5Gjpv_v8L78Ku1Ia1EGYQQKRs",
    authDomain: "cb-tok-exhibition.firebaseapp.com",
    projectId: "cb-tok-exhibition",
    storageBucket: "cb-tok-exhibition.appspot.com",
    messagingSenderId: "301778114866",
    appId: "1:301778114866:web:948f38742ad763b5bb1f2b",
    measurementId: "G-LEEZ38C4SM"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
auth.setPersistence(browserLocalPersistence)
const storage = getStorage(app)
const analytics = getAnalytics(app)

export { db, auth, storage, analytics };
export default app;