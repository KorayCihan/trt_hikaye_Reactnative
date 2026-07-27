import * as Speech from 'expo-speech';
import { AudioSource, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

export function useNarration(text: string, muted: boolean, audioSource?: AudioSource) {
  const requestId = useRef(0);
  const player = useAudioPlayer(null);

  useEffect(() => {
    // iOS'ta boş veya bırakılmış oynatıcıya pause() çağrısı çökmeye neden
    // olabildiğinden sessiz/final durumda native metot çağırmadan sesi kapatıyoruz.
    player.volume = audioSource && !muted ? 1 : 0;
    if (audioSource) {
      player.replace(audioSource);
    }
  }, [audioSource, muted, player]);

  const speak = useCallback(async () => {
    const id = ++requestId.current;
    await Speech.stop();
    if (muted || !text.trim() || id !== requestId.current) return;

    if (audioSource) {
      try {
        await player.seekTo(0);
        if (id === requestId.current) {
          player.volume = 1;
          player.play();
        }
      } catch (error) {
        console.warn('Kayıtlı ses başlatılamadı', error);
      }
      return;
    }

    try {
      const voices = await Speech.getAvailableVoicesAsync();
      if (id !== requestId.current) return;
      const turkishVoice = voices.find((voice) => voice.language.toLowerCase().startsWith('tr'));

      Speech.speak(text, {
        ...(turkishVoice ? { language: turkishVoice.language, voice: turkishVoice.identifier } : {}),
        rate: .88,
        pitch: 1,
        volume: 1,
        useApplicationAudioSession: false,
        onError: (error) => console.warn('Seslendirme başlatılamadı', error),
      });
    } catch (error) {
      console.warn('Cihaz sesleri okunamadı, varsayılan ses kullanılıyor', error);
      if (id === requestId.current && !muted) Speech.speak(text, { rate: .88, pitch: 1, volume: 1 });
    }
  }, [audioSource, muted, player, text]);

  useEffect(() => {
    const timer = setTimeout(speak, 300);
    return () => {
      requestId.current += 1;
      clearTimeout(timer);
      Speech.stop();
    };
  }, [speak]);

  const stop = useCallback(() => {
    requestId.current += 1;
    player.volume = 0;
    Speech.stop();
  }, [player]);

  return { replay: speak, stop };
}
