import { Certificado } from "../initModels.js"; // <-- pega o model pronto

// Criar certificado
export const criarCertificado = async (req, res) => {
  try {
    const { nomeAluno, cpfAluno, matricula, nomeCurso } = req.body;

    const certificado = await Certificado.create({
      nomeAluno,
      cpfAluno: cpfAluno.replace(/\D/g, ""), // só números
      matricula,
      nomeCurso,
      dataEmissao: new Date(),
      arquivo: req.file ? `uploads/${req.file.filename}` : null,
    });

    res.status(201).json(certificado);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};


// Listar certificados de um aluno (apenas públicos se for acesso público)
export const listarCertificadosPorCpf = async (req, res) => {
  try {
    const { cpf } = req.params;
    const certificados = await Certificado.findAll({
      where: {
        cpfAluno: cpf,
        publico: true // apenas visíveis publicamente
      }
    });
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
