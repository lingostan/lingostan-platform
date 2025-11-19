import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@lingostan/lesson-progress';

export type LessonProgressMap = Record<string, boolean>;

let cache: LessonProgressMap | null = null;
const listeners = new Set<(progress: LessonProgressMap) => void>();

async function readStorage(): Promise<LessonProgressMap> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value) {
      return JSON.parse(value);
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

async function writeStorage(progress: LessonProgressMap) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore write errors
  }
}

export async function getLessonProgress(): Promise<LessonProgressMap> {
  if (cache) {
    return cache;
  }
  cache = await readStorage();
  return cache!;
}

export async function markLessonCompleted(lessonId: string) {
  const progress = await getLessonProgress();
  if (progress[lessonId]) {
    return;
  }
  const updated = { ...progress, [lessonId]: true };
  cache = updated;
  await writeStorage(updated);
  listeners.forEach(listener => listener(updated));
}

export function subscribeToProgress(listener: (progress: LessonProgressMap) => void) {
  listeners.add(listener);
  if (cache) {
    listener(cache);
  }
  return () => {
    listeners.delete(listener);
  };
}

export function applyProgressToModule<T extends { lessons: Array<{ id: string; completed?: boolean }> }>(
  module: T,
  progress: LessonProgressMap,
): T {
  return {
    ...module,
    lessons: module.lessons.map(lesson => ({
      ...lesson,
      completed: progress[lesson.id] ?? lesson.completed ?? false,
    })),
  };
}


