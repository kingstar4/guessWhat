import ActionButton from '@/components/ui/ActionButton';
import TextField from '@/components/ui/TextField';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import uuid from 'react-native-uuid';
import { supabase } from '../lib/supabase';



type Props = {}

const CreateTeamScreen = (props: Props) => {
  const [teamName, setTeamName] = useState('');
  const [hostName, setHostName] = useState('');
  const [roomCode] = useState(() => uuid.v4().slice(0, 6).toUpperCase());
  const [roomId] = useState(() => uuid.v4()); // Store roomId in state so it doesn't change
  const router = useRouter()
  const validForm = teamName.trim() !== '' && hostName.trim() !== '';
   const hasHydrated = usePlayerStore.persist.hasHydrated; 

  const handleCreateTeam = async () => {
    if (!teamName || !hostName) {
      alert('Please enter both team and player name.')
      return
    }

    const userId = uuid.v4() // Generate UUID for the user

    //  Save to Supabase
    const { error: roomError } = await supabase.from('rooms').insert({
      id: roomId, // Using the stored UUID
      code: roomCode,
      team_name: teamName,
      host_id: userId,
      mode: 'team',
      started: false
    })

    const { error: playerError } = await supabase.from('players').insert({
      user_id: userId,
      name: hostName,
      room_id: roomId, // Using roomId (UUID) instead of roomCode
      team_id: teamName, // default team
      is_host: true,
    })

    if (roomError || playerError) {
      console.error(roomError || playerError)
      alert('Failed to create room or player.')
      return
    }

    // Save to Zustand
    usePlayerStore.getState().setPlayer({
      userId,
      name: hostName,
      roomId,
      teamId: teamName,
      isHost: true,
    })

    // Navigate to Lobby
    router.push(`/waitingRoom/${roomCode}`);
}
if (!hasHydrated){
    return (
      <View style={{alignItems:'center', justifyContent:'center'}}>
        <ActivityIndicator size={'large'} color={'#007AFF'}/>
      </View>
    );
  } 
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.txt}>Create Team</Text>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.codeContainer}>
            <Text>Team Room Code</Text>
            <Text>{roomCode}</Text>
        </View>
        <TextField placeHolder="Team's Name" value={teamName} onChangeText={setTeamName} />
        <TextField placeHolder="Host Player's Name" value={hostName} onChangeText={setHostName} />

        <ActionButton title='Create Team' onPress={handleCreateTeam} disabled={!validForm}  buttonStyle={{opacity: validForm ? 1 : 0.5}}/>
      </View>
    </View>
  )
}

export default CreateTeamScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
    gap:40,
  },
  title:{
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  codeContainer:{
    flexDirection:'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  bodyContainer:{
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    // gap: 10,
  }
})