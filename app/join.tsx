import ActionButton from '@/components/ui/ActionButton';
import TextField from '@/components/ui/TextField';
import { usePortraitLock } from '@/hooks/usePortrait';
import { useValidateForm } from '@/hooks/useValidateForm';
import { supabase } from '@/lib/supabase';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import uuid from 'react-native-uuid';

const JoinGameScreen = () => {
  usePortraitLock();
  
  // const [roomCode, setRoomCode] = useState('')
  // const [playerName, setPlayerName] = useState('')

  const [form, setForm]= useState({
    roomCode:'',
    playerName: '',
  })
  const validForm = useValidateForm(form)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  
 const router = useRouter()

  const handleJoinGame = async () => {
    if (!form.roomCode || !form.playerName) {
      Alert.alert('Error', 'Please enter both room code and player name.')
      return
    }

    // Check if room exists
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', form.roomCode.toUpperCase())
      .single()

    if (roomError || !room) {
      Alert.alert('Error', 'Room not found.')
      return
    }

    const userId = uuid.v4()

    // Insert player
    const { error: playerError } = await supabase.from('players').insert({
      user_id: userId,
      name: form.playerName,
      room_id: room.id,
      team_id: null, // will be assigned in lobby
      is_host: false,
    })

    if (playerError) {
      Alert.alert('Error', 'Failed to join room.')
      console.error(playerError)
      return
    }

    // Save to Zustand
    usePlayerStore.getState().setPlayer({
      userId,
      name: form.playerName,
      roomId: room.id,
      teamId: null,
      isHost: false,
    })

    // Navigate to lobby
    router.push(`/waitingRoom/${form.roomCode}`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Team</Text>

      <TextField
        placeHolder="Enter Team Room Code"
        value={form.roomCode}
        onChangeText={(text)=>handleChange('roomCode', text)}
      />

      <TextField
        placeHolder="Enter Your Name"
        value={form.playerName}
        onChangeText={(text)=>handleChange('playerName', text)}
      />

      <ActionButton title="Join" onPress={handleJoinGame} disabled={!validForm} buttonStyle={{opacity: validForm ? 1 : 0.5}}/>
    </View>
  )
}

export default JoinGameScreen

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
})
