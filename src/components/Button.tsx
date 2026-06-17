import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  title: string; 
}


export default function Button({ title, ...rest }: InputProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} className="bg-primaryColor p-5 rounded-2xl w-full items-center mb-8 shadow-sm">
    <Text className="text-white font-bold text-xl">{title}</Text>
  </TouchableOpacity>
  );
}
