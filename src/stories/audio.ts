import type { AudioSource } from 'expo-audio';
import { akilliTavsanMomoAudio } from './akilli-tavsan-momo/audio';
import { dehlizinGizemiAudio } from './dehlizin-gizemi/audio';
import { niloyaLostLightAudio } from './niloya-kayip-isik/audio';
import { forestStoryAudio } from './ormanda-kaybolus/audio';

// Her hikâyenin düğüm kimliklerini kayıtlı ses dosyalarıyla eşleştirir.
const audioRegistry: Record<string, Record<string, AudioSource>> = {
  'akilli-tavsan-momo': akilliTavsanMomoAudio,
  'dehlizin-gizemi': dehlizinGizemiAudio,
  'niloya-lost-light': niloyaLostLightAudio,
  'ormanda-kaybolus': forestStoryAudio,
};

export function getStoryAudio(storyId?: string, nodeId?: string) {
  if (!storyId || !nodeId) return undefined;
  return audioRegistry[storyId]?.[nodeId];
}
