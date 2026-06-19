import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
// 1. IMPORTAMOS O HOOK DE FOCO DA TELA
import { useIsFocused } from '@react-navigation/native';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
const IP_LOCAL = '192.168.0.111'; // Lembre de colocar o seu IP aqui

const DUMMY_VIDEOS = [
  { id: '1', url: `http://${IP_LOCAL}:3000/videos/aula1.mp4`, title: 'Bizu plano de metas', author: '@ajaykumar', likes: '34.4K', comments: '120' },
  { id: '2', url: `http://${IP_LOCAL}:3000/videos/aula2.mp4`, title: 'Atividade de funcão', author: '@profcarlos', likes: '12K', comments: '45' },
  { id: '3', url: `http://${IP_LOCAL}:3000/videos/aula3.mp4`, title: 'Bizu salvador', author: '@profcarlos', likes: '12K', comments: '45' },
];

export function FeedScreen() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  
  // 2. ESTADO PARA O PAUSE MANUAL
  const [isPaused, setIsPaused] = useState(false); 
  
  // 3. HOOK QUE VERIFICA SE A TELA ESTÁ ABERTA AGORA
  const isFocused = useIsFocused(); 

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index);
      // Sempre que rolar para um vídeo novo, garantimos que ele não comece pausado
      setIsPaused(false); 
    }
  }).current;

  // Função para pausar/despausar ao tocar na tela
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const renderVideoItem = ({ item, index }: any) => {
    const isActive = activeVideoIndex === index;
    
    // A FÓRMULA MÁGICA DO PLAY:
    // Só toca se for o vídeo ativo na lista E o usuário não pausou E a tela está aberta
    const shouldPlay = isActive && !isPaused && isFocused;

    return (
      <View style={{ height: WINDOW_HEIGHT, width: WINDOW_WIDTH }} className="bg-black relative">
        
        {/* 4. ENVOLVEMOS O VÍDEO NO PRESSABLE PARA CAPTURAR O TOQUE */}
        <Pressable onPress={togglePause} style={{ flex: 1 }}>
          <Video
            source={{ uri: item.url }}
            style={{ flex: 1 }}
            resizeMode={ResizeMode.COVER}
            shouldPlay={shouldPlay} 
            isLooping
          />
          
          {/* 5. ÍCONE DE PLAY NO MEIO DA TELA SE ESTIVER PAUSADO */}
          {isPaused && (
            <View className="absolute inset-0 items-center justify-center bg-black/20">
              <Ionicons name="play" size={80} color="white" style={{ opacity: 0.8 }} />
            </View>
          )}
        </Pressable>

        {/* OVERLAY DE CONTEÚDO (Fica por cima do vídeo) */}
        <View className="absolute bottom-24 left-4 right-16" pointerEvents="none">
          <Text className="text-white font-bold text-lg mb-1">{item.author}</Text>
          <Text className="text-white text-sm">{item.title}</Text>
        </View>

        {/* BARRA LATERAL DIREITA (Ações) */}
        <View className="absolute bottom-24 right-4 items-center">
          <View className="mb-6 items-center border-2 border-white rounded-full">
            {/* Como combinamos, aqui fica o componente Image, substitua a URI pela foto do usuário depois */}
            <Image source={{ uri: 'https://i.pravatar.cc/100' }} className="w-12 h-12 rounded-full" />
            <View className="absolute -bottom-2 bg-secondaryColor rounded-full p-0.5">
              <Ionicons name="add" size={14} color="white" />
            </View>
          </View>

          <TouchableOpacity className="items-center mb-4">
            <Ionicons name="heart" size={36} color="white" />
            <Text className="text-white text-xs mt-1">{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mb-4">
            <Ionicons name="chatbubble-ellipses" size={32} color="white" />
            <Text className="text-white text-xs mt-1">{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center">
            <Ionicons name="bookmark" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView edges={['top']} className="absolute top-0 w-full z-10 flex-row justify-between px-5 pt-2" pointerEvents="box-none">
        <View className="flex-1" />
        <View className="flex-row gap-4 items-center">
          <Text className="text-gray-300 font-bold text-lg">Seguindo</Text>
          <View className="bg-white px-3 py-1 rounded-full">
             <Text className="text-black font-bold text-lg">For You</Text>
          </View>
        </View>
        <View className="flex-1 items-end">
          <Ionicons name="search" size={28} color="white" />
        </View>
      </SafeAreaView>

      <FlatList
        data={DUMMY_VIDEOS}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled 
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false} 
      />
    </View>
  );
}