import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';

import { auth, db } from '../../utils/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { Input } from '@/src/components/Input';
import Button from '@/src/components/Button';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'estudante' | 'educador'>('estudante');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      // 1. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Salva os dados de perfil no Firestore usando o UID do usuário como ID do documento
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        phone,
        userType,
        createdAt: new Date().toISOString()
      });

      Alert.alert('Sucesso!', 'Conta criada com sucesso.');
      
      // 3. Redireciona para a área logada do app
      router.replace('/(tabs)');

    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Não foi possível realizar o cadastro.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha precisa ter pelo menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O e-mail digitado é inválido.';
      }

      Alert.alert('Erro no Cadastro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
          
          {/* CABEÇALHO */}
          <View className="bg-secondaryColor p-6 pt-10 pb-12 rounded-b-[40px]">
            <TouchableOpacity onPress={() => router.back()} className="mb-8">
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>

            <Text className="text-white text-5xl font-bold mb-2">Cadastro</Text>
            
            <View className="flex-row items-center">
              <Text className="text-gray-300 text-lg">Já possui uma conta? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primaryColor text-lg font-bold underline">Entre</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* FORMULÁRIO */}
          <View className="px-6 py-8">
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Input title="Primeiro nome" placeholder="Fulano" value={firstName} onChangeText={setFirstName} />
              </View>
              <View className="flex-1">
                <Input title="Sobrenome" placeholder="De Tal" value={lastName} onChangeText={setLastName} />
              </View>
            </View>

            <View className="mb-6">
              <Input title="Email" placeholder="Fuladodetal@gmail.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>

            {/* SELETOR DE PERFIL */}
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

            {/* TELEFONE */}
            <View className="mb-6">
              <Text className="text-gray-500 text-lg mb-2">Telefone</Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl p-4">
                <View className="flex-row items-center gap-1 border-r border-gray-200 pr-3 mr-3">
                  <Text className="text-2xl">🇧🇷</Text>
                  <Ionicons name="chevron-down" size={16} color="gray" />
                </View>
                <TextInput
                placeholder="(00) 0000-0000"
                value={phone}
                onChangeText={setPhone}
              />
              </View>
            </View>

            {/* SENHA */}
            <View className="mb-10">
          
              <Input 
                title="Sua senha" 
                placeholder="*******" 
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Button 
              title={loading ? "Cadastrando..." : "Cadastrar"} 
              onPress={handleRegister}
              disabled={loading}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}