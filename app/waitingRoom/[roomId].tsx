// app/lobby/[roomId].tsx
import ActionButton from '@/components/ui/ActionButtion';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import uuid from 'react-native-uuid';
import { supabase } from '../../lib/supabase';
import { usePlayerStore } from '../../store/usePlayerStore';

interface Player {
  id: string;
  name: string;
  is_host: boolean;
  room_id: string;
}

interface Room {
  id: string;
  code: string;
  team_name: string;
  mode: string;
  started: boolean;
}

export default function LobbyScreen() {
  const { roomId } = useLocalSearchParams();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);

  const { userId, setUserId } = usePlayerStore();

  useEffect(() => {
    if (!userId) {
      const tempId = uuid.v4();
      setUserId(tempId);
    }
  }, [userId, setUserId]);

  // Fetch room and player info
  useEffect(() => {
    const fetchPlayers = async () => {
      // First get the room using the code
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomId)
        .single();

      if (roomError) {
        Alert.alert('Error', 'Room not found');
        router.replace('/');
        return;
      }

      setRoom(roomData);

      // Then get players using the room's UUID
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomData.id);

      if (playersError) {
        Alert.alert('Error', playersError.message);
        return;
      }

      setPlayers(players);
      setLoading(false);

      const host = players.find((p) => p.is_host && p.user_id === userId);
      setIsHost(!!host);
    };

    fetchPlayers();

    // Subscribe to real-time player updates
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        () => fetchPlayers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, userId, router]);

  const handleStartGame = async () => {
    // Optional: select category before this
    const { error } = await supabase
      .from('rooms')
      .update({ status: 'in_progress' })
      .eq('id', roomId);

    if (!error) {
      // TODO: Create a game route before enabling this navigation
      Alert.alert('Game started', 'Game route needs to be created');
      // router.push({
      //   pathname: '/game/[roomId]',
      //   params: { roomId }
      // });
    }
  };

  const handleLeaveRoom = async () => {
    await supabase.from('players').delete().eq('id', userId);
    router.replace('/');
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.teamName}>{room?.team_name}</Text>
        <Text style={styles.roomCode}>Room Code: {roomId}</Text>
      </View>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerItem}>
            <Text>{item.name} {item.is_host ? '(Host)' : ''}</Text>
          </View>
        )}
      />

      {isHost && (
        <ActionButton title="Start Game" onPress={handleStartGame} />
      )}

      <ActionButton title="Leave Room" onPress={handleLeaveRoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    padding: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap:20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roomCode: {
    fontSize: 16,
    color: '#666',
  },
  playerItem: {
    padding: 10,
    width: 300,
    height: 50,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9', 
    borderRadius: 8,
  },
});