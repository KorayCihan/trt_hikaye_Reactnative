import type { RegisteredStory } from '@/types/story';
import { akilliTavsanMomoImages } from './akilli-tavsan-momo/images';
import { akilliTavsanMomoStory } from './akilli-tavsan-momo/story';
import { dehlizinGizemiImages } from './dehlizin-gizemi/images';
import { dehlizinGizemiStory } from './dehlizin-gizemi/story';
import { niloyaLostLightImages } from './niloya-kayip-isik/images';
import { niloyaLostLightStory } from './niloya-kayip-isik/story';
import { forestStoryImages } from './ormanda-kaybolus/images';
import { forestStory } from './ormanda-kaybolus/story';

// Ana sayfadaki hikâye sırası bu dizinin sırasıyla aynıdır.
export const stories: RegisteredStory[] = [
  { story: akilliTavsanMomoStory, images: akilliTavsanMomoImages },
  { story: niloyaLostLightStory, images: niloyaLostLightImages },
  { story: dehlizinGizemiStory, images: dehlizinGizemiImages },
  { story: forestStory, images: forestStoryImages },
];

// Kayıt defteri sayesinde ekranlar hikâyeyi kimliğiyle hızlıca bulur.
export const storyRegistry = Object.fromEntries(
  stories.map((entry) => [entry.story.id, entry]),
) as Record<string, RegisteredStory>;

export function getStory(id: string) {
  return storyRegistry[id];
}
