// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api, { LoginResponse } from "../services/api";

type UserType = "aluno" | "universidade";

const LoginScreen: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("aluno");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!login || !senha) {
    Alert.alert("Erro", "Preencha todos os campos");
    return;
  }

  setLoading(true);
  try {
    const endpoint = userType === "aluno" ? "/auth/aluno" : "/auth/universidade";
    const response = await api.post<LoginResponse>(endpoint, { login, senha });
    
    Alert.alert("Sucesso", `Logado como ${response.data.tipo}`);
    console.log("TOKEN:", response.data.token);
    // salvar token e redirecionar
  } catch (err: any) {
    Alert.alert("Erro", err.response?.data?.error || "Erro ao logar");
  } finally {
    setLoading(false);
  }
};


  const getButtonText = () => {
  if (loading) return "Carregando...";
  return userType === "aluno" ? "Entrar como Aluno" : "Entrar como Universidade";
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Seletor de tipo */}
      <View style={styles.selector}>
        <TouchableOpacity
          style={[styles.option, userType === "aluno" && styles.selectedOption]}
          onPress={() => setUserType("aluno")}
        >
          <Text style={userType === "aluno" ? styles.selectedText : styles.optionText}>Aluno</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, userType === "universidade" && styles.selectedOption]}
          onPress={() => setUserType("universidade")}
        >
          <Text style={userType === "universidade" ? styles.selectedText : styles.optionText}>Universidade</Text>
        </TouchableOpacity>
      </View>

      {/* Campo de login */}
      <TextInput
        style={styles.input}
        placeholder={userType === "aluno" ? "CPF ou Email" : "CNPJ ou Email"}
        value={login}
        onChangeText={setLogin}
        keyboardType="default"
      />

      {/* Campo de senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{getButtonText()}</Text>
        </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  selector: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  option: { padding: 10, borderWidth: 1, borderColor: "#ccc", marginHorizontal: 5, borderRadius: 5 },
  selectedOption: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  optionText: { color: "#000" },
  selectedText: { color: "#fff", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
  button: { backgroundColor: "#4f46e5", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default LoginScreen;
