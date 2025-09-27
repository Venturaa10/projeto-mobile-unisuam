// config/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDqW-TJvVadsjCrK8QeLVz0NHJE0PZw8_g",
  authDomain: "projeto-mobile-unisuam-473100.firebaseapp.com",
  projectId: "projeto-mobile-unisuam-473100",
  storageBucket: "projeto-mobile-unisuam-473100.appspot.com", // 👈 corrigi ".app" para ".appspot.com"
  messagingSenderId: "659201367256",
  appId: "1:659201367256:web:5e242dddeeeb1ac916cbad",
  measurementId: "G-Y0EDEW3SNK", // pode deixar, mas não será usado no mobile
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
