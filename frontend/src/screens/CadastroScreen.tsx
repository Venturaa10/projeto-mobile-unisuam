import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import api from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Ionicons } from '@expo/vector-icons';

type CadastroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Cadastro">;
type UserType = "aluno" | "universidade";

const CadastroScreen: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("aluno");
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState(""); // CPF ou CNPJ
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const navigation = useNavigation<CadastroScreenNavigationProp>();

  const handleCadastro = async () => {
    if (!nome || !cpfCnpj || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const endpoint = userType === "aluno" ? "/alunos" : "/universidades";

      const payload =
        userType === "aluno"
          ? { nome, cpf: cpfCnpj.replace(/\D/g, ""), email, senha }
          : { nome, cnpj: cpfCnpj.replace(/\D/g, ""), email, senha };

      const response = await api.post(endpoint, payload);
      Alert.alert(
        "Sucesso",
        `${userType === "aluno" ? "Aluno" : "Universidade"} cadastrado com sucesso!`
      );
      console.log("Cadastro:", response.data);

      navigation.navigate("Login");
    } catch (err: any) {
      Alert.alert("Erro", err.response?.data?.error || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "Carregando...";
    return userType === "aluno" ? "Cadastrar como Aluno" : "Cadastrar como Universidade";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

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

      {/* Campo nome */}
        <TextInput
        style={styles.input}
        placeholder={userType === "aluno" ? "Nome Completo" : "Nome da Instituição/Universidade"}
        value={nome}
        onChangeText={setNome}
        />

      {/* Campo CPF/CNPJ */}
      <TextInput
        style={styles.input}
        placeholder={userType === "aluno" ? "CPF" : "CNPJ"}
        value={cpfCnpj}
        onChangeText={setCpfCnpj}
        keyboardType="default"
        maxLength={11}
      />

      {/* Campo Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Campo senha com olhinho */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Confirmar senha com olhinho */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarConfirmarSenha}
        />
        <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
          <Ionicons name={mostrarConfirmarSenha ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={loading}>
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>

      {/* Link para Login */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.link}>
        <Text style={styles.linkText}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  selector: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  option: { padding: 10, borderWidth: 1, borderColor: "#ccc", marginHorizontal: 5, borderRadius: 5 },
  selectedOption: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  optionText: { color: "#000" },
  selectedText: { color: "#fff", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15, width: "100%" },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 5, paddingHorizontal: 10, marginBottom: 15, width: "100%" },
  inputPassword: { flex: 1, paddingVertical: 10 },
  button: { backgroundColor: "#4f46e5", padding: 15, borderRadius: 5, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 15 },
  linkText: { color: "#4f46e5", fontWeight: "bold", fontSize: 16 },
});

export default CadastroScreen;
