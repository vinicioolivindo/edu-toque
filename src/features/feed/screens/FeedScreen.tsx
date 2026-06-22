import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, Pressable, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

// Importações do Firebase
import { auth, db } from '../../../utils/firebaseConfig';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment, arrayUnion, getDoc, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

export function FeedScreen() {
  const { videoId } = useLocalSearchParams<{ videoId?: string }>();
  const flatListRef = useRef<FlatList>(null);

  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); 
  
  // ================= ESTADOS DOS COMENTÁRIOS =================
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [activeCommentVideoId, setActiveCommentVideoId] = useState<string | null>(null);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  
  // Referência para podermos "desligar" o ouvinte do Firebase quando fechar o modal
  const commentsListenerRef = useRef<any>(null);
  // ===========================================================

  const isFocused = useIsFocused(); 

  const fetchUserFollowing = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setFollowing(userDoc.data().following || []);
        }
      } catch (error) {
        console.error("Erro ao buscar lista de seguindo:", error);
      }
    }
  };

  const fetchVideosFromFirebase = async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const videoList = querySnapshot.docs.map(document => {
        const data = document.data();
        return {
          id: document.id,
          url: data.videoUrl,
          title: data.title,
          author: data.authorName,
          authorId: data.authorId, 
          likes: data.likes || 0,
          comments: data.comments || 0,
        };
      });

      setVideos(videoList);

      if (videoId && videoList.length > 0) {
        const index = videoList.findIndex(v => v.id === videoId);
        if (index !== -1) {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index, animated: false });
            setActiveVideoIndex(index);
          }, 200);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar feed:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserFollowing();
    fetchVideosFromFirebase();
    
    // Limpa o ouvinte de comentários caso a tela seja desmontada
    return () => {
      if (commentsListenerRef.current) commentsListenerRef.current();
    };
  }, [videoId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserFollowing();
    fetchVideosFromFirebase();
  };

  const handleFollow = async (authorId: string) => {
    const user = auth.currentUser;
    if (!user || user.uid === authorId) return; 

    setFollowing(prev => [...prev, authorId]);

    try {
      const currentUserRef = doc(db, 'users', user.uid);
      const educatorRef = doc(db, 'users', authorId);
      await updateDoc(currentUserRef, { following: arrayUnion(authorId) });
      await updateDoc(educatorRef, { followers: increment(1) });
    } catch (error) {
      console.error("Erro ao seguir educador:", error);
      setFollowing(prev => prev.filter(id => id !== authorId));
    }
  };

  const handleLike = async (id: string) => {
    const isAlreadyLiked = likedVideos.includes(id);

    if (isAlreadyLiked) {
      setLikedVideos(prev => prev.filter(vid => vid !== id));
      setVideos(prev => prev.map(v => v.id === id ? { ...v, likes: v.likes - 1 } : v));
    } else {
      setLikedVideos(prev => [...prev, id]);
      setVideos(prev => prev.map(v => v.id === id ? { ...v, likes: v.likes + 1 } : v));
    }

    try {
      const videoRef = doc(db, 'videos', id);
      await updateDoc(videoRef, { likes: increment(isAlreadyLiked ? -1 : 1) });
    } catch (error) {
      console.error("Erro ao salvar curtida no Firebase:", error);
    }
  };

  // ================= FUNÇÕES DOS COMENTÁRIOS =================
  const openComments = (id: string) => {
    setActiveCommentVideoId(id);
    setCommentModalVisible(true);
    
    // Conecta na subcoleção "comments" deste vídeo específico, ordenando do mais recente pro mais antigo
    const commentsQuery = query(
      collection(db, 'videos', id, 'comments'), 
      orderBy('createdAt', 'desc')
    );

    // O onSnapshot escuta as mudanças em tempo real!
    commentsListenerRef.current = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCommentsList(fetchedComments);
    });
  };

  const closeComments = () => {
    setCommentModalVisible(false);
    setActiveCommentVideoId(null);
    if (commentsListenerRef.current) {
      commentsListenerRef.current(); // Desliga o "ouvinte" para economizar internet
    }
  };

  const postComment = async () => {
    if (!newCommentText.trim() || !activeCommentVideoId) return;
    
    const user = auth.currentUser;
    if (!user) return;

    setIsPostingComment(true);

    try {
      // 1. Busca os dados do usuário com segurança contra "undefined"
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      
      const userName = userData ? `${userData.firstName} ${userData.lastName}` : 'Usuário';
      
      // A CORREÇÃO ESTÁ AQUI: Só usa o profilePic se ele realmente existir e tiver um valor.
      // Caso contrário, injeta a string da imagem padrão garantindo que nunca seja undefined.
      const userPic = (userData && userData.profilePic) ? userData.profilePic : 'https://i.pravatar.cc/100';

      // 2. Salva o comentário na subcoleção
      await addDoc(collection(db, 'videos', activeCommentVideoId, 'comments'), {
        text: newCommentText,
        authorId: user.uid,
        authorName: userName,
        authorPic: userPic,
        createdAt: serverTimestamp(),
      });

      // 3. Aumenta o número de comentários no documento principal do vídeo
      await updateDoc(doc(db, 'videos', activeCommentVideoId), {
        comments: increment(1)
      });

      // Atualiza a tela de feed otimisticamente
      setVideos(prev => prev.map(v => v.id === activeCommentVideoId ? { ...v, comments: v.comments + 1 } : v));

      setNewCommentText(''); // Limpa o input
    } catch (error) {
      console.error("Erro ao postar comentário:", error);
    } finally {
      setIsPostingComment(false);
    }
  };
  // ===========================================================

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index);
      setIsPaused(false); 
    }
  }).current;

  const togglePause = () => setIsPaused(!isPaused);

  const renderVideoItem = ({ item, index }: any) => {
    const isActive = activeVideoIndex === index;
    // Pausa o vídeo se o modal de comentários estiver aberto
    const shouldPlay = isActive && !isPaused && isFocused && !isCommentModalVisible;
    const hasLiked = likedVideos.includes(item.id);
    
    const currentUserUid = auth.currentUser?.uid;
    const isMyVideo = currentUserUid === item.authorId;
    const isAlreadyFollowing = following.includes(item.authorId);

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
            
            {!isMyVideo && !isAlreadyFollowing && (
              <TouchableOpacity 
                onPress={() => handleFollow(item.authorId)}
                className="absolute -bottom-2 bg-[#05ADA7] rounded-full p-0.5"
              >
                <Ionicons name="add" size={14} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={() => handleLike(item.id)} className="items-center mb-4">
            <Ionicons 
              name={hasLiked ? "heart" : "heart"} 
              size={36} 
              color={hasLiked ? "#EF4444" : "white"} 
            />
            <Text className="text-white text-xs mt-1">
              {item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}K` : item.likes}
            </Text>
          </TouchableOpacity>

          {/* BOTÃO QUE ABRE OS COMENTÁRIOS */}
          <TouchableOpacity onPress={() => openComments(item.id)} className="items-center mb-4">
            <Ionicons name="chatbubble-ellipses" size={32} color="white" />
            <Text className="text-white text-xs mt-1">
              {item.comments >= 1000 ? `${(item.comments / 1000).toFixed(1)}K` : item.comments}
            </Text>
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
        ref={flatListRef}
        data={videos} 
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled 
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false} 
        refreshing={refreshing}
        onRefresh={handleRefresh}
        getItemLayout={(data, index) => ({
          length: WINDOW_HEIGHT,
          offset: WINDOW_HEIGHT * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
          });
        }}
      />

      {/* ================= MODAL DE COMENTÁRIOS (BOTTOM SHEET) ================= */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCommentModalVisible}
        onRequestClose={closeComments}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          {/* Fundo escuro clicável para fechar */}
          <Pressable onPress={closeComments} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
          
          <View className=" bg-white rounded-t-3xl h-[65%] shadow-lg">
            
            {/* Header do Modal */}
            <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-100">
              <View className="w-6" /> 
              <Text className="font-bold text-[#0C1338] text-base">
                {commentsList.length} comentários
              </Text>
              <TouchableOpacity onPress={closeComments}>
                <Ionicons name="close" size={24} color="#0C1338" />
              </TouchableOpacity>
            </View>

            {/* Lista de Comentários */}
            <FlatList
              data={commentsList}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
              renderItem={({ item }) => (
                <View className="flex-row mb-6">
                  <Image source={{ uri: item.authorPic || 'https://i.pravatar.cc/100' }} className="w-10 h-10 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="font-bold text-gray-500 text-xs mb-1">{item.authorName}</Text>
                    <Text className="text-[#0C1338] text-sm leading-5">{item.text}</Text>
                  </View>
                  <View className="items-center ml-2">
                    <Ionicons name="heart-outline" size={16} color="gray" />
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-400 mt-10">
                  Seja o primeiro a comentar!
                </Text>
              }
            />

            {/* Input de Novo Comentário */}
            <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-5 py-4 flex-row items-center gap-3">
              <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                <TextInput
                  className="flex-1 text-[#0C1338] h-10"
                  placeholder="Adicionar comentário..."
                  placeholderTextColor="gray"
                  value={newCommentText}
                  onChangeText={setNewCommentText}
                  multiline
                />
              </View>
              <TouchableOpacity 
                onPress={postComment}
                disabled={isPostingComment || !newCommentText.trim()}
                className={`w-12 h-12 rounded-full items-center justify-center ${newCommentText.trim() ? 'bg-[#05ADA7]' : 'bg-gray-200'}`}
              >
                {isPostingComment ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="send" size={20} color={newCommentText.trim() ? 'white' : 'gray'} style={{ marginLeft: 3 }} />
                )}
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>
  

    </View>
  );
}