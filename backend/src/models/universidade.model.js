// src/models/universidade.model.js
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

export default (sequelize, DataTypes) => {
  const Universidade = sequelize.define("Universidade", {
    nome: { type: DataTypes.STRING, allowNull: false },
    cnpj: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    logo: { type: DataTypes.STRING, allowNull: true },
  }, {
    hooks: {
      beforeCreate: async (uni) => {
        // Remove pontuação do CNPJ
        uni.cnpj = uni.cnpj.replace(/\D/g, "");

        // Hash da senha
        uni.senha = await bcrypt.hash(uni.senha, 10);

        // Valida CNPJ único
        const cnpjExistente = await Universidade.findOne({ where: { cnpj: uni.cnpj } });
        if (cnpjExistente) throw new Error("CNPJ já cadastrado");

        // Valida email único
        const emailExistente = await Universidade.findOne({ where: { email: uni.email } });
        if (emailExistente) throw new Error("Email já cadastrado");
      },
      beforeUpdate: async (uni) => {
        uni.cnpj = uni.cnpj.replace(/\D/g, "");

        // Se a senha foi alterada, cria hash
        if (uni.changed("senha")) {
          uni.senha = await bcrypt.hash(uni.senha, 10);
        }

        // Valida CNPJ único ignorando o próprio registro
        const cnpjExistente = await Universidade.findOne({ 
          where: { cnpj: uni.cnpj, id: { [Op.ne]: uni.id } } 
        });
        if (cnpjExistente) throw new Error("CNPJ já cadastrado");

        // Valida email único ignorando o próprio registro
        const emailExistente = await Universidade.findOne({ 
          where: { email: uni.email, id: { [Op.ne]: uni.id } } 
        });
        if (emailExistente) throw new Error("Email já cadastrado");
      }
    }
  });

  return Universidade;
};
