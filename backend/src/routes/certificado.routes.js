import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from "express";
import {
  criarCertificado,
  listarCertificadosPorCpf,
  atualizarPrivacidade,
listarTodosCertificados
} from "../controllers/certificado.controller.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// Agora aplicamos o multer no controller
router.get("/", listarTodosCertificados);
router.post("/", upload.single("arquivo"), criarCertificado);
router.get("/aluno/:cpf", listarCertificadosPorCpf);
router.patch("/:id/privacidade", atualizarPrivacidade);

export default router;
