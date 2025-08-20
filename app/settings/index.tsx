import { useSoundStore } from '@/store/useSoundStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

type Props = {}

const Settings = (props: Props) => {
  const router = useRouter();
  const isSoundOn = useSoundStore((s) => s.isSoundOn);
  const toggleSound = useSoundStore((s) => s.toggleSound);
  const stopMusic = useSoundStore((s) => s.stopMusic);
  const playMusic = useSoundStore((s) => s.playMusic);

  const handleToggle = () => {
    toggleSound();
    if (isSoundOn) {
      stopMusic();
    } else {
      playMusic();
    }
  };

  return (
    <View>
  
      <View style={styles.settingItem}>
         <Text style={styles.txt}>Sound</Text>
         <Switch value={isSoundOn} onValueChange={handleToggle} />
      </View>
      
      <Pressable style={styles.settingItem} onPress={()=>router.push('/settings/howToPlay')}>
        <Text style={styles.txt}>How to Play</Text>
        <Ionicons name="help-circle" color={'#007AFF'} size={30}/>
      </Pressable>
    
    </View>
  )
}

export default Settings;

const styles = StyleSheet.create({
  settingItem:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  txt:{
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  }
})