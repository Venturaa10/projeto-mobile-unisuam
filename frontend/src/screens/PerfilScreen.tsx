import React, { useState, useEffect } from "react";
import { Alert, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../navigation/AppNavigator";

type PerfilScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Perfil">;
type PerfilScreenRouteProp = RouteProp<RootStackParamList, "Perfil">;

interface User {
  id: number;
  nome: string;
  cpf?: string;
  cnpj?: string;
  email: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  imagemPerfil?: string;
  logo?: string;
}

interface PerfilScreenProps {
  navigation: PerfilScreenNavigationProp;
  route: PerfilScreenRouteProp;
}

const PerfilScreen: React.FC<PerfilScreenProps> = ({ route }) => {
  const { userType, userId } = route.params;
  const navigation = useNavigation<PerfilScreenNavigationProp>();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [userTypeStored, setUserTypeStored] = useState<string | null>(null);

  const [showExtras, setShowExtras] = useState(false); // <-- controla campos extras

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const endpoint = userType === "aluno" ? `/alunos/${userId}` : `/universidades/${userId}`;
        const response = await api.get(endpoint);
        const u = response.data;
        setUser(u);
        setNome(u.nome);
        setEmail(u.email);
        setCpfCnpj(userType === "aluno" ? u.cpf : u.cnpj);
        setTelefone(u.telefone || "");
        setEndereco(u.endereco || "");
        setCidade(u.cidade || "");
        setEstado(u.estado || "");
        setFoto(userType === "aluno" ? u.imagemPerfil : u.logo);
        const tipo = await AsyncStorage.getItem("tipo");
        setUserTypeStored(tipo);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      }
    };
    fetchUser();
  }, [userType, userId]);

  const handleAtualizar = async () => {
    setLoading(true);
    try {
      const endpoint =
        userType === "aluno"
          ? `/alunos/atualizarCampos/${userId}`
          : `/universidades/atualizarCampos/${userId}`;

      const payload: any = { nome, email };
      if (showExtras) {
        payload.telefone = telefone;
        payload.endereco = endereco;
        payload.cidade = cidade;
        payload.estado = estado;
      }
      if (userType === "aluno") payload.cpf = cpfCnpj;
      else payload.cnpj = cpfCnpj;

      const response = await api.put(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const updatedUser = response.data;
      setUser(updatedUser);
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (err: any) {
      console.error("Erro ao atualizar:", err.response?.data || err.message);
      Alert.alert("Erro", err.response?.data?.error || "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirConta = () => {
    Alert.alert(
      "Confirmação",
      "Você realmente deseja excluir sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const endpoint =
                userType === "aluno"
                  ? `/alunos/${userId}`
                  : `/universidades/${userId}`;
              await api.delete(endpoint);
              await AsyncStorage.clear();
              Alert.alert("Sucesso", "Conta excluída com sucesso!");
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } catch (err: any) {
              Alert.alert(
                "Erro",
                err.response?.data?.error || "Não foi possível excluir a conta."
              );
            }
          },
        },
      ]
    );
  };

  if (!user) return <CenteredText>Carregando...</CenteredText>;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20 }}>
      <Title>Meu Perfil</Title>

      <ProfileCard>
        <ProfileImage 
  source={foto ? { uri: foto } : require("../../assets/Elliot.jpeg")} 
/>

        <ProfileInfo>
          <UserType>{userTypeStored === "aluno" ? "Aluno" : "Universidade"}</UserType>
          <UserName>{nome}</UserName>
          <UserEmail>{email}</UserEmail>
          <UserCPF>{userType === "aluno" ? `CPF: ${cpfCnpj}` : `CNPJ: ${cpfCnpj}`}</UserCPF>
        </ProfileInfo>
      </ProfileCard>

      <Input value={nome} onChangeText={setNome} placeholder={userType === "aluno" ? "Nome Completo" : "Nome da Instituição"} />
      <Input value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
      {userType === "universidade" ? (
        <Input value={cpfCnpj} onChangeText={t => { if (t.length <= 14) setCpfCnpj(t); }} placeholder="CNPJ" keyboardType="numeric" />
      ) : (
        <ReadOnlyInput>CPF: {cpfCnpj}</ReadOnlyInput>
      )}

      {/* Botão para mostrar campos extras */}
      <ExtraButton onPress={() => setShowExtras(!showExtras)}>
        <ExtraButtonText>{showExtras ? "Ocultar informações extras" : "Adicionar informações extras"}</ExtraButtonText>
      </ExtraButton>

      {showExtras && (
        <>
          <Input value={telefone} onChangeText={setTelefone} placeholder="Telefone" keyboardType="phone-pad" />
          <Input value={endereco} onChangeText={setEndereco} placeholder="Endereço" />
          <Input value={cidade} onChangeText={setCidade} placeholder="Cidade" />
          <Input value={estado} onChangeText={setEstado} placeholder="Estado" />
        </>
      )}

      <ButtonRow>
        <SmallButton onPress={handleAtualizar} disabled={loading}>
          <ButtonText>{loading ? "Atualizando..." : "Atualizar"}</ButtonText>
        </SmallButton>
        <SmallButtonDelete onPress={handleExcluirConta}>
          <ButtonText>Excluir Conta</ButtonText>
        </SmallButtonDelete>
      </ButtonRow>
    </ScrollView>
  );
};

//
// Styled Components
//
const CenteredText = styled.Text`
  flex: 1;
  text-align: center;
  margin-top: 50%;
  font-size: 16px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ProfileCard = styled.View`
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 4;
`;

const ProfileImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-right: 16px;
`;

const ProfileInfo = styled.View`
  flex: 1;
`;

const UserType = styled.Text`
  font-size: 14px;
  font-style: italic;
  color: #555;
  margin-bottom: 6px;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const UserEmail = styled.Text`
  font-size: 14px;
  color: #555;
  margin-bottom: 2px;
`;

const UserCPF = styled.Text`
  font-size: 14px;
  color: #555;
`;

const Input = styled.TextInput`
  width: 100%;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #fff;
`;

const ReadOnlyInput = styled.Text`
  width: 100%;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #f0f0f0;
`;

const ExtraButton = styled.TouchableOpacity`
  margin-bottom: 12px;
`;

const ExtraButtonText = styled.Text`
  color: #2563eb;
  font-size: 14px;
  font-weight: bold;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const SmallButton = styled.TouchableOpacity`
  background-color: #4f46e5;
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  margin-right: 10px;
`;

const SmallButtonDelete = styled(SmallButton)`
  background-color: #e53935;
  margin-right: 0;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

export default PerfilScreen;
