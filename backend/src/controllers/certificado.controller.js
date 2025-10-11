import { Certificado, Universidade } from "../initModels.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import fs from "fs";


export const criarCertificado = async (req, res) => {
  try {
    const { nomeAluno, cpfAluno, matricula, nomeCurso, universidadeId } = req.body;

    let arquivoUrl = null;

    if (req.file) {
      const filePath = req.file.path;

      console.log("📥 Nome original do arquivo:", req.file.originalname);

      // Gera um public_id seguro e limpo
      const publicId = `${Date.now()}-${req.file.originalname
        .replace(/\.[^/.]+$/, "")   // remove extensão
        .replace(/\s+/g, "_")       // espaços -> underline
        .replace(/[^\w\-]/g, "")}`; // remove caracteres especiais

      console.log("🆔 public_id gerado:", publicId);

      // Upload para o Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "certificados",
        resource_type: "raw",
        public_id: publicId,
        type: "upload", // garante acesso público
      });

      console.log("🔗 secure_url retornado do Cloudinary:", result.secure_url);
      console.log("📁 Caminho completo salvo no Cloudinary:", result.public_id);

      arquivoUrl = result.secure_url;

      console.log("📝 URL atribuída para salvar no banco:", arquivoUrl);

      // Remove o arquivo temporário
      fs.unlinkSync(filePath);
    }

    // Criação no banco
    const certificado = await Certificado.create({
      nomeAluno,
      cpfAluno: cpfAluno.replace(/\D/g, ""),
      matricula,
      nomeCurso,
      dataEmissao: new Date(),
      arquivo: arquivoUrl,
      universidadeId,
    });

    console.log("✅ Certificado salvo no banco:", certificado);
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
