import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Suas importações globais e de estilo
import 'react-native-reanimated';
import '../../styles/global.css';

// Importação do Contexto
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// 1. Criamos o "Guarda de Rota"
function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Se o Firebase ainda está carregando, espera.
    if (isLoading) return;

    // Verifica se o usuário está dentro da pasta (auth)
    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      // Tem usuário e está na tela de login? Pula para as abas!
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      // Não tem usuário e está tentando ver o app? Joga pro login!
      router.replace('/(auth)/login');
    }
  }, [user, isLoading, segments]);

  // Tela de transição rápida enquanto o Firebase pensa
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0C1338' }}>
        <ActivityIndicator size="large" color="#05ADA7" />
      </View>
    );
  }

  // O Stack assume o controle das rotas assim que o loading termina
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// 2. O Layout Raiz apenas envelopa o Guarda com o Provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}