export default (sequelize, DataTypes) => {
  const Certificado = sequelize.define("Certificado", {
    nomeAluno: { type: DataTypes.STRING, allowNull: false },
    cpfAluno: { type: DataTypes.STRING, allowNull: false },
    matricula: { type: DataTypes.STRING, allowNull: true },
    nomeCurso: { type: DataTypes.STRING, allowNull: false },
    dataEmissao: { type: DataTypes.DATE, allowNull: false },
    publico: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
 {
    hooks: {
      beforeCreate: (certificado) => {
        certificado.cpfAluno = certificado.cpfAluno.replace(/\D/g, "");
      },
      beforeUpdate: (certificado) => {
        certificado.cpfAluno = certificado.cpfAluno.replace(/\D/g, "");
      }
}
});

  return Certificado;
};
