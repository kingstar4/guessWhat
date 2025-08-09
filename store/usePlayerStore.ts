
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Role = 'describer' | 'guesser' | 'spectator'

interface PlayerState {
  userId: string | null
  name: string
  roomId: string | null
  teamId: string | null
  role: Role
  isHost: boolean

  setPlayer: (data: Partial<Omit<PlayerState, 'setPlayer' | 'setRole' | 'clearPlayer'>>) => void
  setRole: (role: Role) => void
  clearPlayer: () => void
  setUserId: (userId: string) => void
  setName: (name: string) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist<PlayerState>(
    (set) => ({
      userId: null,
      name: '',
      roomId: null,
      teamId: null,
      role: 'spectator',
      isHost: false,

      setPlayer: (data) => set((state) => ({ ...state, ...data })),
      setRole: (role) => set(() => ({ role })),
      setUserId: (userId) => set(() => ({ userId })),
      setName: (name) => set(() => ({ name })),
      clearPlayer: () =>
        set(() => ({
          userId: null,
          name: '',
          roomId: null,
          teamId: null,
          role: 'spectator',
          isHost: false,
        })),
    }),
    {
      name: 'player-store',
      storage: createJSONStorage(()=> AsyncStorage),
    }
  )
)
