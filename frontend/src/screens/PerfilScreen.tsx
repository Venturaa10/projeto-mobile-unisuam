import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipos para Navigation e Route
type PerfilScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Perfil">;
type PerfilScreenRouteProp = RouteProp<RootStackParamList, "Perfil">;

interface User {
  id: number;
  nome: string;
  cpf?: string;
  cnpj?: string;
  email: string;
  imagemPerfil?: string;
  logo?: string;
}

interface PerfilScreenProps {
  navigation: PerfilScreenNavigationProp;
  route: PerfilScreenRouteProp;
}

const PerfilScreen: React.FC<PerfilScreenProps> = ({ route }) => {
  const { userType, userId } = route.params;
  const navigation = useNavigation<PerfilScreenNavigationProp>();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState<string | undefined>(undefined);
const [userTypeStored, setUserTypeStored] = useState<string | null>(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      // Busca os dados do usuário
      const endpoint = userType === "aluno" ? `/alunos/${userId}` : `/universidades/${userId}`;
      const response = await api.get(endpoint);
      setUser(response.data);
      setNome(response.data.nome);
      setEmail(response.data.email);
      setCpfCnpj(userType === "aluno" ? response.data.cpf : response.data.cnpj);
      setFoto(userType === "aluno" ? response.data.imagemPerfil : response.data.logo);

      // Busca o tipo de perfil armazenado
      const tipo = await AsyncStorage.getItem("tipo");
      setUserTypeStored(tipo);
    } catch (err: any) {
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
    }
  };
  fetchUser();
}, [userType, userId]);
  

const handleExcluirConta = () => {
  Alert.alert(
    "Confirmação",
    "Você realmente deseja excluir sua conta? Essa ação não pode ser desfeita.",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const endpoint =
              userType === "aluno"
                ? `/alunos/${userId}`
                : `/universidades/${userId}`;

            await api.delete(endpoint);

            // Limpa AsyncStorage
            await AsyncStorage.clear();

            Alert.alert("Sucesso", "Conta excluída com sucesso!");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (err: any) {
            console.error("Erro ao excluir conta:", err.response?.data || err.message);
            Alert.alert(
              "Erro",
              err.response?.data?.error || "Não foi possível excluir a conta."
            );
          }
        },
      },
    ]
  );
};

  // Dentro do handleAtualizar
const handleAtualizar = async () => {
  setLoading(true);
  try {
    const endpoint =
      userType === "aluno"
        ? `/alunos/atualizarCampos/${userId}`
        : `/universidades/atualizarCampos/${userId}`;

    const payload: any = { nome, email };
    if (userType === "aluno") payload.cpf = cpfCnpj;
    else payload.cnpj = cpfCnpj;

    const response = await api.put(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const updatedUser = response.data;

    // Atualiza o state local
    setUser(updatedUser);
    setNome(updatedUser.nome);
    setEmail(updatedUser.email);
    if (userType === "aluno") setCpfCnpj(updatedUser.cpf || "");
    else setCpfCnpj(updatedUser.cnpj || "");

    // Atualiza AsyncStorage preservando o token e outros campos
    const storedUser = await AsyncStorage.getItem("usuario");
    const token = await AsyncStorage.getItem("token"); // mantém o token salvo

    if (storedUser) {
      const oldUser = JSON.parse(storedUser);
      const mergedUser = { ...oldUser, ...updatedUser }; // preserva campos antigos
      await AsyncStorage.setItem("usuario", JSON.stringify(mergedUser));
    } else {
      await AsyncStorage.setItem("usuario", JSON.stringify(updatedUser));
    }

await AsyncStorage.setItem("tipo", userType);
if (token) await AsyncStorage.setItem("token", token); // regrava só pra garantir


    // Mostra snackbar simples
    Alert.alert("Sucesso", "Perfil atualizado!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Home"),
      },
    ]);
  } catch (err: any) {
    console.error("Erro ao atualizar:", err.response?.data || err.message);
    Alert.alert(
      "Erro",
      err.response?.data?.error || "Não foi possível atualizar o perfil."
    );
  } finally {
    setLoading(false);
  }
};


  if (!user) return <Text>Carregando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Foto */}
      {/* <TouchableOpacity disabled>
        <Image
          source={foto ? { uri: foto } : require("../../assets/logo.png")}
          style={styles.foto}
        />
      </TouchableOpacity> */}
      {/* Tipo de Perfil */}
    {userTypeStored && (
      <Text style={styles.tipoPerfil}>
        {userTypeStored === "aluno" ? "Aluno" : "Universidade"}
      </Text>
    )}


      {/* Nome */}
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder={userType === "aluno" ? "Nome Completo" : "Nome da Instituição"}
        maxLength={50}
        placeholderTextColor={"#999"}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        maxLength={50}
        placeholderTextColor={"#999"}
      />

{/* CPF/CNPJ */}
{userType === "universidade" ? (
  <TextInput
    style={styles.input}
    value={cpfCnpj}
    onChangeText={text => {
      const max = 14; // CNPJ sempre 14 dígitos
      if (text.length <= max) setCpfCnpj(text);
    }}
    placeholder="CNPJ"
    keyboardType="numeric"
  />
) : (
  // Aluno: CPF é somente leitura
  <Text style={[styles.input, { backgroundColor: "#f0f0f0" }]}>
    CPF: {cpfCnpj}
  </Text>
)}


      <TouchableOpacity style={styles.button} onPress={handleAtualizar} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Atualizando..." : "Atualizar Perfil"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={[styles.button, { backgroundColor: "#e53935", marginTop: 20 }]}
  onPress={handleExcluirConta}
>
  <Text style={styles.buttonText}>Excluir Conta</Text>
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
  tipoPerfil: {
  fontSize: 16,
  fontStyle: "italic",
  color: "#555",
  marginBottom: 15,
}

});

export default PerfilScreen;
