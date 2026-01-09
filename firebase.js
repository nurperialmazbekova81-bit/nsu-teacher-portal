// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Storage импорттоо

const firebaseConfig = {
  apiKey: "AIzaSyCX5c4bvG-IK_aofjOhYcs13U1m3MpGQbU",
  authDomain: "kafedra5-c0144.firebaseapp.com",
  databaseURL: "https://kafedra5-c0144-default-rtdb.firebaseio.com",
  projectId: "kafedra5-c0144",
  storageBucket: "kafedra5-c0144.appspot.com", // Storage бул жерде көрсөтүлгөн
  messagingSenderId: "452540053572",
  appId: "1:452540053572:web:3fec39b1534c4a51fca411"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // Storage экспорттоо