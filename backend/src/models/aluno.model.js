// src/models/aluno.model.js
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

export default (sequelize, DataTypes) => {
  const Aluno = sequelize.define("Aluno", {
    nome: { type: DataTypes.STRING, allowNull: false },
    cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    imagemPerfil: { type: DataTypes.STRING, allowNull: true },

    cep: { type: DataTypes.STRING, allowNull: true },
    endereco: { type: DataTypes.STRING, allowNull: true },
    bairro: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.STRING, allowNull: true },
  }, {
    hooks: {
      // Antes de criar um novo aluno
      beforeCreate: async (aluno) => {
        // Remove pontuação do CPF
        aluno.cpf = aluno.cpf.replace(/\D/g, "");

        // Hash da senha
        aluno.senha = await bcrypt.hash(aluno.senha, 10);

        // Valida CPF único e tamanho
        if (aluno.cpf.length !== 11) {
          throw new Error("CPF deve ter exatamente 11 dígitos");
        }

        // Valida CPF único
        const cpfExistente = await Aluno.findOne({ where: { cpf: aluno.cpf } });
        if (cpfExistente) throw new Error("CPF já cadastrado");

        // Valida email único
        const emailExistente = await Aluno.findOne({ where: { email: aluno.email } });
        if (emailExistente) throw new Error("Email já cadastrado");
      },

beforeUpdate: async (aluno) => {
  // Remove pontuação do CPF só se estiver presente
  if (aluno.cpf) aluno.cpf = aluno.cpf.replace(/\D/g, "");

// Verifica CPF apenas se foi alterado
if (aluno.changed("cpf")) {
  if (aluno.cpf.length !== 11) {
    throw new Error("CPF deve ter exatamente 11 dígitos");
  }
  const cpfExistente = await Aluno.findOne({
    where: { cpf: aluno.cpf, id: { [Op.ne]: aluno.id } }
  });
  if (cpfExistente) throw new Error("CPF já cadastrado");
}

  // Verifica email apenas se foi alterado
  if (aluno.changed("email")) {
    const emailExistente = await Aluno.findOne({
      where: { email: aluno.email, id: { [Op.ne]: aluno.id } }
    });
    if (emailExistente) throw new Error("Email já cadastrado");
  }
}
    }
  });

  return Aluno;
};
