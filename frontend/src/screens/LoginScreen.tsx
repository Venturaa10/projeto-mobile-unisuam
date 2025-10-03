import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api, { LoginResponse } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../firebase"; // seu firebase.ts
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";


type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;
type UserType = "aluno" | "universidade";

const LoginScreen: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("aluno");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

WebBrowser.maybeCompleteAuthSession();

const [googleRequest, googleResponse, promptGoogleLogin] = Google.useAuthRequest({
  androidClientId: "88043054481-tg2g95io9ogndjc7gk7b3jt6rtjakcdm.apps.googleusercontent.com", // coloque aqui
});

useEffect(() => {
  if (googleResponse?.type === "success") {
    const { idToken } = googleResponse.authentication!;
    if (idToken) {
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          // Aqui você pode salvar no AsyncStorage e navegar para Home
          AsyncStorage.setItem("token", user.uid); // ou outro identificador
          AsyncStorage.setItem("usuario", JSON.stringify(user));
          navigation.replace("Home");
        })
        .catch((err) => console.error(err));
    }
  }
}, [googleResponse]);

const handleLogin = async () => {
  if (!login || !senha) {
    Alert.alert("Erro", "Preencha todos os campos");
    return;
  }

  setLoading(true);
  try {
    const endpoint = userType === "aluno" ? "/auth/aluno" : "/auth/universidade";
    const response = await api.post<LoginResponse>(endpoint, { login, senha });

    // Salvar token, tipo e dados do usuário
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

      <TouchableOpacity
  style={[styles.button, { backgroundColor: "#DB4437" }]}
  onPress={() => promptGoogleLogin()}
>
  <Text style={styles.buttonText}>Login com Google</Text>
</TouchableOpacity>


      <TextInput
        style={styles.input}
        placeholder={userType === "aluno" ? "CPF ou Email" : "CNPJ ou Email"}
        value={login}
        onChangeText={setLogin}
        maxLength={50}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        maxLength={25}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
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
  button: { backgroundColor: "#4f46e5", padding: 15, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  registerButton: { alignItems: "center", marginTop: 10 },
  registerText: { color: "#4f46e5", fontWeight: "bold" },
});

export default LoginScreen;
