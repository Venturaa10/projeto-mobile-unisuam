import axios from "axios";

// Define a tipagem do retorno do login
export interface LoginResponse {
  token: string;
  tipo: "aluno" | "universidade";
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

// Cria instância do Axios
// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const api = axios.create({
  baseURL: "http://1.0.11.21:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
