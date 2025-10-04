// config/firebaseConfig.ts
/*import { initializeApp } from "firebase/app";
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

export default app;*/


// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAPmLWUgykJVbU5L-QYGekKi4RqUVgXYjo',
  authDomain: 'projetomobileunisuam-e3cf4.firebaseapp.com',
  projectId: 'projetomobileunisuam-e3cf4',
  storageBucket: 'projetomobileunisuam-e3cf4.firebasestorage.app',
  messagingSenderId: '933250452089',
  appId: '1:933250452089:web:837fb39b9a06fdb2dea2a8',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

