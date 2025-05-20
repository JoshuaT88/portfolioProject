// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxRHIUIq5BWoDrUz8UTPR7S_Ihj7fsF8o",
  authDomain: "dev-journal-f4c25.firebaseapp.com",
  projectId: "dev-journal-f4c25",
  storageBucket: "dev-journal-f4c25.firebasestorage.app",
  messagingSenderId: "909365401527",
  appId: "1:909365401527:web:a15b732646d11408f87a32",
  measurementId: "G-233M2J5XYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//Export the app 
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();