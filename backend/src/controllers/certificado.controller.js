import { Certificado, Universidade } from "../initModels.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier"; // npm i streamifier

export const criarCertificado = async (req, res) => {
  try {
    const { nomeAluno, cpfAluno, matricula, nomeCurso, universidadeId } = req.body;

    let arquivoUrl = null;

    if (req.file && req.file.buffer) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "certificados", resource_type: "raw" }, // PDFs
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
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
    console.log(arquivoUrl);
    res.status(201).json(certificado);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Listar certificados de um aluno (apenas públicos se for acesso público)
export const listarCertificadosPorCpf = async (req, res) => {
  try {
    let { cpf } = req.params;
    cpf = cpf.replace(/\D/g, ""); // só números

    const certificados = await Certificado.findAll({
      where: { cpfAluno: cpf },
      include: [
        {
          model: Universidade,
          as: "universidade",
          attributes: ["id", "nome"], // só os campos que quer expor
        }
      ],
      order: [["dataEmissao", "DESC"]],
    });

    res.json(certificados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Listar todos os certificados (opcional: apenas admin)
export const listarTodosCertificados = async (req, res) => {
  try {
    const certificados = await Certificado.findAll();
    res.json(certificados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Atualizar privacidade de certificado
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
