import { useRouter } from 'expo-router';
import { useMemo, useRef } from 'react';
import { Animated, PanResponder, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryBackground } from '@/components/StoryBackground';
import { EmptyState } from '@/components/EmptyState';
import { useStory } from '@/context/StoryContext';
import { storyRegistry } from '@/stories';
import { getStoryAudio } from '@/stories/audio';
import { useNarration } from '@/hooks/useNarration';
import { colors, radius, spacing, typography } from '@/theme';

const badge = { courage: '🏅', kindness: '💛', curiosity: '🔭' } as const;

export default function ResultScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { activeStoryId, progress, restart, muted } = useStory();
  const entry = storyRegistry[activeStoryId];
  const state = progress[activeStoryId];
  const node = entry?.story.nodes[state?.currentNodeId];
  const narrationText = node?.isEnding ? `${node.title}. ${node.text}` : '';
  const { stop: stopNarration } = useNarration(narrationText, muted, node?.isEnding ? getStoryAudio(activeStoryId, node.id) : undefined);
  const sheetHeight = Math.min(650, Math.round(height * .72));
  const collapsedY = sheetHeight - 76;
  const translateY = useRef(new Animated.Value(0)).current;
  const position = useRef(0);
  const dragStart = useRef(0);

  const moveSheet = (toValue: number) => {
    Animated.spring(translateY, { toValue, damping: 24, stiffness: 230, mass: .8, useNativeDriver: true }).start(() => {
      position.current = toValue;
    });
  };

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
    onPanResponderGrant: () => { dragStart.current = position.current; },
    onPanResponderMove: (_, gesture) => {
      const next = Math.max(0, Math.min(collapsedY, dragStart.current + gesture.dy));
      translateY.setValue(next);
      position.current = next;
    },
    onPanResponderRelease: (_, gesture) => {
      const shouldCollapse = gesture.vy > .45 || (gesture.vy > -.25 && position.current > collapsedY * .42);
      moveSheet(shouldCollapse ? collapsedY : 0);
    },
    onPanResponderTerminate: () => moveSheet(position.current > collapsedY / 2 ? collapsedY : 0),
  }), [collapsedY, translateY]);

  if (!entry || !state || !node?.isEnding) {
    return <EmptyState title="Final henüz hazır değil" message="Macera yoluna devam ederek finali keşfedebilirsin." action="Hikâyeye dön" onAction={() => router.replace('/story')} />;
  }

  const again = () => {
    stopNarration();
    restart();
    router.replace('/story');
  };

  const openMyStory = () => {
    stopNarration();
    router.push('/my-story' as never);
  };

  const goHome = () => {
    stopNarration();
    router.replace('/');
  };

  return (
    <View style={styles.root}>
      <StoryBackground source={entry.images[state.currentBackgroundKey ?? node.backgroundImage]} />
      <SafeAreaView pointerEvents="box-none" style={styles.safe}>
        <View style={styles.photoHint}><Text style={styles.photoHintText}>Son sahneyi görmek için paneli aşağı çek</Text></View>
      </SafeAreaView>

      <Animated.View style={[styles.sheet, { height: sheetHeight, transform: [{ translateY }] }]}>
        <View style={styles.dragArea} {...panResponder.panHandlers}>
          <View style={styles.handle} />
          <Text style={styles.dragTitle}>Macera tamamlandı</Text>
          <Text style={styles.dragHint}>Aşağı çekerek son sahneyi görebilirsin</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Text style={styles.complete}>MACERA TAMAMLANDI</Text>
          <Text style={styles.badge}>{badge[node.endingKind ?? 'courage']}</Text>
          <Text style={styles.title}>{node.title}</Text>
          <Text style={styles.text}>{node.text}</Text>
          <View style={styles.journey}>
            <Text style={styles.journeyTitle}>Macera Yolculuğun</Text>
            {state.history.slice(-3).map((item, index) => (
              <View key={`${item.choiceId}-${index}`} style={styles.step}>
                <View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View>
                <View style={styles.stepText}>
                  <Text style={styles.node}>{item.nodeTitle}</Text>
                  <Text style={styles.choice}>{item.choiceText}</Text>
                </View>
              </View>
            ))}
          </View>
          <Pressable accessibilityRole="button" onPress={openMyStory} style={styles.primary}>
            <Text style={styles.primaryText}>Hikâyemi Baştan Oku</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={again} style={styles.secondary}>
            <Text style={styles.secondaryText}>↻ Yeniden Oyna</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={goHome} style={styles.home}>
            <Text style={styles.homeText}>Yeni hikâye seç</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },
  safe: { ...StyleSheet.absoluteFillObject },
  photoHint: { alignSelf: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: 'rgba(8,14,22,.50)' },
  photoHintText: { color: 'rgba(255,255,255,.78)', fontSize: 10, fontWeight: '600' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,18,29,.78)', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, borderWidth: 1, borderBottomWidth: 0, borderColor: 'rgba(255,255,255,.18)', overflow: 'hidden' },
  dragArea: { height: 76, alignItems: 'center', paddingTop: 9 },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,.48)' },
  dragTitle: { color: colors.white, fontSize: 13, fontWeight: '800', marginTop: 8 },
  dragHint: { color: 'rgba(255,255,255,.58)', fontSize: 10, marginTop: 2 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, alignItems: 'center' },
  complete: { ...typography.label, color: colors.secondary, letterSpacing: 1.3 },
  badge: { fontSize: 42, marginTop: spacing.xs },
  title: { ...typography.title, color: colors.white, textAlign: 'center', marginTop: spacing.xs },
  text: { ...typography.body, color: 'rgba(255,255,255,.82)', textAlign: 'center', marginTop: spacing.sm },
  journey: { width: '100%', backgroundColor: 'rgba(255,255,255,.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,.12)', borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, marginTop: spacing.lg },
  journeyTitle: { ...typography.heading, color: colors.white },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepText: { flex: 1 },
  number: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  numberText: { color: colors.white, fontWeight: '800' },
  node: { color: colors.white, fontWeight: '700', fontSize: 13 },
  choice: { color: 'rgba(255,255,255,.68)', fontSize: 12, marginTop: 2 },
  primary: { width: '100%', minHeight: 52, borderRadius: radius.sm, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  primaryText: { color: colors.navy, fontWeight: '800', fontSize: 16 },
  secondary: { width: '100%', minHeight: 50, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,.13)', borderWidth: 1, borderColor: 'rgba(255,255,255,.22)', alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  secondaryText: { color: colors.white, fontWeight: '800' },
  home: { minHeight: 46, justifyContent: 'center' },
  homeText: { color: 'rgba(255,255,255,.72)', fontWeight: '700' },
});
