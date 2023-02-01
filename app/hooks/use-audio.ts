import { useCallback, useEffect, useRef } from 'react';

interface UseAudioParams {
  onPause?: () => void;
  onPlay?: () => void;
}

export function useAudio({ onPause, onPlay }: UseAudioParams = {}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudioPlaying = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      onPlay?.();
      audio.play();
    } else {
      onPause?.();
      audio.pause();
    }
  }, [onPause, onPlay]);

  useEffect(() => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
    }
  }, []);

  return { audioRef, toggleAudioPlaying };
}
