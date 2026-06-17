import { Redirect } from 'expo-router';

export default function Index() {
  // Assim que o app abrir a raiz (/), ele é redirecionado para o Login automaticamente
  return <Redirect href="/login" />;
}