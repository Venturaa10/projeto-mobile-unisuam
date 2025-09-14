import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { FontAwesome } from "@expo/vector-icons"; // ou qualquer outra lib de ícones
import { Linking, Platform } from "react-native";

interface Certificado {
  id: number;
  nomeCurso: string;
  dataEmissao: string;
  arquivo: string | null;
  publico: boolean;
  universidade: {
    nome: string;
    cnpj: string;
  };
}

export default function MeusCertificadosScreen() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificados();
  }, []);

const fetchCertificados = async () => {
  try {
    const usuario = await AsyncStorage.getItem("usuario");
    if (!usuario) return;

    const parsedUser = JSON.parse(usuario);
    const documento = parsedUser.cpf_cnpj?.replace(/\D/g, "");
    if (!documento) return;

    // Pega os certificados
    const certificadosRes = await api.get(`/certificados/aluno/${documento}`);
    const certificadosData = certificadosRes.data;

    // Pega todas universidades
    const universidadesRes = await api.get(`/universidades`);
    const universidadesData = universidadesRes.data;

    // Adiciona o CNPJ correto em cada certificado
    const certificadosComCnpj = certificadosData.map((cert: any) => {
      const uni = universidadesData.find((u: any) => u.id === cert.universidadeId);
      return {
        ...cert,
        universidade: {
          nome: uni?.nome || "Desconhecida",
          cnpj: uni?.cnpj || "N/A",
        },
      };
    });

    setCertificados(certificadosComCnpj);
  } catch (err) {
    console.error("Erro ao buscar certificados:", err);
    Alert.alert("Erro", "Não foi possível carregar os certificados.");
  } finally {
    setLoading(false);
  }
};


  const togglePrivacidade = async (certificado: Certificado) => {
    try {
      const response = await api.patch(`/certificados/${certificado.id}/privacidade`, {
        publico: !certificado.publico,
      });
      // Atualiza o estado local
      setCertificados((prev) =>
        prev.map((c) => (c.id === certificado.id ? { ...c, publico: response.data.publico } : c))
      );
    } catch (err) {
      console.error("Erro ao atualizar privacidade:", err);
      Alert.alert("Erro", "Não foi possível atualizar a privacidade.");
    }
  };

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
          <Text style={styles.universidade}>Universidade: {item.universidade.nome}</Text>
          <Text style={styles.universidade}>CNPJ: {item.universidade.cnpj}</Text>

          {item.arquivo && (
            <TouchableOpacity
              style={styles.botao}
              onPress={() => console.log("Abrir certificado:", item.arquivo)}
            >
              <Text style={styles.botaoTexto}>📄 Ver Certificado</Text>
            </TouchableOpacity>
          )}

          {/* Ícone de visibilidade */}
          <TouchableOpacity
            style={styles.visibilityBtn}
            onPress={() => togglePrivacidade(item)}
          >
            <FontAwesome
              name={item.publico ? "eye" : "eye-slash"}
              size={20}
              color={item.publico ? "#4f46e5" : "#999"}
            />
            <Text style={styles.visibilityText}>
              {item.publico ? "Público" : "Privado"}
            </Text>
          </TouchableOpacity>
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
  universidade: { fontSize: 14, color: "#555" },
  botao: {
    marginTop: 10,
    backgroundColor: "#4f46e5",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
  visibilityBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  visibilityText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
});
