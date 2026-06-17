import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  title: string; 
}

export function Input({ title, ...rest }: InputProps) {
  return (
    <View className="mb-6">
              <Text className="text-gray-500 text-lg mb-2">{title}</Text>
              <TextInput 
                {...rest}
                className="border border-gray-200 p-4 rounded-xl text-lg text-black bg-white"
              />
            </View>
  );
}