import express from "express";
import { criarUniversidade, listarUniversidades, buscarUniversidadePorId } from "../controllers/universidade.controller.js";

const router = express.Router();

// Criar universidade
router.post("/", criarUniversidade);

// Listar todas as universidades
router.get("/", listarUniversidades);

// Buscar universidade por ID
router.get("/:id", buscarUniversidadePorId);

export default router;
