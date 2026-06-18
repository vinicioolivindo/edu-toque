import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function Button({ title, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="bg-primaryColor p-5 rounded-2xl w-full items-center mb-8 shadow-sm"
      {...rest}
    >
      <Text className="text-white font-bold text-xl">
        {title}
      </Text>
    </TouchableOpacity>
  );
}