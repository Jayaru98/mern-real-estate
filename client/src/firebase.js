// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-279c7.firebaseapp.com",
  projectId: "mern-real-estate-279c7",
  storageBucket: "mern-real-estate-279c7.appspot.com",
  messagingSenderId: "803612814834",
  appId: "1:803612814834:web:60498c113e41659cd9cf6b"
};

// Initialize Firebase`
export const app = initializeApp(firebaseConfig);