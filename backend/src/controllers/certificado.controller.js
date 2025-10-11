import { Certificado, Universidade } from "../initModels.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import fs from "fs";


export const criarCertificado = async (req, res) => {
  try {
    const { nomeAluno, cpfAluno, matricula, nomeCurso, universidadeId } = req.body;

    let arquivoUrl = null;

    if (req.file) {
      const filePath = req.file.path; // caminho do arquivo temporário

      // gera um public_id seguro
      const publicId = `${Date.now()}-${req.file.originalname
        .replace(/\.[^/.]+$/, "")   // remove a extensão
        .replace(/\s+/g, "_")       // espaços → underline
        .replace(/[^\w\-]/g, "")}`; // remove caracteres especiais

      // envia para o Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "certificados",
        resource_type: "raw",   // garante que seja tratado como PDF
        public_id: publicId,
        flags: "attachment:false", // abre direto no navegador
      });

      arquivoUrl = result.secure_url;

      // deleta o arquivo temporário
      fs.unlinkSync(filePath);
    }

    const certificado = await Certificado.create({
      nomeAluno,
      cpfAluno: cpfAluno.replace(/\D/g, ""),
      matricula,
      nomeCurso,
      dataEmissao: new Date(),
      arquivo: arquivoUrl,
      universidadeId,
    });

    console.log("✅ Certificado criado:", certificado);
    res.status(201).json(certificado);
  } catch (err) {
    console.error("❌ Erro ao criar certificado:", err);
    res.status(400).json({ error: err.message });
  }
};



// Listar certificados por CPF
export const listarCertificadosPorCpf = async (req, res) => {
  try {
    const cpf = req.params.cpf.replace(/\D/g, "");

    const certificados = await Certificado.findAll({
      where: { cpfAluno: cpf },
      include: [{ model: Universidade, as: "universidade", attributes: ["id", "nome"] }],
      order: [["dataEmissao", "DESC"]],
    });

    res.json(certificados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os certificados
export const listarTodosCertificados = async (req, res) => {
  try {
    const certificados = await Certificado.findAll();
    res.json(certificados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar privacidade
export const atualizarPrivacidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { publico } = req.body;
    const cert = await Certificado.findByPk(id);
    if (!cert) return res.status(404).json({ error: "Certificado não encontrado" });

    cert.publico = publico;
    await cert.save();
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
