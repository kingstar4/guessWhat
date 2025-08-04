import ActionButton from '@/components/ui/ActionButtion';
import TextField from '@/components/ui/TextField';
import { supabase } from '@/lib/supabase';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import uuid from 'react-native-uuid';

const JoinGameScreen = () => {
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const router = useRouter()

  const handleJoinGame = async () => {
    if (!roomCode || !playerName) {
      Alert.alert('Error', 'Please enter both room code and player name.')
      return
    }

    // Check if room exists
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', roomCode.toUpperCase())
      .single()

    if (roomError || !room) {
      Alert.alert('Error', 'Room not found.')
      return
    }

    const userId = uuid.v4()

    // Insert player
    const { error: playerError } = await supabase.from('players').insert({
      user_id: userId,
      name: playerName,
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
      name: playerName,
      roomId: room.id,
      teamId: null,
      isHost: false,
    })

    // Navigate to lobby
    router.push(`/waitingRoom/${roomCode}`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Game</Text>

      <TextField
        placeHolder="Enter Team Room Code"
        value={roomCode}
        onChangeText={setRoomCode}
      />

      <TextField
        placeHolder="Enter Your Name"
        value={playerName}
        onChangeText={setPlayerName}
      />

      <ActionButton title="Join" onPress={handleJoinGame} />
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
  },
})
