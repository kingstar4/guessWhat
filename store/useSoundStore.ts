// store/useSoundStore.ts
import type { AudioPlayer } from "expo-audio";
import { createAudioPlayer } from "expo-audio";
import { create } from "zustand";

type SoundState = {
  isSoundOn: boolean;
  toggleSound: () => void;
  playMusic: () => void;
  stopMusic: () => void;
  playEffect: (effect: "click" | "success" | "wrong" | "timeup") => void;
};

export const useSoundStore = create<SoundState>((set, get) => {
  let backgroundPlayer: AudioPlayer | null = null;

  return {
    isSoundOn: true,

    toggleSound: () => set((s) => ({ isSoundOn: !s.isSoundOn })),

    playMusic: () => {
      if (!get().isSoundOn) return;

      if (backgroundPlayer) {
        backgroundPlayer.play();
        return;
      }

      backgroundPlayer = createAudioPlayer(
        require("../assets/audio/gamesound.mp3")
      );
      backgroundPlayer.loop = true;
      backgroundPlayer.play();
    },

    stopMusic: () => {
      if (backgroundPlayer) {
        backgroundPlayer.pause();
      }
    },

    playEffect: (effect) => {
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

      const player = createAudioPlayer(file);
      player.play();
      // Auto-cleanup when finished - player will be garbage collected
    },
  };
});
