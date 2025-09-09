import express from "express";
import { criarAluno, listarAlunos, buscarAlunoPorId } from "../controllers/aluno.controller.js";

const router = express.Router();

// Criar aluno
router.post("/", criarAluno);

// Listar todos os alunos
router.get("/", listarAlunos);

// Buscar aluno por ID
router.get("/:id", buscarAlunoPorId);

export default router;
