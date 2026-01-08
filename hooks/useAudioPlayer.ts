import { Audio, AVPlaybackSource } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const unload = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch {
        // ignore stop error if already stopped
      }
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  const play = useCallback(
    async (source: AVPlaybackSource | undefined) => {
      if (!source) {
        console.warn('Audio source is undefined');
        return;
      }

      try {
        await unload();
        const { sound } = await Audio.Sound.createAsync(source, {
          shouldPlay: true,
        });
        soundRef.current = sound;
        
        // Ожидаем завершения воспроизведения
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            unload();
          }
        });
      } catch (error) {
        console.error('Error playing audio:', error);
        await unload();
      }
    },
    [unload],
  );

  useEffect(() => {
    return () => {
      unload();
    };
  }, [unload]);

  return { play };
}

export default useAudioPlayer;


