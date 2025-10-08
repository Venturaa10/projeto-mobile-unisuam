import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import styled from "styled-components/native";
import api, { LoginResponse } from "../services/api";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;
type UserType = "aluno" | "universidade";

const LoginScreen: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("aluno");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    const init = async () => {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("tipo");

      const existingToken = await AsyncStorage.getItem("token");
      if (existingToken) {
        navigation.replace("Home");
      }
    };
    init();
  }, []);

  const handleLogin = async () => {
    if (!login || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const endpoint = userType === "aluno" ? "/auth/aluno" : "/auth/universidade";
      const response = await api.post<LoginResponse>(endpoint, { login, senha });

      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("tipo", response.data.tipo);
      await AsyncStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      navigation.replace("Home");
    } catch (err: any) {
      Alert.alert("Erro", err.response?.data?.error || "Erro ao logar");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => (loading ? "Carregando..." : userType === "aluno" ? "Entrar como Aluno" : "Entrar como Universidade");

  return (
    <Container>
      <Title>Login</Title>

      <Selector>
        <Option selected={userType === "aluno"} onPress={() => setUserType("aluno")}>
          <OptionText selected={userType === "aluno"}>Aluno</OptionText>
        </Option>

        <Option selected={userType === "universidade"} onPress={() => setUserType("universidade")}>
          <OptionText selected={userType === "universidade"}>Universidade</OptionText>
        </Option>
      </Selector>

      <Input placeholder={userType === "aluno" ? "CPF ou Email" : "CNPJ ou Email"} value={login} onChangeText={setLogin} maxLength={50} />
      <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry maxLength={25} />

      <Button onPress={handleLogin} disabled={loading}>
        <ButtonText>{getButtonText()}</ButtonText>
      </Button>

      <RegisterButton onPress={() => navigation.navigate("Cadastro")}>
        <RegisterText>Não tem conta? Cadastre-se</RegisterText>
      </RegisterButton>
    </Container>
  );
};

export default LoginScreen;

//
// 🎨 Styled Components
//
const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #111;
`;

const Selector = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
`;

const Option = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 10px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? "#4f46e5" : "#ccc")};
  background-color: ${({ selected }) => (selected ? "#4f46e5" : "transparent")};
  margin: 0 5px;
  border-radius: 5px;
`;

const OptionText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
`;

const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#9ca3af" : "#4f46e5")};
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 10px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const RegisterButton = styled.TouchableOpacity`
  align-items: center;
  margin-top: 10px;
`;

const RegisterText = styled.Text`
  color: #4f46e5;
  font-weight: bold;
  font-size: 16px;
`;
