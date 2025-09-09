// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
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
  
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Bem-vindo!</Text>
      {tipo && <Text>Você está logado como: {tipo}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 20 },
});

export default HomeScreen;
