import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import modulesData from '@/mocks/modules.json';
import lesson1Data from '@/mocks/lessons/lesson-1.json';
import lesson2Data from '@/mocks/lessons/lesson-2.json';
import { getLessonProgress } from '@/utils/progressStore';
import { applyProgressToModule } from '@/utils/progressStore';

// Определяем режим разработки
// В React Native __DEV__ доступен глобально, в Node.js используем NODE_ENV
declare const __DEV__: boolean | undefined;
const isDevelopment =
  (typeof __DEV__ !== 'undefined' && __DEV__) ||
  process.env.NODE_ENV === 'development' ||
  process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';

// Моковые данные для алфавита
const alphabetLetters = [
  { id: 1, letter: 'А', transcription: 'ажари', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/1.mp3' },
  { id: 2, letter: 'Аь', transcription: 'аньак|и', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/2.mp3' },
  { id: 3, letter: 'Б', transcription: 'бак|', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/3.mp3' },
  { id: 4, letter: 'В', transcription: 'варани', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/4.mp3' },
  { id: 5, letter: 'Г', transcription: 'гунгуми', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/5.mp3' },
  { id: 6, letter: 'Гъ', transcription: 'гъарал', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/6.mp3' },
  { id: 7, letter: 'Гь', transcription: 'гьану', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/7.mp3' },
  { id: 8, letter: 'Д', transcription: 'даву', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/8.mp3' },
  { id: 9, letter: 'Е', transcription: 'е', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/9.mp3' },
  { id: 10, letter: 'Ё', transcription: 'ё', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/10.mp3' },
  { id: 11, letter: 'Ж', transcription: 'жалин', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/11.mp3' },
  { id: 12, letter: 'З', transcription: 'зимиз', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/12.mp3' },
  { id: 13, letter: 'И', transcription: 'инт', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/13.mp3' },
  { id: 15, letter: 'К', transcription: 'инт', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/15.mp3' },
  { id: 16, letter: 'Кк', transcription: 'ккунук', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/16.mp3' },
  { id: 17, letter: 'Къ', transcription: 'къалпуз', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/17.mp3' },
  { id: 18, letter: 'Кь', transcription: 'кьини', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/18.mp3' },
  { id: 19, letter: 'К|', transcription: 'к|улу', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/19.mp3' },
  { id: 20, letter: 'Л', transcription: 'ламу', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/20.mp3' },
  { id: 21, letter: 'М', transcription: 'миллат', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/21.mp3' },
  { id: 22, letter: 'Н', transcription: 'нину', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/22.mp3' },
  { id: 24, letter: 'Оъ', transcription: 'оърч|', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/24.mp3' },
  { id: 26, letter: 'Пп', transcription: 'ппал', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/26.mp3' },
  { id: 28, letter: 'Р', transcription: 'рик|', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/28.mp3' },
  { id: 29, letter: 'C', transcription: 'Симан', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/29.mp3' },
  { id: 30, letter: 'Сс', transcription: 'ссихьу', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/30.mp3' },
  { id: 31, letter: 'Т', transcription: 'талих|', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/31.mp3' },
  { id: 32, letter: 'Тт', transcription: 'ттукку', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/32.mp3' },
  { id: 33, letter: 'Т|', transcription: 'т|абиаьт', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/33.mp3' },
  { id: 34, letter: 'У', transcription: 'уссу', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/34.mp3' },
  { id: 35, letter: 'Ф', transcription: 'ф', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/35.mp3' },
  { id: 36, letter: 'Х', transcription: 'хиял', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/36.mp3' },
  { id: 37, letter: 'Хх', transcription: 'ххуллу', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/37.mp3' },
  { id: 38, letter: 'Хъ', transcription: 'хъува', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/38.mp3' },
  { id: 39, letter: 'Хь', transcription: 'хьулу', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/39.mp3' },
  { id: 40, letter: 'Хьхь', transcription: 'хьхьири', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/40.mp3' },
  { id: 41, letter: 'Х|', transcription: 'х|акин', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/41.mp3' },
  { id: 42, letter: 'Ц', transcription: 'цулч|а', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/42.mp3' },
  { id: 43, letter: 'Цц', transcription: 'ццац', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/43.mp3' },
  { id: 44, letter: 'Ц|', transcription: 'ц|улит', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/44.mp3' },
  { id: 45, letter: 'Ч', transcription: 'чани', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/45.mp3' },
  { id: 46, letter: 'Чч', transcription: 'ччан', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/46.mp3' },
  { id: 47, letter: 'Ч|', transcription: 'ч|елму', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/47.mp3' },
  { id: 48, letter: 'Ш', transcription: 'шагьру', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/48.mp3' },
  { id: 49, letter: 'Щ', transcription: 'щин', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/49.mp3' },
  { id: 53, letter: 'Э', transcription: 'эшкьи', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/53.mp3' },
  { id: 54, letter: 'Ю', transcription: 'ю', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/54.mp3' },
  { id: 55, letter: 'Я', transcription: 'яру', audioUrl: 'https://api.lingostan.com/v1/assets/audio/alphabet/lakku/55.mp3' },
];

// Моковые данные для пользователя
const mockUserProfile = {
  user: {
    id: 'user-123',
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    gender: 'Мужской' as const,
    age: 25,
    avatarUrl: 'https://api.lingostan.com/v1/assets/images/avatar.png',
    registrationDate: '2025-04-01T00:00:00Z',
  },
  learningLanguages: [
    {
      languageCode: 'lak',
      languageName: 'Лакский',
      totalLessons: 50,
      completedLessons: 15,
      progressPercentage: 30.0,
      currentStreak: 5,
      totalXP: 1500,
    },
  ],
};

const LESSONS_BY_ID: Record<string, typeof lesson1Data> = {
  [lesson1Data.id]: lesson1Data,
  [lesson2Data.id]: lesson2Data,
};

// Имитация задержки сети
async function delay(ms: number = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Моковый обработчик запросов
export async function handleMockRequest(
  config: AxiosRequestConfig,
): Promise<AxiosResponse> {
  const url = config.url || '';
  const method = config.method?.toUpperCase() || 'GET';

  await delay(300); // Имитация сетевой задержки

  // Обработка GET /modules
  if (method === 'GET' && url === '/modules') {
    const progress = await getLessonProgress();
    const modules = modulesData.modules.map(module => {
      const moduleWithProgress = applyProgressToModule(module, progress);
      const totalLessons = moduleWithProgress.lessons.length;
      const completedLessons = moduleWithProgress.lessons.filter(l => l.completed).length;
      const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      
      return {
        ...moduleWithProgress,
        totalLessons,
        completedLessons,
        progressPercentage,
      };
    });
    return {
      data: { modules },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse;
  }

  // Обработка GET /modules/{moduleId}
  if (method === 'GET' && url.match(/^\/modules\/([^/]+)$/)) {
    const match = url.match(/^\/modules\/([^/]+)$/);
    const moduleId = match?.[1];
    const module = modulesData.modules.find(m => m.id === moduleId);
    
    if (!module) {
      return {
        data: { message: 'Модуль не найден', code: 'MODULE_NOT_FOUND' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
      } as AxiosResponse;
    }

    const progress = await getLessonProgress();
    const moduleWithProgress = applyProgressToModule(module, progress);
    const totalLessons = moduleWithProgress.lessons.length;
    const completedLessons = moduleWithProgress.lessons.filter(l => l.completed).length;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    
    return {
      data: {
        ...moduleWithProgress,
        totalLessons,
        completedLessons,
        progressPercentage,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse;
  }

  // Обработка GET /modules/{moduleId}/lessons
  if (method === 'GET' && url.match(/^\/modules\/([^/]+)\/lessons$/)) {
    const match = url.match(/^\/modules\/([^/]+)\/lessons$/);
    const moduleId = match?.[1];
    const module = modulesData.modules.find(m => m.id === moduleId);
    
    if (!module) {
      return {
        data: { message: 'Модуль не найден', code: 'MODULE_NOT_FOUND' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
      } as AxiosResponse;
    }

    return {
      data: { lessons: module.lessons },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse;
  }

  // Обработка GET /modules/{moduleId}/lessons/{lessonId}/exercises
  if (
    method === 'GET' &&
    url.match(/^\/modules\/([^/]+)\/lessons\/([^/]+)\/exercises$/)
  ) {
    const match = url.match(/^\/modules\/([^/]+)\/lessons\/([^/]+)\/exercises$/);
    const lessonId = match?.[2];
    if (!lessonId) {
      return {
        data: { message: 'Урок не найден', code: 'LESSON_NOT_FOUND' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
      } as AxiosResponse;
    }
    const lesson = LESSONS_BY_ID[lessonId];

    if (!lesson) {
      return {
        data: { message: 'Урок не найден', code: 'LESSON_NOT_FOUND' },
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
      } as AxiosResponse;
    }

    return {
      data: { exercises: lesson.questions },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse;
  }

  // Обработка GET /alphabet
  if (method === 'GET' && url === '/alphabet') {
    return {
      data: { letters: alphabetLetters },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse;
  }

  // Обработка GET /user/me
  if (method === 'GET' && url === '/user/me') {
    return {
      data: mockUserProfile,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse;
  }

  // Если endpoint не найден
  return {
    data: { message: 'Endpoint не найден', code: 'NOT_FOUND' },
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config,
  } as AxiosResponse;
}

export { isDevelopment };

