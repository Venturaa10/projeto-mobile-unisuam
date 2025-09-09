// src/models/aluno.model.js
export default (sequelize, DataTypes) => {
  const Aluno = sequelize.define("Aluno", {
  nome: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  imagemPerfil: { type: DataTypes.STRING, allowNull: true },
}, {
  hooks: {
    beforeCreate: async (aluno, options) => {
      // Remove pontuação do CPF
      aluno.cpf = aluno.cpf.replace(/\D/g, "");

      // Verifica se já existe CPF
      const cpfExistente = await Aluno.findOne({ where: { cpf: aluno.cpf } });
      if (cpfExistente) {
        throw new Error("CPF já cadastrado");
      }

      // Verifica se já existe email
      const emailExistente = await Aluno.findOne({ where: { email: aluno.email } });
      if (emailExistente) {
        throw new Error("Email já cadastrado");
      }
    },
    beforeUpdate: async (aluno, options) => {
      aluno.cpf = aluno.cpf.replace(/\D/g, "");

      // Se quiser validar atualização também
      const cpfExistente = await Aluno.findOne({ 
        where: { cpf: aluno.cpf, id: { [sequelize.Op.ne]: aluno.id } } 
      });
      if (cpfExistente) throw new Error("CPF já cadastrado");

      const emailExistente = await Aluno.findOne({ 
        where: { email: aluno.email, id: { [sequelize.Op.ne]: aluno.id } } 
      });
      if (emailExistente) throw new Error("Email já cadastrado");
    }
  }
});


  return Aluno;
};
