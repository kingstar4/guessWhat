import { colors } from '@/constants/designTokens';
import { useSoundStore } from '@/store/useSoundStore';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';



const SettingsButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const playEffect = useSoundStore((s) => s.playEffect);

  // Function to handle button press
  const handlePress = () => {
    router.push('/settings');
    playEffect('click');
  }

  // Hide the settings button when on settings screens
  if (pathname.startsWith('/settings') || pathname.startsWith('/gameRoom')) {
    return null;
  }

  return (
    <View>
      <Pressable style={styles.btn} onPress={handlePress}>
        <Ionicons name='settings' size={30} color={'#fff'} />
      </Pressable>
    </View>
  )
}

export default SettingsButton;

const styles = StyleSheet.create({
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 200,
    right: 10,
    zIndex: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  }
})