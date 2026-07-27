import * as Speech from 'expo-speech';
import { AudioSource, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

export type StoryReaderItem = { id: string; text: string; audio?: AudioSource };

export function useStoryReader() {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [speakingId, setSpeakingId] = useState<string>();
  const session = useRef(0);
  const queue = useRef<StoryReaderItem[]>([]);
  const index = useRef(0);
  const waitingForAudio = useRef(false);
  const playTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const finish = useCallback((activeSession: number) => {
    if (activeSession !== session.current) return;
    waitingForAudio.current = false;
    player.volume = 0;
    setSpeakingId(undefined);
  }, [player]);

  const playAt = useCallback(async (nextIndex: number, activeSession: number) => {
    if (activeSession !== session.current) return;
    const item = queue.current[nextIndex];
    if (!item) {
      finish(activeSession);
      return;
    }
    index.current = nextIndex;

    if (item.audio) {
      await Speech.stop();
      if (activeSession !== session.current) return;
      waitingForAudio.current = true;
      player.volume = 1;
      player.replace(item.audio);
      playTimer.current = setTimeout(() => {
        if (activeSession === session.current) player.play();
      }, 200);
      return;
    }

    waitingForAudio.current = false;
    player.volume = 0;
    const voices = await Speech.getAvailableVoicesAsync().catch(() => []);
    if (activeSession !== session.current) return;
    const turkishVoice = voices.find((voice) => voice.language.toLowerCase().startsWith('tr'));
    Speech.speak(item.text, {
      ...(turkishVoice ? { language: turkishVoice.language, voice: turkishVoice.identifier } : {}),
      rate: .88,
      pitch: 1,
      volume: 1,
      useApplicationAudioSession: false,
      onDone: () => { void playAt(nextIndex + 1, activeSession); },
      onError: () => { void playAt(nextIndex + 1, activeSession); },
    });
  }, [finish, player]);

  const stop = useCallback(() => {
    session.current += 1;
    waitingForAudio.current = false;
    if (playTimer.current) clearTimeout(playTimer.current);
    player.volume = 0;
    Speech.stop();
    setSpeakingId(undefined);
  }, [player]);

  const play = useCallback((id: string, items: StoryReaderItem[]) => {
    stop();
    const activeSession = session.current;
    queue.current = items;
    index.current = 0;
    setSpeakingId(id);
    playAt(0, activeSession);
  }, [playAt, stop]);

  useEffect(() => {
    if (!status.didJustFinish || !waitingForAudio.current) return;
    waitingForAudio.current = false;
    playAt(index.current + 1, session.current);
  }, [playAt, status.didJustFinish]);

  useEffect(() => () => {
    session.current += 1;
    if (playTimer.current) clearTimeout(playTimer.current);
    Speech.stop();
  }, []);

  return { speakingId, play, stop };
}
