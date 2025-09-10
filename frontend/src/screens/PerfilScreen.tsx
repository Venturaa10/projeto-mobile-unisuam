import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import api from "../services/api";
import * as ImagePicker from "expo-image-picker";

type PerfilScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Perfil">;
type UserType = "aluno" | "universidade";

interface User {
  id: number;
  nome: string;
  cpf?: string;
  cnpj?: string;
  email: string;
  imagemPerfil?: string;
  logo?: string;
}

const PerfilScreen: React.FC<{ userType: UserType; userId: number }> = ({ userType, userId }) => {
  const navigation = useNavigation<PerfilScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Campos de input
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const endpoint = userType === "aluno" ? `/alunos/${userId}` : `/universidades/${userId}`;
        const response = await api.get(endpoint);
        setUser(response.data);
        setNome(response.data.nome);
        setEmail(response.data.email);
        setCpfCnpj(userType === "aluno" ? response.data.cpf : response.data.cnpj);
        setFoto(userType === "aluno" ? response.data.imagemPerfil : response.data.logo);
      } catch (err: any) {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      }
    };
    fetchUser();
  }, [userType, userId]);

  const handleEscolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleAtualizar = async () => {
    setLoading(true);
    try {
      const endpoint = userType === "aluno" ? `/alunos/${userId}` : `/universidades/${userId}`;
      const payload: any = {
        nome,
        email,
      };

      if (userType === "aluno") payload.imagemPerfil = foto;
      else payload.logo = foto;

      // CPF/CNPJ não deve ser alterado aqui, mas se quiser permitir, inclua:
      // payload.cpf = cpfCnpj; payload.cnpj = cpfCnpj;

      const response = await api.patch(endpoint, payload);
      Alert.alert("Sucesso", "Perfil atualizado!");
      setUser(response.data);
    } catch (err: any) {
      Alert.alert("Erro", err.response?.data?.error || "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Text>Carregando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Foto */}
      <TouchableOpacity onPress={handleEscolherFoto}>
        <Image
          source={foto ? { uri: foto } : require("../assets/default-avatar.png")}
          style={styles.foto}
        />
        <Text style={styles.link}>Alterar foto</Text>
      </TouchableOpacity>

      {/* Nome */}
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder={userType === "aluno" ? "Nome Completo" : "Nome da Instituição"}
      />

      {/* CPF/CNPJ */}
      <TextInput
        style={[styles.input, { backgroundColor: "#f0f0f0" }]}
        value={cpfCnpj}
        editable={false} // Apenas leitura
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleAtualizar} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Atualizando..." : "Atualizar Perfil"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 12, marginBottom: 15 },
  button: { backgroundColor: "#4f46e5", padding: 15, borderRadius: 5, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  foto: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  link: { color: "#4f46e5", fontWeight: "bold", textAlign: "center", marginBottom: 20 },
});

export default PerfilScreen;
