import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
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

  const handleCloseMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    handleCloseMenu();
    if (onLogout) {
      onLogout();
    } else {
      // fallback seguro
      AsyncStorage.clear().then(() => {
        console.log("Logout padrão executado");
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      });
    }
  };

  const renderMenuItems = () => {
    if (!tipo) {
      return (
        <>
          <Button title="Login" onPress={() => { handleCloseMenu(); navigation.navigate("Login"); }} />
          <Button title="Cadastro" onPress={() => { handleCloseMenu(); navigation.navigate("Cadastro"); }} />
        </>
      );
    }

    if (tipo === "aluno") {
      return (
        <>
          <Button title="Meus Certificados" onPress={() => { handleCloseMenu(); }} />
          <Button title="Perfil" onPress={() => { handleCloseMenu(); navigation.navigate("Perfil"); }} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      );
    }

    if (tipo === "universidade") {
      return (
        <>
          <Button title="Registrar Certificado" onPress={() => { handleCloseMenu(); }} />
          <Button title="Perfil" onPress={() => { handleCloseMenu(); navigation.navigate("Perfil"); }} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com nome do app e hamburger */}
      <View style={styles.headerRow}>
      <TouchableOpacity
        onPress={async () => {
          const token = await AsyncStorage.getItem("token");
          if (token) {
            // Usuário logado → vai para a HomeScreen
            navigation.navigate("Home");
          } else {
            // Usuário não logado → vai para BuscaCertificado
            navigation.navigate("BuscaCertificado");
          }
        }}
      >
        <Text style={styles.title}>Meu App</Text>
      </TouchableOpacity>


        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "close" : "menu"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Menu flutuante com fechamento ao clicar fora */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={handleCloseMenu}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menu}>{renderMenuItems()}</View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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

  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 999,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
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
