import React, { useState } from "react";
import { Alert, Platform } from "react-native";
import styled from "styled-components/native";
import * as DocumentPicker from "expo-document-picker";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegistraCertificadoScreen: React.FC = () => {
  const [nomeAluno, setNomeAluno] = useState("");
  const [cpfAluno, setCpfAluno] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nomeCurso, setNomeCurso] = useState("");
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Formata CPF
  const formatCPF = (value: string) => {
    let cpf = value.replace(/\D/g, "");
    if (cpf.length > 3) cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    if (cpf.length > 6) cpf = cpf.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (cpf.length > 9) cpf = cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    return cpf;
  };

  const handleSelectPdf = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf";
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) setPdfFile(file);
      };
      input.click();
    } else {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "application/pdf",
          copyToCacheDirectory: true,
          multiple: false,
        });

        if (result.canceled) return;
        const file = result.assets[0];
        setPdfFile(file);
      } catch (err) {
        console.error("Erro ao selecionar PDF:", err);
        Alert.alert("Erro", "Não foi possível selecionar o PDF.");
      }
    }
  };

  const handleSubmit = async () => {
    const nomeTrim = nomeAluno.trim();
    const cpfOnlyNumbers = cpfAluno.replace(/\D/g, "");

    if (!nomeTrim || !cpfAluno || !nomeCurso || !pdfFile) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (cpfOnlyNumbers.length !== 11) {
      Alert.alert("Erro", "O CPF deve conter exatamente 11 dígitos.");
      return;
    }

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(nomeTrim)) {
      Alert.alert("Erro", "O nome do aluno deve conter apenas letras e espaços.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const usuarioStr = await AsyncStorage.getItem("usuario");
      if (!usuarioStr) throw new Error("Usuário não encontrado");
      const usuario = JSON.parse(usuarioStr);
      const universidadeId = usuario.universidadeId || usuario.id;

      const formData = new FormData();
      formData.append("nomeAluno", nomeTrim);
      formData.append("cpfAluno", cpfOnlyNumbers);
      formData.append("matricula", matricula);
      formData.append("nomeCurso", nomeCurso);
      formData.append("universidadeId", universidadeId.toString());

      if (Platform.OS === "web") {
        formData.append(
          "arquivo",
          new File([pdfFile], pdfFile.name, { type: "application/pdf" })
        );
      } else {
        formData.append("arquivo", {
          uri: pdfFile.uri,
          type: pdfFile.mimeType || "application/pdf",
          name: pdfFile.name || "certificado.pdf",
        } as any);
      }

      await api.post("/certificados/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      Alert.alert("Sucesso", "Certificado registrado com sucesso!");
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
    <Container>
      <Title>Registrar Certificado</Title>

      <Input
        placeholder="Nome do Aluno"
        value={nomeAluno}
        onChangeText={setNomeAluno}
        maxLength={50}
      />
      <Input
        placeholder="CPF do Aluno"
        keyboardType="numeric"
        value={cpfAluno}
        onChangeText={(text) => setCpfAluno(formatCPF(text))}
        maxLength={14}
      />
      <Input
        placeholder="Matrícula (opcional)"
        value={matricula}
        onChangeText={setMatricula}
        maxLength={15}
      />
      <Input
        placeholder="Nome do Curso"
        value={nomeCurso}
        onChangeText={setNomeCurso}
        maxLength={50}
      />

      <UploadButton onPress={handleSelectPdf}>
        <UploadText>{pdfFile ? pdfFile.name : "Selecionar PDF"}</UploadText>
      </UploadButton>

      <SubmitButton onPress={handleSubmit} disabled={loading}>
        <SubmitText>{loading ? "Enviando..." : "Registrar"}</SubmitText>
      </SubmitButton>
    </Container>
  );
};

//
// Styled Components
//
const Container = styled.ScrollView.attrs({ contentContainerStyle: { alignItems: "center", padding: 20 } })`
  flex: 1;
  background-color: #f9fafb;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  width: 100%;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #fff;
`;

const UploadButton = styled.TouchableOpacity`
  width: 100%;
  border-width: 1px;
  border-color: #4f46e5;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #eef2ff;
  align-items: center;
`;

const UploadText = styled.Text`
  color: #4f46e5;
  font-weight: 600;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #4f46e5;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  width: 100%;
`;

const SubmitText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

export default RegistraCertificadoScreen;
