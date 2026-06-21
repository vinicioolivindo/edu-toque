import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/assets/svg/logov2.svg';
import { useRouter } from 'expo-router';

export function EducatorDashboard() {

  const router = useRouter()

  const chartData = [
    { day: 'dom', value: 45 },
    { day: 'seg', value: 28 },
    { day: 'ter', value: 60 },
    { day: 'qua', value: 90, peak: true },
    { day: 'qui', value: 55 },
    { day: 'sex', value: 22 },
    { day: 'sáb', value: 15 },
  ];

  const metrics = [
    ['heart', '30K'],
    ['chatbubble', '100'],
    ['arrow-redo', '100'],
    ['bookmark', '200'],
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FC]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}
        <View className="flex-row justify-between items-center mb-8">

          <View>
            <Text className="text-gray-500 text-base">
              Olá professor 👋
            </Text>

            <Text className="text-[34px] font-extrabold text-secondaryColor">
              Bem-vindo
            </Text>
          </View>

          <TouchableOpacity className="flex-row items-center gap-2"  onPress={() => router.push('/feed')}>
            <Logo width={34} height={34} />
            <Text className="font-bold text-primaryColor text-lg">
              EduToque
            </Text>
            </TouchableOpacity>

        </View>

        {/* ÚLTIMO VÍDEO */}

        <Text className="text-2xl font-bold mb-4">
          Último vídeo
        </Text>

        <View className="bg-white rounded-[32px] p-5 shadow-sm mb-8">
          <View className="flex-row">
            <View className="w-28 h-28 rounded-3xl bg-[#D9F3F0] items-center justify-center">
              <Ionicons
                name="play"
                size={34}
                color="#2CC0B7"
              />
            </View>

            <View className="flex-1 ml-4">

              <Text className="text-primaryColor font-bold text-lg">
                Dicas de matemática
              </Text>

              <Text className="text-gray-400 mt-1">
                Últimos 7 dias
              </Text>

              <View className="flex-row items-end mt-3">

                <Text className="text-4xl font-extrabold text-secondaryColor">
                  2.4K
                </Text>

                <Ionicons
                  name="trending-up"
                  size={20}
                  color="#2CC0B7"
                />

              </View>

            </View>

          </View>

          <View className="flex-row justify-between mt-5">

            {metrics.map(([icon, value]) => (
              <View
              key={value}
                className="bg-[#F3F6FA] rounded-2xl px-4 py-3 items-center w-[22%]"
              >
                <Ionicons
                  name={icon}
                  size={18}
                  color="#2CC0B7"
                />

                <Text className="font-bold mt-1">
                  {value}
                </Text>

              </View>
            ))}

          </View>

        </View>

        {/* DESEMPENHO */}

        <Text className="text-2xl font-bold mb-4">
          Desempenho semanal
        </Text>

        <View className="bg-primaryColor rounded-[34px] p-6">

          <View className="flex-row gap-3 mb-8">

            <MetricCard
              title="Visualizações"
              value="27.4K"
              positive
            />

            <MetricCard
              title="Seguidores"
              value="200"
            />

          </View>

          <View className="h-52 flex-row items-end justify-between">

            {chartData.map((item) => (
              <View
                key={item.day}
                className="items-center"
              >

                <View
                  style={{
                    height: item.value,
                  }}
                  className={`
                    w-9 rounded-t-2xl
                    ${item.peak ? 'bg-white' : 'bg-secondaryColor'}
                  `}
                />

                <Text className="text-white mt-3 font-semibold">
                  {item.day}
                </Text>

              </View>
            ))}

          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  title,
  value,
  positive,
}) {
  return (
    <View className="flex-1 bg-white rounded-3xl p-4">

      <Text className="text-primaryColor font-semibold text-xs">
        {title}
      </Text>

      <View className="flex-row items-center mt-3">

        <Text className="text-3xl font-bold">
          {value}
        </Text>
        <Ionicons
          name={
            positive
              ? 'trending-up'
              : 'trending-down'
          }
          size={16}
          color={
            positive
              ? '#2CC0B7'
              : '#EF4444'
          }
        />
      </View>
    </View>
  );
}