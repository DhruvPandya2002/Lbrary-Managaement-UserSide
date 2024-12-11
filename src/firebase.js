import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, Timestamp, addDoc} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBvWeRTcluug1-W-Gx8sabzel0z7N2AGKg",
  authDomain: "libray-ee82e.firebaseapp.com",
  projectId: "libray-ee82e",
  storageBucket: "libray-ee82e.firebasestorage.app",
  messagingSenderId: "1084135898314",
  appId: "1:1084135898314:web:def758796ffa036515c833",
  measurementId: "G-R4GZZX3RPS"
};

export default firebase;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, query, where, app, Timestamp, addDoc};