// src/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define as props que o Navbar recebe
interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [tipo, setTipo] = useState<string | null>(null);

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
      {tipo === "aluno" && (
        <View style={styles.menu}>
          <Button title="Meus Certificados" onPress={() => {}} />
          <Button title="Perfil" onPress={() => {}} />
          <Button title="Logout" onPress={onLogout} />
        </View>
      )}
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
