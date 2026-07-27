import type { AudioSource } from 'expo-audio';

const common = {
  1: require('./audio/common-1.mp3'),
  2: require('./audio/common-2.mp3'),
  3: require('./audio/common-3.mp3'),
  4: require('./audio/common-4.mp3'),
  5: require('./audio/common-5.mp3'),
} satisfies Record<number, AudioSource>;

const high = {
  6: require('./audio/high-6.mp3'),
  7: require('./audio/high-7.mp3'),
  8: require('./audio/high-8.mp3'),
  9: require('./audio/high-9.mp3'),
  10: require('./audio/high-10.mp3'),
} satisfies Record<number, AudioSource>;

const cave = {
  6: require('./audio/cave-6.mp3'),
  7: require('./audio/cave-7.mp3'),
  8: require('./audio/cave-8.mp3'),
  9: require('./audio/cave-9.mp3'),
  10: require('./audio/cave-10.mp3'),
  11: require('./audio/cave-11.mp3'),
} satisfies Record<number, AudioSource>;

const river = {
  6: require('./audio/river-6.mp3'),
  7: require('./audio/river-7.mp3'),
  8: require('./audio/river-8.mp3'),
  9: require('./audio/river-9.mp3'),
  10: require('./audio/river-10.mp3'),
} satisfies Record<number, AudioSource>;

export const niloyaLostLightAudio: Record<string, AudioSource> = {
  'parlayan-isik': common[1],
};

const accessorySuffixes = ['kirmizi-canta', 'sari-sapka', 'kucuk-fener'];
const skyKeyPaths = ['niloya-key', 'tospik-key', 'wind-key'];
const skyEndings = ['watch-sky', 'wave-birds', 'view-forest'];
const cavePaths = ['raise-leaf', 'follow-lights', 'follow-sound'];
const moonlightPaths = ['niloya-push', 'ask-bats', 'bats-fly'];
const moonCelebrations = ['walk-flowers', 'play-bats', 'watch-moonlight'];
const riverPlacements = ['tas', 'cicekler', 'kum'];
const riverCelebrations = ['cicekleri-izle', 'hayvanlarla-oyna', 'baliklara-el-salla'];

for (const suffix of accessorySuffixes) {
  niloyaLostLightAudio[`cicekli-yol-${suffix}`] = common[2];
  niloyaLostLightAudio[`yasli-agac-${suffix}`] = common[3];
  niloyaLostLightAudio[`sisli-orman-${suffix}`] = common[4];
  niloyaLostLightAudio[`uc-gizemli-yol-${suffix}`] = common[5];

  niloyaLostLightAudio[`ruzgarli-tepe-${suffix}`] = high[6];
  niloyaLostLightAudio[`altin-anahtar-${suffix}`] = high[7];
  niloyaLostLightAudio[`gokyuzundeki-yol-${suffix}`] = high[9];
  for (const keyPath of skyKeyPaths) {
    niloyaLostLightAudio[`sonmus-fener-${suffix}-${keyPath}`] = high[8];
  }
  for (const ending of skyEndings) {
    niloyaLostLightAudio[`birlikte-basarmak-${suffix}-${ending}`] = high[10];
  }

  niloyaLostLightAudio[`karanlik-magara-${suffix}`] = cave[6];
  niloyaLostLightAudio[`uyuyan-ay-cicegi-${suffix}`] = cave[8];
  niloyaLostLightAudio[`cesur-dostlar-${suffix}`] = cave[10];
  for (const path of cavePaths) {
    niloyaLostLightAudio[`kucuk-yarasa-${suffix}-${path}`] = cave[7];
  }
  for (const path of moonlightPaths) {
    niloyaLostLightAudio[`ay-isiginin-donusu-${suffix}-${path}`] = cave[9];
  }
  for (const celebration of moonCelebrations) {
    niloyaLostLightAudio[`ay-ciceginin-cesur-dostlari-${suffix}-${celebration}`] = cave[11];
  }

  niloyaLostLightAudio[`sarki-soyleyen-nehir-${suffix}`] = river[6];
  niloyaLostLightAudio[`baliklarin-sirri-${suffix}`] = river[7];
  niloyaLostLightAudio[`mavi-kristal-${suffix}`] = river[8];
  for (const placement of riverPlacements) {
    niloyaLostLightAudio[`ormanin-uyanisi-${suffix}-${placement}`] = river[9];
  }
  for (const celebration of riverCelebrations) {
    niloyaLostLightAudio[`paylasmanin-gucu-${suffix}-${celebration}`] = river[10];
  }
}
