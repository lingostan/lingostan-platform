import { AVPlaybackSource } from 'expo-av';

type ImageSource = ReturnType<typeof require>;

// Маппинг старых ключей для обратной совместимости
export const audioAssets: Record<string, AVPlaybackSource> = {
  'audio-letter-a': require('@/assets/audio/alphabet/lakku/1.mp3'),
  'audio-letter-b': require('@/assets/audio/alphabet/lakku/2.mp3'),
  'audio-letter-g': require('@/assets/audio/alphabet/lakku/3.mp3'),
  'audio-letter-d': require('@/assets/audio/alphabet/lakku/4.mp3'),
  'audio-letter-j': require('@/assets/audio/alphabet/lakku/5.mp3'),
  'audio-letter-k': require('@/assets/audio/alphabet/lakku/6.mp3'),
  'audio-letter-l': require('@/assets/audio/alphabet/lakku/7.mp3'),
  'audio-letter-m': require('@/assets/audio/alphabet/lakku/8.mp3'),
  'audio-letter-n': require('@/assets/audio/alphabet/lakku/9.mp3'),
  'audio-letter-p': require('@/assets/audio/alphabet/lakku/10.mp3'),
  'audio-word-arh': require('@/assets/audio/alphabet/lakku/11.mp3'),
  'audio-word-bur': require('@/assets/audio/alphabet/lakku/12.mp3'),
  'audio-word-gol': require('@/assets/audio/alphabet/lakku/13.mp3'),
  'audio-word-bubu': require('@/assets/audio/alphabet/lakku/14.mp3'),
  // Новые прямые пути к аудио файлам
  'letter-a.m4a': require('@/assets/audio/letter-a.m4a'),
  'letter-a_.m4a': require('@/assets/audio/letter-a_.m4a'),
  'letter-i.m4a': require('@/assets/audio/letter-i.m4a'),
  'letter-e.m4a': require('@/assets/audio/letter-e.m4a'),
  'letter-ii.m4a': require('@/assets/audio/letter-ii.m4a'),
};

export const imageAssets: Record<string, ImageSource> = {
  // Старые ключи для обратной совместимости
  'image-letter-a': require('@/assets/images/content/apple.jpg'),
  'image-letter-b': require('@/assets/images/content/banana.jpg'),
  'image-letter-g': require('@/assets/images/content/bird.jpg'),
  'image-apple': require('@/assets/images/content/apple.jpg'),
  'image-banana': require('@/assets/images/content/banana.jpg'),
  'image-cat': require('@/assets/images/content/cat.jpg'),
  'image-dog': require('@/assets/images/content/dog.jpg'),
  'image-tree': require('@/assets/images/content/tree.jpg'),
  // Новые прямые пути к изображениям
  'rooster.jpeg': require('@/assets/images/content/rooster.jpeg'),
  'chicken.jpeg': require('@/assets/images/content/chicken.jpeg'),
  'owl.jpeg': require('@/assets/images/content/owl.jpeg'),
  'nettle.jpeg': require('@/assets/images/content/nettle.jpg'), // Файл имеет расширение .jpg
  'horse.jpeg': require('@/assets/images/content/horse.jpeg'),
};

export function resolveAudioAsset(key: string | null | undefined): AVPlaybackSource | undefined {
  if (!key) {
    return undefined;
  }
  // Сначала проверяем маппинг
  if (audioAssets[key]) {
    return audioAssets[key];
  }
  // Если ключ не найден, возвращаем undefined
  return undefined;
}

export function resolveImageAsset(key: string | null | undefined): ImageSource | undefined {
  if (!key) {
    return undefined;
  }
  // Сначала проверяем маппинг
  if (imageAssets[key]) {
    return imageAssets[key];
  }
  // Если ключ не найден, возвращаем undefined
  return undefined;
}


