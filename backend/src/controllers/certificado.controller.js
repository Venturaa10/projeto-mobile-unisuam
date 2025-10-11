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

  const originalNameDecoded = decodeURIComponent(req.file.originalname);
  console.log("📄 Nome decodificado:", originalNameDecoded);

  const publicId = `${Date.now()}-${originalNameDecoded
    .replace(/\.[^/.]+$/, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]/g, "")}`;

  console.log("🆔 public_id gerado:", publicId);

  const result = await cloudinary.uploader.upload(filePath, {
    folder: "certificados",
    resource_type: "raw",
    public_id: publicId,
    type: "upload",
  });

  console.log("🔗 secure_url retornado do Cloudinary:", result.secure_url);
  console.log("📁 Caminho completo salvo no Cloudinary:", result.public_id);

  arquivoUrl = result.secure_url;

  // Gera URL assinada para teste, que vai funcionar mesmo com restrição de acesso
  const signedUrl = cloudinary.url(publicId, {
    resource_type: "raw",
    sign_url: true,
    type: "upload",
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora de validade
  });

  console.log("🔒 URL assinada para teste:", signedUrl);

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
