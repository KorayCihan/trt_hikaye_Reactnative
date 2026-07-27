import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { stories, storyRegistry } from '@/stories';
import type { ChoiceRecord, StoryChoice, StoryProgress } from '@/types/story';

// Eski kullanıcı kayıtlarını kaybetmemek için bu anahtar değiştirilmemelidir.
const STORAGE_KEY = '@mino/story-engine/v1';
const initialStoryId = stories[0]?.story.id ?? '';

type PersistedStoryState = {
  activeStoryId: string;
  progress: Record<string, StoryProgress>;
  favorites: string[];
  muted: boolean;
};

type StoryContextValue = PersistedStoryState & {
  hydrated: boolean;
  startStory: (id: string, restart?: boolean) => void;
  selectChoice: (choice: StoryChoice) => boolean;
  goBack: () => void;
  restart: () => void;
  toggleFavorite: (id: string) => void;
  toggleMuted: () => void;
};

function createProgress(storyId: string): StoryProgress {
  const story = storyRegistry[storyId]?.story;
  const startNode = story?.nodes[story.startNodeId];

  return {
    currentNodeId: story?.startNodeId ?? '',
    currentBackgroundKey: startNode?.backgroundImage,
    history: [],
    completed: false,
    endings: [],
    updatedAt: Date.now(),
  };
}

const StoryContext = createContext<StoryContextValue | null>(null);

export function StoryProvider({ children }: PropsWithChildren) {
  const [hydrated, setHydrated] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState(initialStoryId);
  const [progress, setProgress] = useState<Record<string, StoryProgress>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [muted, setMuted] = useState(false);

  // Uygulama açıldığında cihazdaki son hikâye durumunu bir kez geri yükler.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;

        const saved = JSON.parse(raw) as PersistedStoryState;
        setActiveStoryId(storyRegistry[saved.activeStoryId] ? saved.activeStoryId : initialStoryId);
        setProgress(saved.progress ?? {});
        setFavorites(saved.favorites ?? []);
        setMuted(Boolean(saved.muted));
      })
      .catch((error) => console.warn('Kayıt okunamadı', error))
      .finally(() => setHydrated(true));
  }, []);

  // İlk okuma tamamlandıktan sonra her değişikliği cihazda saklar.
  useEffect(() => {
    if (!hydrated) return;

    const state: PersistedStoryState = { activeStoryId, progress, favorites, muted };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      .catch((error) => console.warn('Kayıt yapılamadı', error));
  }, [activeStoryId, favorites, hydrated, muted, progress]);

  const startStory = useCallback((id: string, fresh = false) => {
    const story = storyRegistry[id]?.story;
    if (!story) return;

    Speech.stop();
    setMuted(false);
    setActiveStoryId(id);
    setProgress((allProgress) => {
      const saved = allProgress[id];
      if (fresh || !saved) return { ...allProgress, [id]: createProgress(id) };

      const isAtStart = saved.currentNodeId === story.startNodeId && saved.history.length === 0;
      if (!isAtStart) return { ...allProgress, [id]: saved };

      return {
        ...allProgress,
        [id]: {
          ...saved,
          currentBackgroundKey: story.nodes[story.startNodeId].backgroundImage,
        },
      };
    });
  }, []);

  const selectChoice = useCallback((choice: StoryChoice) => {
    Speech.stop();

    const story = storyRegistry[activeStoryId]?.story;
    const currentProgress = progress[activeStoryId] ?? createProgress(activeStoryId);
    const currentNode = story?.nodes[currentProgress.currentNodeId];
    const nextNode = story?.nodes[choice.nextNodeId];

    if (!story || !currentNode || !nextNode) {
      console.error(`Hikâye düğümü bulunamadı: ${choice.nextNodeId}`);
      return false;
    }

    const historyRecord: ChoiceRecord = {
      nodeId: currentNode.id,
      nodeTitle: currentNode.title,
      choiceId: choice.id,
      choiceText: choice.text,
    };

    setProgress((allProgress) => {
      const oldProgress = allProgress[activeStoryId] ?? createProgress(activeStoryId);
      const endings = nextNode.isEnding
        ? [...new Set([...oldProgress.endings, nextNode.id])]
        : oldProgress.endings;

      return {
        ...allProgress,
        [activeStoryId]: {
          ...oldProgress,
          currentNodeId: nextNode.id,
          currentBackgroundKey: choice.transitionImageKey ?? nextNode.backgroundImage,
          history: [...oldProgress.history, historyRecord],
          completed: oldProgress.completed || nextNode.isEnding,
          endings,
          updatedAt: Date.now(),
        },
      };
    });

    return true;
  }, [activeStoryId, progress]);

  const goBack = useCallback(() => {
    Speech.stop();
    setProgress((allProgress) => {
      const oldProgress = allProgress[activeStoryId] ?? createProgress(activeStoryId);
      const history = oldProgress.history.slice(0, -1);
      const story = storyRegistry[activeStoryId].story;
      const lastRecord = history.at(-1);
      const previousChoice = lastRecord
        ? story.nodes[lastRecord.nodeId].choices.find((choice) => choice.id === lastRecord.choiceId)
        : undefined;

      return {
        ...allProgress,
        [activeStoryId]: {
          ...oldProgress,
          currentNodeId: previousChoice?.nextNodeId ?? story.startNodeId,
          currentBackgroundKey: previousChoice?.transitionImageKey
            ?? story.nodes[story.startNodeId].backgroundImage,
          history,
          updatedAt: Date.now(),
        },
      };
    });
  }, [activeStoryId]);

  const restart = useCallback(
    () => startStory(activeStoryId, true),
    [activeStoryId, startStory],
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((list) => (
      list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
    ));
  }, []);

  const toggleMuted = useCallback(() => {
    Speech.stop();
    setMuted((value) => !value);
  }, []);

  const value = useMemo<StoryContextValue>(() => ({
    hydrated,
    activeStoryId,
    progress,
    favorites,
    muted,
    startStory,
    selectChoice,
    goBack,
    restart,
    toggleFavorite,
    toggleMuted,
  }), [
    hydrated,
    activeStoryId,
    progress,
    favorites,
    muted,
    startStory,
    selectChoice,
    goBack,
    restart,
    toggleFavorite,
    toggleMuted,
  ]);

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export function useStory() {
  const value = useContext(StoryContext);
  if (!value) throw new Error('useStory, StoryProvider içinde kullanılmalı');
  return value;
}
