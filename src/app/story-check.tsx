import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listStoryPaths } from '@/engine/storyPaths';
import { validateStory } from '@/engine/validateStory';
import { stories } from '@/stories';
import { colors, radius, spacing, typography } from '@/theme';
import type { RegisteredStory } from '@/types/story';

function StoryValidationCard({ entry }: { entry: RegisteredStory }) {
  const { story, images } = entry;
  const result = validateStory(story, images);
  const paths = listStoryPaths(story);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.story}>{story.title}</Text>
        <View style={[styles.status, result.valid ? styles.ok : styles.bad]}>
          <Text style={styles.statusText}>{result.valid ? 'GEÇTİ' : 'HATA'}</Text>
        </View>
      </View>

      <Text style={styles.meta}>
        {Object.keys(story.nodes).length} düğüm • {paths.length} test yolu •{' '}
        {result.missingImages.length} eksik görsel
      </Text>

      {Object.values(story.nodes).map((node) => (
        <Text key={node.id} style={styles.node}>
          • {node.paragraphNumber}. {node.title} {node.isEnding ? '(Final)' : ''}
        </Text>
      ))}

      {result.issues.length > 0 ? (
        <View style={styles.issues}>
          {result.issues.map((issue, index) => (
            <Text
              key={`${issue.code}-${index}`}
              style={issue.type === 'error' ? styles.error : styles.warning}
            >
              {issue.type === 'error' ? '⛔' : '⚠️'}{' '}
              {issue.nodeId ? `${issue.nodeId}: ` : ''}
              {issue.message}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.success}>✓ Tüm bağlantılar, finaller ve görseller doğrulandı.</Text>
      )}
    </View>
  );
}

export default function StoryCheckScreen() {
  const router = useRouter();
  if (!__DEV__) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Hikâye Kontrolü</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {stories.map((entry) => <StoryValidationCard key={entry.story.id} entry={entry} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 34, color: colors.primary },
  title: { ...typography.title, color: colors.textPrimary },
  content: { padding: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  story: { ...typography.heading, color: colors.textPrimary, flex: 1 },
  status: { paddingHorizontal: spacing.sm, paddingVertical: 5, borderRadius: radius.pill },
  ok: { backgroundColor: '#DDF8EE' },
  bad: { backgroundColor: '#FFE2E8' },
  statusText: { fontWeight: '900', fontSize: 11, color: colors.textPrimary },
  meta: { color: colors.textSecondary, marginVertical: spacing.md },
  node: { color: colors.textPrimary, lineHeight: 22 },
  issues: { marginTop: spacing.md, gap: spacing.xs },
  error: { color: colors.danger },
  warning: { color: '#9A6700' },
  success: { color: colors.success, fontWeight: '800', marginTop: spacing.md },
});
