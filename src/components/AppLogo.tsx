import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const logo = require('../../assets/images/trt-cocuk-logo.png');

export function AppLogo() {
  return (
    <View accessibilityLabel="TRT Çocuk" style={styles.container}>
      <Image source={logo} contentFit="contain" style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 42, justifyContent: 'center' },
  image: { width: 164, height: 42 },
});
