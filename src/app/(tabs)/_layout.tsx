import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useAuth } from '@/src/contexts/AuthContext';

const NAVY = '#0C1338';
const TEAL = '#05ADA7';
const WHITE = '#FFFFFF';
const INACTIVE = '#FFFFFF';

// Paths
const OUTER_PATH = 'M11.7746 0.470556C10.8116 0.724338 9.50125 1.16904 8.86006 1.46241C8.21887 1.75344 7.11603 2.41467 6.41189 2.93155C5.70774 3.44843 4.6049 4.44261 3.96371 5.13876C3.32252 5.83725 2.4132 7.13643 1.94455 8.02816C1.4759 8.9199 0.84637 10.4356 0.545596 11.3949C0.183965 12.5523 0.000346628 13.7938 0.00101275 15.0064C0.0310298 69.6493 0.0648284 71.954 0.438341 73.4436C0.662176 74.34 1.18911 75.8068 1.6088 76.7032C2.02849 77.5996 2.93781 79.0361 3.63263 79.8929C4.32744 80.7521 5.5795 82 6.41189 82.6683C7.24427 83.3365 8.66187 84.2212 9.55954 84.6357C10.4572 85.0524 11.8212 85.5809 12.5906 85.8138C13.6631 86.1397 14.7776 86.2398 17.3704 86.2422C19.8535 86.2468 21.1522 86.1397 22.2667 85.8417C23.1271 85.6135 26.7061 83.9581 30.5439 82.014C34.2628 80.1304 47.4829 73.4832 59.922 67.2434C75.0144 59.6741 83.0421 55.5205 84.054 54.7615C84.8887 54.1375 86.0708 53.0036 86.684 52.2423C87.2972 51.4809 88.2042 50.0746 88.7032 49.113C89.2022 48.1538 89.855 46.6334 90.1535 45.737C90.6338 44.3005 90.6991 43.6672 90.6991 40.382C90.6991 37.127 90.6291 36.4355 90.1535 34.9105C89.8527 33.9513 89.1975 32.3797 88.6962 31.4181C88.1949 30.4588 87.2879 29.0549 86.677 28.2982C86.0685 27.5438 84.8887 26.4169 84.054 25.7953C82.8672 24.9082 81.3773 24.2074 77.1758 22.5497C74.2263 21.3879 70.4492 19.9047 68.7821 19.2551C67.115 18.6056 60.6098 16.0444 54.3262 13.5648C48.0425 11.0829 40.8029 8.22374 38.2382 7.21094C35.6734 6.19813 31.0056 4.35879 27.8626 3.1248C24.7196 1.89081 21.3108 0.682431 20.2849 0.435633C19.0328 0.135286 17.6152 -0.00673914 15.9714 0.000245422C14.3113 0.00722999 12.959 0.160894 11.7746 0.470556Z';

const MIDDLE_PATH = 'M15.648 16.4255C14.7772 16.655 13.5922 17.0572 13.0123 17.3225C12.4325 17.5857 11.4352 18.1836 10.7984 18.6511C10.1616 19.1185 9.16431 20.0175 8.58447 20.6471C8.00463 21.2788 7.18231 22.4536 6.7585 23.26C6.33469 24.0665 5.76539 25.4371 5.49339 26.3046C5.16636 27.3513 5.00031 28.474 5.00092 29.5706C5.02806 78.9854 5.05863 81.0695 5.3964 82.4166C5.59882 83.2273 6.07534 84.5537 6.45488 85.3644C6.83441 86.175 7.65673 87.4741 8.28506 88.2489C8.9134 89.0259 10.0457 90.1544 10.7984 90.7587C11.5511 91.363 12.8331 92.1631 13.6449 92.5379C14.4567 92.9147 15.6902 93.3927 16.386 93.6033C17.3559 93.898 18.3637 93.9886 20.7084 93.9907C22.954 93.9949 24.1284 93.898 25.1363 93.6285C25.9143 93.4222 29.1509 91.9252 32.6215 90.1671C35.9846 88.4637 47.9398 82.4524 59.1888 76.8097C72.8372 69.9646 80.0968 66.2084 81.0119 65.522C81.7667 64.9577 82.8336 63.9323 83.3903 63.2438C83.9448 62.5553 84.765 61.2836 85.2162 60.414C85.6675 59.5465 86.2578 58.1716 86.5277 57.361C86.9621 56.0619 87.0211 55.4892 87.0211 52.5183C87.0211 49.5748 86.9579 48.9495 86.5277 47.5703C86.2557 46.7029 85.6632 45.2816 85.2099 44.4121C84.7566 43.5446 83.9364 42.275 83.3839 41.5907C82.8336 40.9085 81.7667 39.8894 81.0119 39.3272C79.9386 38.525 78.5913 37.8913 74.7917 36.3922C72.1245 35.3415 68.7087 34.0003 67.2011 33.4128C65.6935 32.8254 59.8108 30.5093 54.1283 28.267C48.4459 26.0225 41.899 23.4369 39.5796 22.521C37.2602 21.6051 33.039 19.9418 30.1967 18.8258C27.3544 17.7099 24.2718 16.6171 23.3441 16.394C22.2118 16.1223 20.9298 15.9939 19.4433 16.0002C17.942 16.0065 16.7191 16.1455 15.648 16.4255Z';

const PLAY_PATH = 'M30.502 37.0493C30.874 36.6636 31.5086 36.1703 31.9121 35.9532C32.3975 35.694 33.0951 35.5549 33.9609 35.5486C34.8477 35.5422 35.5307 35.6708 36.0623 35.9385C36.4952 36.1577 38.4579 37.2811 40.4227 38.4341C42.3875 39.5849 46.3591 41.9308 49.2485 43.6423C52.1379 45.3559 55.6367 47.4257 57.0236 48.2435C58.4106 49.0613 59.8143 49.9761 60.1421 50.2754C60.4699 50.5747 60.9385 51.2007 61.1802 51.6644C61.5059 52.2862 61.6215 52.8932 61.6215 53.9829C61.6215 55.0726 61.5059 55.6796 61.1802 56.3014C60.9385 56.7651 60.4699 57.3953 60.1421 57.7031C59.8143 58.0108 56.8492 59.8993 53.5564 61.8996C50.2635 63.8998 44.9197 67.1352 41.6835 69.0933C38.3822 71.0872 35.476 72.7039 35.0641 72.7755C34.6607 72.8451 33.8558 72.8493 33.278 72.7861C32.5908 72.7102 31.9352 72.4594 31.3867 72.0631C30.9244 71.728 30.3297 71.1294 30.0649 70.7289C29.8002 70.3285 29.4934 69.6687 29.382 69.264C29.2643 68.832 29.1803 62.5572 29.1761 54.0883C29.1718 41.5219 29.2139 39.528 29.4997 38.7017C29.6804 38.179 30.1322 37.4371 30.502 37.0493Z';

// Path do Ícone de "+", centralizado na mesma proporção do botão de Play
const PLUS_PATH = 'M20 0.5C20.6252 0.5 21.2249 0.74838 21.667 1.19043C22.109 1.63247 22.3574 2.23233 22.3574 2.85742V17.6426H37.1426C37.7677 17.6426 38.3675 17.891 38.8096 18.333C39.2516 18.7751 39.5 19.3748 39.5 20C39.5 20.6252 39.2516 21.2249 38.8096 21.667C38.3675 22.109 37.7677 22.3574 37.1426 22.3574H22.3574V37.1426C22.3574 37.7677 22.109 38.3675 21.667 38.8096C21.2249 39.2516 20.6252 39.5 20 39.5C19.3748 39.5 18.7751 39.2516 18.333 38.8096C17.891 38.3675 17.6426 37.7677 17.6426 37.1426V22.3574H2.85742C2.23233 22.3574 1.63247 22.109 1.19043 21.667C0.74838 21.2249 0.5 20.6252 0.5 20C0.500001 19.3748 0.74838 18.7751 1.19043 18.333C1.63247 17.891 2.23234 17.6426 2.85742 17.6426H17.6426V2.85742C17.6426 2.23234 17.891 1.63247 18.333 1.19043C18.7751 0.74838 19.3748 0.5 20 0.5Z';

/**
 * Adicionamos a prop `isPlus` para definir se renderizamos o triângulo de Play ou a cruz de Mais
 */
function CentralTabButton({ onPress, accessibilityState, style, isPlus }) {
  const [pressed, setPressed] = useState(false);

  const selected = !!accessibilityState?.selected;
  const outerColor = selected ? TEAL : NAVY;
  const middleColor = selected ? NAVY : WHITE;
  const iconColor = selected ? WHITE : TEAL;

  // Decide qual path interno usar
  const INNER_PATH = isPlus ? PLUS_PATH : PLAY_PATH;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      android_ripple={{ color: 'transparent' }}
      style={[
        style,
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <View
        style={{
          width: 70,
          height: 72,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [
            { translateY: -34 }, 
            { scale: pressed ? 0.94 : 1 },
          ],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Svg width={64} height={66} viewBox="0 0 91 94">
          <Path d={OUTER_PATH} fill={outerColor} />
          <Path d={MIDDLE_PATH} fill={middleColor} />
          
          {/* A tag G agrupa elementos. Se for o ícone de Plus, empurramos ele 25.5px para a direita e 27px para baixo! */}
          <G transform={isPlus ? "translate(20, 33)" : ""}>
            <Path 
              d={INNER_PATH} 
              fill={iconColor} 
              stroke={iconColor} 
              strokeWidth={isPlus ? 2 : 0} 
              strokeLinejoin="round" 
            />
          </G>

        </Svg>
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const { userType } = useAuth();
  const isEducator = userType === 'educador';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TEAL,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: NAVY,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          borderTopWidth: 0,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          position: 'absolute',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={26} color={color} />
          ),
        }}
      />

      {/* ROTA DO ESTUDANTE (FEED) */}
      <Tabs.Screen
        name="feed"
        options={{
          title: '',
          // A MÁGICA ACONTECE AQUI:
          // Se for educador, injetamos o { href: null }. Se for estudante, injetamos o botão costumizado.
          // Assim o Expo Router ignora a existência visual dessa aba, não deixando nenhum buraco!
          ...(isEducator 
            ? { href: null } 
            : { tabBarButton: (props) => <CentralTabButton {...props} isPlus={false} /> }
          )
        }}
      />

      {/* ROTA DO EDUCADOR (STUDIO) */}
      <Tabs.Screen
        name="studio"
        options={{
          title: '',
          // Mesma lógica, mas invertida
          ...(!isEducator 
            ? { href: null } 
            : { tabBarButton: (props) => <CentralTabButton {...props} isPlus={true} /> }
          )
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 