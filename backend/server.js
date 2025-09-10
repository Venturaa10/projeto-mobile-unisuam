import express from "express";
import bodyParser from "body-parser";
import certificadoRoutes from "./src/routes/certificado.routes.js";
import alunoRoutes from "./src/routes/aluno.routes.js";
import universidadeRoutes from "./src/routes/universidade.routes.js";
import authRoutes from "./src/routes/auth.routes.js"
import { sequelize } from "./src/initModels.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Configuração CORS
app.use(cors({
  origin: "http://localhost:8081", // endereço do frontend
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(bodyParser.json());

app.use("/api/certificados", certificadoRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/universidades", universidadeRoutes);
app.use("/api/auth", authRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

sequelize
  .sync({ alter: true }) // ou { force: true } para recriar todas as tabelas
  .then(() => {
    console.log("Tabelas sincronizadas com o banco!");
  })
  .catch((err) => console.log("Erro ao sincronizar tabelas:", err));

  