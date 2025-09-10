import express from "express";
import { criarUniversidade, listarUniversidades, buscarUniversidadePorId, atualizarUniversidade } from "../controllers/universidade.controller.js";

const router = express.Router();

// Criar universidade
router.post("/", criarUniversidade);

// Listar todas as universidades
router.get("/", listarUniversidades);

// Buscar universidade por ID
router.get("/:id", buscarUniversidadePorId);

router.patch("/:id", atualizarUniversidade);

export default router;
