import express from "express";
import { criarAluno, listarAlunos, buscarAlunoPorId, atualizarAluno } from "../controllers/aluno.controller.js";

const router = express.Router();

// Criar aluno
router.post("/", criarAluno);

// Listar todos os alunos
router.get("/", listarAlunos);

// Buscar aluno por ID
router.get("/:id", buscarAlunoPorId);

router.patch("/:id", atualizarAluno);

export default router;
