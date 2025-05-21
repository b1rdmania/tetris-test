import { useState, useEffect } from "react";

type AudioOptions = {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
};

export const useAudio = (url: string, options: AudioOptions = {}) => {
  const [audio] = useState<HTMLAudioElement>(() => new Audio(url));
  const [playing, setPlaying] = useState(false);

  const { volume = 1, loop = false, autoplay = false } = options;

  const toggle = () => setPlaying(!playing);

  const play = () => setPlaying(true);

  const pause = () => setPlaying(false);

  const stop = () => {
    pause();
    if (audio) {
      audio.currentTime = 0;
    }
  };

  const setVolume = (value: number) => {
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, value / 100));
    }
  };

  useEffect(() => {
    if (audio) {
      audio.loop = loop;
      audio.volume = volume;
      if (autoplay) setPlaying(true);
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio, loop, volume, autoplay]);

  useEffect(() => {
    if (audio) {
      if (playing) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Audio play error:", error);
          });
        }
      } else {
        audio.pause();
      }
    }
  }, [playing, audio]);

  return { playing, toggle, play, pause, stop, setVolume };
};
