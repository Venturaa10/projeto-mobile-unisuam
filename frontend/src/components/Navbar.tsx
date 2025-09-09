import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/Ionicons";

interface NavbarProps {
  onLogout?: () => void;
}

const { width, height } = Dimensions.get("window");

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [tipo, setTipo] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadTipo = async () => {
      const storedTipo = await AsyncStorage.getItem("tipo");
      setTipo(storedTipo);
    };
    loadTipo();
  }, []);

  const renderMenuItems = () => {
    if (!tipo) {
      return (
        <>
          <Button title="Login" onPress={() => navigation.navigate("Login")} />
          <Button title="Cadastro" onPress={() => navigation.navigate("Cadastro")} />
        </>
      );
    }

    if (tipo === "aluno") {
      return (
        <>
          <Button title="Meus Certificados" onPress={() => {}} />
          <Button title="Perfil" onPress={() => {}} />
          <Button title="Logout" onPress={onLogout} />
        </>
      );
    }

    if (tipo === "universidade") {
      return (
        <>
          <Button title="Registrar Certificado" onPress={() => {}} />
          <Button title="Perfil" onPress={() => {}} />
          <Button title="Logout" onPress={onLogout} />
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com nome do app e hamburger */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("BuscaCertificado")}>
          <Text style={styles.title}>Meu App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "close" : "menu"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Menu flutuante */}
      {menuOpen && (
        <View style={styles.menuWrapper}>
          <View style={styles.menu}>{renderMenuItems()}</View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  hamburger: { padding: 5 },

  menuWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 999,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60, // abaixo do navbar
    paddingRight: 16,
  },

  menu: {
    backgroundColor: "#3730a3",
    borderRadius: 8,
    padding: 10,
    flexDirection: "column",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default Navbar;
