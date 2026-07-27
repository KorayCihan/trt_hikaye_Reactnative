import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';

const fallbackImage = require('../stories/ormanda-kaybolus/assets/cover.jpg');

type StoryBackgroundProps = {
  source?: ImageSourcePropType;
};

export function StoryBackground({ source }: StoryBackgroundProps) {
  const [failed, setFailed] = useState(false);

  // Yeni bölüm açıldığında önceki görsel hatasını sıfırlarız.
  useEffect(() => setFailed(false), [source]);

  const activeSource = !source || failed ? fallbackImage : source;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.sceneFrame}>
        <Image
          accessibilityIgnoresInvertColors
          source={activeSource}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={150}
          style={styles.sceneImage}
          onError={() => setFailed(true)}
        />
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(8,14,22,0)', 'rgba(8,14,22,0)', 'rgba(8,14,22,.06)', 'rgba(8,14,22,.26)']}
        locations={[0, 0.5, 0.76, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sceneFrame: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sceneImage: {
    width: '100%',
    height: '100%',
  },
});
