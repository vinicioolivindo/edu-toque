import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Logo from "@/assets/svg/logov2.svg";

export default function StudentHomeScreen() {
  const categories = Array(8).fill({
    name: "Matemática",
  });

  const videos = Array(5).fill({
    title: "Dicas de matemática",
    author: "Ajay Kumar",
  });

  const educators = Array(4).fill({
    name: "Brooklyn Simmons",
    followers: "2.4K",
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 22,
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}

        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-gray-400 text-base">
              Continue estudando 👋
            </Text>

            <Text className="text-[34px] font-extrabold text-secondaryColor">
              Bem-vindo
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Logo width={34} height={34} />

            <Text className="text-primaryColor font-bold">EduToque</Text>
          </View>
        </View>

        {/* SEARCH */}

        <View className="bg-[#EFF4F7] rounded-2xl flex-row items-center px-5 h-14 mb-8">
          <Ionicons name="search" size={20} color="#64748B" />

          <TextInput
            placeholder="Buscar aulas..."
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-3 text-base"
          />
        </View>

        {/* CATEGORIAS */}

        <View>
          <Text className="text-2xl font-bold mb-4">Categorias</Text>

          <View className="flex-row flex-wrap justify-between">
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="
w-[23%]
aspect-square
rounded-3xl
mb-3
items-center
justify-center
bg-primaryColor
"
              >
                <View className="bg-white/20 p-2 rounded-xl">
                  <Ionicons name="calculator" size={20} color="white" />
                </View>

                <Text
                  className="
text-white
text-[11px]
font-semibold
mt-2
"
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* VIDEOS */}

        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-bold">Vídeos em alta</Text>

            <Text className="text-primaryColor text-md">Ver todos</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {videos.map((item, index) => (
              <View
                key={index}
                className="
        w-[130px]
        mr-3
        bg-white
        rounded-[24px]
        overflow-hidden
        "
              >
                {/* Thumbnail */}

                <View className="h-[80px] bg-[#D8F2EF]">
                  <View
                    className="
            absolute
            self-center
            top-[22px]
            bg-white/90
            rounded-full
            p-3
            "
                  >
                    <Ionicons name="play" size={18} color="#2CC0B7" />
                  </View>
                </View>

                <View className="p-3">
                  <Text
                    numberOfLines={2}
                    className="
            font-bold
            text-primaryColor
            text-[13px]
            leading-4
            "
                  >
                    {item.title}
                  </Text>

                  <View className="flex-row mt-3 items-center">
                    <Image
                      source={{
                        uri: "https://i.pravatar.cc/100",
                      }}
                      className="
              w-8
              h-8
              rounded-full
              "
                    />

                    <View className="ml-2 flex-1">
                      <Text
                        numberOfLines={1}
                        className="
                text-xs
                font-semibold
                "
                      >
                        {item.author}
                      </Text>

                      <Text className="text-[10px] text-gray-400">
                        Matemática
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* EDUCADORES */}

        <View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-2xl font-bold">Educadores em alta</Text>

            <Text className="text-primaryColor">Ver todos</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {educators.map((item, index) => (
              <View
                key={index}
                className="
bg-white
rounded-[28px]
mr-4
w-[180px]
p-4
"
              >
                <View className="items-center">
                  <Image
                    source={{
                      uri: "https://i.pravatar.cc/150",
                    }}
                    className="
w-20
h-20
rounded-full
"
                  />

                  <Text
                    numberOfLines={1}
                    className="
font-bold
mt-3
"
                  >
                    {item.name}
                  </Text>

                  <Text className="text-gray-400">Professor</Text>

                  <View
                    className="
flex-row
items-center
mt-3
"
                  >
                    <Text
                      className="
text-primaryColor
text-3xl
font-bold
"
                    >
                      {item.followers}
                    </Text>

                    <Ionicons name="trending-up" size={18} color="#2CC0B7" />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
