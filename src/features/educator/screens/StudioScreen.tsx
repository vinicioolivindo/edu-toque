import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../../utils/firebaseConfig';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

// Substitua pelo IPv4 da sua máquina (o mesmo que usamos no feed)
const API_URL = 'http://192.168.0.111:3000/upload'; 

export function StudioScreen() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Função para abrir a galeria e escolher um vídeo
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Restringe apenas para vídeos
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  // Função de envio para o seu servidor Node.js
  const handleUpload = async () => {
    if (!title || !description || !videoUri) {
      Alert.alert('Atenção', 'Preencha todos os campos e selecione um vídeo.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Envia o arquivo físico para a sua máquina (Node.js)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category || 'Geral');
      formData.append('video', {
        uri: videoUri,
        name: `video_${Date.now()}.mp4`,
        type: 'video/mp4',
      } as any);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro no servidor local');
      }

      // 2. Busca o nome do educador que está logado para vincular ao vídeo
      const user = auth.currentUser;
      let authorName = 'Educador';
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          authorName = `${userDoc.data().firstName} ${userDoc.data().lastName}`;
        }
      }

      // 3. Salva os metadados (Textos + Link do Vídeo) no Firebase Firestore
      await addDoc(collection(db, 'videos'), {
        title: title,
        description: description,
        category: category || 'Geral',
        videoUrl: data.videoUrl, // O link que o Node.js nos devolveu!
        authorName: authorName,
        authorId: user?.uid || '',
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp() // Marca a hora exata da postagem
      });

      Alert.alert('Sucesso!', 'Vídeo publicado com sucesso.');
      
      // Limpa os campos
      setTitle('');
      setDescription('');
      setCategory('');
      setVideoUri(null);
      
      // Redireciona para o Feed
      router.push('/(tabs)/feed');

    } catch (error) {
      console.error("Erro no upload:", error);
      Alert.alert('Erro', 'Não foi possível enviar o vídeo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View className="flex-row items-center mt-4 mb-8">
            <Text className="text-3xl font-bold text-[#0C1338]">Publicar Vídeo</Text>
          </View>

          {/* FORMULÁRIO */}
          <View className="mb-6">
            <Text className="text-gray-500 mb-2">Título</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-base"
              placeholder="Ex: Dicas de matemática"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-500 mb-2">Descrição</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-base h-32"
              placeholder="Blablablablablabla"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-500 mb-2">Principal Conteúdo</Text>
            {/* Aqui simulamos um select simples. Depois podemos trocar por um Picker real */}
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-base"
              placeholder="Eixo Educacional"
              placeholderTextColor="#9CA3AF"
              value={category}
              onChangeText={setCategory}
            />
          </View>

          {/* ÁREA DE UPLOAD (Borda Tracejada) */}
          <View className="mb-10">
            <Text className="text-gray-500 mb-2">Anexar Arquivo</Text>
            <TouchableOpacity 
              onPress={pickVideo}
              className="border-2 border-dashed border-[#05ADA7] rounded-xl py-8 items-center justify-center bg-[#F0FAF9]"
            >
              {videoUri ? (
                <View className="items-center">
                   <Ionicons name="checkmark-circle" size={32} color="#05ADA7" />
                   <Text className="text-[#05ADA7] font-bold mt-2">Vídeo selecionado!</Text>
                   <Text className="text-gray-400 text-xs mt-1">Toque para trocar</Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="videocam" size={24} color="#05ADA7" />
                  <Text className="text-[#05ADA7] font-bold text-base">Enviar vídeo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* BOTÃO PUBLICAR */}
          <TouchableOpacity 
            onPress={handleUpload}
            disabled={isUploading}
            className={`py-4 rounded-xl items-center mb-10 ${isUploading ? 'bg-gray-400' : 'bg-[#05ADA7]'}`}
          >
            {isUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Publicar</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}