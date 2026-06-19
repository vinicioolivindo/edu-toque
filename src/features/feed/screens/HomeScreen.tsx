import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/assets/svg/logov2.svg'

export default function HomeScreen() {
  const categories = Array(8).fill({ name: 'Matemática' });
  const videos = Array(3).fill({ title: 'Dicas de mátematica', author: 'Ajay Kumar' });
  const educators = Array(3).fill({ name: 'Brooklyn Simmons', period: 'Última semana', followers: '2.4K' });

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false} className=" px-5">
        
        {/* HEADER */}
        <View className="flex-row justify-between items-center mt-4 mb-6">
          <View>
            <Text className="text-4xl font-bold text-black">Bem Vindo!</Text>
          </View>
          <View className="flex-row items-center gap-2">
             <Logo/>
             <Text className="text-xl font-bold text-primaryColor">EduToque</Text>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-8 shadow-sm">
          <TextInput 
            placeholder="Pesquisar..." 
            className="flex-1 text-lg"
            placeholderTextColor="#94A3B8"
          />
          <Ionicons name="search" size={24} color="black" />
        </View>

        {/* CATEGORIAS GRID */}
        <View>
          <Text className="text-2xl font-bold mb-4">Categorias</Text>
          <View className="flex-row flex-wrap justify-between">
            {categories.map((item, index) => (
              <TouchableOpacity key={index} className="w-[23%] bg-primaryColor h-20 rounded-2xl items-center justify-center mb-3">
                <Ionicons name="calculator" size={24} color="white" />
                <Text className="text-white text-[10px] mt-1 font-bold">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* VÍDEOS EM ALTA (Horizontal Scroll) */}
        <View className="mb-8">
          <Text className="text-2xl font-bold mb-4">Vídeos em Alta</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {videos.map((item, index) => (
              <View
                key={index}
                className="w-48 mr-4 bg-white rounded-3xl p-3 shadow-sm"
              >
                <View className="w-full aspect-[4/3] bg-[#C1E1DE] rounded-2xl items-center justify-center mb-3 overflow-hidden">
                  <Ionicons name="play" size={40} color="white" />
                </View>
                <Text className="font-bold text-base leading-5 text-primaryColor" numberOfLines={2}>
                  {item.title}
                </Text>
                <View className="flex-row items-center mt-3 gap-2">
                   <Image 
                    source={{ uri: 'https://i.pravatar.cc/100' }} 
                    className="w-8 h-8 rounded-full border-2 border-orange-400" 
                   />
                   <View>
                     <Text className="text-sm font-bold text-black">{item.author}</Text>
                     <Text className="text-xs text-gray-400">Matemática</Text>
                   </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* EDUCADORES EM ALTA */}
        <View className="mb-20">
          <Text className="text-2xl font-bold mb-4">Educadores em Alta</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {educators.map((item, index) => (
              <View
                key={index}
                className="bg-white border-2 border-primaryColor p-4 rounded-[30px] items-center mr-4 w-44"
              >
                <Image 
                  source={{ uri: 'https://i.pravatar.cc/150' }} 
                  className="w-20 h-20 rounded-full border-2 border-secondaryColor mb-3" 
                />
                <Text className="font-bold text-center text-base leading-5 text-black" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-gray-400 text-xs mb-2">{item.period}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-2xl font-bold text-gray-800">{item.followers}</Text>
                  <Ionicons name="arrow-up" size={22} color="#2CC0B7" />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}