// src/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [tipo, setTipo] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadTipo = async () => {
      const storedTipo = await AsyncStorage.getItem("tipo");
      setTipo(storedTipo);
    };
    loadTipo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu App</Text>

      {/* Quando o usuário NÃO está logado */}
      {!tipo && (
        <View style={styles.menu}>
          <Button title="Login" onPress={() => navigation.navigate("Login")} />
          <Button
            title="Cadastro"
            onPress={() => navigation.navigate("Cadastro")}
          />
        </View>
      )}

      {/* Quando o usuário é aluno */}
      {tipo === "aluno" && (
        <View style={styles.menu}>
          <Button title="Meus Certificados" onPress={() => {}} />
          <Button title="Perfil" onPress={() => {}} />
          <Button title="Logout" onPress={onLogout} />
        </View>
      )}

      {/* Quando o usuário é universidade */}
      {tipo === "universidade" && (
        <View style={styles.menu}>
          <Button title="Registrar Certificado" onPress={() => {}} />
          <Button title="Perfil" onPress={() => {}} />
          <Button title="Logout" onPress={onLogout} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", padding: 10, backgroundColor: "#4f46e5" },
  title: { color: "#fff", fontWeight: "bold", fontSize: 20, marginBottom: 10 },
  menu: { flexDirection: "row", justifyContent: "space-around" },
});

export default Navbar;
