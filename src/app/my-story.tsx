import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { useStory } from '@/context/StoryContext';
import { storyRegistry } from '@/stories';
import { getStoryAudio } from '@/stories/audio';
import { useStoryReader } from '@/hooks/useStoryReader';
import { colors, radius, spacing, typography } from '@/theme';

export default function MyStoryScreen() {
  const router = useRouter();
  const { speakingId, play, stop } = useStoryReader();
  const { activeStoryId, progress } = useStory();
  const entry = storyRegistry[activeStoryId];
  const state = progress[activeStoryId];

  if (!entry || !state?.completed) {
    return <EmptyState title="Hikâyen henüz hazır değil" message="Önce maceranı tamamlamalısın." action="Hikâyeye dön" onAction={() => router.replace('/story')} />;
  }

  const chapters = state.history.map((record) => ({
    node: entry.story.nodes[record.nodeId],
    choiceText: record.choiceText,
  })).filter((chapter) => chapter.node);
  const ending = entry.story.nodes[state.currentNodeId];

  const fullStoryText = [
    ...chapters.map(({ node }) => `${node.title}. ${node.text}`),
    ending ? `${ending.title}. ${ending.text}` : '',
  ].filter(Boolean).join('. ');
  const readerItems = [
    ...chapters.map(({ node }) => ({ id: node.id, text: `${node.title}. ${node.text}`, audio: getStoryAudio(activeStoryId, node.id) })),
    ...(ending ? [{ id: ending.id, text: `${ending.title}. ${ending.text}`, audio: getStoryAudio(activeStoryId, ending.id) }] : []),
  ];
  const toggleReader = (id: string, items: typeof readerItems) => speakingId === id ? stop() : play(id, items);

  const shareStory = async () => {
    const choices = chapters.map(({ choiceText }, index) => `${index + 1}. seçimim: ${choiceText}`).join('\n');
    const message = [`Benim oluşturduğum hikâye: ${entry.story.title}`, '', fullStoryText, choices ? `\nYaptığım seçimler:\n${choices}` : '', '', 'Bu macera benim seçimlerimle yazıldı.'].filter(Boolean).join('\n');
    try {
      await Share.share({ message, title: entry.story.title });
    } catch {
      Alert.alert('Paylaşım açılamadı', 'Lütfen biraz sonra yeniden dene.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>OLUŞTURDUĞUM HİKÂYE</Text>
          <Text numberOfLines={1} style={styles.headerTitle}>{entry.story.title}</Text>
        </View>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Bu hikâyeyi sen yazdın</Text>
          <Text style={styles.introText}>Yaptığın seçimlerle oluşan maceranı baştan sona okuyabilirsin.</Text>
        </View>

        {chapters.map(({ node, choiceText }, index) => (
          <View key={`${node.id}-${index}`} style={styles.chapter}>
            <View style={styles.chapterTop}>
              <View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View>
              <Text style={styles.chapterLabel}>BÖLÜM {node.paragraphNumber}</Text>
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{node.title}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={`${node.title} bölümünü dinle`} onPress={() => toggleReader(node.id, [readerItems[index]])} style={[styles.listenButton, speakingId === node.id && styles.listenButtonActive]}>
                <Text style={styles.listenIcon}>{speakingId === node.id ? '■' : '▶'}</Text>
                <Text style={styles.listenText}>{speakingId === node.id ? 'Durdur' : 'Dinle'}</Text>
              </Pressable>
            </View>
            <Text style={styles.text}>{node.text}</Text>
            <View style={styles.choiceBox}>
              <Text style={styles.choiceLabel}>SENİN SEÇİMİN</Text>
              <Text style={styles.choiceText}>{choiceText}</Text>
            </View>
          </View>
        ))}

        {ending ? (
          <View style={[styles.chapter, styles.ending]}>
            <Text style={styles.endingLabel}>HİKÂYENİN SONU</Text>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{ending.title}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Final bölümünü dinle" onPress={() => toggleReader(ending.id, [readerItems[readerItems.length - 1]])} style={[styles.listenButton, speakingId === ending.id && styles.listenButtonActive]}>
                <Text style={styles.listenIcon}>{speakingId === ending.id ? '■' : '▶'}</Text>
                <Text style={styles.listenText}>{speakingId === ending.id ? 'Durdur' : 'Dinle'}</Text>
              </Pressable>
            </View>
            <Text style={styles.text}>{ending.text}</Text>
          </View>
        ) : null}

        <Pressable accessibilityRole="button" onPress={() => toggleReader('full-story', readerItems)} style={[styles.readAll, speakingId === 'full-story' && styles.readAllActive]}>
          <Text style={styles.readAllIcon}>{speakingId === 'full-story' ? '■' : '▶'}</Text>
          <View style={styles.readAllTextWrap}>
            <Text style={styles.readAllTitle}>{speakingId === 'full-story' ? 'Okumayı durdur' : 'Hikâyeyi baştan dinle'}</Text>
            <Text style={styles.readAllSubtitle}>Tüm bölümleri sırayla oku</Text>
          </View>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Hikâyemi paylaş" onPress={shareStory} style={styles.shareButton}>
          <Text style={styles.shareIcon}>↗</Text>
          <Text style={styles.shareText}>Hikâyemi paylaş</Text>
        </Pressable>
        <Text style={styles.signature}>Bu macera, senin seçimlerinle yazıldı.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  back: { color: colors.white, fontSize: 30, lineHeight: 32 },
  headerText: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.sm },
  headerLabel: { color: colors.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  headerTitle: { color: colors.white, fontSize: 15, fontWeight: '700', marginTop: 2 },
  headerSpace: { width: 40 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  intro: { marginBottom: spacing.lg },
  introTitle: { ...typography.title, color: colors.white },
  introText: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  chapter: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  chapterTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  number: { width: 25, height: 25, borderRadius: 13, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  numberText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  chapterLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '800', letterSpacing: .8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  title: { ...typography.heading, color: colors.white, flex: 1 },
  listenButton: { height: 34, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
  listenButtonActive: { backgroundColor: 'rgba(255,203,33,.18)', borderColor: colors.primary },
  listenIcon: { color: colors.primary, fontSize: 10 },
  listenText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  text: { ...typography.body, color: '#D5DCE6', marginTop: spacing.xs },
  choiceBox: { backgroundColor: 'rgba(255,203,33,.10)', borderLeftWidth: 3, borderLeftColor: colors.primary, borderRadius: radius.sm, padding: spacing.sm, marginTop: spacing.md },
  choiceLabel: { color: colors.primary, fontSize: 9, fontWeight: '800', letterSpacing: .8 },
  choiceText: { color: colors.white, fontSize: 14, lineHeight: 20, fontWeight: '600', marginTop: 3 },
  ending: { borderColor: 'rgba(255,203,33,.45)' },
  endingLabel: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  readAll: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.md, marginTop: spacing.md },
  readAllActive: { backgroundColor: colors.primaryDark },
  readAllIcon: { color: colors.navy, fontSize: 18, fontWeight: '800' },
  readAllTextWrap: { flex: 1 },
  readAllTitle: { color: colors.navy, fontSize: 15, fontWeight: '800' },
  readAllSubtitle: { color: 'rgba(36,51,75,.72)', fontSize: 11, marginTop: 2 },
  shareButton: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderRadius: radius.md, borderWidth: 1, borderColor: colors.primary, marginTop: spacing.sm },
  shareIcon: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  shareText: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  signature: { color: colors.textSecondary, fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginTop: spacing.lg },
});
