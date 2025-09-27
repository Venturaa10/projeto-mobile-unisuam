import axios from "axios";
import { Platform } from "react-native";

// Tipagem do retorno do login
export interface LoginResponse {
  token: string;
  tipo: "aluno" | "universidade";
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

// Configuração do IP local
const LOCAL_IP = "192.168.1.74"; // IP da sua máquina na rede Wi-Fi

// Cria instância do Axios
// const api = axios.create({
//   baseURL:
//     Platform.OS === "android"
//       ? "http://10.0.2.2:3000/api"   
//       : Platform.OS === "ios"
//       ? `http://${LOCAL_IP}:3000/api` 
//       : "http://localhost:3000/api",  
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


// axios
//   .get("http://192.168.1.74:3000/api/alunos")
//   .then(res => console.log("Conseguiu:", res.data))
//   .catch(err => console.log("Erro mobile:", err));
  

// Configuração da api para funcionar o backend no mobile. 
const api = axios.create({
  baseURL: "http://192.168.1.74:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
