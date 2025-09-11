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
import { Image } from "react-native";

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

      // pega a imagem do usuário ou default
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
<Button
  title="Perfil"
  onPress={() => {
    handleCloseMenu();
    if (usuario && tipo) {
      navigation.navigate("Perfil", { userType: tipo as "aluno" | "universidade", userId: usuario.id });
    } else {
      console.log("Usuário não encontrado no storage");
    }
  }}
/>
          <Button title="Logout" onPress={handleLogout} />
        </>
      );
    }

    if (tipo === "universidade") {
      return (
        <>
          <Button title="Registrar Certificado" onPress={() => { handleCloseMenu(); }} />
<Button
  title="Perfil"
  onPress={() => {
    handleCloseMenu();
    if (usuario && tipo) {
      navigation.navigate("Perfil", { userType: tipo as "aluno" | "universidade", userId: usuario.id });
    } else {
      console.log("Usuário não encontrado no storage");
    }
  }}
/>
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
        navigation.navigate("Home");
      } else {
        navigation.navigate("BuscaCertificado");
      }
    }}
    style={styles.appRow}
  >
    <Text style={styles.title}>Meu App</Text>

    {usuario && (
      <Image
        source={
          usuario.imagem
            ? { uri: usuario.imagem }
            : require("../../assets/perfil-logo-default.png") // fallback
        }
        style={styles.profileImage}
      />
    )}
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.hamburger}
    onPress={() => setMenuOpen(!menuOpen)}
  >
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

  appRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8, // espaçamento entre "Meu App" e a foto
},
profileImage: {
  width: 32,
  height: 32,
  borderRadius: 16,
  marginLeft: 8,
  borderWidth: 1,
  borderColor: "#fff",
},

});

export default Navbar;
