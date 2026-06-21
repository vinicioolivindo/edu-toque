import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

// Importações do Firebase para os Likes
import { db } from '../../../utils/firebaseConfig';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

export function FeedScreen() {
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para o Pull-to-Refresh
  const [refreshing, setRefreshing] = useState(false);

  // Estado para controlar quais vídeos foram curtidos localmente
  const [likedVideos, setLikedVideos] = useState<string[]>([]);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); 
  const isFocused = useIsFocused(); 

  // Centralizamos a busca para reutilizar no useEffect e no Refresh
  const fetchVideosFromFirebase = async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const videoList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          url: data.videoUrl,
          title: data.title,
          author: data.authorName,
          likes: data.likes || 0,
          comments: data.comments || 0,
        };
      });

      setVideos(videoList);
    } catch (error) {
      console.error("Erro ao buscar feed:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false); // Desliga o indicador de reload
    }
  };

  useEffect(() => {
    fetchVideosFromFirebase();
  }, []);

  // Função disparada ao arrastar para baixo
  const handleRefresh = () => {
    setRefreshing(true);
    fetchVideosFromFirebase();
  };

  // Lógica de Like Otimista
  const handleLike = async (videoId: string) => {
    const isAlreadyLiked = likedVideos.includes(videoId);

    // 1. ATUALIZAÇÃO OTIMISTA: Muda a UI imediatamente
    if (isAlreadyLiked) {
      // Remove do array de curtidos
      setLikedVideos(prev => prev.filter(id => id !== videoId));
      // Diminui o contador na tela
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, likes: v.likes - 1 } : v));
    } else {
      // Adiciona no array de curtidos
      setLikedVideos(prev => [...prev, videoId]);
      // Aumenta o contador na tela
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, likes: v.likes + 1 } : v));
    }

    // 2. BACKEND: Atualiza o Firebase em segundo plano
    try {
      const videoRef = doc(db, 'videos', videoId);
      await updateDoc(videoRef, {
        // Se já estava curtido, decrementa -1. Se não, incrementa 1.
        likes: increment(isAlreadyLiked ? -1 : 1)
      });
    } catch (error) {
      console.error("Erro ao salvar curtida no Firebase:", error);
      // Opcional: Se der erro na rede, você pode reverter o estado aqui para o usuário não ser enganado
    }
  };

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index);
      setIsPaused(false); 
    }
  }).current;

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const renderVideoItem = ({ item, index }: any) => {
    const isActive = activeVideoIndex === index;
    const shouldPlay = isActive && !isPaused && isFocused;
    
    // Verifica se este vídeo específico está na lista de curtidos
    const hasLiked = likedVideos.includes(item.id);

    return (
      <View style={{ height: WINDOW_HEIGHT, width: WINDOW_WIDTH }} className="bg-black relative">
        <Pressable onPress={togglePause} style={{ flex: 1 }}>
          <Video
            source={{ uri: item.url }}
            style={{ flex: 1 }}
            resizeMode={ResizeMode.COVER}
            shouldPlay={shouldPlay} 
            isLooping
          />
          {isPaused && (
            <View className="absolute inset-0 items-center justify-center bg-black/20">
              <Ionicons name="play" size={80} color="white" style={{ opacity: 0.8 }} />
            </View>
          )}
        </Pressable>

        <View className="absolute bottom-24 left-4 right-16" pointerEvents="none">
          <Text className="text-white font-bold text-lg mb-1">{item.author}</Text>
          <Text className="text-white text-sm">{item.title}</Text>
        </View>

        <View className="absolute bottom-24 right-4 items-center">
          <View className="mb-6 items-center border-2 border-white rounded-full">
            <Image source={{ uri: 'https://i.pravatar.cc/100' }} className="w-12 h-12 rounded-full" />
            <View className="absolute -bottom-2 bg-secondaryColor rounded-full p-0.5">
              <Ionicons name="add" size={14} color="white" />
            </View>
          </View>

          {/* BOTÃO DE LIKE */}
          <TouchableOpacity onPress={() => handleLike(item.id)} className="items-center mb-4">
            <Ionicons 
              name={hasLiked ? "heart" : "heart"} // Mantém o preenchido, muda a cor
              size={36} 
              color={hasLiked ? "#EF4444" : "white"} // Vermelho se curtido, Branco se não
            />
            <Text className="text-white text-xs mt-1">
              {item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}K` : item.likes}
            </Text>
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

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#05ADA7" />
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg mb-4">Nenhum vídeo publicado ainda.</Text>
        <TouchableOpacity onPress={handleRefresh} className="bg-[#05ADA7] px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Verificar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        data={videos} 
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled 
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false} 
        
        // Propriedades do Pull-to-Refresh adicionadas aqui
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}