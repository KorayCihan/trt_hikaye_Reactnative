import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '@/components/AppLogo';
import { APP_INTRO_DURATION_MS, AppLoadingScreen } from '@/components/AppLoadingScreen';
import { useStory } from '@/context/StoryContext';
import { getStoryUiConfig } from '@/config/storyUi';
import { stories } from '@/stories';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type StoryFilter = 'all' | 'favorites' | 'inProgress' | 'completed';

const storyFilters: Array<[StoryFilter, string]> = [
  ['all', 'Tümü'],
  ['favorites', 'Favoriler'],
  ['inProgress', 'Devam Edenler'],
  ['completed', 'Tamamlananlar'],
];

function StoryFilters({ value, onChange }: { value: StoryFilter; onChange: (filter: StoryFilter) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
      {storyFilters.map(([id, label]) => (
        <Pressable
          key={id}
          accessibilityRole="button"  
          accessibilityState={{ selected: value === id }}
          onPress={() => onChange(id)}
          style={[styles.filterChip, value === id && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, value === id && styles.filterTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [minimumLoadingElapsed, setMinimumLoadingElapsed] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StoryFilter>('all');
  const { hydrated, progress, favorites, startStory, toggleFavorite } = useStory();
  const featured = stories[0];

  const visibleStories = useMemo(() => {
    // Arama metni ve seçili filtre tek geçişte uygulanır.
    const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');
    return stories.filter(({ story }) => {
      const saved = progress[story.id];
      const matchesFilter = filter === 'all'
        || (filter === 'favorites' && favorites.includes(story.id))
        || (filter === 'inProgress' && Boolean(saved && !saved.completed))
        || (filter === 'completed' && Boolean(saved?.completed));
      const searchableText = `${story.title} ${story.description} ${story.category}`.toLocaleLowerCase('tr-TR');
      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [favorites, filter, progress, query]);

  useEffect(() => {
    const timer = setTimeout(() => setMinimumLoadingElapsed(true), APP_INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!hydrated || !minimumLoadingElapsed) return <AppLoadingScreen />;
  if (!featured) return null;

  const featuredProgress = progress[featured.story.id];
  const open = (id: string, fresh = false) => {
    startStory(id, fresh);
    router.push('/story');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <AppLogo />
          <View style={styles.profile}><Text style={styles.profileText}>K</Text></View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>HİKÂYE ZAMANI</Text>
          <Text style={styles.greeting}>Merhaba, kâşif!</Text>
          <Text style={styles.welcome}>Seçimlerini yap, hikâyenin yönünü sen belirle.</Text>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput accessibilityLabel="Hikâye ara" autoCapitalize="none" autoCorrect={false} clearButtonMode="while-editing" onChangeText={setQuery} placeholder="Hikâye adı yaz..." placeholderTextColor={colors.textSecondary} returnKeyType="search" style={styles.searchInput} value={query} />
          {query ? <Pressable accessibilityLabel="Aramayı temizle" hitSlop={10} onPress={() => setQuery('')}><Text style={styles.clearSearch}>×</Text></Pressable> : null}
        </View>

        <StoryFilters value={filter} onChange={setFilter} />

        <Text style={styles.section}>Senin için seçtik</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`${featured.story.title} hikâyesini aç`} onPress={() => open(featured.story.id)} style={styles.hero}>
          <Image
            source={featured.images[featured.story.coverImage]}
            contentFit="cover"
            contentPosition={getStoryUiConfig(featured.story.id).bannerPosition}
            cachePolicy="memory-disk"
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient colors={['rgba(12,20,31,0.02)', 'rgba(12,20,31,0.18)', 'rgba(12,20,31,0.88)']} locations={[0, .42, 1]} style={styles.heroGradient}>
            <View style={styles.editorBadge}><Text style={styles.editorBadgeText}>EDİTÖRÜN SEÇİMİ</Text></View>
            <View>
              <Text style={styles.heroMeta}>{featured.story.category}  ·  {featured.story.estimatedMinutes} dakika  ·  {featured.story.ageRange} yaş</Text>
              <Text style={styles.heroTitle}>{featured.story.title}</Text>
              <Text numberOfLines={2} style={styles.heroDescription}>{featured.story.description}</Text>
              <View style={styles.heroActions}>
                {featuredProgress ? (
                  <Pressable onPress={(event) => { event.stopPropagation(); open(featured.story.id, true); }} style={styles.heroSecondary}>
                    <Text style={styles.heroSecondaryText}>Baştan başla</Text>
                  </Pressable>
                ) : null}
                <View style={styles.heroAction}>
                  <Text style={styles.heroActionText}>{featuredProgress ? 'Devam et' : 'Hikâyeyi başlat'}</Text>
                  <Text style={styles.heroArrow}>→</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        <View style={styles.sectionRow}>
          <Text style={styles.section}>Tüm hikâyeler</Text>
          <Text style={styles.count}>{visibleStories.length} hikâye</Text>
        </View>

        {visibleStories.map(({ story, images }) => {
          const saved = progress[story.id];
          const percent = saved?.completed ? 100 : saved ? Math.min(90, (saved.history.length + 1) * 20) : 0;
          const favorite = favorites.includes(story.id);
          return (
            <Pressable key={story.id} accessibilityRole="button" onPress={() => open(story.id)} style={styles.card}>
              <Image
                source={images[story.coverImage]}
                contentFit="cover"
                contentPosition={getStoryUiConfig(story.id).bannerPosition}
                cachePolicy="memory-disk"
                style={styles.cover}
              />
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.category}>{story.category.toUpperCase()}</Text>
                  <Pressable accessibilityRole="button" hitSlop={10} onPress={(event) => { event.stopPropagation(); toggleFavorite(story.id); }} style={styles.favorite}>
                    <Text style={[styles.favoriteText, favorite && styles.favoriteActive]}>{favorite ? '♥' : '♡'}</Text>
                  </Pressable>
                </View>
                <Text numberOfLines={2} style={styles.cardTitle}>{story.title}</Text>
                <Text style={styles.cardMeta}>{story.ageRange} yaş  ·  {story.estimatedMinutes} dakika</Text>
                {saved ? (
                  <>
                    <View style={styles.progressRow}><View style={styles.track}><View style={[styles.fill, { width: `${percent}%` }]} /></View><Text style={styles.percent}>%{percent}</Text></View>
                    <View style={styles.cardActions}>
                      <Pressable onPress={(event) => { event.stopPropagation(); open(story.id, true); }} style={styles.cardSecondary}><Text style={styles.cardSecondaryText}>Baştan başla</Text></Pressable>
                      <Pressable onPress={(event) => { event.stopPropagation(); open(story.id); }} style={styles.cardPrimary}><Text style={styles.cardPrimaryText}>Devam et</Text></Pressable>
                    </View>
                  </>
                ) : <Text style={styles.startLabel}>Başla  →</Text>}
              </View>
            </Pressable>
          );
        })}

        {!visibleStories.length ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsTitle}>Hikâye bulunamadı</Text>
            <Text style={styles.noResultsText}>Arama kelimeni veya seçili filtreyi değiştirebilirsin.</Text>
            <Pressable onPress={() => { setQuery(''); setFilter('all'); }} style={styles.resetFilters}><Text style={styles.resetFiltersText}>Filtreleri temizle</Text></Pressable>
          </View>
        ) : null}

        {__DEV__ ? <Pressable onPress={() => router.push('/story-check')} style={styles.dev}><Text style={styles.devText}>Hikâye kontrol ekranı</Text></Pressable> : null}
        <Text style={styles.footer}>TRT Çocuk · Güvenli ve reklamsız içerik</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  header: { height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profile: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  profileText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  intro: { paddingTop: spacing.sm, paddingBottom: spacing.lg },
  eyebrow: { ...typography.label, color: colors.primaryDark, letterSpacing: 1.3 },
  greeting: { ...typography.title, color: colors.textPrimary, marginTop: 3 },
  welcome: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  section: { ...typography.heading, color: colors.textPrimary },
  hero: { height: 410, borderRadius: radius.lg, overflow: 'hidden', marginTop: spacing.sm, ...shadows.card },
  heroGradient: { flex: 1, padding: spacing.md, justifyContent: 'space-between' },
  editorBadge: { alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6 },
  editorBadgeText: { color: colors.navy, fontSize: 10, fontWeight: '800', letterSpacing: .7 },
  heroMeta: { color: 'rgba(255,255,255,.78)', fontSize: 12, fontWeight: '600' },
  heroTitle: { ...typography.hero, color: colors.white, marginTop: spacing.xs },
  heroDescription: { color: 'rgba(255,255,255,.84)', fontSize: 14, lineHeight: 20, marginTop: 5 },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  heroAction: { height: 46, flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.md },
  heroActionText: { color: colors.navy, fontSize: 14, fontWeight: '800' },
  heroArrow: { color: colors.navy, fontSize: 19, fontWeight: '700' },
  heroSecondary: { height: 46, justifyContent: 'center', paddingHorizontal: spacing.sm, borderRadius: radius.sm, backgroundColor: 'rgba(10,18,29,.68)', borderWidth: 1, borderColor: 'rgba(255,255,255,.28)' },
  heroSecondaryText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl, marginBottom: spacing.sm },
  count: { color: colors.textSecondary, fontSize: 13 },
  searchBox: { height: 50, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  searchIcon: { color: colors.primary, fontSize: 25, lineHeight: 27, transform: [{ rotate: '-20deg' }] },
  searchInput: { flex: 1, height: '100%', color: colors.textPrimary, fontSize: 15 },
  clearSearch: { color: colors.textSecondary, fontSize: 24, lineHeight: 26 },
  filters: { gap: spacing.xs, paddingBottom: spacing.md },
  filterChip: { minHeight: 38, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
  filterTextActive: { color: colors.navy },
  card: { minHeight: 192, flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden', marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  cover: { width: 116, alignSelf: 'stretch' },
  cardBody: { flex: 1, padding: spacing.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  category: { color: colors.accent, fontSize: 10, fontWeight: '800', letterSpacing: .8 },
  favorite: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  favoriteText: { color: colors.textSecondary, fontSize: 23, lineHeight: 26 },
  favoriteActive: { color: colors.danger },
  cardTitle: { ...typography.heading, color: colors.textPrimary, fontSize: 17, lineHeight: 22, marginTop: 5 },
  cardMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 5 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 'auto' },
  track: { height: 5, flex: 1, backgroundColor: colors.surfaceMuted, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primaryDark },
  percent: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 6, marginTop: spacing.sm },
  cardSecondary: { minHeight: 34, justifyContent: 'center', paddingHorizontal: 9, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border },
  cardSecondaryText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  cardPrimary: { minHeight: 34, justifyContent: 'center', paddingHorizontal: 11, borderRadius: radius.sm, backgroundColor: colors.primary },
  cardPrimaryText: { color: colors.navy, fontSize: 11, fontWeight: '800' },
  startLabel: { color: colors.navy, fontSize: 13, fontWeight: '800', marginTop: 'auto' },
  noResults: { alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.xl },
  noResultsTitle: { ...typography.heading, color: colors.textPrimary },
  noResultsText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  resetFilters: { minHeight: 40, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radius.sm, backgroundColor: colors.primary, marginTop: spacing.md },
  resetFiltersText: { color: colors.navy, fontSize: 13, fontWeight: '800' },
  dev: { alignItems: 'center', padding: spacing.md },
  devText: { color: colors.textSecondary, fontSize: 12 },
  footer: { color: colors.textSecondary, fontSize: 11, textAlign: 'center', marginTop: spacing.lg },
});
