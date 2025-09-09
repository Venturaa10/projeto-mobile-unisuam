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
  }, {
    hooks: {
      // Antes de criar um novo aluno
      beforeCreate: async (aluno) => {
        // Remove pontuação do CPF
        aluno.cpf = aluno.cpf.replace(/\D/g, "");

        // Hash da senha
        aluno.senha = await bcrypt.hash(aluno.senha, 10);

        // Valida CPF único
        const cpfExistente = await Aluno.findOne({ where: { cpf: aluno.cpf } });
        if (cpfExistente) throw new Error("CPF já cadastrado");

        // Valida email único
        const emailExistente = await Aluno.findOne({ where: { email: aluno.email } });
        if (emailExistente) throw new Error("Email já cadastrado");
      },

      // Antes de atualizar um aluno
      beforeUpdate: async (aluno) => {
        aluno.cpf = aluno.cpf.replace(/\D/g, "");

        // Se a senha foi alterada, cria hash
        if (aluno.changed("senha")) {
          aluno.senha = await bcrypt.hash(aluno.senha, 10);
        }

        // Valida CPF único ignorando o próprio registro
        const cpfExistente = await Aluno.findOne({ 
          where: { cpf: aluno.cpf, id: { [Op.ne]: aluno.id } } 
        });
        if (cpfExistente) throw new Error("CPF já cadastrado");

        // Valida email único ignorando o próprio registro
        const emailExistente = await Aluno.findOne({ 
          where: { email: aluno.email, id: { [Op.ne]: aluno.id } } 
        });
        if (emailExistente) throw new Error("Email já cadastrado");
      }
    }
  });

  return Aluno;
};
