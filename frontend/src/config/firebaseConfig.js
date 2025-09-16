// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnW-tgu-zifneZ0596eyCNCqtewUfYXcU",
  authDomain: "projeto-mobile-unisuam.firebaseapp.com",
  projectId: "projeto-mobile-unisuam",
  storageBucket: "projeto-mobile-unisuam.firebasestorage.app",
  messagingSenderId: "502548654272",
  appId: "1:502548654272:web:df3487b2c0bff193ca2525",
  measurementId: "G-0FKWJ91M0L"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
