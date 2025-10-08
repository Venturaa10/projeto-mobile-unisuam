import React, { useState } from "react";
import { Text, Alert, FlatList, Linking } from "react-native";
import styled from "styled-components/native";
import api from "../services/api";

const BASE_URL = "http://192.168.1.74:3000";

const BuscaCertificadoScreen: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [certificados, setCertificados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    const cpfLimpo = cpf.replace(/\D/g, ""); // remove pontos e traço
    if (!cpfLimpo) {
      Alert.alert("Atenção", "Digite um CPF válido.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.get("/certificados");
      const data = res.data;

      const filtrados = data.filter(
        (cert: any) => cert.publico && cert.cpfAluno === cpfLimpo
      );

      if (filtrados.length === 0) {
        Alert.alert("Nenhum certificado público encontrado");
      }

      setCertificados(filtrados);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível buscar certificados.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <Card>
      <Curso>{item.nomeCurso}</Curso>
      <Text>Aluno: {item.nomeAluno}</Text>
      <Text>CPF: {item.cpfAluno}</Text>
      <Text>Emitido em: {new Date(item.dataEmissao).toLocaleDateString("pt-BR")}</Text>

      {item.arquivo && (
        <Botao onPress={() => Linking.openURL(`${BASE_URL}/${item.arquivo}`)}>
          <BotaoTexto>📄 Ver Certificado</BotaoTexto>
        </Botao>
      )}
    </Card>
  );

  return (
    <Container>
      <Title>Busca de Certificado</Title>

      <Input
        placeholder="Digite o CPF do Aluno"
        value={cpf}
        maxLength={11}
        keyboardType="numeric"
        onChangeText={setCpf}
      />

      <Button onPress={handleBuscar} disabled={loading}>
        <ButtonText>{loading ? "Buscando..." : "Buscar"}</ButtonText>
      </Button>

      <FlatList
        data={certificados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={{ width: "100%", marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default BuscaCertificadoScreen;

//
// 🎨 Estilos com styled-components
//
const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f9fafb;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #d1d5db;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  background-color: #fff;
  font-size: 16px;
`;

const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#9ca3af" : "#4f46e5")};
  padding-vertical: 14px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 18px;
`;

const Card = styled.View`
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  elevation: 2;
`;

const Curso = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Botao = styled.TouchableOpacity`
  margin-top: 10px;
  background-color: #4f46e5;
  padding: 10px;
  border-radius: 6px;
  align-items: center;
`;

const BotaoTexto = styled.Text`
  color: #fff;
  font-weight: bold;
`;
