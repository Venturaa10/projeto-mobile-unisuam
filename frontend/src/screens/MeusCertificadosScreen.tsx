import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

interface Certificado {
  id: number;
  nomeCurso: string;
  dataEmissao: string;
  arquivo: string | null;
  publico: boolean;
}

export default function MeusCertificadosScreen() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        const usuario = await AsyncStorage.getItem("usuario");
        if (!usuario) return;

        const parsedUser = JSON.parse(usuario);
        const documento = parsedUser.cpf_cnpj?.replace(/\D/g, ""); // apenas números
        if (!documento) return;

        const response = await api.get(`/certificados/aluno/${documento}`);

        setCertificados(response.data);
      } catch (err) {
        console.error("Erro ao buscar certificados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificados();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (certificados.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Nenhum certificado encontrado.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={certificados}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.curso}>{item.nomeCurso}</Text>
          <Text style={styles.data}>
            Emitido em: {new Date(item.dataEmissao).toLocaleDateString("pt-BR")}
          </Text>

          {item.arquivo && (
            <TouchableOpacity
              style={styles.botao}
              onPress={() => {
                // Se quiser abrir no navegador:
                // Linking.openURL(`http://localhost:3000/${item.arquivo}`);
                console.log("Abrir certificado:", item.arquivo);
              }}
            >
              <Text style={styles.botaoTexto}>📄 Ver Certificado</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666" },
  list: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  curso: { fontSize: 16, fontWeight: "bold", color: "#111" },
  data: { fontSize: 14, color: "#555", marginTop: 4 },
  botao: {
    marginTop: 10,
    backgroundColor: "#4f46e5",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
});
