import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../../styles/global.css';

export default function RootLayout() {
  return (
    <>
      {/* O Stack assume o controle das rotas */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Dizemos ao roteador que existe um grupo (auth) e (tabs) */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}