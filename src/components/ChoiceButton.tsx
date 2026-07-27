import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { colors, radius, spacing } from '@/theme';

export function ChoiceButton({ icon = '•', text, disabled, selected = false, index = 0, onPress }: { icon?: string; text: string; disabled: boolean; selected?: boolean; index?: number; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 160, delay: index * 35, useNativeDriver: true }).start();
  }, [index, opacity]);

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={text}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: .98, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        style={({ pressed }) => [styles.button, selected && styles.selected, pressed && styles.pressed, disabled && !selected && styles.disabled]}
      >
        <View style={styles.iconWrap}><Text style={styles.icon}>{icon}</Text></View>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.arrow}>→</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 40, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,.13)', borderWidth: 1, borderColor: 'rgba(255,255,255,.22)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, gap: spacing.xs },
  pressed: { backgroundColor: 'rgba(255,203,33,.22)', borderColor: colors.primary },
  selected: { backgroundColor: 'rgba(255,203,33,.30)', borderColor: colors.secondary },
  disabled: { opacity: .55 },
  iconWrap: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,203,33,.20)', alignItems: 'center', justifyContent: 'center' },
  icon: { color: colors.secondary, fontSize: 12, fontWeight: '800' },
  text: { flex: 1, color: colors.white, fontWeight: '700', fontSize: 12, lineHeight: 15 },
  arrow: { color: colors.white, fontSize: 15, fontWeight: '700' },
});
