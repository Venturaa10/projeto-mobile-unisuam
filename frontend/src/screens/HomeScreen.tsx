import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  cpf_cnpj: string;
};

const HomeScreen: React.FC = () => {
  const [tipo, setTipo] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedTipo = await AsyncStorage.getItem("tipo");
      setTipo(storedTipo);

      const storedUsuario = await AsyncStorage.getItem("usuario");
      if (storedUsuario) {
        const usuarioObj: Usuario = JSON.parse(storedUsuario);
        setUsuario(usuarioObj);

        // Aqui você vê no console o que foi armazenado
        console.log("Dados do usuário armazenado:", usuarioObj);
      } else {
        console.log("Nenhum usuário armazenado.");
      }
    };
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      {tipo && <Text>Você está logado como: {tipo}</Text>}
      {usuario && <Text>Olá, {usuario.nome}!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 20 },
});

export default HomeScreen;
