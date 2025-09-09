import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen: React.FC = () => {
  const [tipo, setTipo] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedTipo = await AsyncStorage.getItem("tipo");
      setTipo(storedTipo);
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("tipo");
    Alert.alert("Logout", "Você saiu da conta");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      {tipo && <Text>Você está logado como: {tipo}</Text>}
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});

export default HomeScreen;
