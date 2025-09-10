import { Universidade } from "../initModels.js"; // <-- pega o model pronto

export const criarUniversidade = async (req, res) => {
  try {
    const uni = await Universidade.create(req.body);
    res.status(201).json(uni);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const listarUniversidades = async (req, res) => {
  try {
    const universidades = await Universidade.findAll();
    res.json(universidades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Adicione esta função se quiser buscar por ID
export const buscarUniversidadePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const universidade = await Universidade.findByPk(id);
    if (!universidade) {
      return res.status(404).json({ message: "Universidade não encontrada" });
    }
    res.json(universidade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar universidade
export const atualizarUniversidade = async (req, res) => {
  try {
    const { id } = req.params;
    const universidade = await Universidade.findByPk(id);
    if (!universidade) {
      return res.status(404).json({ error: "Universidade não encontrada" });
    }

    // Bloqueia alteração de senha diretamente aqui
    const { senha, ...dados } = req.body;

    await universidade.update(dados);
    res.json(universidade);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};