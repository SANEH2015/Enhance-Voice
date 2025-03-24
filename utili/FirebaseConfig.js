// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAeMzxELk_y_KNdR7U8PDeUQALpkHcfJ8",
  authDomain: "voice-record-c0b0b.firebaseapp.com",
  projectId: "voice-record-c0b0b",
  storageBucket: "voice-record-c0b0b.firebasestorage.app",
  messagingSenderId: "926943973191",
  appId: "1:926943973191:web:0b56b2a6a06175921bc662",
  measurementId: "G-JMV996X1X4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);