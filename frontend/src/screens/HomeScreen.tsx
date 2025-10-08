// src/screens/HomeScreen.tsx
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Text, ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";

// Imagens para os cards de notícias
const vagasImg = require("../../assets/image.png");
const cursosImg = require("../../assets/image.png");
const novidadeImg = require("../../assets/image.png");
const incentivoImg = require("../../assets/image.png");

const HomeScreen: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const carregarUsuario = async () => {
        try {
          const usuarioStr = await AsyncStorage.getItem("usuario");
          if (usuarioStr) setUsuario(JSON.parse(usuarioStr));
        } catch (err) {
          console.log("Erro ao carregar usuário:", err);
        }
      };
      carregarUsuario();
    }, [])
  );

  if (!usuario) {
    return (
      <LoadingContainer>
        <Text>Carregando usuário...</Text>
      </LoadingContainer>
    );
  }

  const tipoUsuario = usuario.cpf_cnpj?.length === 11 ? "Aluno" : "Universidade";

  return (
    <Container>
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}>
        
        {/* Card do Usuário */}
        <UserCard>
          <Avatar source={usuario.imagemPerfil ? { uri: usuario.imagemPerfil } : require("../../assets/image.png")} />
          <UserInfo>
            <UserName>{usuario.nome}</UserName>
            <UserEmail>{usuario.email}</UserEmail>
            <UserCPF>{tipoUsuario}: {usuario.cpf_cnpj}</UserCPF>
          </UserInfo>
        </UserCard>

        {/* Cards de notícias */}
        <CardsContainer>
          <Card>
            <CardImage source={vagasImg} resizeMode="cover" />
            <CardTitle>💼 Vagas em Destaque</CardTitle>
            <CardText>
              Confira as oportunidades de estágio e emprego disponíveis para você!
            </CardText>
          </Card>

          <Card>
            <CardImage source={cursosImg} resizeMode="cover" />
            <CardTitle>🎓 Cursos Recomendados</CardTitle>
            <CardText>
              Aproveite e faça cursos para se qualificar e crescer na carreira!
            </CardText>
          </Card>

          {/* Flashes finais com imagens iguais aos primeiros */}
          <Card>
            <CardImage source={novidadeImg} resizeMode="cover" />
            <CardTitle>🚀 Novidades da Universidade</CardTitle>
            <CardText>
              Fique atento aos próximos cursos e oportunidades que vão te impulsionar!
            </CardText>
          </Card>

          <Card>
            <CardImage source={incentivoImg} resizeMode="cover" />
            <CardTitle>💡 Dica de Incentivo</CardTitle>
            <CardText>
              Continue estudando e aprimorando suas habilidades todos os dias!
            </CardText>
          </Card>

        </CardsContainer>

        {/* Frase de incentivo azul */}
        <IncentivoText>
          🌟 Mantenha o foco, aprenda algo novo todos os dias e conquiste seus objetivos!
        </IncentivoText>

      </ScrollView>
    </Container>
  );
};

export default HomeScreen;

// =======================
// Estilos com styled-components
// =======================
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f9fafb;
`;

const UserCard = styled.View`
  width: 100%;
  margin: 20px 20px 10px 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 3;
`;

const Avatar = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-right: 16px;
`;

const UserInfo = styled.View`
  flex: 1;
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

const CardsContainer = styled.View`
  width: 100%;
  margin-top: 10px;
  padding: 0 20px;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 120px;
`;

const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 16px 6px 16px;
`;

const CardText = styled.Text`
  font-size: 14px;
  color: #555;
  margin: 0 16px 12px 16px;
`;

const IncentivoText = styled.Text`
  font-size: 15px;
  color: #1e40af; /* azul escuro */
  font-weight: 600;
  margin: 10px 20px 0 20px;
  text-align: center;
`;
