import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from '@/assets/svg/logo.svg'
import {Input} from '@/src/components/Input';
import Button from '@/src/components/Button';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* KeyboardAvoidingView garante que o teclado não cubra os campos no iOS/Android */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{flexGrow: 1}} bounces={false}>
      
          <View className="bg-secondaryColor p-6 pt-16 pb-24 rounded-b-[40px]">
            <View className="flex-row items-center gap-2 mb-10">
              <Logo/>
              <Text className='text-3xl font-bold text-white'>EduToque</Text>
            </View>

            <Text className="text-white text-5xl font-bold mb-3 left-aligned leading-tight">
              Entre, {} role e estude!
            </Text>

            <View className="flex-row gap-1 items-center">
              <Text className="text-gray-300 text-lg">Não possui conta?</Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text className="text-primaryColor text-lg font-bold underline">Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SEÇÃO BRANCA (FORMULÁRIO) */}
          <View className="flex-1 px-6 pt-8 pb-6">
            
            <Input
            title='Email'
            value={email}
            onChangeText={setEmail}
            placeholder="Fuladodetal@gmail.com"
            placeholderTextColor="#A3A3A3"
            keyboardType="email-address"
            autoCapitalize="none"
            />

            <Input
            title="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="*******"
            placeholderTextColor="#A3A3A3"
            secureTextEntry={!showPassword}
            />

            {/* Lembrar de mim / Esqueceu a senha */}
            <View className="flex-row justify-between items-center mb-10">
              <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} className="flex-row items-center gap-2">
                <View className={`w-6 h-6 border rounded-md items-center justify-center ${rememberMe ? 'bg-brandTeal border-brandTeal' : 'border-gray-300'}`}>
                    {rememberMe && <Ionicons name="checkmark" size={18} color="white" />}
                </View>
                <Text className="text-gray-500 text-lg">Lembrar de mim</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className="text-primaryColor text-lg font-bold">Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>

            {/* Botão Entrar */}
          <Button title="Entrar"/>

            {/* Divisor "Ou entre por" */}
            <View className="flex-row items-center mb-8">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="text-gray-400 text-lg px-4">Ou entre por</Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            {/* Botão Google */}
            <TouchableOpacity activeOpacity={0.8} className="border border-gray-200 p-5 rounded-2xl w-full flex-row items-center justify-center gap-3 mb-12 bg-white">
              {/* <Image source={require('../../../assets/google-logo.png')} className="w-6 h-6" /> */}
              <MaterialCommunityIcons name="google" size={24} color="#4285F4" />
              <Text className="text-gray-600 font-bold text-xl">Google</Text>
            </TouchableOpacity>

            {/* Texto de Serviço (Footer) */}
            <View className="items-center px-4 mt-auto">
                <Text className="text-gray-400 text-center text-sm leading-5">
                    Ao se cadastrar, você concorda com os 
                    <Text className="text-secondaryColor font-bold"> Termos de Serviço</Text> e as 
                    <Text className="text-secondaryColor font-bold"> Políticas de Privacidade</Text>.
                </Text>
            </View>
            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}