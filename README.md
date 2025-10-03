-- Rodar o backend:
- cd backend
- npm install


-- Rodar o frontend
- cd frontend
- npm install 


Depois disso, você só precisa iniciar cada parte:

Backend: npm run dev

Frontend: npm start




🛠️ Erro: RNDocumentPicker could not be found – React Native / Expo
❌ Mensagem de erro
Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'RNDocumentPicker' could not be found.

📌 Causa

Esse erro ocorre quando você tenta usar o pacote react-native-document-picker em um projeto Expo (Managed Workflow).

react-native-document-picker é uma biblioteca nativa, que não funciona no Expo Go porque exige código nativo não incluído no runtime do Expo.

✅ Solução
🔁 Substituir por expo-document-picker (compatível com Expo)
1. Desinstale o pacote incompatível:
npm uninstall react-native-document-picker
# ou
yarn remove react-native-document-picker

2. Instale o pacote correto:
npx expo install expo-document-picker

3. Importe no seu código:
import * as DocumentPicker from 'expo-document-picker';

4. Use assim:
const pickDocument = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
    copyToCacheDirectory: true,
  });

  if (!result.canceled) {
    console.log('Documento:', result.assets[0]);
  }
};

💡 Dica extra: web vs mobile

No expo-document-picker, não é necessário fazer Platform.OS !== "web" para decidir a lib. Ele já lida com isso internamente.

Se você quiser tratar upload web manualmente, pode usar:

if (Platform.OS === 'web') {
  // Criar input type="file"
} else {
  // Usar DocumentPicker
}

📄 Resumo
Situação	Ação recomendada
Usando Expo Go	✅ Use expo-document-picker
Precisa de react-native-document-picker	❌ Eject do Expo (expo eject) + EAS Build
Quer suportar web	✅ Trate Platform.OS === 'web'




### 
Comando para gerar a keytool SHA1

keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

Vai retornar algo como : 
Alias name: androiddebugkey Creation date: 26 de jul. de 2024 Entry type: PrivateKeyEntry Certificate chain length: 1 Certificate[1]: Owner: C=US, O=Android, CN=Android Debug Issuer: C=US, O=Android, CN=Android Debug Serial number: 1 Valid from: Fri Jul 26 16:37:04 BRT 2024 until: Sun Jul 19 16:37:04 BRT 2054 Certificate fingerprints: SHA1: 23:E4:2B:56:7A:C8:C9:FF:EE:01:A3:91:FE:9D:98:7D:45:A1:E6:0C SHA256: 32:08:EA:47:CC:59:43:EB:EB:49:A1:34:68:63:D0:D3:FB:82:CE:02:3C:20:24:15:4F:4B:B3:29:31:36:4F:EE Signature algorithm name: SHA256withRSA Subject Public Key Algorithm: 2048-bit RSA key Version: 1