// src/models/universidade.model.js
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

export default (sequelize, DataTypes) => {
  const Universidade = sequelize.define("Universidade", {
  firebaseUid: { type: DataTypes.STRING, allowNull: true, unique: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  cnpj: { type: DataTypes.STRING, allowNull: true, unique: true },  
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: true },           
  logo: { type: DataTypes.STRING, allowNull: true },
  }, {
    hooks: {
      beforeCreate: async (uni) => {
  // Remove pontuação do CNPJ só se existir
  if (uni.cnpj) {
    uni.cnpj = uni.cnpj.replace(/\D/g, "");

    if (uni.cnpj.length !== 14) {
      throw new Error("CNPJ deve ter exatamente 14 dígitos");
    }

    // Valida CNPJ único
    const cnpjExistente = await Universidade.findOne({ where: { cnpj: uni.cnpj } });
    if (cnpjExistente) throw new Error("CNPJ já cadastrado");
  }

  // Hash da senha só se existir
  if (uni.senha) {
    uni.senha = await bcrypt.hash(uni.senha, 10);
  }

  // Valida email único
  const emailExistente = await Universidade.findOne({ where: { email: uni.email } });
  if (emailExistente) throw new Error("Email já cadastrado");
      },
      beforeUpdate: async (uni) => {
        uni.cnpj = uni.cnpj.replace(/\D/g, "");

      // Valida tamanho do CNPJ apenas se alterado
      if (uni.changed("cnpj") && uni.cnpj.length !== 14) {
        throw new Error("CNPJ deve ter exatamente 14 dígitos");
      }

      // Valida CNPJ único ignorando o próprio registro
      if (uni.changed("cnpj")) {
        const cnpjExistente = await Universidade.findOne({ 
          where: { cnpj: uni.cnpj, id: { [Op.ne]: uni.id } } 
        });
        if (cnpjExistente) throw new Error("CNPJ já cadastrado");
      }

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
