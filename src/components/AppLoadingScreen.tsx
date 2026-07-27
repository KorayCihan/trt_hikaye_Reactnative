import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';

const logo = require('../../assets/images/trt-cocuk-logo.png');

// Ana sayfa, çıkış animasyonu tamamlandıktan sonra gösterilir.
export const APP_INTRO_DURATION_MS = 2600;

type AppLoadingScreenProps = {
  message?: string;
};

export function AppLoadingScreen({ message = 'Hikâyeler hazırlanıyor…' }: AppLoadingScreenProps) {
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.72)).current;
  const logoPosition = useRef(new Animated.Value(12)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacities = useRef([
    new Animated.Value(0.25),
    new Animated.Value(0.25),
    new Animated.Value(0.25),
  ]).current;

  useEffect(() => {
    const entrance = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.back(1.25)),
          useNativeDriver: true,
        }),
        Animated.timing(logoPosition, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(180),
          Animated.timing(glowOpacity, {
            toValue: 0.55,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(loadingOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
    ]);

    const exit = Animated.sequence([
      Animated.delay(2100),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const dotAnimations = dotOpacities.map((opacity, index) => (
      Animated.loop(Animated.sequence([
        Animated.delay(index * 140),
        Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.25, duration: 280, useNativeDriver: true }),
        Animated.delay((2 - index) * 140),
      ]))
    ));

    entrance.start();
    exit.start();
    dotAnimations.forEach((animation) => animation.start());

    return () => {
      entrance.stop();
      exit.stop();
      dotAnimations.forEach((animation) => animation.stop());
    };
  }, [dotOpacities, glowOpacity, loadingOpacity, logoOpacity, logoPosition, logoScale, screenOpacity, titleOpacity]);

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <View style={styles.brand}>
        <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ translateY: logoPosition }, { scale: logoScale }],
          }}
        >
          <Image source={logo} contentFit="contain" style={styles.logo} />
        </Animated.View>
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text style={styles.title}>Hikâyenin yönünü sen belirle</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.loading, { opacity: loadingOpacity }]}>
        <View style={styles.dots}>
          {dotOpacities.map((opacity, index) => (
            <Animated.View key={index} style={[styles.dot, { opacity }]} />
          ))}
        </View>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>

      <Animated.Text style={[styles.safe, { opacity: loadingOpacity }]}>
        Güvenli · Reklamsız · Çocuklara özel
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  brand: { alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    width: 260,
    height: 130,
    borderRadius: 130,
    backgroundColor: 'rgba(255,203,33,.18)',
    transform: [{ scaleX: 1.25 }],
  },
  logo: { width: 250, height: 72 },
  title: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    marginTop: spacing.lg,
  },
  loading: { position: 'absolute', bottom: 112, alignItems: 'center' },
  dots: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.primary },
  message: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.sm },
  safe: {
    position: 'absolute',
    bottom: 36,
    color: '#758398',
    fontSize: 10,
    letterSpacing: 0.4,
  },
});
