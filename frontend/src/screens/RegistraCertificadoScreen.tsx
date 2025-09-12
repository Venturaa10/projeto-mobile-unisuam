import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

let DocumentPicker: any = null;
if (Platform.OS !== "web") {
  DocumentPicker = require("react-native-document-picker");
}

const RegistraCertificadoScreen: React.FC = () => {
  const [nomeAluno, setNomeAluno] = useState("");
  const [cpfAluno, setCpfAluno] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nomeCurso, setNomeCurso] = useState("");
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

// Função para formatar CPF
const formatCPF = (value: string) => {
  // Remove tudo que não for número
  let cpf = value.replace(/\D/g, "");

  // Aplica máscara
  if (cpf.length > 3) cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  if (cpf.length > 6) cpf = cpf.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  if (cpf.length > 9) cpf = cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

  return cpf;
};

// Função para validar CPF (apenas quantidade de dígitos)
const isCPFValid = (cpf: string) => {
  const onlyNumbers = cpf.replace(/\D/g, ""); // remove pontos e traço
  return onlyNumbers.length === 11;
};

  // Função para escolher arquivo
  const handleSelectPdf = async () => {
    if (Platform.OS === "web") {
      // No web, usamos input file HTML
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf";
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) setPdfFile(file);
      };
      input.click();
    } else {
      // Mobile
      try {
        const res = await DocumentPicker.pick({ type: [DocumentPicker.types.pdf] });
        setPdfFile(res[0]);
      } catch (err) {
        if (!DocumentPicker.isCancel(err)) console.error(err);
      }
    }
  };

const handleSubmit = async () => {
  const nomeTrim = nomeAluno.trim();
  const cpfOnlyNumbers = cpfAluno.replace(/\D/g, ""); // remove pontos e traço

  // Campos obrigatórios
  if (!nomeTrim || !cpfAluno || !nomeCurso || !pdfFile) {
    Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
    return;
  }

  // Validação CPF
  if (cpfOnlyNumbers.length !== 11) {
    Alert.alert("Erro", "O CPF deve conter exatamente 11 dígitos.");
    return;
  }

  // Validação nome (apenas letras e espaços)
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(nomeTrim)) {
    Alert.alert("Erro", "O nome do aluno deve conter apenas letras e espaços.");
    return;
  }

  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append("nomeAluno", nomeTrim);
    formData.append("cpfAluno", cpfOnlyNumbers); // envia só números
    formData.append("matricula", matricula);
    formData.append("nomeCurso", nomeCurso);

    if (Platform.OS === "web") {
      // No web, PDF precisa ser File
      formData.append(
        "arquivo",
        new File([pdfFile], pdfFile.name, { type: "application/pdf" })
      );
    } else {
      // Mobile
      formData.append("arquivo", {
        uri: pdfFile.uri,
        type: pdfFile.type || "application/pdf",
        name: pdfFile.name || "certificado.pdf",
      } as any);
    }

    const response = await api.post("/certificados/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    Alert.alert("Sucesso", "Certificado registrado com sucesso!");
    console.log("Certificado criado:", response.data);

    // limpa formulário
    setNomeAluno("");
    setCpfAluno("");
    setMatricula("");
    setNomeCurso("");
    setPdfFile(null);
  } catch (err: any) {
    console.error(err);
    Alert.alert("Erro", err.response?.data?.error || "Erro ao registrar certificado");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Certificado</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Aluno"
        value={nomeAluno}
        onChangeText={setNomeAluno}
        maxLength={50}
      />

<TextInput
  style={styles.input}
  placeholder="CPF do Aluno"
  keyboardType="numeric"
  value={cpfAluno}
  onChangeText={(text) => setCpfAluno(formatCPF(text))}
  maxLength={14}
/>


      <TextInput
        style={styles.input}
        placeholder="Matrícula (opcional)"
        value={matricula}
        onChangeText={setMatricula}
        maxLength={15}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do Curso"
        value={nomeCurso}
        onChangeText={setNomeCurso}
        maxLength={50}
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={handleSelectPdf}>
        <Text style={styles.uploadText}>
          {pdfFile ? (Platform.OS === "web" ? pdfFile.name : pdfFile.name) : "Selecionar PDF"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>{loading ? "Enviando..." : "Registrar"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: "#4f46e5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#eef2ff",
    alignItems: "center",
  },
  uploadText: { color: "#4f46e5", fontWeight: "600" },
  submitBtn: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default RegistraCertificadoScreen;
