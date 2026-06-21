// src/app/(tabs)/index.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';

// Importa as duas visões
import { EducatorDashboard } from '@/src/features/educator/screens/EducatorDashboard';
import StudentHomeScreen from '@/src/features/student/screens/StudentHomeScreen';
import { ProfileEducatorScreen } from '@/src/features/educator/screens/ProfileEducatorScreen';
import { ProfileStudentScreen } from '@/src/features/student/screens/ProfileStudentScreen';

export default function HomeRoute() {
  const { userType, isLoading } = useAuth();

  // Mostra um loading enquanto verifica o Firebase
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2CC0B7" />
      </View>
    );
  }

  // Se o contexto disser que é educador, renderiza o painel
  if (userType === 'educador') {
    return <ProfileEducatorScreen />;
  }

  // Por padrão (se for estudante ou se algo falhar), mostra a home de descoberta
  return <ProfileStudentScreen />;
}