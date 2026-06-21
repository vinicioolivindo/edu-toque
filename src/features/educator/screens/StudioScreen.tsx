import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/assets/svg/logo.svg'; 

export function StudioScreen() {

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <Text>Studio</Text>
    </SafeAreaView>
  );
}