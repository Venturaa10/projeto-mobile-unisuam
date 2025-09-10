import express from "express";
import { criarAluno, listarAlunos, buscarAlunoPorId, atualizarAluno, atualizarSenhaAluno } from "../controllers/aluno.controller.js";

const router = express.Router();

// Criar aluno
router.post("/", criarAluno);

// Listar todos os alunos
router.get("/", listarAlunos);

// Buscar aluno por ID
router.get("/:id", buscarAlunoPorId);

router.patch("/:id", atualizarAluno);

router.put("/senha/:id", atualizarSenhaAluno);

export default router;
