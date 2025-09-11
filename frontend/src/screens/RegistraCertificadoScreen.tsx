import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DocumentPicker from "react-native-document-picker";

const RegistrarCertificadoScreen: React.FC = () => {
  const [nomeAluno, setNomeAluno] = useState("");
  const [cpfAluno, setCpfAluno] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nomeCurso, setNomeCurso] = useState("");
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPdf = async () => {
    try {
      const res = await DocumentPicker.pick({ type: [DocumentPicker.types.pdf] });
      setPdfFile(res[0]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!nomeAluno || !cpfAluno || !nomeCurso || !pdfFile) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("nomeAluno", nomeAluno);
      formData.append("cpfAluno", cpfAluno);
      formData.append("matricula", matricula);
      formData.append("nomeCurso", nomeCurso);
      formData.append("arquivo", {
        uri: pdfFile.uri,
        type: pdfFile.type || "application/pdf",
        name: pdfFile.name || "certificado.pdf",
      } as any);

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
      />

      <TextInput
        style={styles.input}
        placeholder="CPF do Aluno"
        keyboardType="numeric"
        value={cpfAluno}
        onChangeText={setCpfAluno}
      />

      <TextInput
        style={styles.input}
        placeholder="Matrícula (opcional)"
        value={matricula}
        onChangeText={setMatricula}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do Curso"
        value={nomeCurso}
        onChangeText={setNomeCurso}
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={handleSelectPdf}>
        <Text style={styles.uploadText}>{pdfFile ? pdfFile.name : "Selecionar PDF"}</Text>
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

export default RegistrarCertificadoScreen;
