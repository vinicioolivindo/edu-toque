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
import { auth, db } from "@/src/utils/firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Logo from "@/assets/svg/logov2.svg";
import { signOut } from "firebase/auth";

export function ProfileStudentScreen() {
  const router = useRouter();

  // Estado para armazenar os dados do usuário vindos do banco
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dados falsos para os álbuns (apenas para visualização do design)
  const dummyAlbums = Array(4).fill({
    title: "Matemática",
    count: "20 vídeos",
  });
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }

        setLoading(false);
      },
      (error) => {
        console.error("Erro ao atualizar perfil:", error);

        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Busca o documento do usuário logado na coleção 'users'
          const docRef = doc(db, "users", user.uid);
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
          <Text className="text-2xl font-bold text-secondaryColor ml-2">
            EduToque
          </Text>
        </View>

        {/* INFORMAÇÕES DO PERFIL */}
        <View className="items-center px-5 mb-10">
          <Image
            // Mostra uma foto padrão se o usuário ainda não tiver foto no banco
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
            <Text className="text-xl font-bold text-black">
              {userData.following?.length || 0}
            </Text>
            <Text className="text-gray-400 text-sm">Seguindo</Text>
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

        {/* ÁLBUNS DE VÍDEOS */}
        <View className="px-5 mb-20">
          <View className="flex-row items-center justify-center mb-6">
            <Ionicons name="bookmark-outline" size={24} color="#1E3A8A" />
            <Text className="text-xl font-bold text-secondaryColor ml-2">
              Álbuns de vídeos
            </Text>
          </View>

          {/* GRID DE ÁLBUNS */}
          <View className="flex-row flex-wrap justify-between">
            {dummyAlbums.map((album, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <View className="w-full h-32 bg-[#D1E8E6] items-center justify-center">
                  {/* Simulação da capa do álbum (fundo de caderno do print) */}
                  <Text className="text-gray-400 opacity-50">
                    Capa do Álbum
                  </Text>
                </View>

                <View className="p-3 flex-row justify-between items-center bg-white">
                  <View>
                    <Text className="font-bold text-gray-800">
                      {album.title}
                    </Text>
                    <Text className="text-xs text-gray-400">{album.count}</Text>
                  </View>
                  <View className="bg-secondaryColor p-2 rounded-lg">
                    <Ionicons name="grid" size={16} color="white" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
