import type { ImageSourcePropType } from 'react-native';

export interface StoryChoice {
  id: string;
  text: string;
  nextNodeId: string;
  transitionImageKey?: string;
  icon?: string;
}

// StoryNode, ekranda gösterilen tek bir hikâye bölümünü temsil eder.
export interface StoryNode {
  id: string;
  paragraphNumber: number;
  title: string;
  text: string;
  backgroundImage: string;
  imagePrompt?: string;
  choices: StoryChoice[];
  isEnding: boolean;
  endingTitle?: string;
  endingKind?: 'courage' | 'kindness' | 'curiosity';
}

export interface StoryVisualBible {
  artStyle: string;
  aspectRatio: '9:16';
  characterDescription: string;
  characterClothing: string;
  colorPalette: string;
  lightingStyle: string;
  negativePrompt: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  startNodeId: string;
  estimatedMinutes: number;
  ageRange: string;
  category: string;
  isNew?: boolean;
  visualBible: StoryVisualBible;
  nodes: Record<string, StoryNode>;
}

export type StoryImageMap = Record<string, ImageSourcePropType>;

export interface RegisteredStory {
  story: Story;
  images: StoryImageMap;
}

export interface ChoiceRecord {
  nodeId: string;
  nodeTitle: string;
  choiceId: string;
  choiceText: string;
}

export interface StoryProgress {
  currentNodeId: string;
  currentBackgroundKey?: string;
  history: ChoiceRecord[];
  completed: boolean;
  endings: string[];
  updatedAt: number;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  code: string;
  message: string;
  nodeId?: string;
}

export interface StoryValidation {
  valid: boolean;
  issues: ValidationIssue[];
  unreachableNodeIds: string[];
  missingImages: string[];
}
