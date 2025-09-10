import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import CadastroScreen from "../screens/CadastroScreen";
import BuscaCertificadoScreen from "../screens/BuscaCertificadoScreen";
import Navbar from "../components/Navbar";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Cadastro: undefined;
  BuscaCertificado: undefined;
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.wrapper}>
      <Navbar />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>("Login");

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Usuário logado → vai para Home ou tela que desejar
        setInitialRoute("Home");
      } else {
        // Usuário não logado → vai para BuscaCertificado (ou Login)
        setInitialRoute("BuscaCertificado");
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) {
    // Enquanto verifica login, mostra loading
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BuscaCertificado">
          {() => (
            <ScreenWrapper>
              <BuscaCertificadoScreen />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {() => (
            <ScreenWrapper>
              <LoginScreen />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {() => (
            <ScreenWrapper>
              <HomeScreen />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="Cadastro">
          {() => (
            <ScreenWrapper>
              <CadastroScreen />
            </ScreenWrapper>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  content: { flex: 1 },
});
