import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Aluno, Universidade } from "../initModels.js";
import { Op } from "sequelize";

const JWT_SECRET = "sua_chave_super_secreta"; // no futuro usar variável de ambiente

// Login apenas para Aluno (email ou CPF)
export const loginAluno = async (req, res) => {
  try {
    const { login, senha } = req.body;
    if (!login || !senha) return res.status(400).json({ error: "Informe login e senha" });

    const aluno = await Aluno.findOne({
      where: {
        [Op.or]: [
          { email: login },
          { cpf: login.replace(/\D/g, "") }
        ]
      }
    });

    if (!aluno) return res.status(401).json({ error: "Aluno não encontrado" });

    const senhaValida = await bcrypt.compare(senha, aluno.senha);
    if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: aluno.id, tipo: "aluno" }, JWT_SECRET, { expiresIn: "1d" });

    // Retornando CPF também
    res.json({ 
      token, 
      tipo: "aluno", 
      usuario: { 
        id: aluno.id, 
        nome: aluno.nome, 
        email: aluno.email,
        cpf_cnpj: aluno.cpf 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login apenas para Universidade (email ou CNPJ)
export const loginUniversidade = async (req, res) => {
  try {
    const { login, senha } = req.body;
    if (!login || !senha) return res.status(400).json({ error: "Informe login e senha" });

    const uni = await Universidade.findOne({
      where: {
        [Op.or]: [
          { email: login },
          { cnpj: login.replace(/\D/g, "") }
        ]
      }
    });

    if (!uni) return res.status(401).json({ error: "Universidade não encontrada" });

    const senhaValida = await bcrypt.compare(senha, uni.senha);
    if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: uni.id, tipo: "universidade" }, JWT_SECRET, { expiresIn: "1d" });

    // Retornando CNPJ também
    res.json({ 
      token, 
      tipo: "universidade", 
      usuario: { 
        id: uni.id, 
        nome: uni.nome, 
        email: uni.email,
        cpf_cnpj: uni.cnpj 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login com Google
export const loginGoogle = async (req, res) => {
  try {
    const { firebaseUid, email, userType } = req.body;
    if (!firebaseUid || !email || !userType) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    let usuario;

    if (userType === "aluno") {
      usuario = await Aluno.findOne({ where: { email } });
      if (!usuario) {
        // Cria novo aluno
        usuario = await Aluno.create({
          nome: "Aluno Google", // você pode adaptar se quiser pegar nome do Google
          email,
          cpf: null,
          firebaseUid
        });
      }
    } else if (userType === "universidade") {
      usuario = await Universidade.findOne({ where: { email } });
      if (!usuario) {
        // Cria nova universidade
        usuario = await Universidade.create({
          nome: "Universidade Google",
          email,
          cnpj: null,
          firebaseUid
        });
      }
    } else {
      return res.status(400).json({ error: "Tipo de usuário inválido" });
    }

    // Gera token JWT
    const token = jwt.sign({ id: usuario.id, tipo: userType }, JWT_SECRET, { expiresIn: "1d" });

    // Retorna dados
    res.json({
      token,
      tipo: userType,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cpf_cnpj: userType === "aluno" ? usuario.cpf : usuario.cnpj
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};