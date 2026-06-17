import { View, Text, TouchableOpacity } from 'react-native';

export function StudioScreen() {
  return (
    <View className="flex-1 bg-gray-50 items-center justify-center p-6">
      <Text className="text-3xl font-bold text-academicBlue mb-6">Creator Studio</Text>
      <TouchableOpacity activeOpacity={0.8} className="bg-eduOrange p-4 rounded-xl shadow-md w-full items-center">
        <Text className="text-white font-bold text-lg">Publicar Vídeo</Text>
      </TouchableOpacity>
    </View>
  );
}