import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp({}); // vazio, o EAS usa o google-services.json
export const auth = getAuth(app);
