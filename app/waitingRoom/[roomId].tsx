// app/lobby/[roomId].tsx
import ActionButton from '@/components/ui/ActionButton';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import uuid from 'react-native-uuid';
import { supabase } from '../../lib/supabase';
import { usePlayerStore } from '../../store/usePlayerStore';
import { startHeartbeatAndCleanup } from '../../utils/heartbeat';


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
  const hasHydrated = usePlayerStore.persist.hasHydrated; 
 
  // Assign a temporary userId if not already present
  if (!userId) {
    const tempId = uuid.v4();
    setUserId(tempId);
  }

   /*
   * Fetches room details using the room code (from URL),
   * fetches players in that room,
   * sets the current player as host if applicable.
   */
  const fetchPlayers = useCallback(async (roomUuid?: string): Promise<Room|null> => {
      // First get the room using the code
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomId)
        .single();

      if (roomError) {
        Alert.alert('Error', 'Room not found');
        router.replace('/');
        return null;
      }
      setRoom(roomData);

      // Then get players using the room's UUID
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomData.id);

      if (playersError) {
        Alert.alert('Error', playersError.message);
        return null;
      }

      setPlayers(players);
      setLoading(false);

      const host = players.find((p) => p.is_host && p.user_id === userId);
      setIsHost(!!host);

      return roomData;
    },[]);

    /**
   * Initializes real-time Supabase subscriptions for:
   * - `players`: watch for join/leave
   * - `rooms`: watch for room status updates
   * Fetches players again whenever changes are detected.
   */
 const initSubscriptions = (roomCode: string, roomUUID: string) => {
  const channel = supabase
    .channel(`lobby:${roomCode}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'players',
      },
      (payload: RealtimePostgresChangesPayload<any>) => {
        const changedPlayer = payload.new || payload.old;
        if (changedPlayer?.room_id === roomUUID) {
          console.log('Realtime: player change in this room');
          fetchPlayers(roomUUID); // Refetches players
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `code=eq.${roomCode}`, // still OK for small usage
      },
      (payload) => {
        if (payload.eventType === 'UPDATE') {
          setRoom(payload.new as Room);
        }
      }
    )
    .subscribe();

    // Return unsubscribe cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};

  /**
   * Loads room and player data, then subscribes to real-time updates.
   */
  useEffect(() => {
    if (!userId || !roomId) return;

    let unsubscribe: () => void;

    const load = async () => {
      const roomData = await fetchPlayers(); // assumed to return roomData
      if (roomData?.id) {
        unsubscribe = initSubscriptions(roomId.toString(), roomData.id);
      }
    };

    load();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, roomId]);

  /**
   * Starts (heartbeat or live update) and cleanup loop once the room and userId are ready.
   * This keeps the user "alive" and removes inactive players (if host).
   */
  useEffect(() => {
    if (room?.id && userId) {
      const cleanup = startHeartbeatAndCleanup(room.id, userId, isHost);
      return cleanup;
    }
  }, [room?.id, userId, isHost]);

  


  const handleStartGame = async () => {
    // Optional: select category before this
    const { error } = await supabase
      .from('rooms')
      .update({ status: 'in_progress' })
      .eq('code', roomId);

    if (!error) {
      router.push(`/category`);
    }
  };


  const handleLeaveRoom = async () => {
    await supabase.from('players').delete().eq('id', userId);
    router.replace('/teamMode');
  };

  if (!hasHydrated && loading){
    return (
      <View style={{alignItems:'center', justifyContent:'center'}}>
        <ActivityIndicator size={'large'} color={'#007AFF'}/>
      </View>
    );
  } 

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