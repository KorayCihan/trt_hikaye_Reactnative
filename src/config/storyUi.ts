import type { ImageContentPosition } from 'expo-image';

export type StoryUiConfig = {
  panelHeight: `${number}%`;
  bannerPosition: ImageContentPosition;
};

const defaultConfig: StoryUiConfig = {
  panelHeight: '38%',
  bannerPosition: 'center',
};

// Her hikâyenin yalnızca kendisine özgü ekran farkları burada tutulur.
const storyUiConfigs: Record<string, Partial<StoryUiConfig>> = {
  'niloya-lost-light': {
    panelHeight: '32%',
    bannerPosition: { left: '68%', top: '50%' },
  },
};

export function getStoryUiConfig(storyId: string): StoryUiConfig {
  return { ...defaultConfig, ...storyUiConfigs[storyId] };
}
