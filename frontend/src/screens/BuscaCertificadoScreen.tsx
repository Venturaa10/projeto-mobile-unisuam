import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";

const BuscaCertificadoScreen: React.FC = () => {
  const [tipoBusca, setTipoBusca] = useState("cpf");
  const [valor, setValor] = useState("");

  // Limpar token e tipo sempre que entrar na tela
  useEffect(() => {
    const clearUserData = async () => {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("tipo");
    };
    clearUserData();
  }, []);

  const handleBuscar = () => {
    console.log(`Buscar por ${tipoBusca}: ${valor}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Busca de Certificado</Text>

      {/* Select */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoBusca}
          onValueChange={(itemValue) => setTipoBusca(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Buscar por CPF" value="cpf" />
          <Picker.Item label="Buscar por ID do Aluno" value="idAluno" />
          <Picker.Item label="Buscar por Instituição" value="instituicao" />
        </Picker>
      </View>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder={
          tipoBusca === "cpf"
            ? "Digite o CPF"
            : tipoBusca === "idAluno"
            ? "Digite o ID do Aluno"
            : "Digite o nome da Instituição"
        }
        value={valor}
        maxLength={50}
        onChangeText={setValor}
      />

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={handleBuscar}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1f2937",
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 20,
    width: "100%",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: "100%",
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default BuscaCertificadoScreen;
