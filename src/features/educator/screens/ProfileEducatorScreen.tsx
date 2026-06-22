import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Importações do Firebase atualizadas
import { auth, db } from "@/src/utils/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Logo from "@/assets/svg/logov2.svg";
import { signOut } from "firebase/auth";

export function ProfileEducatorScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  // Novo estado para guardar os vídeos publicados pelo educador
  const [publishedVideos, setPublishedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndVideos = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // 1. Busca os dados do perfil
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }

        // 2. Busca APENAS os vídeos deste educador
        const q = query(
          collection(db, "videos"),
          where("authorId", "==", user.uid),
        );
        const querySnapshot = await getDocs(q);

        const videos = querySnapshot.docs.map((videoDoc) => ({
          id: videoDoc.id,
          ...videoDoc.data(),
        }));

        // Ordena os vídeos do mais recente para o mais antigo usando JavaScript
        // (Isso evita a necessidade de criar um Índice Composto complexo no Firebase agora)
        videos.sort((a: any, b: any) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setPublishedVideos(videos);
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndVideos();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#05ADA7" />
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);

      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);

      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* CABEÇALHO */}
        <View className="flex-row justify-center items-center mt-4 mb-8">
          <Logo width={30} height={30} />
          {/* Usando o azul escuro padrão da marca */}
          <Text className="text-2xl font-bold text-[#0C1338] ml-2">
            EduToque
          </Text>
        </View>

        {/* INFORMAÇÕES DO PERFIL */}
        <View className="items-center px-5 mb-10">
          <Image
            source={{
              uri: userData?.profilePic || "https://i.pravatar.cc/150?img=11",
            }}
            className="w-28 h-28 rounded-full mb-4"
          />

          <Text className="text-2xl font-bold text-black mb-2">
            {userData
              ? `${userData.firstName} ${userData.lastName}`
              : "Usuário não encontrado"}
          </Text>

          <View className="items-center mb-6">
            {/* Atualizado para a visão do Educador (Seguidores) */}
            <Text className="text-xl font-bold text-black">
              {userData?.followers || "0"}
            </Text>
            <Text className="text-gray-400 text-sm">Seguidores</Text>
          </View>

          <View className="flex flex-row gap-2">
            <TouchableOpacity
              className="border border-gray-300 rounded-2xl py-3 px-10  items-center"
              // Você pode criar uma rota /edit-profile depois para esta ação
              onPress={() => console.log("Ir para edição de perfil")}
            >
              <Text className="text-black font-bold text-base">
                Editar Perfil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="
  border
  border-red-300
  rounded-2xl
  py-3
  px-10
  items-center
  "
              onPress={handleLogout}
            >
              <View className="flex-row items-center">
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />

                <Text
                  className="
      text-red-600
      font-bold
      text-base
      ml-2
      "
                >
                  Sair
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* DIVISOR */}
        <View className="h-[1px] bg-gray-100 w-full mb-6" />

        {/* VÍDEOS PUBLICADOS */}
        <View className="px-5 mb-24">
          <View className="flex-row items-center justify-center mb-6">
            <Ionicons name="play" size={20} color="#0C1338" />
            <Text className="text-xl font-bold text-[#0C1338] ml-2">
              Vídeos Publicados
            </Text>
          </View>

          {/* GRID DE VÍDEOS */}
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {publishedVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                className="w-[48%] bg-white rounded-3xl shadow-md shadow-black/5 border border-gray-100 overflow-hidden mb-2"
                onPress={() => {
                  // Navega para o feed passando o ID do vídeo clicado
                  router.push({
                    pathname: "/(tabs)/feed",
                    params: { videoId: video.id },
                  });
                }}
              >
                {/* Thumbnail com Overlay de Play suave */}
                <View className="w-full aspect-square bg-[#E0F2F1] items-center justify-center relative">
                  <View className="bg-white/40 p-3 rounded-full">
                    <Ionicons name="play" size={32} color="white" />
                  </View>
                  {/* Badge de Duração ou Categoria no canto (Opcional) */}
                  <View className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-lg">
                    <Text className="text-white text-[10px] font-bold">
                      {video.category}
                    </Text>
                  </View>
                </View>

                {/* Conteúdo do Card */}
                <View className="p-3">
                  <Text
                    className="font-bold text-[#0C1338] text-sm mb-2"
                    numberOfLines={1}
                  >
                    {video.title}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1.5">
                      <Ionicons name="heart" size={14} color="#EF4444" />
                      <Text className="text-gray-500 text-[11px] font-medium">
                        {video.likes || 0}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <Ionicons
                        name="chatbubble-ellipses"
                        size={14}
                        color="#05ADA7"
                      />
                      <Text className="text-gray-500 text-[11px] font-medium">
                        {video.comments || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Tratamento caso não tenha vídeos */}
            {publishedVideos.length === 0 && (
              <Text className="text-gray-400 text-center w-full mt-4">
                Você ainda não publicou nenhum vídeo.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
