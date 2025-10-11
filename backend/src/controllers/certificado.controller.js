import { Certificado, Universidade } from "../initModels.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";


// Criar certificado
export const criarCertificado = async (req, res) => {
  try {
    const { nomeAluno, cpfAluno, matricula, nomeCurso, universidadeId } = req.body;

    let arquivoUrl = null;

if (req.file) {
  const filePath = req.file.path;

  // copia para teste
  fs.copyFileSync(filePath, "uploads/teste_local.pdf");
  console.log("PDF salvo localmente para teste!");

  const result = await cloudinary.uploader.upload(filePath, {
    folder: "certificados",
    resource_type: "raw",
    public_id: `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`,
    flags: "attachment:false",
  });

  fs.unlinkSync(filePath);
  arquivoUrl = result.secure_url;
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

    res.status(201).json(certificado);
  } catch (err) {
    console.error("Erro ao criar certificado:", err);
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
