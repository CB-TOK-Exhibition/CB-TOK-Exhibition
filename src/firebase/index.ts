import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBGWutrCQ5Gjpv_v8L78Ku1Ia1EGYQQKRs",
    authDomain: "cb-tok-exhibition.firebaseapp.com",
    projectId: "cb-tok-exhibition",
    storageBucket: "cb-tok-exhibition.appspot.com",
    messagingSenderId: "301778114866",
    appId: "1:301778114866:web:948f38742ad763b5bb1f2b",
    measurementId: "G-LEEZ38C4SM"
}

const app = firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export {db};
export default app;