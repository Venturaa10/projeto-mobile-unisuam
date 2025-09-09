// src/models/aluno.model.js
export default (sequelize, DataTypes) => {
  const Aluno = sequelize.define("Aluno", {
    nome: { type: DataTypes.STRING, allowNull: false },
    cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    imagemPerfil: { type: DataTypes.STRING, allowNull: true },
  });

  return Aluno;
};
