import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, Alert, Linking } from "react-native";
import api from "../services/api";

// const BASE_URL = "http://1.0.11.21:3000"; // Ip do backend no mac no trabalho
// const BASE_URL = "http://192.168.1.74:3000";
// const BASE_URL = "https://projeto-mobile-unisuam.onrender.com";


const BuscaCertificadoScreen: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [certificados, setCertificados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    const cpfLimpo = cpf.replace(/\D/g, ""); // remove pontos e traço
    if (!cpfLimpo) {
      Alert.alert("Atenção", "Digite um CPF válido.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.get("/certificados");
      const data = res.data;

      // filtra apenas os certificados públicos com CPF correspondente
      const filtrados = data.filter(
        (cert: any) => cert.publico && cert.cpfAluno === cpfLimpo
      );

      if (filtrados.length === 0) {
        Alert.alert("Nenhum certificado público encontrado");
      }

      setCertificados(filtrados);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível buscar certificados.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.curso}>{item.nomeCurso}</Text>
      <Text>Aluno: {item.nomeAluno}</Text>
      <Text>CPF: {item.cpfAluno}</Text>
      <Text>Emitido em: {new Date(item.dataEmissao).toLocaleDateString("pt-BR")}</Text>

{item.arquivo && (
  <TouchableOpacity
    style={styles.botao}
    onPress={() => Linking.openURL(item.arquivo)}
  >
    <Text style={styles.botaoTexto}>📄 Ver Certificado</Text>
  </TouchableOpacity>
)}
    </View>
  );

  return (
<View style={styles.container}>
  <Text style={styles.title}>Busca de Certificado</Text>

  <TextInput
    style={styles.input}
    placeholder="Digite o CPF do Aluno"
    value={cpf}
    maxLength={11}
    keyboardType="numeric"
    onChangeText={setCpf}
  />

  <TouchableOpacity style={styles.button} onPress={handleBuscar}>
    <Text style={styles.buttonText}>Buscar</Text>
  </TouchableOpacity>

  <FlatList
    data={certificados}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderItem}
    style={{ width: "100%", marginTop: 20 }}
    contentContainerStyle={{ paddingBottom: 20 }}
    showsVerticalScrollIndicator={false}
  />
</View>

  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f9fafb" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, marginBottom: 20, backgroundColor: "#fff", fontSize: 16 },
  button: { backgroundColor: "#4f46e5", paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 12 },
  curso: { fontSize: 16, fontWeight: "bold" },
  botao: { marginTop: 10, backgroundColor: "#4f46e5", padding: 10, borderRadius: 6, alignItems: "center" },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
});

export default BuscaCertificadoScreen;
