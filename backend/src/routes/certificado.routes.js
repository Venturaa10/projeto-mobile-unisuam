import express from "express";
import {
  criarCertificado,
  listarCertificadosPorCpf,
  atualizarPrivacidade
} from "../controllers/certificado.controller.js";

const router = express.Router();

router.post("/", criarCertificado);
router.get("/aluno/:cpf", listarCertificadosPorCpf);
router.patch("/privacidade/:id", atualizarPrivacidade);

export default router;
