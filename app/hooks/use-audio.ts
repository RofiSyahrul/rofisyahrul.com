import { useCallback, useEffect, useRef } from 'react';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudioPlaying = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) audio.play();
    else audio.pause();
  }, []);

  useEffect(() => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
    }
  }, []);

  return { audioRef, toggleAudioPlaying };
}
