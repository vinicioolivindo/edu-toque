import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '@/src/utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Logo from '@/assets/svg/logov2.svg'

export function ProfileEducatorScreen() {
  const router = useRouter();
  
  // Estado para armazenar os dados do usuário vindos do banco
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dados falsos para os álbuns (apenas para visualização do design)
  const dummyAlbums = Array(4).fill({ title: 'Matemática', count: '20 vídeos' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Busca o documento do usuário logado na coleção 'users'
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2CC0B7" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* CABEÇALHO */}
        <View className="flex-row justify-center items-center mt-4 mb-8">
          <Logo width={30} height={30} /> 
          <Text className="text-2xl font-bold text-secondaryColor ml-2">EduToque</Text>
        </View>

        {/* INFORMAÇÕES DO PERFIL */}
        <View className="items-center px-5 mb-10">
          <Image 
            // Mostra uma foto padrão se o usuário ainda não tiver foto no banco
            source={{ uri: userData?.profilePic || 'https://i.pravatar.cc/150?img=11' }} 
            className="w-28 h-28 rounded-full mb-4"
          />
          
          <Text className="text-2xl font-bold text-black mb-2">
            {userData ? `${userData.firstName} ${userData.lastName}` : 'Usuário não encontrado'}
          </Text>
          
          <View className="items-center mb-6">
            <Text className="text-xl font-bold text-black">38</Text>
            <Text className="text-gray-400 text-sm">Seguindo</Text>
          </View>

          <TouchableOpacity 
            className="border border-gray-300 rounded-2xl py-3 px-10 w-full items-center"
            // Você pode criar uma rota /edit-profile depois para esta ação
            onPress={() => console.log('Ir para edição de perfil')}
          >
            <Text className="text-black font-bold text-base">Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* DIVISOR */}
        <View className="h-[1px] bg-gray-100 w-full mb-6" />

        {/* ÁLBUNS DE VÍDEOS */}
        <View className="px-5 mb-20">
          <View className="flex-row items-center justify-center mb-6">
            <Ionicons name="bookmark-outline" size={24} color="#1E3A8A" />
            <Text className="text-xl font-bold text-secondaryColor ml-2">Álbuns de vídeos</Text>
          </View>

         <Text>vai ter os video aqui</Text> 
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}