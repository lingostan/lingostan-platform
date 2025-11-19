export type BaseQuestion = {
  id: string;
  type: 'letterIntro' | 'selectWord' | 'selectImage' | 'matchPairs' | 'matchAudio';
};

export type OptionBase = {
  id: string;
  isCorrect?: boolean;
};

export type LetterIntroQuestionData = BaseQuestion & {
  type: 'letterIntro';
  letter: string;
  letterAudio: string;
  image: string;
  options: (OptionBase & { label: string; isCorrect: boolean })[];
};

export type SelectWordQuestionData = BaseQuestion & {
  type: 'selectWord';
  letter: string;
  letterAudio: string;
  options: (OptionBase & { label: string; audio: string; isCorrect: boolean })[];
};

export type SelectImageQuestionData = BaseQuestion & {
  type: 'selectImage';
  letter: string;
  letterAudio: string;
  options: (OptionBase & { image: string; audio: string; isCorrect: boolean })[];
};

export type MatchPairsQuestionData = BaseQuestion & {
  type: 'matchPairs';
  title: string;
  pairs: { left: string; right: string }[];
};

export type MatchAudioQuestionData = BaseQuestion & {
  type: 'matchAudio';
  title: string;
  audioOptions: { id: string; audio: string }[];
  letterOptions: { id: string; letter: string }[];
  matches: Record<string, string>;
};

export type LessonQuestion =
  | LetterIntroQuestionData
  | SelectWordQuestionData
  | SelectImageQuestionData
  | MatchPairsQuestionData
  | MatchAudioQuestionData;


