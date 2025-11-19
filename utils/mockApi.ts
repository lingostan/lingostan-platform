import modulesData from '@/mocks/modules.json';
import lesson1Data from '@/mocks/lessons/lesson-1.json';
import lesson2Data from '@/mocks/lessons/lesson-2.json';
import { applyProgressToModule, getLessonProgress } from '@/utils/progressStore';

export type ModuleSummary = typeof modulesData.modules[number];
export type LessonData = typeof lesson1Data;

const LESSONS_BY_ID: Record<string, LessonData> = {
  [lesson1Data.id]: lesson1Data,
  [lesson2Data.id]: lesson2Data,
};

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cloneModule(module: ModuleSummary): ModuleSummary {
  return {
    ...module,
    lessons: module.lessons.map(lesson => ({ ...lesson })),
  };
}

export async function fetchModules(): Promise<ModuleSummary[]> {
  await delay(1000);
  const progress = await getLessonProgress();
  return modulesData.modules.map(module =>
    applyProgressToModule(cloneModule(module), progress),
  );
}

export async function fetchModuleById(moduleId: string): Promise<ModuleSummary | undefined> {
  await delay(1000);
  const module = modulesData.modules.find(item => item.id === moduleId);
  if (!module) {
    return undefined;
  }
  const progress = await getLessonProgress();
  return applyProgressToModule(cloneModule(module), progress);
}

export async function fetchLessonById(lessonId: string): Promise<LessonData | undefined> {
  await delay(1000);
  return LESSONS_BY_ID[lessonId];
}

