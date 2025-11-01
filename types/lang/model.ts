export type Lang = {
  id: number;
  code: string;
  name: string;
  alphabet: AlphabetItem[];
};

export type UserLang = {
  id: string;
  language: Lang;
  status: string;
};

export type AlphabetItem = {
  letter: string;
  transcription: string;
  audioUrl?: string;
};
