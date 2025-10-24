import { useCallback } from "react";

function useSoundPlayer() {
  const playSound = useCallback((soundUrl) => {
    const audio = new Audio(soundUrl);
    audio.play().catch((e) => {
      console.warn("Audio playback failed:", e);
    });
  }, []);

  return playSound;
}

export default useSoundPlayer;
