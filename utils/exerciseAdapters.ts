import type { ExerciseResponseDto } from '@/api/generated/models';

// Типы для адаптированных упражнений
type AdaptedExercise = 
  | AdaptedLetterIntroExercise
  | AdaptedSelectWordExercise
  | AdaptedSelectImageExercise
  | AdaptedMatchPairsExercise
  | AdaptedMatchAudioExercise
  | AdaptedMatchingExercise;

interface AdaptedLetterIntroExercise {
  id: string;
  type: 'letterIntro';
  title?: string;
  letter: string;
  letterAudio?: string | null;
  image?: string | null;
  options: Array<{
    id: string;
    label: string;
    audio?: string | null;
    isCorrect: boolean;
  }>;
}

interface AdaptedSelectWordExercise {
  id: string;
  type: 'selectWord';
  title?: string;
  letter: string;
  letterAudio?: string | null;
  options: Array<{
    id: string;
    label: string;
    audio?: string | null;
    image?: string | null;
    isCorrect: boolean;
  }>;
}

interface AdaptedSelectImageExercise {
  id: string;
  type: 'selectImage';
  title?: string;
  letter: string;
  letterAudio?: string | null;
  options: Array<{
    id: string;
    image: string;
    audio?: string | null;
    word?: string | null;
    isCorrect: boolean;
  }>;
}

interface AdaptedMatchPairsExercise {
  id: string;
  type: 'matchPairs';
  title: string;
  pairs: Array<{
    left: string;
    leftDisplayValue?: string | null;
    right: string;
  }>;
}

interface AdaptedMatchAudioExercise {
  id: string;
  type: 'matchAudio';
  title: string;
  audioOptions: Array<{
    id: string;
    audio: string;
    value: string;
    displayValue?: string | null;
  }>;
  letterOptions: Array<{
    id: string;
    letter: string;
    audio?: string | null;
  }>;
  matches: Record<string, string>;
}

// Новый объединенный формат для MatchingExercise и MatchingAudioExercise
interface AdaptedMatchingExercise {
  id: string;
  type: 'matching' | 'matchAudio';
  title: string;
  content: {
    left: {
      isLetter?: boolean;
      onlyAudio?: boolean;
    };
    right: {
      isLetter?: boolean;
      onlyAudio?: boolean;
    };
    pairs: Array<{
      id: string;
      left: {
        value: string;
        displayValue?: string | null;
        audioUrl?: string | null;
      };
      right: {
        value: string;
        displayValue?: string | null;
        audioUrl?: string | null;
      };
    }>;
  };
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

/**
 * Преобразует URL в полный путь, если это относительный путь
 */
const resolveUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${url}`;
  }
  return `${url}`;
};

/**
 * Адаптирует упражнение LISTENING в формат letterIntro
 */
function adaptListeningExercise(exercise: ExerciseResponseDto): AdaptedLetterIntroExercise {
  const content = exercise.content as any;
  const letter = content.letter || {};
  const variants = content.variants || [];
  
  return {
    id: String(exercise.id),
    type: 'letterIntro',
    title: exercise.title,
    letter: letter.letter || '',
    letterAudio: resolveUrl(letter.audioUrl),
    image: variants[0]?.imageUrl ? resolveUrl(variants[0].imageUrl) : null,
    options: variants.map((variant: any, index: number) => ({
      id: `opt-${exercise.id}-${index}`,
      label: variant.word || '',
      audio: resolveUrl(variant?.audioUrl),
      isCorrect: Boolean(variant.correct),
    })),
  };
}

/**
 * Адаптирует упражнение MULTIPLE_CHOICE в формат selectWord или selectImage
 */
function adaptMultipleChoiceExercise(exercise: ExerciseResponseDto): AdaptedSelectWordExercise | AdaptedSelectImageExercise {
  const content = exercise.content as any;
  const letter = content.letter || {};
  const variants = content.variants || [];
  
  // Проверяем, есть ли изображения в вариантах
  const hasImages = variants.some((v: any) => v?.imageUrl);
  
  if (hasImages) {
    // selectImage
    return {
      id: String(exercise.id),
      type: 'selectImage',
      title: exercise.title,
      letter: letter.letter || '',
      letterAudio: resolveUrl(letter.audioUrl),
      options: variants.map((variant: any, index: number) => ({
        id: `opt-${exercise.id}-${index}`,
        image: resolveUrl(variant?.imageUrl) || '',
        audio: resolveUrl(variant?.audioUrl),
        word: variant?.word || null,
        isCorrect: Boolean(variant?.correct),
      })),
    };
  } else {
    // selectWord
    return {
      id: String(exercise.id),
      type: 'selectWord',
      title: exercise.title,
      letter: letter.letter || '',
      letterAudio: resolveUrl(letter.audioUrl),
      options: variants.map((variant: any, index: number) => ({
        id: `opt-${exercise.id}-${index}`,
        label: variant?.word || '',
        audio: resolveUrl(variant?.audioUrl),
        image: resolveUrl(variant?.imageUrl),
        isCorrect: Boolean(variant?.correct),
      })),
    };
  }
}

/**
 * Адаптирует упражнение MATCHING в новый формат для MatchingExercise
 */
function adaptMatchingExercise(exercise: ExerciseResponseDto): AdaptedMatchingExercise {
  const content = exercise.content as any;
  
  return {
    id: String(exercise.id),
    type: 'matching',
    title: exercise.title,
    content: {
      left: content.left || { isLetter: false, onlyAudio: false },
      right: content.right || { isLetter: false, onlyAudio: false },
      pairs: content.pairs.map((pair: any) => ({
        id: pair.id || String(pair.left?.value || ''),
        left: {
          value: pair.left?.value || '',
          displayValue: pair.left?.displayValue || null,
          audioUrl: pair.left?.audioUrl || null,
        },
        right: {
          value: pair.right?.value || '',
          displayValue: pair.right?.displayValue || null,
          audioUrl: pair.right?.audioUrl || null,
        },
      })),
    },
  };
}

/**
 * Адаптирует упражнение MATCHING_AUDIO в новый формат для MatchingAudioExercise
 */
function adaptMatchingAudioExercise(exercise: ExerciseResponseDto): AdaptedMatchingExercise {
  const content = exercise.content as any;
  
  return {
    id: String(exercise.id),
    type: 'matchAudio',
    title: exercise.title,
    content: {
      left: content.left || { isLetter: false, onlyAudio: false },
      right: content.right || { isLetter: false, onlyAudio: false },
      pairs: content.pairs.map((pair: any) => ({
        id: pair.id || String(pair.left?.value || ''),
        left: {
          value: pair.left?.value || '',
          displayValue: pair.left?.displayValue || null,
          audioUrl: pair.left?.audioUrl || null,
        },
        right: {
          value: pair.right?.value || '',
          displayValue: pair.right?.displayValue || null,
          audioUrl: pair.right?.audioUrl || null,
        },
      })),
    },
  };
}

/**
 * Адаптирует упражнение из нового формата API в старый формат для компонентов
 */
export function adaptExercise(exercise: ExerciseResponseDto): AdaptedExercise {
  switch (exercise.type) {
    case 'LISTENING':
      return adaptListeningExercise(exercise);
    case 'MULTIPLE_CHOICE':
      return adaptMultipleChoiceExercise(exercise);
    case 'MATCHING':
      return adaptMatchingExercise(exercise);
    case 'MATCHING_AUDIO':
      return adaptMatchingAudioExercise(exercise);
    default:
      throw new Error(`Unknown exercise type: ${(exercise as any).type}`);
  }
}

/**
 * Адаптирует массив упражнений
 */
export function adaptExercises(exercises: ExerciseResponseDto[]): AdaptedExercise[] {
  return exercises.map(adaptExercise);
}

