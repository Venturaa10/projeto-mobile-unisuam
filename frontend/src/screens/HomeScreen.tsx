// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;


const HomeScreen: React.FC = () => {
  const [tipo, setTipo] = useState<string | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

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
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], // volta para a tela de login
    });
  };

  return (
    <View style={styles.container}>
      {/* Navbar recebe o logout como prop */}
      <Navbar onLogout={handleLogout} />

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
