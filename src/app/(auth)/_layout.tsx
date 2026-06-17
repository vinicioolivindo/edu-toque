import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    // O Stack empilha as telas de forma fluida.
    // O headerShown: false remove a barra superior padrão de todas as telas deste grupo.
    <Stack screenOptions={{ headerShown: false }}>
      
      {/* Opcional, mas recomendado: você pode declarar as telas explicitamente 
        caso queira passar alguma configuração específica para apenas uma delas no futuro.
      */}
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      
    </Stack>
  );
}