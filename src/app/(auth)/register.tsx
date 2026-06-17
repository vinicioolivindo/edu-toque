import React, { useState } from 'react';
import { 
  View, Text, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {Input} from '@/src/components/Input';
import Button from '@/src/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState<'estudante' | 'educador'>('estudante');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
        >
          <View className="bg-secondaryColor p-6 pt-10 pb-12 rounded-b-[40px]">
            <TouchableOpacity onPress={() => router.back()} className="mb-8">
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-5xl font-bold mb-2">Cadastro</Text>
            
            <View className="flex-row items-center">
              <Text className="text-gray-300 text-lg">Já possui uma conta? </Text>
              <TouchableOpacity onPress={() => router.push('/')}>
                <Text className="text-primaryColor text-lg font-bold underline">Entre</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FORMULÁRIO */}
          <View className="px-6 py-8">
            
            {/* Nome e Sobrenome Lado a Lado */}
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Input title="Primeiro nome" placeholder="Fulano" />
              </View>
              <View className="flex-1">
                <Input title="Sobrenome" placeholder="De Tal" />
              </View>
            </View>

            <View className="mb-6">
              <Input title="Email" placeholder="Fuladodetal@gmail.com" keyboardType="email-address" />
            </View>

            {/* SELETOR DE PERFIL (Estudante / Educador) */}
            <View className="mb-6">
              <Text className="text-gray-500 text-lg mb-3">Quem é você?</Text>
              <View className="flex-row gap-4">
                <TouchableOpacity 
                  onPress={() => setUserType('estudante')}
                  className={`flex-1 p-4 rounded-2xl items-center border ${userType === 'estudante' ? 'bg-primaryColor border-primaryColor' : 'bg-white border-gray-200'}`}
                >
                  <Text className={`font-bold text-lg ${userType === 'estudante' ? 'text-white' : 'text-gray-400'}`}>Estudante</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setUserType('educador')}
                  className={`flex-1 p-4 rounded-2xl items-center border ${userType === 'educador' ? 'bg-primaryColor border-primaryColor' : 'bg-white border-gray-200'}`}
                >
                  <Text className={`font-bold text-lg ${userType === 'educador' ? 'text-white' : 'text-gray-400'}`}>Educador</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* TELEFONE (Layout especial do print) */}
            <View className="mb-6">
              <Text className="text-gray-500 text-lg mb-2">Telefone</Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl p-4">
                <TouchableOpacity className="flex-row items-center gap-1 border-r border-gray-200 pr-3 mr-3">
                  <Text className="text-2xl">🇧🇷</Text>
                  <Ionicons name="chevron-down" size={16} color="gray" />
                </TouchableOpacity>
                <Text className="text-lg text-black">(00) 000-0000</Text>
              </View>
            </View>

            {/* SENHA */}
            {/* <View className="mb-10">
              <Input 
                title="Sua senha" 
                placeholder="*******" 
                secureTextEntry={!showPassword}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#A3A3A3" />
                  </TouchableOpacity>
                }
              />
            </View> */}

            {/* BOTÃO CADASTRAR (Usando seu componente Button) */}
            <Button 
              title="Cadastrar" 
              onPress={() => console.log('Cadastrar')}
              // Supondo que seu Button aceite classes Tailwind ou mude de cor via prop
              className="bg-secondaryColor py-5 rounded-2xl" 
            />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}