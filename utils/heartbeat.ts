import { supabase } from '../lib/supabase';
export function startHeartbeatAndCleanup (roomId: string, userId: string, isHost: boolean){
  // Heartbeat
  const updateLastSeen = async () => {
    await supabase
      .from('players')
      .update({ last_seen: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('room_id', roomId);
  };

  updateLastSeen(); // Immediately update

  const heartbeatInterval = setInterval(updateLastSeen, 30000);

  // Host-only cleanup
  let cleanupInterval: number;
  if (isHost) {
    cleanupInterval = setInterval(async () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from('players')
        .delete()
        .eq('room_id', roomId)
        .lt('last_seen', fiveMinutesAgo)
        .eq('is_host', false);

      if (error) {
        console.error('Error cleaning up inactive players:', error);
      }
    }, 60000);
  }

  // Return cleanup
  return () => {
    clearInterval(heartbeatInterval);
    if (isHost && cleanupInterval) clearInterval(cleanupInterval);
  };
};
