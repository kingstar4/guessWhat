// store/useSoundStore.ts
import { Audio } from "expo-av";
import { create } from "zustand";

type SoundState = {
  isSoundOn: boolean;
  toggleSound: () => void;
  playMusic: () => Promise<void>;
  stopMusic: () => Promise<void>;
  playEffect: (effect: "click" | "success" | "wrong" | "timeup") => Promise<void>;
};

export const useSoundStore = create<SoundState>((set, get) => {
  let backgroundSound: Audio.Sound | null = null;

  return {
    isSoundOn: true,

    toggleSound: () => set((s) => ({ isSoundOn: !s.isSoundOn })),

    playMusic: async () => {
      if (!get().isSoundOn) return;

      if (backgroundSound) {
        await backgroundSound.replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../assets/audio/gamesound.mp3"), 
        { isLooping: true }
      );
      backgroundSound = sound;
      await sound.playAsync();
    },

    stopMusic: async () => {
      if (backgroundSound) {
        await backgroundSound.stopAsync();
      }
    },

    playEffect: async (effect) => {
      if (!get().isSoundOn) return;

      let file;
      switch (effect) {
        case "click":
          file = require("../assets/audio/mouseclick.mp3");
          break;
        case "success":
          file = require("../assets/audio/success.mp3");
          break;
        case "wrong":
          file = require("../assets/audio/wrong.mp3");
          break;
        case "timeup":
          file = require("../assets/audio/timeup.mp3");
          break;
      }

      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
      // unload after play
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    },
  };
});
