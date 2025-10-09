// Navbar.tsx
import React, { useEffect, useState } from "react";
import {
  View, Text, Button, StyleSheet, TouchableOpacity,
  Dimensions, TouchableWithoutFeedback, Image
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
  const [usuario, setUsuario] = useState<{ id: number; nome: string; imagem?: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedTipo = await AsyncStorage.getItem("tipo");
      setTipo(storedTipo);
      const storedUsuario = await AsyncStorage.getItem("usuario");
      if (storedUsuario) {
        const usuarioObj = JSON.parse(storedUsuario);
        const imagem =
          storedTipo === "aluno"
            ? usuarioObj.imagemPerfil || null
            : storedTipo === "universidade"
            ? usuarioObj.logo || null
            : null;
        setUsuario({ id: usuarioObj.id, nome: usuarioObj.nome, imagem });
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      AsyncStorage.clear().then(() => {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      });
    }
  };

  const renderMenuItems = () => {
    if (!tipo) {
      return (
        <>
          <Button title="Login" onPress={() => { setMenuOpen(false); navigation.navigate("Login"); }} />
          <Button title="Cadastro" onPress={() => { setMenuOpen(false); navigation.navigate("Cadastro"); }} />
        </>
      );
    }
    if (tipo === "aluno") {
      return (
        <>
          <Button title="Meus Certificados" onPress={() => { setMenuOpen(false); navigation.navigate("MeusCertificados"); }} />
          <Button title="Perfil" onPress={() => {
            setMenuOpen(false);
            if (usuario) navigation.navigate("Perfil", { userType: "aluno", userId: usuario.id });
          }} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      );
    }
    if (tipo === "universidade") {
      return (
        <>
          <Button title="Registrar Certificado" onPress={() => { setMenuOpen(false); navigation.navigate("RegistraCertificado"); }} />
          <Button title="Perfil" onPress={() => {
            setMenuOpen(false);
            if (usuario) navigation.navigate("Perfil", { userType: "universidade", userId: usuario.id });
          }} />
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
            navigation.navigate(token ? "Home" : "BuscaCertificado");
          }}
          style={styles.appRow}
        >
          <Text style={styles.title}>Meu App</Text>
          {usuario && (
            <Image
              source={
                usuario.imagem
                  ? { uri: usuario.imagem }
                  : require("../../assets/perfil_logo_default.png")
              }
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.hamburger} onPress={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "close" : "menu"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Menu flutuante */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
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
    top: 0, left: 0,
    width, height,
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
  },
  appRow: { flexDirection: "row", alignItems: "center" },
  profileImage: {
    width: 32, height: 32,
    borderRadius: 16,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#fff",
  },
});

export default Navbar;
