import { useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChoiceButton } from './ChoiceButton';
import { StoryBackground } from './StoryBackground';
import { EmptyState } from './EmptyState';
import { useStory } from '@/context/StoryContext';
import { storyRegistry } from '@/stories';
import { getStoryAudio } from '@/stories/audio';
import { useNarration } from '@/hooks/useNarration';
import { getStoryUiConfig } from '@/config/storyUi';
import { colors, radius, spacing } from '@/theme';
import type { StoryChoice, StoryNode } from '@/types/story';

type StoryHeaderProps = {
  storyTitle: string;
  progressPercent: number;
  muted: boolean;
  onToggleMuted: () => void;
};

function StoryHeader({ storyTitle, progressPercent, muted, onToggleMuted }: StoryHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerSpacer} />
      <View style={styles.headerCenter}>
        <Text numberOfLines={1} style={styles.storyName}>{storyTitle}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={muted ? 'Sesi aç' : 'Sesi kapat'}
        onPress={onToggleMuted}
        style={styles.circle}
      >
        <Text style={styles.control}>{muted ? '🔇' : '🔊'}</Text>
      </Pressable>
    </View>
  );
}

type StoryTextContentProps = {
  node: StoryNode;
  selectedChoiceId?: string;
  locked: boolean;
  onChoose: (choice: StoryChoice) => void;
};

function StoryTextContent({ node, selectedChoiceId, locked, onChoose }: StoryTextContentProps) {
  return (
    <View style={styles.scroll}>
      <Text style={styles.chapter}>BÖLÜM {node.paragraphNumber}</Text>
      <Text style={styles.title}>{node.title}</Text>
      <Text style={styles.text}>{node.text}</Text>
      <View style={styles.choices}>
        {node.choices.map((choice, index) => (
          <ChoiceButton
            key={choice.id}
            {...choice}
            index={index}
            selected={selectedChoiceId === choice.id}
            disabled={locked}
            onPress={() => onChoose(choice)}
          />
        ))}
      </View>
    </View>
  );
}

export function StoryPlayer() {
  const router = useRouter();
  const { activeStoryId, progress, muted, selectChoice, toggleMuted } = useStory();
  const entry = storyRegistry[activeStoryId];
  const state = progress[activeStoryId];
  const node = entry?.story.nodes[state?.currentNodeId ?? entry?.story.startNodeId];
  const [locked, setLocked] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>();
  const selectionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentRise = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(1)).current;
  const zoom = useRef(new Animated.Value(1.03)).current;
  const narrationAudio = node?.isEnding ? undefined : getStoryAudio(activeStoryId, node?.id);
  const narrationText = node && !node.isEnding ? `${node.title}. ${node.text}` : '';
  useNarration(narrationText, muted, narrationAudio);
  const { panelHeight } = getStoryUiConfig(activeStoryId);

  // Bir sonraki sahnenin görselini seçim yapılmadan önce önbelleğe alırız.
  const source = node ? entry?.images[state?.currentBackgroundKey ?? node.backgroundImage] : undefined;
  const preloadedSources = useMemo(() => {
    if (!entry || !node) return [];
    return node.choices.map((choice) => {
      const next = entry.story.nodes[choice.nextNodeId];
      return entry.images[choice.transitionImageKey ?? next?.backgroundImage];
    }).filter(Boolean);
  }, [entry, node]);
  const maxParagraph = useMemo(
    () => entry ? Math.max(...Object.values(entry.story.nodes).map((item) => item.paragraphNumber)) : 1,
    [entry],
  );
  const progressPercent = Math.min(100, node ? node.paragraphNumber / maxParagraph * 100 : 0);

  useEffect(() => {
    if (!entry || !node) return;
    node.choices.forEach((choice) => {
      const next = entry.story.nodes[choice.nextNodeId];
      const nextSource = entry.images[choice.transitionImageKey ?? next?.backgroundImage];
      if (nextSource) Image.prefetch(Image.resolveAssetSource(nextSource).uri).catch(() => undefined);
    });
  }, [entry, node]);

  useEffect(() => {
    if (!node) return;
    setLocked(false);
    setSelectedChoiceId(undefined);
    contentOpacity.setValue(0);
    contentRise.setValue(6);
    bgOpacity.setValue(1);
    zoom.setValue(1);
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(contentRise, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
    if (node.isEnding) {
      const timer = setTimeout(() => router.replace('/result'), 500);
      return () => clearTimeout(timer);
    }
  }, [bgOpacity, contentOpacity, contentRise, node, router, zoom]);

  useEffect(() => () => {
    if (selectionTimer.current) clearTimeout(selectionTimer.current);
  }, []);

  if (!entry || !node) {
    return <EmptyState title="Hikâye açılamadı" message="Bu macera şu anda hazırlanıyor." action="Ana sayfaya dön" onAction={() => router.replace('/')} />;
  }

  const choose = (choice: typeof node.choices[number]) => {
    if (locked) return;
    setLocked(true);
    setSelectedChoiceId(choice.id);
    Haptics.selectionAsync().catch(() => undefined);
    selectionTimer.current = setTimeout(() => {
      if (!selectChoice(choice)) {
        setLocked(false);
        setSelectedChoiceId(undefined);
      }
    }, 110);
  };

  return <View style={styles.root}>
    {preloadedSources.map((preloadSource, index) => <ExpoImage key={`${node.id}-${index}`} source={preloadSource} contentFit="cover" cachePolicy="memory-disk" transition={0} style={styles.preload} />)}
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgOpacity, transform: [{ scale: zoom }] }]}>
      <StoryBackground source={source} />
    </Animated.View>
    <SafeAreaView style={styles.safe}>
      <StoryHeader
        storyTitle={entry.story.title}
        progressPercent={progressPercent}
        muted={muted}
        onToggleMuted={toggleMuted}
      />
      <Animated.View style={[styles.bottom, { height: panelHeight, opacity: contentOpacity, transform: [{ translateY: contentRise }] }]}> 
        <StoryTextContent
          node={node}
          selectedChoiceId={selectedChoiceId}
          locked={locked}
          onChoose={choose}
        />
      </Animated.View>
    </SafeAreaView>
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },
  preload: { ...StyleSheet.absoluteFillObject, opacity: 0 },
  safe: { flex: 1, justifyContent: 'space-between' },
  header: { zIndex: 2, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: spacing.xs, gap: spacing.sm },
  headerSpacer: { width: 40, height: 40 },
  circle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(11,18,29,.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,.26)', alignItems: 'center', justifyContent: 'center' },
  control: { fontSize: 16 },
  headerCenter: { flex: 1 },
  storyName: { color: colors.white, fontWeight: '700', fontSize: 13, textAlign: 'center', textShadowColor: 'rgba(0,0,0,.55)', textShadowRadius: 4 },
  progressTrack: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,.30)', marginTop: spacing.xs, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  bottom: { backgroundColor: 'rgba(10,18,29,.48)', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, borderWidth: 1, borderBottomWidth: 0, borderColor: 'rgba(255,255,255,.14)', overflow: 'hidden' },
  scroll: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.xs, paddingBottom: spacing.sm },
  chapter: { fontSize: 8, lineHeight: 10, fontWeight: '800', color: colors.secondary, letterSpacing: 1.1 },
  title: { fontSize: 16, lineHeight: 19, fontWeight: '800', color: colors.white, marginTop: 1 },
  text: { fontSize: 12, lineHeight: 16, fontWeight: '400', color: 'rgba(255,255,255,.86)', marginTop: 2 },
  choices: { gap: 4, marginTop: spacing.xs },
});
