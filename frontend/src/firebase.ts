import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Para Android + Expo EAS Build, não precisa colocar firebaseConfig
const app = initializeApp({});
export const auth = getAuth(app);
