// src/navigation/AppNavigator.tsx
import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Wrapper que adiciona Navbar global com handleLogout
const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("tipo");
    Alert.alert("Logout", "Você saiu da conta");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.wrapper}>
      <Navbar onLogout={handleLogout} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BuscaCertificado" screenOptions={{ headerShown: false }}>
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
