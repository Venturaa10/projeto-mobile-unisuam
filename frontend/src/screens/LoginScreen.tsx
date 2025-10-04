import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api, { LoginResponse } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { auth } from "../config/firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from 'expo-auth-session';

// Dentro do componente LoginScreen
const redirectUri = makeRedirectUri({ useProxy: true } as any); // força, evita TS
console.log("Redirect URI:", redirectUri);

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;
type UserType = "aluno" | "universidade";

const LoginScreen: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("aluno");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Google Auth
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: "933250452089-p84rjjk9sso9f7t98p8dvvu2a0m1k548.apps.googleusercontent.com",//mudei para webClientId para fazer o login pelo  navegador
    redirectUri
  });


  useEffect(() => {
    const init = async () => {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("tipo");

      const existingToken = await AsyncStorage.getItem("token");
      if (existingToken) navigation.replace("Home");
    };
    init();
  }, []);

  // Login normal
  const handleLogin = async () => {
    if (!login || !senha) return Alert.alert("Erro", "Preencha todos os campos");

    setLoading(true);
    try {
      const endpoint = userType === "aluno" ? "/auth/aluno" : "/auth/universidade";
      const response = await api.post<LoginResponse>(endpoint, { login, senha });

      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("tipo", response.data.tipo);
      await AsyncStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      navigation.replace("Home");
    } catch (err: any) {
      Alert.alert("Erro", err.response?.data?.error || "Erro ao logar");
    } finally {
      setLoading(false);
    }
  };

  // Login com Google
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const firebaseUid = userCredential.user.uid;
          const email = userCredential.user.email;

          // Envia para backend para criar ou logar usuário
          const endpoint = "/auth/google";
          const backendResponse = await api.post<LoginResponse>(endpoint, { firebaseUid, email, userType });

          await AsyncStorage.setItem("token", backendResponse.data.token);
          await AsyncStorage.setItem("tipo", backendResponse.data.tipo);
          await AsyncStorage.setItem("usuario", JSON.stringify(backendResponse.data.usuario));

          navigation.replace("Home");
        })
        .catch((err) => {
          Alert.alert("Erro", "Não foi possível logar com Google");
        });
    }
  }, [response]);

  const getButtonText = () => (loading ? "Carregando..." : userType === "aluno" ? "Entrar como Aluno" : "Entrar como Universidade");

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

      <TextInput style={styles.input} placeholder="CPF/CNPJ ou Email" value={login} onChangeText={setLogin} />
      <TextInput style={styles.input} placeholder="Senha" value={senha} secureTextEntry onChangeText={setSenha} />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>

      {/* Botão Google */}
      <TouchableOpacity style={[styles.button, { backgroundColor: "#DB4437" }]} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos permanecem iguais
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  selector: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  option: { padding: 10, borderWidth: 1, borderColor: "#ccc", marginHorizontal: 5, borderRadius: 5 },
  selectedOption: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  optionText: { color: "#000" },
  selectedText: { color: "#fff", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
  button: { padding: 15, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  registerButton: { alignItems: "center", marginTop: 10 },
  registerText: { color: "#4f46e5", fontWeight: "bold" },
});

export default LoginScreen;
