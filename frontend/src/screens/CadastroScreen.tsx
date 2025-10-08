import React, { useState, useEffect } from "react";
import { Text, Alert } from "react-native";
import styled from "styled-components/native";
import api from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInputMask } from "react-native-masked-text";

type CadastroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Cadastro">;
type UserType = "aluno" | "universidade";

const CadastroScreen: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("aluno");
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const navigation = useNavigation<CadastroScreenNavigationProp>();

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

  const handleCadastro = async () => {
    if (!nome || !cpfCnpj || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const endpoint = userType === "aluno" ? "/alunos" : "/universidades";

      const payload =
        userType === "aluno"
          ? { nome, cpf: cpfCnpj.replace(/\D/g, ""), email, senha }
          : { nome, cnpj: cpfCnpj.replace(/\D/g, ""), email, senha };

      await api.post(endpoint, payload);
      Alert.alert("Sucesso", `${userType === "aluno" ? "Aluno" : "Universidade"} cadastrado com sucesso!`);

      navigation.replace("Login");
    } catch (err: any) {
      console.log("ERRO AO CADASTRAR ===>", JSON.stringify(err, null, 2));
      Alert.alert("Erro", err.response?.data?.error || err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCpfCnpj("");
  }, [userType]);

  const getButtonText = () => {
    if (loading) return "Carregando...";
    return userType === "aluno" ? "Cadastrar como Aluno" : "Cadastrar como Universidade";
  };

  return (
    <Container>
      <Title>Cadastro</Title>

      <Selector>
        <Option
          isSelected={userType === "aluno"}
          onPress={() => setUserType("aluno")}
        >
          <OptionText isSelected={userType === "aluno"}>Aluno</OptionText>
        </Option>

        <Option
          isSelected={userType === "universidade"}
          onPress={() => setUserType("universidade")}
        >
          <OptionText isSelected={userType === "universidade"}>Universidade</OptionText>
        </Option>
      </Selector>

      <Input
        placeholder={userType === "aluno" ? "Nome Completo" : "Nome da Instituição/Universidade"}
        value={nome}
        onChangeText={setNome}
        maxLength={50}
      />

      <MaskedInput
        type={userType === "aluno" ? "cpf" : "cnpj"}
        placeholder={userType === "aluno" ? "CPF" : "CNPJ"}
        value={cpfCnpj}
        onChangeText={setCpfCnpj}
      />

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        maxLength={50}
      />

      <PasswordContainer>
        <InputPassword
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          maxLength={25}
        />
        <IconButton onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={24} color="gray" />
        </IconButton>
      </PasswordContainer>

      <PasswordContainer>
        <InputPassword
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarConfirmarSenha}
          maxLength={25}
        />
        <IconButton onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
          <Ionicons name={mostrarConfirmarSenha ? "eye-off" : "eye"} size={24} color="gray" />
        </IconButton>
      </PasswordContainer>

      <Button onPress={handleCadastro} disabled={loading}>
        <ButtonText>{getButtonText()}</ButtonText>
      </Button>

      <Link onPress={() => navigation.navigate("Login")}>
        <LinkText>Já tem conta? Entrar</LinkText>
      </Link>
    </Container>
  );
};

export default CadastroScreen;

//
// 🎨 Estilos com styled-components
//
const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
})`
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
`;

const Selector = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
`;

const Option = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 10px;
  border-width: 1px;
  border-color: ${({ isSelected }) => (isSelected ? "#4f46e5" : "#ccc")};
  background-color: ${({ isSelected }) => (isSelected ? "#4f46e5" : "#fff")};
  margin: 0 5px;
  border-radius: 5px;
`;

const OptionText = styled.Text<{ isSelected: boolean }>`
  color: ${({ isSelected }) => (isSelected ? "#fff" : "#000")};
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  width: 100%;
`;

const MaskedInput = styled(TextInputMask)`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  width: 100%;
`;

const PasswordContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
  padding-horizontal: 10px;
  margin-bottom: 15px;
  width: 100%;
`;

const InputPassword = styled.TextInput`
  flex: 1;
  padding-vertical: 10px;
`;

const IconButton = styled.TouchableOpacity``;

const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#9ca3af" : "#4f46e5")};
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  width: 100%;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const Link = styled.TouchableOpacity`
  margin-top: 15px;
`;

const LinkText = styled.Text`
  color: #4f46e5;
  font-weight: bold;
  font-size: 16px;
`;
