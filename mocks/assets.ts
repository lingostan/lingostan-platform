import { AVPlaybackSource } from 'expo-av';

type ImageSource = ReturnType<typeof require>;


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
  'audio-word-bubu': require('@/assets/audio/alphabet/lakku/14.mp3')
};


//TODO что то похожее надо добавить в контрак, что генерить id картинки по которым можно получать название для картинки из мапы. но лучше конечно контракт расширить и с бэка название присылать
export const imageId = {
'image-letter-a': 'image-letter-a',
'image-letter-b': 'image-letter-b',
'image-letter-g': 'image-letter-g',
'image-apple': 'image-apple',
'image-banana': 'image-banana',
'image-cat': 'image-cat',
'image-dog': 'image-dog',
'image-tree': 'image-tree',
} as const


export const imageAssets: Record<typeof imageId[keyof typeof imageId], ImageSource> = {
  ['image-letter-a']: require('@/assets/images/content/apple.jpg'),
  ['image-letter-b']: require('@/assets/images/content/banana.jpg'),
  ['image-letter-g']: require('@/assets/images/content/bird.jpg'),
  ['image-apple']: require('@/assets/images/content/apple.jpg'),
  ['image-banana']: require('@/assets/images/content/banana.jpg'),
  ['image-cat']: require('@/assets/images/content/cat.jpg'),
  ['image-dog']: require('@/assets/images/content/dog.jpg'),
  ['image-tree']: require('@/assets/images/content/tree.jpg')
};

export function resolveAudioAsset(key: string): AVPlaybackSource | undefined {
  return audioAssets[key];
}

export function resolveImageAsset(key: string): ImageSource | undefined {
  return imageAssets[key];
}


